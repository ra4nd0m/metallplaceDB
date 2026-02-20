const JSZip = require("jszip");

/**
 * Post-processes a docx buffer to fix two issues with the docx v7 library output:
 *
 * 1. rPr element ordering: The library emits <w:rFonts> after <w:color>/<w:sz>,
 *    but the OOXML schema (CT_RPr) requires <w:rFonts> before those elements.
 *    Without this fix, Word ignores the font entirely.
 *
 * 2. Percentage table widths: The library emits w:type="pct" w:w="X%" but OOXML
 *    requires the value in fiftieths of a percent (e.g. 5000 = 100%).
 *    Without this fix, Word falls back to auto-sizing, ignoring the intended width.
 *
 * @param {Buffer} buf - The raw docx buffer from Packer.toBuffer()
 * @returns {Promise<Buffer>} - The fixed docx buffer
 */
module.exports = async function fixDocx(buf) {
    const zip = await JSZip.loadAsync(buf);

    // Process all XML files that may contain rPr or table width elements
    const xmlPaths = [];
    zip.forEach(function (relativePath) {
        if (relativePath.startsWith("word/") && relativePath.endsWith(".xml")) {
            xmlPaths.push(relativePath);
        }
    });

    for (const xmlPath of xmlPaths) {
        const xmlFile = zip.file(xmlPath);
        if (!xmlFile) continue;

        let xml = await xmlFile.async("string");
        let changed = false;

        // Fix 1: Reorder rPr child elements per OOXML CT_RPr sequence
        const fixedRpr = fixRprOrder(xml);
        if (fixedRpr !== xml) { xml = fixedRpr; changed = true; }

        // Fix 2: Convert percentage widths from "X%" string to fiftieths-of-percent integer
        const fixedPct = fixPercentageWidths(xml);
        if (fixedPct !== xml) { xml = fixedPct; changed = true; }

        if (changed) {
            zip.file(xmlPath, xml);
        }
    }

    return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
};

// --- rPr ordering ---

// OOXML CT_RPr sequence
const rprOrder = [
    "w:rStyle", "w:rFonts", "w:b", "w:bCs", "w:i", "w:iCs",
    "w:caps", "w:smallCaps", "w:strike", "w:dstrike",
    "w:outline", "w:shadow", "w:emboss", "w:imprint",
    "w:noProof", "w:snapToGrid", "w:vanish", "w:webHidden",
    "w:color", "w:spacing", "w:w", "w:kern", "w:position",
    "w:sz", "w:szCs", "w:highlight", "w:u", "w:effect",
    "w:bdr", "w:shd", "w:fitText", "w:vertAlign",
    "w:rtl", "w:cs", "w:em", "w:lang",
];

function orderIndex(tagName) {
    const idx = rprOrder.indexOf(tagName);
    return idx === -1 ? 9999 : idx;
}

function fixRprOrder(xml) {
    return xml.replace(/<w:rPr>([\s\S]*?)<\/w:rPr>/g, function (match, inner) {
        const children = [];
        const childRe = /<(w:\w+)(?:\s[^>]*)?\/>|<(w:\w+)(?:\s[^>]*)?>[\s\S]*?<\/\2>/g;
        let m;
        while ((m = childRe.exec(inner)) !== null) {
            children.push({ tagName: m[1] || m[2], xml: m[0] });
        }
        if (children.length <= 1) return match;

        let needsReorder = false;
        for (let i = 1; i < children.length; i++) {
            if (orderIndex(children[i].tagName) < orderIndex(children[i - 1].tagName)) {
                needsReorder = true;
                break;
            }
        }
        if (!needsReorder) return match;

        children.sort(function (a, b) {
            return orderIndex(a.tagName) - orderIndex(b.tagName);
        });
        return "<w:rPr>" + children.map(function (c) { return c.xml; }).join("") + "</w:rPr>";
    });
}

// --- Percentage width fix ---

function fixPercentageWidths(xml) {
    // Fix w:tblW, w:tcW, and similar width elements that use type="pct" with "X%" string
    // OOXML expects an integer value where 5000 = 100%
    // Handle both attribute orderings: w:type before w:w and w:w before w:type
    return xml.replace(/<w:(\w+)\s+([^>]*?)\/>/g,
        function (match, tag, attrs) {
            // Only process elements that have type="pct" and w="...%"
            var typeMatch = /w:type="pct"/.exec(attrs);
            var valMatch = /w:w="([^"]+)%"/.exec(attrs);
            if (!typeMatch || !valMatch) return match;
            var num = parseFloat(valMatch[1]);
            if (isNaN(num)) return match;
            var fiftieths = Math.round(num * 50);
            var fixedAttrs = attrs.replace(/w:w="[^"]+%"/, 'w:w="' + fiftieths + '"');
            return '<w:' + tag + ' ' + fixedAttrs + '/>';
        }
    );
}

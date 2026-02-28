/**
 * Validates that an API response contains a non-empty price_feed.
 * Throws a descriptive error – including the material and property IDs – so the
 * consuming component's .catch() can surface exactly which dataset is missing
 * instead of crashing with a generic "Cannot read properties of undefined".
 *
 * @param {object} response     - The axios response object
 * @param {number|string} materialId  - material_source_id used in the request
 * @param {number|string} propertyId  - property_id used in the request
 * @param {string} [context]    - Optional extra context, e.g. a date range string
 */
function assertFeed(response, materialId, propertyId, context) {
    const tag = `material_source_id=${materialId}, property_id=${propertyId}` +
        (context ? ` (${context})` : "");

    if (!response || !response.data) {
        throw new Error(`No response data for ${tag}`);
    }
    if (!response.data.price_feed) {
        throw new Error(`Missing price_feed in response for ${tag}`);
    }
    if (response.data.price_feed.length === 0) {
        throw new Error(`Empty price_feed (no values found) for ${tag}`);
    }
}

/**
 * Validates that a getMaterialInfo response contains valid material info.
 *
 * @param {object} response     - The axios response object
 * @param {number|string} materialId  - The material ID used in the request
 */
function assertMaterialInfo(response, materialId) {
    if (!response || !response.data || !response.data.info) {
        throw new Error(`No material info found for id=${materialId}`);
    }
}

module.exports = { assertFeed, assertMaterialInfo };

# Payload Sketches

---

## 1. Chart endpoint — proper POST body

Currently docx-gen calls the Go backend via a GET with all parameters baked into the URL path:

```
GET /getChart/2-3_1_2025-02-10to2026-02-10_0_line_day_week_0_-1_0_1.png
```

The Go backend then fetches data from the DB, assembles `x_label_set` + `y_data_set`, and forwards it
to the chart service's existing `POST /gen` endpoint.

A proper replacement would be a single `POST /getChart` on the Go backend that takes a structured body:

```json
POST /getChart

{
  "material_ids": [2, 3],
  "property_id": 1,
  "start": "2025-02-10",
  "finish": "2026-02-10",
  "type": "line",
  "scale": "day",
  "x_step": "week",
  "labels": false,
  "legend": false,
  "to_fixed": -1,
  "predict": false,
  "tall": true,

  // optional: drives the "% change" info row rendered by chart_block.js above the PNG
  "info_row": {
    "avg_group": 5,
    "compare_period": "н/н"  // or "м/м"
  }
}
```

Response stays the same: raw PNG bytes (or base64 if you prefer a JSON response envelope).

The Go backend's internal logic doesn't change at all — the `ChartPack` model and `GetCachedChart`
service method stay as-is. Only the HTTP handler changes: parse a JSON body instead of splitting
a URL string.

---

## 2. Stateless docx-gen payloads

The goal: docx-gen receives all data it needs in the request body and makes zero outgoing HTTP calls.
It becomes a pure layout engine: data in → .docx bytes out.

### Shared types

```typescript
type PricePoint  = { date: string; value: number }
type MaterialInfo = { name: string; unit: string; market: string; delivery: string }

// Used by single-material tables
type SingleFeed = {
  material: MaterialInfo
  feed: PricePoint[]          // daily or monthly-avg, caller decides
  predict_feed?: PricePoint[] // only for monthly-scale tables with predict=true
}

// Used by two-material tables (tableDouble, tableDoubleAvg)
type DoubleFeed = {
  material1: MaterialInfo
  material2: MaterialInfo
  feed1: PricePoint[]
  feed2: PricePoint[]
}

// min / max / med triple  
type MinimaxFeeds = {
  min: PricePoint[]
  max: PricePoint[]
  med: PricePoint[]
}

// Used by singleTableMinimax, doubleTableMinimax
type SingleMinimax = {
  material: MaterialInfo
  feeds: MinimaxFeeds
}
type DoubleMinimax = {
  material1: MaterialInfo; feeds1: MinimaxFeeds
  material2: MaterialInfo; feeds2: MinimaxFeeds
}

// One row in tableMaterialMinimax (wide table, many materials, two periods)
type MaterialMinimaxRow = {
  material: MaterialInfo
  period1: MinimaxFeeds   // first column date
  period2: MinimaxFeeds   // second column date
}

// One row in tableMaterialGrouped (compact grouped table)
type MaterialGroupedRow = {
  material: MaterialInfo
  period1_med: PricePoint[]
  period2_med: PricePoint[]
}

// Pre-rendered chart image
type Chart = string   // base64-encoded PNG bytes
```

---

### Route: `POST /genShort`

This is already close to stateless. The only change: `chart` becomes a base64 PNG string
rather than raw bytes, to be consistent with the other routes.

```json
{
  "date": "2026-02-10",
  "report_header": "Мировой рынок металлургического сырья",
  "blocks": [
    {
      "title": "Железная руда",
      "text": ["Параграф 1", "Параграф 2"],
      "chart": "<base64 PNG | null>"
    }
  ]
}
```

No changes needed to the block shape; it was already stateless.

---

### Route: `POST /gen` — `report_type: "weekly"`

The weekly report has a fixed section structure.
Each section has: optional free-text placeholder, charts, and tables.
The payload mirrors that structure section by section.

```json
{
  "date": "2026-02-10",
  "report_type": "weekly",

  // ── Overview page (краткая сводка цен) ────────────────────────────────────
  "overview": {
    "raw_materials": {
      "chart_ore_hms":    "<base64 PNG>",   // ЖРС62 + ЛОМ HMS
      "chart_pig_scrap":  "<base64 PNG>",   // чугун + лом 3А
      "chart_coal_coke":  "<base64 PNG>"    // уголь кокс + мет кокс
    },
    "steel": {
      "chart_billet":     "<base64 PNG>",
      "chart_rebar":      "<base64 PNG>",
      "chart_hrc":        "<base64 PNG>",
      "chart_crc":        "<base64 PNG>"
    },
    "ferro": {
      "chart_femn_simn":  "<base64 PNG>",
      "chart_fesi":       "<base64 PNG>",
      "chart_fecr":       "<base64 PNG>",
      "chart_mn_cr_ore":  "<base64 PNG>"
    }
  },

  // ── Iron ore ──────────────────────────────────────────────────────────────
  "iron_ore": {
    "chart_stocks":  "<base64 PNG>",    // запасы ЖРС в портах Китая (bar)
    "chart_prices":  "<base64 PNG>",    // ЖРС 62 + 65 (2 weeks, labelled)
    "table": {                          // tableDoubleAvg(2, 3, ...)
      "material1": { "name": "ЖРС 62%", "unit": "$/т", "market": "CNF Китай", "delivery": "" },
      "material2": { "name": "ЖРС 65%", "unit": "$/т", "market": "CNF Китай", "delivery": "" },
      "feed1": [{ "date": "2026-01-27", "value": 103.5 }, "..."],
      "feed2": [{ "date": "2026-01-27", "value": 108.2 }, "..."]
    }
  },

  // ── Coal & coke ───────────────────────────────────────────────────────────
  "coal_coke": {
    "chart_coal":   "<base64 PNG>",    // коксующийся уголь Россия + Австралия
    "table_coal": {                    // tableDoubleAvg(6, 7, ...)
      "material1": { "..." },
      "material2": { "..." },
      "feed1": ["..."],
      "feed2": ["..."]
    },
    "chart_coke":   "<base64 PNG>",   // мет кокс
    "table_coke": {                   // singleTable(8, ...)
      "material": { "..." },
      "feed": ["..."]
    }
  },

  // ── Scrap ─────────────────────────────────────────────────────────────────
  "scrap": {
    "table_minimax": [                // tableMaterialMinimax([4,29..42], ...)
      {
        "material": { "name": "ЛОМ HMS 1&2", "unit": "$/т", "market": "...", "delivery": "..." },
        "period1": { "min": ["..."], "max": ["..."], "med": ["..."] },
        "period2": { "min": ["..."], "max": ["..."], "med": ["..."] }
      },
      "..."
    ],
    "chart_scrap3a":  "<base64 PNG>",  // лом 3А
    "table_scrap3a": {                 // singleTableMinimax(1, ...)
      "material": { "..." },
      "feeds": { "min": ["..."], "max": ["..."], "med": ["..."] }
    }
  },

  // ── Pig iron ──────────────────────────────────────────────────────────────
  "pig_iron": {
    "chart":  "<base64 PNG>",
    "table": {
      "material": { "..." },
      "feeds": { "min": ["..."], "max": ["..."], "med": ["..."] }
    },
    "table_minimax": [ "... MaterialMinimaxRow x3 ..." ]
  },

  // ── Steel: semis ──────────────────────────────────────────────────────────
  "steel_semis": {
    "table_minimax": [ "... MaterialMinimaxRow x7 ..." ],
    "chart_billet_slab":  "<base64 PNG>",
    "table_billet_slab": {            // doubleTableMinimax(9, 11, ...)
      "material1": { "..." }, "feeds1": { "..." },
      "material2": { "..." }, "feeds2": { "..." }
    }
  },

  // ── Steel: long ───────────────────────────────────────────────────────────
  "steel_long": {
    "table_minimax": [ "... MaterialMinimaxRow x3 ..." ],
    "chart_rebar_fob":   "<base64 PNG>",
    "table_rebar_fob": {
      "material": { "..." },
      "feeds": { "..." }
    },
    "chart_rebar_exw":   "<base64 PNG>",
    "table_rebar_exw": {              // singleTable(14, ...) — no minimax, daily scale
      "material": { "..." },
      "feed": ["..."]
    }
  },

  // ── Steel: flat ───────────────────────────────────────────────────────────
  "steel_flat": {
    "table_minimax": [ "... MaterialMinimaxRow x13 ..." ],
    "chart_hrc_crc_fob":  "<base64 PNG>",
    "table_hrc_crc_fob": {
      "material1": { "..." }, "feeds1": { "..." },
      "material2": { "..." }, "feeds2": { "..." }
    },
    "chart_hrc_crc_exw":  "<base64 PNG>",
    "table_hrc_crc_exw": {            // tableDouble(15, 16, ...) — no minimax
      "material1": { "..." }, "feed1": ["..."],
      "material2": { "..." }, "feed2": ["..."]
    }
  },

  // ── Ferro / ores ──────────────────────────────────────────────────────────
  "ferro": {
    "table_grouped": [                // tableMaterialGrouped([17..23], ...)
      {
        "material": { "name": "FeMn76", "unit": "$/т", "market": "DDP ЕС", "delivery": "" },
        "period1_med": ["..."],
        "period2_med": ["..."]
      },
      "..."
    ],
    "femn_simn": {
      "chart":  "<base64 PNG>",
      "table": { "... DoubleMinimax ..." }
    },
    "fesi": {
      "chart":  "<base64 PNG>",
      "table": { "... SingleMinimax ..." }
    },
    "fecr": {
      "chart":  "<base64 PNG>",
      "table": { "... DoubleMinimax ..." }
    },
    "mn_ore": {
      "chart_stocks":  "<base64 PNG>",
      "chart_prices":  "<base64 PNG>",
      "table": { "... SingleMinimax ..." }
    },
    "cr_ore": {
      "chart_stocks":  "<base64 PNG>",
      "chart_prices":  "<base64 PNG>",
      "table": { "... SingleMinimax ..." }
    }
  },

  // ── Graphite electrodes ───────────────────────────────────────────────────
  "graphite": {
    "chart":  "<base64 PNG>",
    "table": {                        // tableDouble(24, 25, ...) — no minimax
      "material1": { "..." }, "feed1": ["..."],
      "material2": { "..." }, "feed2": ["..."]
    }
  }
}
```

---

### Route: `POST /gen` — `report_type: "monthly"`

Monthly uses the same section names as weekly. The differences are:
- All tables switch to `SingleFeed` / `DoubleFeed` (no minimax), with `scale: "month"`
- Some single tables gain an optional `predict_feed`
- The steel sections use only `DoubleFeed` / `SingleFeed` (no minimax variants)
- `table_minimax` rows become monthly-period oriented
- Charts reflect 23-month history instead of 1-year

The top-level structure is identical to weekly, so only **differences** are noted:

```json
{
  "date": "2026-02-01",
  "report_type": "monthly",

  // ── Iron ore ──────────────────────────────────────────────────────────────
  "iron_ore": {
    "chart_stocks":  "<base64 PNG>",
    "chart_prices":  "<base64 PNG>",
    "table": {                         // tableDouble (not avg) — monthly scale, 9 months
      "material1": { "..." }, "feed1": ["..."],
      "material2": { "..." }, "feed2": ["..."]
    }
  },

  // ── Coal & coke ─── same structure as weekly, feeds are monthly-avg ───────

  // ── Scrap ─────────────────────────────────────────────────────────────────
  "scrap": {
    "chart_scrap3a":  "<base64 PNG>",
    "table_scrap3a": {                 // singleTable — monthly scale, 9 months
      "material": { "..." },
      "feed": ["..."]
    },
    "table_minimax": [ "... MaterialMinimaxRow (month/month periods) ..." ]
  },

  // ── Pig iron ── singleTable (monthly) + MaterialMinimaxRow x3 ─────────────

  // ── Steel: semis / long / flat ──────────────────────────────────────────── 
  // All use DoubleFeed / SingleFeed with monthly-avg feeds.
  // No minimax variants. Each section also has a table_minimax for the
  // wide summary rows (GetFirstDaysOfCurrentAndPrevMonth).

  // ── Ferro / ores ─────────────────────────────────────────────────────────
  // Same keys as weekly, but all tables use DoubleFeed / SingleFeed
  // (no minimax). tableMaterialGrouped uses month-period rows.
  // mn_ore and cr_ore gain predict_feed on their singleTable.

  // ── Graphite electrodes ─── identical to weekly ──────────────────────────
}
```

---

---

## 3. Refactoring assessment and plan

### Depth assessment by layer

The codebase has 4 distinct layers. The modification burden is very uneven:

| Layer | Files | What needs to change | Effort |
|---|---|---|---|
| `atom/` | body cells, text, table rows | **Nothing.** They already receive structured data from components and are pure layout. | None |
| `report/` | weekly, monthly, short | Remove date-range calls and chart URL building. Replace material IDs with payload destructuring. Section structure and ordering stay identical. | Low |
| `component/` | all 10 table/chart components | **This is the bulk of the work.** Every component currently owns its own HTTP fetches. The axios calls get removed and replaced with received data parameters. The docx layout code inside each component is untouched. | Medium–High |
| `utils/` | `form_chart_url.js`, `date_ranges.js` | Become dead code (chart URLs go away; date range math moves to the caller). Other utils (`get_change`, `numbers_format`, etc.) stay. | Trivial |
| `client/chart.js` | 1 file | Deleted entirely — chart PNG now arrives in the payload. | Trivial |

The atom layer being zero-touch is the good news: all the complex table layout logic is already
cleanly separated from data fetching. The components act as a thin glue layer between HTTP and atoms,
and that glue is exactly what needs replacing.

**The hardest single file is `chart_block.js`.**
It currently makes 3 outgoing calls per chart: one GET for the PNG, one POST for material info,
and one or two POSTs to compute the % change for the info row.
The info row (name, price, % change, compare period label) needs to be flattened into an explicit
input shape.

---

### Refactoring plan

The strategy is to never break the running server. Each phase leaves the existing routes working.

#### Phase 0 — Preparation (no behaviour change)
- Move all `axios` / `ApiEndpoint` imports inside each component function body (if they're
  currently at module scope). This makes the dependency on HTTP visible at a glance and
  simplifies the per-component extraction work later.
- Add `fix_rpr_order.js` to `utils/` (it already lives there — confirm it has no axios deps).
- No functional change, no new routes.

#### Phase 1 — Split chart_block into two functions
`chart_block.js` is the hardest component and is called by `one_chart.js`, `two_chart.js`,
and `one_chart_text.js` — so fixing it unblocks all chart components at once.

Split it into:
```
chartBlockFromUrl(url, isBig, avgGroup, comparePeriod, fixed, fixedChange)
  → existing behaviour, no change

chartBlockFromData(pngBytes, isBig, infoRow)
  → new stateless version
  infoRow shape:
  {
    material_name: string,      // e.g. "ЖРС 62%"
    material_type: string,      // e.g. "62% Fe"
    delivery: string,
    country: string,
    unit: string,
    last_price: number,
    prev_price: number,
    compare_period: string      // "н/н" | "м/м" | null
  }
```

Both functions return the same docx `Table`. The old one stays for backward compat; 
`one_chart`, `two_chart`, `one_chart_text` get mirror variants that call the new one.

#### Phase 2 — Split each table component
Do this one component at a time, in order of simplest to most complex:

1. **`table_single.js`** — remove axios, accept `{ material: MaterialInfo, feed: PricePoint[], predict_feed?: PricePoint[] }`
2. **`table_double.js`** — accept `{ material1, feed1, material2, feed2 }`
3. **`table_double_avg.js`** — same as double
4. **`table_single_minimax.js`** — accept `{ material, feeds: { min, max, med } }`
5. **`table_double_minimax.js`** — accept `{ material1, feeds1, material2, feeds2 }`
6. **`table_material_minimax.js`** — accept `MaterialMinimaxRow[]` (the current `bodyInfo` array, already roughly this shape inside the function)
7. **`table_material_grouped.js`** — accept `MaterialGroupedRow[]` (same as current `bodyInfo`)

Pattern for each: the new function is the *default export*, the old fetching logic moves into a
separate named export `*FromIds(materialId, dates, ...)` that calls the backend and then calls the
new function. This way the existing report files keep working without any changes during migration.

#### Phase 3 — Add new stateless report handlers in app.js
Add three new routes alongside the old ones:

```
POST /v2/gen         → WeeklyReportV2 / MonthlyReportV2
POST /v2/genShort    → ShortReportV2  (mostly unchanged)
```

The v2 report classes (weekly/monthly) are thin orchestrators:
- Receive the full payload
- Destructure each section's data blob
- Call the now-stateless component functions directly
- No date calculations, no chart URLs, no axios anywhere

The v1 routes (`/gen`, `/genShort`) stay alive and untouched.

#### Phase 4 — Migrate the caller (Go backend)
The Go backend service currently builds a `docxgenclient` request with just a date and type.
In v2 it needs to:
1. Call all relevant DB queries (same queries the docx-gen components were making)
2. Render all charts via the chart service upfront
3. Assemble the full v2 payload
4. POST to `/v2/gen`

This is roughly porting the axios calls out of ~10 JS files into Go service methods —
which is natural since Go already has all the DB access code.

#### Phase 5 — Cleanup
Once the Go backend is fully on v2:
- Delete `/gen`, `/genShort` (v1 routes) from `app.js`
- Delete `client/chart.js`
- Delete `utils/form_chart_url.js`
- Delete the `*FromIds` shim exports from each component
- Remove `ApiEndpoint` from `const.js`
- Remove `axios` from all component files (and from `package.json` if no longer used anywhere)

---

### Summary

```
Phase 0  Cosmetic prep                    ~1 hour
Phase 1  chart_block split                ~2 hours  (trickiest)
Phase 2  7 table components               ~4 hours  (repetitive, low risk)
Phase 3  v2 routes + report classes       ~2 hours
Phase 4  Go backend migration             ~1 day    (larger scope, different codebase)
Phase 5  Cleanup                          ~1 hour
```

Phases 0–3 are entirely self-contained inside `docx-gen` and carry no risk to the running system
since v1 routes are preserved. Phase 4 is the only step that requires coordinated deployment.

---

## 4. Concrete payload examples

> All PNG values are shown as `"<base64>"` — in practice a real base64-encoded PNG string.
> Feeds are trimmed to a few rows for readability; real reports carry ~5–30 rows depending on the section.

---

### 4a. `POST /getChart` (new body-based chart endpoint)

```json
{
  "material_ids": [2, 3],
  "property_id": 1,
  "start": "2025-02-10",
  "finish": "2026-02-10",
  "type": "line",
  "scale": "day",
  "x_step": "week",
  "labels": true,
  "legend": true,
  "to_fixed": 0,
  "predict": false,
  "tall": true,
  "info_row": {
    "avg_group": 5,
    "compare_period": "н/н"
  }
}
```

Response: raw PNG bytes (same as today).

---

### 4b. `POST /v2/genShort`

```json
{
  "date": "2026-02-01",
  "report_header": "Мировой рынок металлургического сырья",
  "blocks": [
    {
      "title": "Железная руда",
      "text": [
        "Цены на железную руду 62% Fe снизились за месяц на 3.2%.",
        "Запасы ЖРС в портах Китая стабилизировались на уровне 148 млн тонн."
      ],
      "chart": "<base64>"
    },
    {
      "title": "Коксующийся уголь",
      "text": [
        "Австралийский уголь Premium Hard Coking Coal вырос до $218/т CFR Китай.",
        "Российский уголь торгуется с дисконтом около 12% к австралийскому бенчмарку."
      ],
      "chart": "<base64>"
    },
    {
      "title": "Ферросилиций",
      "text": [
        "Рынок ферросилиция остаётся под давлением: цены FeSi75 DDP ЕС — $1 080/т."
      ],
      "chart": null
    }
  ]
}
```

---

### 4c. `POST /v2/gen` — `"report_type": "weekly"`

Below the **iron ore** and **scrap** sections are shown fully; remaining sections follow the
identical pattern.

```json
{
  "date": "2026-02-14",
  "report_type": "weekly",

  "overview": {
    "raw_materials": {
      "chart_ore_hms":   "<base64>",
      "chart_pig_scrap": "<base64>",
      "chart_coal_coke": "<base64>"
    },
    "steel": {
      "chart_billet":    "<base64>",
      "chart_rebar":     "<base64>",
      "chart_hrc":       "<base64>",
      "chart_crc":       "<base64>"
    },
    "ferro": {
      "chart_femn_simn": "<base64>",
      "chart_fesi":      "<base64>",
      "chart_fecr":      "<base64>",
      "chart_mn_cr_ore": "<base64>"
    }
  },

  "iron_ore": {
    "chart_stocks": "<base64>",
    "chart_prices": "<base64>",

    "table": {
      "material1": { "name": "ЖРС 62% Fe (62% Fe)", "unit": "$/т", "market": "CNF (Китай)", "delivery": "CNF" },
      "material2": { "name": "ЖРС 65% Fe (65% Fe)", "unit": "$/т", "market": "CNF (Китай)", "delivery": "CNF" },
      "feed1": {
        "prev_price": 99.1,
        "price_feed": [
          { "date": "2026-02-03", "value": 100.3 },
          { "date": "2026-02-04", "value": 101.0 },
          { "date": "2026-02-05", "value": 100.8 },
          { "date": "2026-02-06", "value": 101.5 },
          { "date": "2026-02-07", "value": 102.1 }
        ]
      },
      "feed2": {
        "prev_price": 105.4,
        "price_feed": [
          { "date": "2026-02-03", "value": 106.2 },
          { "date": "2026-02-04", "value": 106.9 },
          { "date": "2026-02-05", "value": 107.1 },
          { "date": "2026-02-06", "value": 107.5 },
          { "date": "2026-02-07", "value": 108.0 }
        ]
      }
    }
  },

  "coal_coke": {
    "chart_coal": "<base64>",
    "table_coal": {
      "material1": { "name": "Уголь к/у Россия (HCC)", "unit": "$/т", "market": "CFR (Китай)", "delivery": "CFR" },
      "material2": { "name": "Уголь к/у Австралия (PHCC)", "unit": "$/т", "market": "CFR (Китай)", "delivery": "CFR" },
      "feed1": {
        "prev_price": 188.0,
        "price_feed": [
          { "date": "2026-02-03", "value": 190.5 },
          { "date": "2026-02-07", "value": 191.0 }
        ]
      },
      "feed2": {
        "prev_price": 213.0,
        "price_feed": [
          { "date": "2026-02-03", "value": 215.0 },
          { "date": "2026-02-07", "value": 218.0 }
        ]
      }
    },
    "chart_coke": "<base64>",
    "table_coke": {
      "material": { "name": "Кокс металлургический (МК)", "unit": "$/т", "market": "FOB (Китай)", "delivery": "FOB" },
      "feed": {
        "prev_price": 231.0,
        "price_feed": [
          { "date": "2026-02-03", "value": 234.0 },
          { "date": "2026-02-07", "value": 235.5 }
        ]
      }
    }
  },

  "scrap": {
    "table_minimax": [
      {
        "material": {
          "Country": "Россия",
          "Type": "3А",
          "DeliveryType": "CPT",
          "DeliveryLocation": "Череповец"
        },
        "period1": {
          "min": { "prev_price": null, "price_feed": [{ "date": "2026-02-03", "value": 27500 }] },
          "max": { "prev_price": null, "price_feed": [{ "date": "2026-02-03", "value": 28200 }] },
          "med": { "prev_price": 27100, "price_feed": [{ "date": "2026-02-03", "value": 27800 }] }
        },
        "period2": {
          "min": { "prev_price": null, "price_feed": [{ "date": "2026-02-10", "value": 27600 }] },
          "max": { "prev_price": null, "price_feed": [{ "date": "2026-02-10", "value": 28500 }] },
          "med": { "prev_price": 27800, "price_feed": [{ "date": "2026-02-10", "value": 28100 }] }
        }
      },
      {
        "material": {
          "Country": "Турция",
          "Type": "HMS 1&2",
          "DeliveryType": "CFR",
          "DeliveryLocation": "Турция"
        },
        "period1": {
          "min": { "prev_price": null, "price_feed": [{ "date": "2026-02-03", "value": 348 }] },
          "max": { "prev_price": null, "price_feed": [{ "date": "2026-02-03", "value": 355 }] },
          "med": { "prev_price": 342, "price_feed": [{ "date": "2026-02-03", "value": 351 }] }
        },
        "period2": {
          "min": { "prev_price": null, "price_feed": [{ "date": "2026-02-10", "value": 350 }] },
          "max": { "prev_price": null, "price_feed": [{ "date": "2026-02-10", "value": 358 }] },
          "med": { "prev_price": 351, "price_feed": [{ "date": "2026-02-10", "value": 354 }] }
        }
      }
    ],

    "chart_scrap3a": "<base64>",
    "table_scrap3a": {
      "material": { "name": "Лом 3А", "unit": "₽/т", "market": "CPT (Россия)", "delivery": "CPT" },
      "feeds": {
        "min": { "prev_price": null, "price_feed": [
          { "date": "2026-01-13", "value": 27200 }, { "date": "2026-01-20", "value": 27400 },
          { "date": "2026-01-27", "value": 27500 }, { "date": "2026-02-03", "value": 27800 },
          { "date": "2026-02-10", "value": 27600 }
        ]},
        "max": { "prev_price": null, "price_feed": [
          { "date": "2026-01-13", "value": 28000 }, { "date": "2026-01-20", "value": 28100 },
          { "date": "2026-01-27", "value": 28200 }, { "date": "2026-02-03", "value": 28500 },
          { "date": "2026-02-10", "value": 28500 }
        ]},
        "med": { "prev_price": 27100, "price_feed": [
          { "date": "2026-01-13", "value": 27600 }, { "date": "2026-01-20", "value": 27750 },
          { "date": "2026-01-27", "value": 27800 }, { "date": "2026-02-03", "value": 28100 },
          { "date": "2026-02-10", "value": 28100 }
        ]}
      }
    }
  },

  "pig_iron": {
    "chart": "<base64>",
    "table": {
      "material": { "name": "Чугун передельный", "unit": "$/т", "market": "FOB (Россия)", "delivery": "FOB" },
      "feeds": {
        "min": { "prev_price": null, "price_feed": [{ "date": "2026-02-03", "value": 388 }, { "date": "2026-02-10", "value": 390 }] },
        "max": { "prev_price": null, "price_feed": [{ "date": "2026-02-03", "value": 398 }, { "date": "2026-02-10", "value": 400 }] },
        "med": { "prev_price": 385, "price_feed": [{ "date": "2026-02-03", "value": 393 }, { "date": "2026-02-10", "value": 395 }] }
      }
    },
    "table_minimax": [ "... 3 MaterialMinimaxRow objects (same shape as scrap.table_minimax) ..." ]
  },

  "steel_semis": {
    "table_minimax": [ "... 7 MaterialMinimaxRow objects ..." ],
    "chart_billet_slab": "<base64>",
    "table_billet_slab": {
      "material1": { "name": "Заготовка", "unit": "$/т", "market": "FOB (Россия)", "delivery": "FOB" },
      "feeds1": {
        "min": { "prev_price": null, "price_feed": [{ "date": "2026-02-03", "value": 488 }, { "date": "2026-02-10", "value": 490 }] },
        "max": { "prev_price": null, "price_feed": [{ "date": "2026-02-03", "value": 498 }, { "date": "2026-02-10", "value": 502 }] },
        "med": { "prev_price": 482, "price_feed": [{ "date": "2026-02-03", "value": 493 }, { "date": "2026-02-10", "value": 496 }] }
      },
      "material2": { "name": "Сляб", "unit": "$/т", "market": "FOB (Россия)", "delivery": "FOB" },
      "feeds2": {
        "min": { "prev_price": null, "price_feed": [{ "date": "2026-02-03", "value": 472 }, { "date": "2026-02-10", "value": 475 }] },
        "max": { "prev_price": null, "price_feed": [{ "date": "2026-02-03", "value": 481 }, { "date": "2026-02-10", "value": 484 }] },
        "med": { "prev_price": 468, "price_feed": [{ "date": "2026-02-03", "value": 476 }, { "date": "2026-02-10", "value": 479 }] }
      }
    }
  },

  "steel_long":  { "... (same pattern) ...": null },
  "steel_flat":  { "... (same pattern) ...": null },

  "ferro": {
    "table_grouped": [
      {
        "material": { "name": "FeMn76", "unit": "$/т", "market": "DDP ЕС", "delivery": "DDP" },
        "period1_med": { "prev_price": null, "price_feed": [{ "date": "2026-02-06", "value": 1320 }] },
        "period2_med": { "prev_price": 1320, "price_feed": [{ "date": "2026-02-13", "value": 1335 }] }
      },
      {
        "material": { "name": "SiMn65", "unit": "$/т", "market": "DDP ЕС", "delivery": "DDP" },
        "period1_med": { "prev_price": null, "price_feed": [{ "date": "2026-02-06", "value": 1110 }] },
        "period2_med": { "prev_price": 1110, "price_feed": [{ "date": "2026-02-13", "value": 1125 }] }
      },
      "... 5 more rows ..."
    ],
    "femn_simn": {
      "chart": "<base64>",
      "table": {
        "material1": { "name": "FeMn76", "unit": "$/т", "market": "DDP (ЕС)", "delivery": "DDP" },
        "feeds1": {
          "min": { "prev_price": null, "price_feed": [{ "date": "2026-02-03", "value": 1310 }, { "date": "2026-02-10", "value": 1325 }] },
          "max": { "prev_price": null, "price_feed": [{ "date": "2026-02-03", "value": 1335 }, { "date": "2026-02-10", "value": 1345 }] },
          "med": { "prev_price": 1305, "price_feed": [{ "date": "2026-02-03", "value": 1320 }, { "date": "2026-02-10", "value": 1335 }] }
        },
        "material2": { "name": "SiMn65", "unit": "$/т", "market": "DDP (ЕС)", "delivery": "DDP" },
        "feeds2": {
          "min": { "prev_price": null, "price_feed": [{ "date": "2026-02-03", "value": 1100 }, { "date": "2026-02-10", "value": 1112 }] },
          "max": { "prev_price": null, "price_feed": [{ "date": "2026-02-03", "value": 1120 }, { "date": "2026-02-10", "value": 1135 }] },
          "med": { "prev_price": 1095, "price_feed": [{ "date": "2026-02-03", "value": 1110 }, { "date": "2026-02-10", "value": 1125 }] }
        }
      }
    },
    "fesi":  { "chart": "<base64>", "table": { "... SingleMinimax ...": null } },
    "fecr":  { "chart": "<base64>", "table": { "... DoubleMinimax ...": null } },
    "mn_ore": {
      "chart_stocks": "<base64>",
      "chart_prices": "<base64>",
      "table": { "... SingleMinimax ...": null }
    },
    "cr_ore": {
      "chart_stocks": "<base64>",
      "chart_prices": "<base64>",
      "table": { "... SingleMinimax ...": null }
    }
  },

  "graphite": {
    "chart": "<base64>",
    "table": {
      "material1": { "name": "Графитированный электрод 450 мм", "unit": "$/т", "market": "EXW (Китай)", "delivery": "EXW" },
      "feed1": {
        "prev_price": 3800,
        "price_feed": [
          { "date": "2026-02-03", "value": 3850 },
          { "date": "2026-02-10", "value": 3870 }
        ]
      },
      "material2": { "name": "Графитированный электрод 600 мм", "unit": "$/т", "market": "EXW (Китай)", "delivery": "EXW" },
      "feed2": {
        "prev_price": 4100,
        "price_feed": [
          { "date": "2026-02-03", "value": 4150 },
          { "date": "2026-02-10", "value": 4165 }
        ]
      }
    }
  }
}
```

---

### 4d. `POST /v2/gen` — `"report_type": "monthly"`

The top-level shape is identical to weekly. Only the feed contents differ (monthly-averaged
price points instead of daily). Shown here for the sections that change most:

```json
{
  "date": "2026-02-01",
  "report_type": "monthly",

  "overview": {
    "raw_materials": { "...same chart keys...": null },
    "steel":         { "...same chart keys...": null },
    "ferro":         { "...same chart keys...": null }
  },

  "iron_ore": {
    "chart_stocks": "<base64>",
    "chart_prices": "<base64>",

    "table": {
      "material1": { "name": "ЖРС 62% Fe (62% Fe)", "unit": "$/т", "market": "CNF (Китай)", "delivery": "CNF" },
      "material2": { "name": "ЖРС 65% Fe (65% Fe)", "unit": "$/т", "market": "CNF (Китай)", "delivery": "CNF" },
      "feed1": {
        "prev_price": 96.0,
        "price_feed": [
          { "date": "2025-06-01", "value": 96.0 },
          { "date": "2025-07-01", "value": 98.5 },
          { "date": "2025-08-01", "value": 97.1 },
          { "date": "2025-09-01", "value": 95.4 },
          { "date": "2025-10-01", "value": 99.2 },
          { "date": "2025-11-01", "value": 101.0 },
          { "date": "2025-12-01", "value": 103.6 },
          { "date": "2026-01-01", "value": 102.1 },
          { "date": "2026-02-01", "value": 100.8 }
        ]
      },
      "feed2": {
        "prev_price": 102.0,
        "price_feed": [
          { "date": "2025-06-01", "value": 102.0 },
          { "date": "2025-07-01", "value": 104.3 },
          { "date": "2025-08-01", "value": 103.0 },
          { "date": "2025-09-01", "value": 101.5 },
          { "date": "2025-10-01", "value": 105.2 },
          { "date": "2025-11-01", "value": 107.0 },
          { "date": "2025-12-01", "value": 109.1 },
          { "date": "2026-01-01", "value": 107.8 },
          { "date": "2026-02-01", "value": 107.1 }
        ]
      }
    }
  },

  "scrap": {
    "chart_scrap3a": "<base64>",
    "table_scrap3a": {
      "material": { "name": "Лом 3А", "unit": "₽/т", "market": "CPT (Россия)", "delivery": "CPT" },
      "feed": {
        "prev_price": 25800,
        "price_feed": [
          { "date": "2025-06-01", "value": 25800 },
          { "date": "2025-07-01", "value": 26200 },
          { "date": "2025-08-01", "value": 26700 },
          { "date": "2025-09-01", "value": 27000 },
          { "date": "2025-10-01", "value": 27300 },
          { "date": "2025-11-01", "value": 27600 },
          { "date": "2025-12-01", "value": 27900 },
          { "date": "2026-01-01", "value": 27800 },
          { "date": "2026-02-01", "value": 28100 }
        ]
      }
    },
    "table_minimax": [
      {
        "material": {
          "Country": "Россия",
          "Type": "3А",
          "DeliveryType": "CPT",
          "DeliveryLocation": "Череповец"
        },
        "period1": {
          "min": { "prev_price": null, "price_feed": [{ "date": "2026-01-01", "value": 27500 }] },
          "max": { "prev_price": null, "price_feed": [{ "date": "2026-01-01", "value": 28000 }] },
          "med": { "prev_price": 27200, "price_feed": [{ "date": "2026-01-01", "value": 27800 }] }
        },
        "period2": {
          "min": { "prev_price": null, "price_feed": [{ "date": "2026-02-01", "value": 27600 }] },
          "max": { "prev_price": null, "price_feed": [{ "date": "2026-02-01", "value": 28500 }] },
          "med": { "prev_price": 27800, "price_feed": [{ "date": "2026-02-01", "value": 28100 }] }
        }
      }
    ]
  },

  "ferro": {
    "table_grouped": [
      {
        "material": { "name": "FeMn76", "unit": "$/т", "market": "DDP ЕС", "delivery": "DDP" },
        "period1_med": { "prev_price": null, "price_feed": [{ "date": "2026-02-01", "value": 1295 }] },
        "period2_med": { "prev_price": 1295, "price_feed": [{ "date": "2026-02-28", "value": 1335 }] }
      }
    ],
    "femn_simn": {
      "chart": "<base64>",
      "table": {
        "material1": { "name": "FeMn76", "unit": "$/т", "market": "DDP (ЕС)", "delivery": "DDP" },
        "feed1": {
          "prev_price": 1240,
          "price_feed": [
            { "date": "2025-06-01", "value": 1240 },
            { "date": "2025-07-01", "value": 1260 },
            { "date": "2025-08-01", "value": 1275 },
            { "date": "2025-09-01", "value": 1290 },
            { "date": "2025-10-01", "value": 1305 },
            { "date": "2025-11-01", "value": 1310 },
            { "date": "2025-12-01", "value": 1315 },
            { "date": "2026-01-01", "value": 1320 },
            { "date": "2026-02-01", "value": 1335 }
          ]
        },
        "material2": { "name": "SiMn65", "unit": "$/т", "market": "DDP (ЕС)", "delivery": "DDP" },
        "feed2": {
          "prev_price": 1040,
          "price_feed": [
            { "date": "2025-06-01", "value": 1040 },
            { "date": "2025-07-01", "value": 1050 },
            { "date": "2025-08-01", "value": 1070 },
            { "date": "2025-09-01", "value": 1085 },
            { "date": "2025-10-01", "value": 1095 },
            { "date": "2025-11-01", "value": 1100 },
            { "date": "2025-12-01", "value": 1108 },
            { "date": "2026-01-01", "value": 1110 },
            { "date": "2026-02-01", "value": 1125 }
          ]
        }
      }
    },
    "fesi":   { "...": null },
    "fecr":   { "...": null },
    "mn_ore": { "...": null },
    "cr_ore": { "...": null }
  },

  "pig_iron":    { "...": null },
  "steel_semis": { "...": null },
  "steel_long":  { "...": null },
  "steel_flat":  { "...": null },
  "graphite":    { "...": null }
}
```

### Key differences between weekly and monthly feeds at a glance

| Field | Weekly | Monthly |
|---|---|---|
| `price_feed` entry count | 5–30 (daily or weekly-avg) | 9 (9 months) or 2 (two months for minimax) |
| `price_feed[].date` | `"2026-02-10"` (specific day) | `"2026-02-01"` (first of month) |
| Minimax `period1/2` date | Monday of each of 2 weeks | First day of each of 2 months |
| `table_grouped` period dates | Two Thursdays | First + last day of month |
| `predict_feed` present | Never | On some `singleTable`s in ferro/ore sections |

## Summary observations

| | `genShort` | `gen/weekly` | `gen/monthly` |
|---|---|---|---|
| Charts | passed as PNG bytes | passed as PNG bytes | passed as PNG bytes |
| Table data | none (text only) | minimax-heavy (daily feeds) | avg-heavy (monthly feeds) |
| Predict data | no | no | optional on some singleTables |
| docx-gen makes outgoing calls | none | **none** (after migration) | **none** (after migration) |

The caller (Go backend, or any future service) becomes responsible for:
1. Rendering all charts ahead of time and passing PNG bytes
2. Fetching and passing all material metadata and price feeds
3. Choosing the correct date ranges for each table section

docx-gen only needs to know: "given this blob of data, lay out this fixed report template."

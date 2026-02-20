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

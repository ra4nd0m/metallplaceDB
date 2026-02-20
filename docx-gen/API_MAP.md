# docx-gen API Dependency Map

This file tracks every incoming and outgoing HTTP call in the docx-gen service.
It is the starting point for decoupling docx-gen from the existing backend.

---

## Incoming (requests received by docx-gen)

Caller: Go backend via `pkg/docxgenclient/client.go`

| Method | Path        | Request body fields                                     | Response                  | Triggered by               |
|--------|-------------|---------------------------------------------------------|---------------------------|----------------------------|
| POST   | `/gen`      | `{ date: "YYYY-MM-DD", report_type: "weekly"\|"monthly" }` | `.docx` binary (stream) | WeeklyReport / MonthlyReport |
| POST   | `/genShort` | `{ date: "YYYY-MM-DD", report_header: string, blocks: Block[] }` | `.docx` binary (stream) | ShortReport |

### `Block` shape (for `/genShort`)

```json
{
  "title": "string",
  "text": ["string"],
  "chart": "<PNG bytes | null>"
}
```

---

## Outgoing — Backend API  (`ApiEndpoint = http://$HTTP_HOST:$MPLBASE_INTERNAL_HTTP_PORT`)

### 1. `POST /getMaterialInfo`

Fetches metadata for a single material (name, unit, market, delivery type).

**Request:**

```json
{ "id": <number> }
```

**Response fields used:**

```json
{
  "info": {
    "Name": "string",
    "Unit": "string",
    "Market": "string",
    "DeliveryType": "string"
  }
}
```

**Called from:**

- `component/table_single.js`
- `component/table_double.js`
- `component/table_double_avg.js`
- `component/table_double_minimax.js`
- `component/table_single_minimax.js`
- `component/table_material_minimax.js`
- `component/table_material_grouped.js`
- `component/chart_block.js`

---

### 2. `POST /getValueForPeriod`

Returns a daily price feed for a material/property pair over a date range.

**Request:**

```json
{
  "material_source_id": <number>,
  "property_id": <number>,   // 1=med, 2=min, 3=max, 4=monthPredict, 5=weekPredict
  "start": "YYYY-MM-DD",
  "finish": "YYYY-MM-DD"
}
```

**Response fields used:**

```json
{
  "price_feed": [
    { "date": "string", "value": <number> }
  ]
}
```

**Called from:**

- `component/table_single.js` — main body + predict rows (scale=day)
- `component/table_double.js` — main body + predict rows (scale=day)
- `component/table_double_avg.js`
- `component/table_double_minimax.js` — min/max/med for 2 materials
- `component/table_single_minimax.js` — min/max/med (scale=day)
- `component/table_material_grouped.js` — med price for type=month and type=week

---

### 3. `POST /getMonthlyAvgFeed`

Returns a monthly-averaged price feed for a material/property pair.

**Request:**

```json
{
  "material_source_id": <number>,
  "property_id": <number>,
  "start": "YYYY-MM-DD",
  "finish": "YYYY-MM-DD"
}
```

**Response fields used:**

```json
{
  "price_feed": [
    { "date": "string", "value": <number> }
  ]
}
```

**Called from:**

- `component/table_single.js` — main body (scale=month)
- `component/table_double.js` — main body (scale=month)
- `component/table_single_minimax.js` — min/max/med (scale=month)
- `component/table_material_minimax.js` — min/max/med for each period
- `component/chart_block.js` — for м/м (month-over-month) percent change in info row

---

### 4. `POST /getNLastValues`

Returns the last N price values for a material/property pair up to a given date.

**Request:**

```json
{
  "material_source_id": <number>,
  "property_id": <number>,
  "n_values": <number>,
  "finish": "YYYY-MM-DD"
}
```

**Response fields used:**

```json
{
  "price_feed": [
    { "value": <number> }
  ]
}
```

**Called from:**

- `component/chart_block.js` — to compute н/н (week-over-week) percent change for the chart info row

---

## Outgoing — Chart Service  (`ApiEndpoint/getChart/...`)

The chart client (`client/chart.js`) sends a single `GET` to:

```text
GET {ApiEndpoint}/getChart/{materialIds}_{propertyId}_{timeFrame}_{labels}_{type}_{scale}_{xStep}_{legend}_{toFixed}_{predict}_{isTall}.png
```

URL is assembled by `utils/form_chart_url.js → FormChartUrl(ChartUrl)`.

**Response:** raw PNG binary (`arraybuffer`)

**Called from:**

- `component/chart_block.js` — all chart components

---

## Dependency summary

```text
docx-gen
 ├── INCOMING
 │    ├── POST /gen          ← Go backend (docxgenclient)
 │    └── POST /genShort     ← Go backend (docxgenclient)
 │
 └── OUTGOING (per request)
      ├── Backend API
      │    ├── POST /getMaterialInfo       (metadata lookup)
      │    ├── POST /getValueForPeriod     (daily price feed)
      │    ├── POST /getMonthlyAvgFeed     (monthly avg price feed)
      │    └── POST /getNLastValues        (last-N prices for % change)
      └── Chart Service
           └── GET  /getChart/...         (PNG chart image)
```

### Property ID reference

| ID | Meaning         |
|----|-----------------|
| 1  | Median price    |
| 2  | Min price       |
| 3  | Max price       |
| 4  | Month forecast  |
| 5  | Week forecast   |
| 6  | Stock           |

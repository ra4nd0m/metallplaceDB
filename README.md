# DB Structure
![img.png](img.png)

# Request examples
```bash
GET localhost:8080/getValueForPeriod
Content-Type: application/json

{
  "material_source_id": 70,
  "property_id": 3,
  "start": "2023-01-01",
  "finish": "2023-01-01"
}

###
GET localhost:8080/getMonthlyAvgFeed
Content-Type: application/json

{
  "material_source_id": 3,
" property_id": 1,
  "start": "2021-10-01",
  "finish": "2022-07-01"
}

###
POST localhost:8080/getNLastValues
Content-Type: application/json

{
  "material_source_id": 1,
  "property_id": 1,
  "n_values": 2,
  "finish": "2022-12-13"
}

###
GET http://localhost:8080/getMaterialInfo
Content-Type: application/json

{
  "id": 82
}

###
GET localhost:8080/getMaterialList
Content-Type: application/json

{}

###
GET localhost:8080/getPropertyList
Content-Type: application/json

{
  "material_source_id": "2"
}

### Intit filling DB from Excel file
GET localhost:8080/initImport
Content-Type: application/json

{}


###
POST localhost:8080/addUniqueMaterial
Content-Type: application/json

{
  "name": "53",
  "source": "website.com",
  "market": "Test Market",
  "unit": "Test Unit"
}
###
POST localhost:8080/addValue
Content-Type: application/json

{
  "material_source_id": 1,
  "property_name": "med_price",
  "value_float": "100",
  "value_str": "",
  "created_on": "2025-10-14"
}

### Any day of target week
GET http://localhost:8080/getReport/weekly/2022-12-13

### Any day of target month
GET http://localhost:8080/getReport/monthly/2023-01-03

###
GET localhost:8080/getPropertyName
Content-Type: application/json

{
  "property_id": 1
}

###
GET localhost:8080/addPropertyToMaterial
Content-Type: application/json

{
  "material_id": 2,
  "property_name": "prop",
  "kind": "decimal"
}

```

# Go Server

```bash
make build
./bin/metallplace
```

# Chart service

```bash
sudo apt install nodejs
sudo apt install npm
npm install -g nodemon
npm install -g ts-node
npm run start:dev src/app.ts
```

# Docxgen service

```bash
npm install
node src/app.js
```

# Vue Frontend

В vue.config.js указать хост и порт основного сервера (по умолчанию стоит localhost:8080)

```bash
npm install
npm run build 
```

В dist соберется проект для деплоя
 
Для тестового локального запуска

```bash
npm run serve
```
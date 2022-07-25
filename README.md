# metallplaceDB

#### Запуск

Необходимо установить [Docker Compose](https://docs.docker.com/compose/install/).

Далее в файле docker-compose.yaml задать следующие характеристики:

- DB_HOST - хост БД
- DB_PORT - порт БД
- DB_USER - имя пользователя для подключения к БД
- DB_PASSWORD - пароль к БД
- DB_NAME - имя БД
- HTTP_PORT - порт сервера



- POSTGRES_USER - пользователь БД
- POSTGRES_PASSWORD - пароль БД
- POSTGRES_DB - имя БД

Далее исполнить команду

    sudo docker-compose up --build

Готово, база создана, сервер запущен и слушает запросы!

#### Сервер

Сервер реализует следующие обработчики:
- getMaterials - возвращает существующие уникальные связки Материал - Источник - Рынок - Валюта продажи в формате JSON
- initialImport - добавляет начальные записи (надо доработать)
- getValueForPeriod - возвращает фид цены определенной связки за определенный промежуток. На вход принимает id связки, дату нижней и верхней границы (несторогое сравнение)

        GET localhost:8080/getValueForPeriod
        Content-Type: application/json

        {
          "material_source_id": 86,
          "start": "2018-01-04",
          "finish": "2022-04-05"
        }
    
    Возвращает
    
        type PriceResponse struct {
            PriceFeed []model.Price `json:"price_feed"`
        }


- addValue - добавляет значение свойству определенной уникальной связки. На вход принимает id связки, id свойсва, значение свойства, и дату фиксирования

        POST localhost:8080/addValue
        Content-Type: application/json

        {
          "maerial_source_id": 1,
          "property_name": "med_price",
          "value_float": "99999",
          "value_str": "",
          "created_on": "2015-09-15T14:00:13Z"
        }

- addUniqueMaterial - добавляет уникальную связку материала. На вход принимает название материала, источник, рынок торгов и валюту

        POST localhost:8080/addUniqueMaterial
        Content-Type: application/json

        {
          "name": "Test Material",
          "source": "Test Source",
          "market": "Test Market",
          "unit": "Test Unit"
        }
        
- getNLastValues - получает последние N записей по materialSourceId

        GET localhost:8080/getNLastValues
        Content-Type: application/json

        {
          "material_source_id": 1,
          "n_values": 5
        }


#### Структура БД

- Material - таблица всех материалов
- Source - источники (биржи)
- Property - свойства материалов (например цена, также можно добавлять новые)


- Material_Property - связывает материал и его свойства
- Material_Value - значение определенного свойства материала, взятого из определенного источника
- Material_Source - связывает материалы, источник, рынок торгов и валюту торгов

![metallplace@localhost](https://user-images.githubusercontent.com/73790397/177200249-0f049e37-8a0c-41d3-abc5-1a79e4ca81b6.png)

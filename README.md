# metallplaceDB

#### Запуск
Создать следующие переменный окружения
- DB_HOST - хост БД
- DB_PORT - порт БД
- DB_USER - имя пользователя для подключения к БД
- DB_PASSWORD - пароль к БД
- DB_NAME - имя БД
- HTTP_PORT - порт сервера
    
Далее исполнить команду
    go build cmd/metallplace/main.go

Готово, сервер запущен и слушает запросы!

#### Сервер

Сервер реализует следующие хендлеры:
- getMaterials - возвращает существующие уникальные связки Материал - Источник - Рынок - Валюта продажи в формате JSON
- getPrice - возвращает фид цены определенной связки за определенный промежуток. На вход принимает id связки, дату нижней и верхней границы (несторогое сравнение)
 
      POST localhost:8080/getPrice
      Content-Type: application/json

      {
        "material_source_id": 1,
        "start": "2017-01-04",
        "finish": "2017-04-05"
      }
      
#### Структура БД

Material - таблица всех материалов
Source - источники (биржи)
Property - свойства материалов (например цена, также можно добавлять новые)

Material_Property - связывает материал и его свойства
Material_Value - значение определенного свойства материала, взятого из определенного источника
Material_Source - связывает материалы, источник, рынок торгов и валюту торгов

![metallplace@localhost](https://user-images.githubusercontent.com/73790397/177200249-0f049e37-8a0c-41d3-abc5-1a79e4ca81b6.png width=50% height=50%
<img src="[https://user-images.githubusercontent.com/16319829/81180309-2b51f000-8fee-11ea-8a78-ddfe8c3412a7.png](https://user-images.githubusercontent.com/73790397/177200249-0f049e37-8a0c-41d3-abc5-1a79e4ca81b6.png)" width=50% height=50%>



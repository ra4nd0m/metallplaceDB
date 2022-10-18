export const addValue = async(materialId, propertyId, value, date) => {
    let propertyName = ""
    await fetch('http://localhost:8080/getPropertyName', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"property_id": propertyId})
    }).then(r => {
         propertyName = r.json().property_name
    });


    await fetch('http://localhost:8080/getMaterialList', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "material_source_id": materialId,
            "property_name": propertyName,
            "value_float": value,
            "value_str": "",
            "created_on": date
        })
    }).then(resp =>{
        alert(resp.json())
    });
}
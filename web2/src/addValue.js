export const addValue = async (materialId, propertyId, value, createdOn) => {
    let propertyName = ""
    const respPropertyName = await fetch('http://localhost:8080/getPropertyName', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"property_id": propertyId})
    });
    let content = await respPropertyName.json()
    propertyName = content.property_name

    const respAddValue = await fetch('http://localhost:8080/addValue', {
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
            "created_on": createdOn
        })
    })
    content = await respAddValue.json()
    alert(content.success)
}
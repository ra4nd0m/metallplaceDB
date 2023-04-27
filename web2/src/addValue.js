import config from './config'

export const addValue = async (materialId, propertyName, value, createdOn) => {
    value.replace(",", ".")
    const respAddValue = await fetch(config.apiEndpoint + `/addValue`, {
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
    let content = await respAddValue.json()
}
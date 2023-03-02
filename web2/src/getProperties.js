export const getPropertiesList = async (materialId) => {

    let list = []
    const rawResponse = await fetch(`http://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}/getPropertyList`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"material_source_id": materialId.toString()})
    });
    const content = await rawResponse.json();
    content.list.forEach(p => {
        list.push({value: `${p.Id}`, text: `${p.Name}`})
    })
    return list

}
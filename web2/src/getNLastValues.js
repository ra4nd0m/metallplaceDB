export const getNLastValues = async(materialId, propertyId, n, date) => {
    if (date === undefined){
        let today = new Date();
        today.setMonth(today.getMonth() + 4)
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        date = yyyy + '-' + mm + '-' + dd;
    }
    console.log(materialId + " " + propertyId + " " + n + " " + date )
    const rawResponse = await fetch('http://localhost:8080/getNLastValues', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "material_source_id": materialId,
            "property_id": propertyId,
            "n_values": n,
            "finish": date
        })
    });
    const content = await rawResponse.json();
    content.price_feed.forEach(v => {
        v.date = v.date.substring(0, 10)
    })
    return content.price_feed
}
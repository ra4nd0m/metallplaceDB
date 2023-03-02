export const getMaterialList = async() => {
    let list = []
    const rawResponse = await fetch(`http://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}/getMaterialList`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
    const content = await rawResponse.json();
    content.list.forEach(m =>{
        list.push({value: `${m.Id}`, text: `${m.Name}, ${m.Unit}, ${m.DeliveryType} ${m.Market}`})
    })
    return list
}

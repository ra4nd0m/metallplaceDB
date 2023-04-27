import config from "@/config";

export const getMaterialList = async() => {
    let list = []
    const rawResponse = await fetch(config.apiEndpoint +`/getMaterialList`, {
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

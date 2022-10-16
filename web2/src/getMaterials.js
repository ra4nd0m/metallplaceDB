export const getMaterialList = async() => {
    let list = []
    const rawResponse = await fetch('http://localhost:8080/getMaterialList', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
    const content = await rawResponse.json();
    content.list.forEach(m =>{
        list.push({value: `${m.Id}`, text: `${m.Name}, ${m.Unit}`})
    })
    return list
}

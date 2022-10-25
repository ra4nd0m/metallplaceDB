export const addMaterial = async (name, source, unit) => {
    const respAddValue = await fetch('http://localhost:8080/addUniqueMaterial', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "source": source,
            "market": "-",
            "unit": unit,
        })
    })
    let content = await respAddValue.json()
    alert(content.success)
}
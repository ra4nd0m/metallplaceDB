import {addProperty} from "@/addProperty";

export const addMaterialWithProperties = async (name, source, market, unit, properties) => {
    const respAddValue = await fetch('http://localhost:8080/addUniqueMaterial', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "source": source,
            "market": market,
            "unit": unit,
        })
    })
    let content = await respAddValue.json()
    const materialId = content.id

    properties.forEach(p =>{
        addProperty(materialId, p.name)
    })

}
import {addProperty} from "@/addProperty";
import agent from "@/addAuthToken";

export const addMaterialWithProperties = async (name, source, market, unit, properties, deliveryType) => {
    const respAddValue = await agent.post('/addUniqueMaterial', {
            "name": name,
            "source": source,
            "market": market,
            "delivery_type": deliveryType,
            "unit": unit,
    })
    let content = await respAddValue.json()
    const materialId = content.id

    properties.forEach(p =>{
        addProperty(materialId, p.name)
    })

}
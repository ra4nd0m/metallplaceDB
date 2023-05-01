import config from './config'
import agent, {fetchWithAuth} from "@/addAuthToken";
export const addProperty = async (materialId, propertyName) => {
    alert("adding req")
    const respAddValue = await agent.post('/addPropertyToMaterial', {
            "material_id": materialId,
            "property_name": propertyName,
            "kind": "decimal"
    })
    let content = await respAddValue.json()
    alert(content.success)
}
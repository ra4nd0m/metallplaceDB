import config from './config'
import agent, {fetchWithAuth} from "@/addAuthToken";

export const addValue = async (materialId, propertyName, value, createdOn) => {
    value.replace(",", ".")
    const respAddValue = await agent.post(`/addValue`, {
            "material_source_id": materialId,
            "property_name": propertyName,
            "value_float": value,
            "value_str": "",
            "created_on": createdOn
    })
    let content = await respAddValue.json()
}
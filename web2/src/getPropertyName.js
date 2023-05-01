import config from './config'
import agent, {fetchWithAuth} from "@/addAuthToken";
export const getPropertyName = async (propertyId) => {
    const rawResponse = await agent.post( '/getPropertyName', {
        "property_id": propertyId
    });
    const content = await rawResponse.json();
    return content.property_name
}
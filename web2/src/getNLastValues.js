import config from './config'
import agent, {fetchWithAuth} from "@/addAuthToken";
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
    const rawResponse = await agent.post('/getNLastValues', {
            "material_source_id": materialId,
            "property_id": propertyId,
            "n_values": n,
            "finish": date
    });
    const content = await rawResponse.json();
    content.price_feed.forEach(v => {
        v.date = v.date.substring(0, 10)
    })
    return content.price_feed
}
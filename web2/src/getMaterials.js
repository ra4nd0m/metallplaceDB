import config from "@/config";
import agent, {fetchWithAuth} from "@/addAuthToken";

export const getMaterialList = async() => {
    let list = []
    const rawResponse = await agent.post(`/getMaterialList`, {});
    const content = await rawResponse.json();
    content.list.forEach(m =>{
        list.push({value: `${m.Id}`, text: `${m.Name}, ${m.Unit}, ${m.DeliveryType} ${m.Market}`})
    })
    return list
}

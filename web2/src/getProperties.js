import agent from "@/addAuthToken";

export const getPropertiesList = async (materialId) => {

    let list = []
    const rawResponse = await agent.post(`/getPropertyList`, {
        "material_source_id": materialId.toString()
    });
    const content = await rawResponse.json();
    content.list.forEach(p => {
        list.push({value: `${p.Id}`, text: `${p.Name}`})
    })
    return list

}
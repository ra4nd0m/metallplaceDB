import config from './config'
export const getPropertyName = async (propertyId) => {
    const rawResponse = await fetch(config.apiEndpoint + '/getPropertyName', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"property_id": propertyId})
    });
    const content = await rawResponse.json();
    return content.property_name
}
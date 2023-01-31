export const getPropertyName = async (propertyId) => {
    const rawResponse = await fetch('http://localhost:8080/getPropertyName', {
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
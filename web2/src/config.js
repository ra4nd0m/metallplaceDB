const config = {
    apiEndpoint: `http://${process.env.VUE_APP_MPLBASE_BACK_HTTP_HOST}:${process.env.VUE_APP_MPLBASE_BACK_HTTP_PORT}`,
}

console.log("Use API endpoint: " + config.apiEndpoint)
console.log(process.env)

export default config
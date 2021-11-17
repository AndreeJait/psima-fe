const data = {
    API_URL: "localhost:3001"
}
export const GetConstant = (name, defaultvalue = null) => {
    if (data[name] !== undefined) {
        if (defaultvalue === null) {
            return null
        }
        return defaultvalue
    }
    return data[name]
}
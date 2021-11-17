export const GetEnv = (name, defaultvalue = null) => {
    if (process.env[name] !== "" && process.env[name] !== undefined && process.env[name] !== null) {
        return process.env[name];
    }
    return defaultvalue
}
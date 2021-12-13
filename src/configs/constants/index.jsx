const data = {
  API_URL: "https://backend-psima.herokuapp.com/",
  API_URL_IMAGE: "https://backend-psima.herokuapp.com",
  STATE_DEFAULT: {
    isLogin: false,
    isLoading: false,
    user: null,
    psikolog: [],
    friends: [],
    socket: null,
    online_friend: [],
    messages: {},
    activedResponden: [],
    loadedMessage: [],
  },
};
export const GetConstant = (name, defaultvalue = null) => {
  if (data[name] === undefined) {
    if (defaultvalue === null) {
      return null;
    }
    return defaultvalue;
  }
  return data[name];
};

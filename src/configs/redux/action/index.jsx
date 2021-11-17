import axios from "axios";
import { GetConstant } from "../../constants";
axios.defaults.baseURL = GetConstant("API_URL");

// Change global redux value
export const ChangeGlobalRedux = (data) => {
  return (dispatch) => {
    return dispatch({ type: data.type, value: data.value });
  };
};

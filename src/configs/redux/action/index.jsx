import axios from "axios";
import { GetConstant } from "../../constants";
axios.defaults.baseURL = GetConstant("API_URL");

// Change global redux value
export const ChangeGlobalRedux = (data) => {
  return (dispatch) => {
    return dispatch(data);
  };
};

export const actionLogin = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/users/login", data)
      .then((res) => {
        dispatch({ type: "CHANGE_LOGIN", value: true });
        let user = res.data.user;
        if (user.psikolog === null && user.students === null) {
          user.role = 0;
        } else if (user.psikolog !== null && user.students === null) {
          user.role = 1;
        } else {
          user.role = 2;
        }
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", res.data.token);
        dispatch({ type: "CHANGE_USER", value: user });
        resolve(res.status);
      })
      .catch((err) => {
        dispatch({ type: "CHANGE_LOGIN", value: false });
        dispatch({ type: "CHANGE_USER", value: null });
        reject(err.response);
      });
  });
};

export const actionRegister = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: "CHANGE_LOADING", value: true });
    axios
      .post("/users/register", data)
      .then((res) => {
        dispatch({ type: "CHANGE_LOADING", value: false });
        dispatch({ type: "CHANGE_LOGIN", value: true });
        let user = res.data.users;
        if (user.psikolog === null && user.students === null) {
          user.role = 0;
        } else if (user.psikolog !== null && user.students === null) {
          user.role = 1;
        } else {
          user.role = 2;
        }
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", res.data.token);
        dispatch({ type: "CHANGE_USER", value: user });
        resolve(res.status);
      })
      .catch((err) => {
        dispatch({ type: "CHANGE_LOADING", value: false });
        dispatch({ type: "CHANGE_LOGIN", value: false });
        dispatch({ type: "CHANGE_USER", value: null });
        reject(err.response);
      });
  });
};
export const actionGetAllPsikolog = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/users/psikolog/all", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        dispatch({ type: "CHANGE_PSIKOLOG", value: response.data.psikolog });
        resolve(response.status);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
};

export const actionGetAllFriend = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/message/all/friend", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        dispatch({ type: "CHANGE_FRIEND", value: response.data.data });
        dispatch({ type: "CHANGE_LOADED_FRIEND", value: true });
        resolve(response.status);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
};

export const actionConnectFriend = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/message/connect", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        dispatch({
          type: "DELETE_PSIKOLOG",
          value: data.index,
          _id: response.data._id,
        });
        resolve(200);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response);
      });
  });
};

export const actionGetAllMessage = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/message/all", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((result) => {
        dispatch({
          type: "CHANGE_MESSAGE",
          value: result.data.data.message,
          key: data.psikolog + "-" + data.student,
        });
        dispatch({
          type: "CHANGE_LOADED_MESSAGE",
          value: data.psikolog + "-" + data.student,
        });
        if (result.data.data.message.length === 0) {
          dispatch({
            type: "CHANGE_DATA_COMPLETE",
            value: data.psikolog + "-" + data.student,
          });
        }
        resolve(result.data.message.length);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response);
      });
  });
};

export const actionSendMessage = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/message/", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        dispatch({
          type: "CHANGE_MESSAGE_NEW",
          key: data.psikolog + "-" + data.student,
          psikolog: data.psikolog,
          student: data.student,
          value: [
            {
              _id: res.data._id,
              message: data.message,
              isPsikolog: data.isPsikolog,
              date: res.data.date,
            },
          ],
        });
        resolve(res.status);
      })
      .catch((err) => {
        reject(err.response);
      });
  });
};

import React, { useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import { isExpired } from "react-jwt";
import { ChangeGlobalRedux } from "../../../configs/redux/action";
const PrivateRoute = ({ component: Component, children, ...rest }) => {
  let [jwt] = useState(localStorage.getItem("token"));
  return (
    <Route
      {...rest}
      render={(props) => {
        if (rest.isLogin && !isExpired(jwt)) {
          return Component ? <Component {...props} /> : children;
        }
        if (isExpired(jwt)) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          rest.changeGlobal({ type: "CHANGE_LOGIN", value: false });
          rest.changeGlobal({ type: "CHANGE_USER", value: null });
          if (rest.socket !== null) {
            rest.socket.discconect();
          }
        }
        return <Redirect to={"/login"} />;
      }}
    />
  );
};
const reduxState = (state) => ({
  isLogin: state.isLogin,
  socket: state.socket,
});
const reduxDispatch = (dispatch) => ({
  changeGlobal: (data) => dispatch(ChangeGlobalRedux(data)),
});

export default connect(reduxState, reduxDispatch)(PrivateRoute);

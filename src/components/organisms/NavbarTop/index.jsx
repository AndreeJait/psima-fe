import React from "react";
import { connect } from "react-redux";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { ChangeGlobalRedux } from "../../../configs/redux/action";
import { GetConstant } from "../../../configs/constants";
const NavbarTop = (props) => {
  const handleLogOut = (event) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    props.socket.disconnect();
    props.changeRedux({ type: "CHANGE_DEFAULT", value: false });
  };
  const handleShowDropDown = (event) => {
    let target = document.getElementById("profile-dropdown");
    if (target.classList.contains("hide")) {
      target.classList.remove("hide");
    } else {
      target.classList.add("hide");
    }
  };
  return (
    <div className="navbar-top">
      <div className="navbar-custom custom-dropdown">
        <div className="image-wrap shadow-sm" onClick={handleShowDropDown}>
          {props.user !== null && (
            <img
              src={GetConstant("API_URL_IMAGE") + props.user.profile}
              alt=""
            />
          )}
          <div
            className={props.socket !== null ? "status active" : "status"}
          ></div>
        </div>
        <div
          className="item-custom-dropdown shadow-sm hide"
          id="profile-dropdown"
        >
          <div className="item-custom-link" onClick={handleLogOut}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
          </div>
        </div>
      </div>
    </div>
  );
};
const reduxState = (state) => ({
  socket: state.socket,
  user: state.user,
});
const reduxDispatch = (dispatch) => ({
  changeRedux: (data) => dispatch(ChangeGlobalRedux(data)),
});

export default connect(reduxState, reduxDispatch)(NavbarTop);

import React from "react";
import { connect } from "react-redux";
import "./index.css";
import Student from "../../../assets/images/logo/student.png";
import Psikolog from "../../../assets/images/logo/psikolog.png";
import { useHistory } from "react-router-dom";
const SelectRole = (props) => {
  const history = useHistory();
  const handleOnClickRole = (event) => {
    let role = event.currentTarget.getAttribute("data-role");
    history.push("/register/" + role);
  };
  return (
    <div className="select-role pt-5">
      <h1>Pilih Peran Anda</h1>
      <div className="col-12 mt-5 d-flex flex-column align-items-center flex-md-row justify-content-md-between">
        <div className="col-10 col-md-5 rounded shadow-sm bg-white">
          <img
            data-role="student"
            onClick={handleOnClickRole}
            src={Student}
            width="100%"
            alt=""
          />
        </div>
        <div className="col-10 mt-5 mt-md-0 col-md-5 rounded shadow-sm bg-white">
          <img
            data-role="psikolog"
            onClick={handleOnClickRole}
            src={Psikolog}
            width="100%"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
const reduxState = (state) => ({});
const reduxDispatch = (dispatch) => ({});

export default connect(reduxState, reduxDispatch)(SelectRole);

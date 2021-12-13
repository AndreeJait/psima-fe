import React from "react";
import { connect } from "react-redux";
import "./index.css";

const InputRounded = (props) => {
  return (
    <div className={"input-rounded " + props.className}>
      <label htmlFor={props.input.name}>{props.label.text}</label>
      <input {...props.input} />
    </div>
  );
};
const reduxState = (state) => ({});
const reduxDispatch = (dispatch) => ({});

export default connect(reduxState, reduxDispatch)(InputRounded);

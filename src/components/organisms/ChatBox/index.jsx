import React from "react";
import { connect } from "react-redux";
import "./index.css";

const ChatBox = (props) => {
  return (
    <div
      className={
        props.message.isMe
          ? "chatBox right shadow-sm"
          : "chatBox left shadow-sm"
      }
    >
      <span className="date-message">{props.message.date}</span>
      <span>{props.message.text}</span>
    </div>
  );
};
const reduxState = (state) => ({});
const reduxDispatch = (dispatch) => ({});

export default connect(reduxState, reduxDispatch)(ChatBox);

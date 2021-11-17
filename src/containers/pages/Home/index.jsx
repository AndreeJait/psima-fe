import "./index.css";
import React, { Component } from "react";
import { ChangeGlobalRedux } from "../../../configs/redux/action";
import { connect } from "react-redux";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handelOnClick = () => {
    this.props.changeGlobalDispatch({ type: "CHANGE_LOADING", value: true });
    console.log(this.props.isLoading);
  };
  render() {
    return (
      <div>
        <h3>Hello World !</h3>
        <button onClick={this.handelOnClick}>Click</button>
      </div>
    );
  }
}

const reduxState = (state) => ({
  isLogin: state.isLogin,
  isLoading: state.isLoading,
});
const reduxDispatch = (dispatch) => ({
  changeGlobalDispatch: (data) => dispatch(ChangeGlobalRedux(data)),
});

export default connect(reduxState, reduxDispatch)(Home);

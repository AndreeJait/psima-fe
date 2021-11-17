import "./index.css";
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../Home";
import { ChangeGlobalRedux } from "../../../configs/redux/action";
import { connect } from "react-redux";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </Router>
    );
  }
}
const reduxState = (state) => ({
  isLogin: state.isLogin,
});
const reduxDispatch = (dispatch) => ({
  changeGlobalDispatch: (data) => dispatch(ChangeGlobalRedux),
});

export default connect(reduxState, reduxDispatch)(App);

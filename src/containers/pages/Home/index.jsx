import "./index.css";
import React, { Component } from "react";
import { ChangeGlobalRedux } from "../../../configs/redux/action";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks } from "@fortawesome/free-solid-svg-icons";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      field: {
        username: "",
        message: "",
      },
    };
  }
  componentDidMount() {}
  handelOnClick = (event) => {
    let target = event.currentTarget;
    let dest = target.getAttribute("data-dest");
    console.log(dest);
  };
  handelOnChange = (event) => {};
  render() {
    return (
      <div className="p-3">
        <h3>
          Hello{" "}
          {this.props.user !== null && this.props.user.students !== null
            ? this.props.user.students.fullName
            : this.props.user.psikolog.fullName}
          !
        </h3>
        <div className="col-12 p-3 shadow-sm mt-4">
          <div className="col-12">
            <h4 className="text-center">Apa Yang Ingin Anda Lakukan ?</h4>
          </div>
          <div className="col-12 flex-wrap mt-5 d-flex justify-content-center flex-md-row gap-5 flex-column">
            <div className="col-3 shadow rounded px-3 py-5" role="button">
              <div className="col-12 d-flex flex-column gap-3 align-items-center">
                <FontAwesomeIcon className="fs-1" icon={faTasks} />
                <h5>Task To Do</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const reduxState = (state) => ({
  isLogin: state.isLogin,
  isLoading: state.isLoading,
  user: state.user,
  socket: state.socket,
});
const reduxDispatch = (dispatch) => ({
  changeGlobalDispatch: (data) => dispatch(ChangeGlobalRedux(data)),
});

export default connect(reduxState, reduxDispatch)(Home);

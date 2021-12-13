import "./index.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPaper } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import Loading from "../../../assets/images/gif/loading.gif";
import DummyDocter from "../../../assets/images/dummy/dummy_psiklolog.png";
import {
  actionConnectFriend,
  actionGetAllPsikolog,
} from "../../../configs/redux/action";
library.add(faHandPaper);
class Consultation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      errorMessage: "",
      show: [],
    };
  }
  componentDidMount() {
    if (this.props.psikolog.length <= 0) {
      this.handleGetConsultan(null);
    } else {
      this.setState((state) => ({
        ...state,
        show: this.props.psikolog,
      }));
    }
  }
  handleGetConsultan = (event) => {
    this.setState((state) => ({
      ...state,
      isLoading: true,
    }));
    this.props
      .getPsikolog({
        id: this.props.user._id,
        limit: 50,
        skip: this.props.psikolog.length,
      })
      .then((result) => {
        this.setState((state) => ({
          ...state,
          isLoading: false,
          show: this.props.psikolog,
        }));
      })
      .catch((err) => {
        this.setState((state) => ({
          ...state,
          isLoading: false,
          errorMessage: err.data.message,
        }));
      });
  };
  handleOnClickConnect = (event) => {
    let target = event.currentTarget;
    let index = Number(target.getAttribute("data-index"));
    let psikolog = this.props.psikolog[index];
    target.classList.add("load");
    this.props
      .connectFriend({
        psikolog: psikolog._id,
        student: this.props.user._id,
        index: index,
      })
      .then((res) => {
        target.classList.remove("load");
        this.setState((state) => ({
          ...state,
          show: this.props.psikolog,
        }));
      })
      .catch((err) => {
        target.classList.remove("load");
        if (err !== undefined) {
          if (err.data !== undefined) {
            this.setState((state) => ({
              ...state,
              errorMessage: err.data.message,
            }));
          }
        } else {
          console.log(err);
        }
      });
  };
  render() {
    return (
      <div className="default-page shadow-sm">
        <div className="header-text">
          <FontAwesomeIcon icon={faHandPaper} />
          <div className="text-content">
            <span>
              Halo{" "}
              {this.props.user.role === 1
                ? this.props.user.psikolog.fullName
                : this.props.user.students.fullName}
              , Selamat Datang <br></br>
              Silahkan memilih psikolog untuk berkonsultasi
            </span>
          </div>
        </div>
        {this.state.errorMessage !== "" && (
          <div className="error-message mt-5">{this.state.errorMessage}</div>
        )}
        {this.state.isLoading && (
          <div className="loading-div">
            <img src={Loading} alt="" />
          </div>
        )}
        {!this.state.isLoading && (
          <div className="loading-div">
            <button onClick={this.handleGetConsultan}>Load Data</button>
          </div>
        )}
        <div className="content-card mt-5">
          {this.props.psikolog.length <= 0 && !this.state.isLoading && (
            <span>No Psikolog Found</span>
          )}
          {this.state.show.length > 0 &&
            !this.state.isLoading &&
            this.state.show.map((item, index) => {
              return (
                <div key={index} className="card-content-item shadow-sm">
                  <img src={DummyDocter} alt="" />
                  <div className="description-card pt-4">
                    <h4>{item.psikolog.fullName}</h4>
                    <span>{item.psikolog.address}</span>
                    <div className="config-card mt-auto">
                      <span>
                        Operasional : <br></br> {item.psikolog.operation}
                      </span>
                      <button
                        className="btn-loading"
                        data-index={index}
                        onClick={this.handleOnClickConnect}
                      >
                        <img src={Loading} alt="" />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

const reduxState = (state) => ({
  user: state.user,
  psikolog: state.psikolog,
});
const reduxDispatch = (dispatch) => ({
  getPsikolog: (data) => dispatch(actionGetAllPsikolog(data)),
  connectFriend: (data) => dispatch(actionConnectFriend(data)),
});

export default connect(reduxState, reduxDispatch)(Consultation);

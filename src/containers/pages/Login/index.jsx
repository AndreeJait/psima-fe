import "./index.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import Logo from "../../../assets/images/logo/Logo.png";
import InputRounded from "../../../components/atoms/InputRounded";
import { Link } from "react-router-dom";
import { actionLogin } from "../../../configs/redux/action";
import Loading from "../../../assets/images/gif/loading.gif";
class PageName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      error: {
        message: "",
        show: false,
      },
      fields: {
        email: "",
        password: "",
      },
    };
  }
  componentDidMount() {
    const { history } = this.props;
    if (this.props.isLogin) {
      history.push("/");
    }
  }
  handleOnChange = (event) => {
    let field = this.state.fields;
    field[event.currentTarget.name] = event.currentTarget.value;
    this.setState((state) => ({
      ...state,
      fields: field,
    }));
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState((state) => ({
      ...state,
      isLoading: true,
    }));
    this.props
      .procesLogin(this.state.fields)
      .then((res) => {
        const { history } = this.props;
        this.setState((state) => ({
          ...state,
          isLoading: false,
          error: {
            show: false,
            message: "",
          },
        }));
        history.push("/");
      })
      .catch((err) => {
        let message = err;
        if (err.status !== undefined) {
          if (err.status !== null) {
            if (err.status === 404) {
              message = "Email tidak ditemukan";
            } else if (err.status === 401) {
              message = "Password salah";
            }
          }
        }
        this.setState((state) => ({
          ...state,
          isLoading: false,
          error: {
            show: true,
            message: message,
          },
        }));
      });
  };
  render() {
    return (
      <div className="box-login shadow-sm">
        <div className="logo-web">
          <img src={Logo} alt="" />
        </div>
        <div className="box-form">
          <h1>Login</h1>
          <form className="mt-4" onSubmit={this.handleSubmit}>
            <InputRounded
              label={{ text: "Email" }}
              input={{
                name: "email",
                id: "email",
                type: "text",
                value: this.state.fields.email,
                onChange: this.handleOnChange,
                required: true,
                placeholder: "Alamat email",
              }}
            />
            <InputRounded
              className="mt-4"
              label={{ text: "Password" }}
              input={{
                name: "password",
                id: "password",
                type: "password",
                value: this.state.fields.password,
                onChange: this.handleOnChange,
                required: true,
                placeholder: "Password",
              }}
            />
            <div className="holder-link">
              <Link to="/" className="ml-auto">
                Lupa password ?
              </Link>
            </div>
            {this.state.error.show && (
              <div className="error-message mt-2">
                <span>{this.state.error.message}</span>
              </div>
            )}
            <div className="button-form d-flex align-items-center flex-column mt-4">
              <button type="submit" className="btn-login-30">
                {!this.state.isLoading && "Login"}
                {this.state.isLoading && <img src={Loading} alt="" />}
              </button>
              <span className="mt-3">
                Sudah memiliki akun ?{" "}
                <Link to="/register/select">Register</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const reduxState = (state) => ({
  isLogin: state.isLogin,
});
const reduxDispatch = (dispatch) => ({
  procesLogin: (data) => dispatch(actionLogin(data)),
});

export default connect(reduxState, reduxDispatch)(PageName);

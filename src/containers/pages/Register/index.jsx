import "./index.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import SelectRole from "../../../components/organisms/SelectRole";
import RegisterForm from "../../../components/organisms/RegisterForm";
import { actionRegister } from "../../../configs/redux/action";
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      psikolog: {
        email: "",
        isPsikolog: "YES",
        password: "",
        fullName: "",
        address: "",
        phoneNumber: "",
        operation: "",
        sipp: null,
      },
      student: {
        email: "",
        isPsikolog: "NO",
        password: "",
        fullName: "",
        address: "",
        phoneNumber: "",
        parentsPhoneNumber: "",
      },
      fieldPsikolog: [
        {
          type: "text",
          name: "email",
          id: "email",
          label: "Email",
          placeholder: "example@mail.com",
        },
        {
          type: "password",
          name: "password",
          label: "Password",
          placeholder: "*********",
        },
        {
          type: "text",
          name: "fullName",
          id: "fullName",
          label: "Nama Lengkap",
          placeholder: "Nama Kamu",
        },
        {
          type: "text",
          name: "address",
          id: "address",
          label: "Alamat",
          placeholder: "Medan, Jl.X",
        },
        {
          type: "text",
          name: "phoneNumber",
          id: "phoneNumber",
          label: "Nomor Telepon",
          placeholder: "08XXXXXXXX",
        },
        {
          type: "text",
          name: "operation",
          id: "operation",
          label: "Jam Kerja",
          placeholder: "18.00 - 19.00 Senin - Jumat",
        },
        {
          type: "file",
          name: "sipp",
          id: "sipp",
          label: "SIPP",
        },
      ],
      fieldStudent: [
        {
          type: "text",
          name: "email",
          id: "email",
          label: "Email",
          placeholder: "example@mail.com",
        },
        {
          type: "password",
          name: "password",
          label: "Password",
          placeholder: "*********",
        },
        {
          type: "text",
          name: "fullName",
          id: "fullName",
          label: "Nama Lengkap",
          placeholder: "Nama Kamu",
        },
        {
          type: "text",
          name: "address",
          id: "address",
          label: "Alamat",
          placeholder: "Medan, Jl.X",
        },
        {
          type: "text",
          name: "phoneNumber",
          id: "phoneNumber",
          label: "Nomor Telepon",
          placeholder: "08XXXXXXXX",
        },
        {
          type: "text",
          name: "parentsPhoneNumber",
          id: "parentsPhoneNumber",
          label: "Nomor Telepon Orang Tua",
          placeholder: "08XXXXXXXX",
        },
      ],
      offset: 0,
      countField: 4,
    };
  }
  componentDidMount() {
    const { history } = this.props;
    if (this.props.isLogin) {
      history.push("/");
    }
  }
  handleOnChange = (name, value) => {
    let data;
    if (this.props.match.params.role === "student") {
      data = this.state.student;
      data[name] = value;
      this.setState((state) => ({
        ...state,
        student: data,
      }));
    } else {
      data = this.state.psikolog;
      data[name] = value;
      this.setState((state) => ({
        ...state,
        psikolog: data,
      }));
    }
  };
  handleRegisterUser = (event) => {
    let data;
    const { history } = this.props;
    if (this.props.match.params.role === "student") {
      data = this.state.student;
    } else {
      let newForm = new FormData();
      Object.keys(this.state.psikolog).forEach((item) => {
        newForm.set(item, this.state.psikolog[item]);
      });
      data = newForm;
    }
    this.props.registerProcess(data).then((res) => {
      history.push("/");
    });
  };
  render() {
    return (
      <div className="register-box">
        {this.props.match.params.role === "select" && <SelectRole />}
        {["psikolog", "student"].includes(this.props.match.params.role) && (
          <RegisterForm
            offset={this.state.offset}
            countField={this.state.countField}
            onChange={this.handleOnChange}
            data={
              this.props.match.params.role !== "student"
                ? this.state.psikolog
                : this.state.student
            }
            registerUser={this.handleRegisterUser}
            dataField={
              this.props.match.params.role !== "student"
                ? this.state.fieldPsikolog
                : this.state.fieldStudent
            }
          />
        )}
      </div>
    );
  }
}

const reduxState = (state) => ({
  isLogin: state.isLogin,
});
const reduxDispatch = (dispatch) => ({
  registerProcess: (data) => dispatch(actionRegister(data)),
});

export default connect(reduxState, reduxDispatch)(Register);

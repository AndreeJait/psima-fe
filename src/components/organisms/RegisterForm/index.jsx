import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import Loading from "../../../assets/images/gif/loading.gif";
import "./index.css";

const RegisterForm = (props) => {
  const [data, setData] = useState(props.data);
  const [offset, setOffset] = useState(Number(props.offset));
  const [countField, setCountField] = useState(Number(props.countField));
  const handleOnChange = (event) => {
    let { name, value, type, files } = event.currentTarget;
    if (type !== "file") {
      props.onChange(name, value);
      setData((state) => ({
        ...state,
        [name]: value,
      }));
    } else {
      props.onChange(name, files[0]);
      setData((state) => ({
        ...state,
        [name]: files[0],
      }));
    }
  };
  const handleNextOffset = (event) => {
    console.log(props.dataField);
    console.log(offset + Number(props.countField));
    setCountField(
      countField + 4 <= props.dataField.length
        ? countField + 4
        : props.dataField.length
    );
    setOffset(countField);
  };
  return (
    <div className="register-form p-4 rounded shadow bg-white">
      <h3 className="text-center">Register</h3>
      {props.dataField.slice(offset, countField).map((item, index) => (
        <div key={index} className="form-group mt-3">
          <label htmlFor={item.id}>{item.label}</label>
          <input
            value={item.type !== "file" ? data[item.name] : ""}
            className="form-control mt-2"
            onChange={handleOnChange}
            {...item}
          />
        </div>
      ))}
      <div className="d-flex w-100 mt-4">
        {offset + Number(props.countField) >= props.dataField.length ? (
          <button
            onClick={props.registerUser}
            className="btn btn-primary ml-custom-auto mr-custom-auto"
          >
            {props.isLoading ? (
              <img width="40px" alt="" src={Loading} />
            ) : (
              "Daftar"
            )}
          </button>
        ) : (
          <button className="btn ml-custom-auto" onClick={handleNextOffset}>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        )}
      </div>
    </div>
  );
};
const reduxState = (state) => ({
  isLoading: state.isLoading,
});
const reduxDispatch = (dispatch) => ({});

export default connect(reduxState, reduxDispatch)(RegisterForm);

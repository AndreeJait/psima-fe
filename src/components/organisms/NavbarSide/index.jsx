import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import "./index.css";
import Logo from "../../../assets/images/logo/Logo.png";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const NavbarSide = (props) => {
  const history = useHistory();
  const [navbar] = useState(props.navbars);
  const handleOnClickLI = (event) => {
    let target = event.currentTarget;
    if (target.classList.contains("dropdown-custom")) {
      let dropdown = document.getElementById(
        target.getAttribute("data-target")
      );
      if (dropdown.classList.contains("hide")) {
        dropdown.classList.remove("hide");
        target.classList.add("drop");
      } else {
        dropdown.classList.add("hide");
        target.classList.remove("drop");
      }
    } else {
      let childs = document.querySelectorAll("ul.sidebar-items li");
      for (let index = 0; index < childs.length; index++) {
        const element = childs[index];
        if (element !== target && element.classList.contains("active")) {
          element.classList.remove("active");
        }
      }
      target.classList.add("active");
      let path = target.getAttribute("data-path");
      history.push(path);
    }
  };
  const handleOnClicLiDropdown = (event) => {
    let target = event.currentTarget;
    let childs = document.querySelectorAll("ul.sidebar-items li");
    for (let index = 0; index < childs.length; index++) {
      const element = childs[index];
      if (element !== target && element.classList.contains("active")) {
        element.classList.remove("active");
      }
    }

    let path = target.getAttribute("data-path");
    history.push(path);
    target.classList.add("active");
    target.parentNode.parentNode.previousSibling.classList.add("active");
  };
  return (
    <div className="navbar-side shadow-sm">
      <div className="navbar-brand-custom">
        <img src={Logo} alt="" />
      </div>
      <ul className="sidebar-items">
        {navbar.map((item, index) => {
          if (item.dropdown !== null) {
            return (
              <Fragment key={index}>
                <li
                  className={
                    item.dropdown.findIndex((item) => {
                      return item.path === history.location.pathname;
                    }) !== -1
                      ? "dropdown-custom active"
                      : "dropdown-custom"
                  }
                  data-target={"dropdown-" + index}
                  onClick={handleOnClickLI}
                >
                  <FontAwesomeIcon icon={item.icon} /> {item.text}
                </li>
                <div
                  className="dropdown-side-item hide"
                  id={"dropdown-" + index}
                >
                  <ul>
                    {item.dropdown.map((item1, index1) => {
                      return (
                        <li
                          key={index1}
                          className={
                            item1.path === history.location.pathname
                              ? "active"
                              : ""
                          }
                          data-path={item1.path}
                          onClick={handleOnClicLiDropdown}
                        >
                          <FontAwesomeIcon icon={item1.icon} /> {item1.text}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Fragment>
            );
          } else {
            return (
              <li
                key={index}
                className={
                  item.path === history.location.pathname ? "active" : ""
                }
                data-path={item.path}
                onClick={handleOnClickLI}
              >
                <FontAwesomeIcon icon={item.icon} /> {item.text}
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};
const reduxState = (state) => ({});
const reduxDispatch = (dispatch) => ({});

export default connect(reduxState, reduxDispatch)(NavbarSide);

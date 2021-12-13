import "./index.css";
import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../Home";
import { ChangeGlobalRedux } from "../../../configs/redux/action";
import { connect } from "react-redux";
import Login from "../Login";
import NavbarTop from "../../../components/organisms/NavbarTop";
import NavbarSide from "../../../components/organisms/NavbarSide";
import {
  faClipboardList,
  faComments,
  faHome,
  faMapMarked,
  faMusic,
  faTasks,
  faUser,
  faUserEdit,
  faUserFriends,
  faUserMd,
  faUsers,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import Consultation from "../Consultation";
import Message from "../Message";
import PrivateRoute from "../../../components/atoms/PrivateRoute";
import { io } from "socket.io-client";
import { GetConstant } from "../../../configs/constants";
import Register from "../Register";
library.add(
  faHome,
  faMusic,
  faComments,
  faUserMd,
  faTasks,
  faClipboardList,
  faVideo,
  faUserFriends,
  faUsers,
  faMapMarked,
  faUserEdit
);
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      navbarStudent: [
        {
          path: "/",
          text: "Home",
          icon: faHome,
          dropdown: null,
        },
        {
          path: "/consultation",
          text: "Konsultasi",
          icon: faUserMd,
          dropdown: null,
        },
        {
          path: "/message",
          text: "Pesan",
          icon: faComments,
          dropdown: null,
        },
        {
          path: "/consultation/request",
          text: "Request Konsultasi",
          icon: faClipboardList,
          dropdown: null,
        },
        {
          path: "/videos",
          text: "Video",
          icon: faVideo,
          dropdown: null,
        },
        {
          text: "Sharing Certita",
          icon: faUserFriends,
          dropdown: [
            {
              icon: faUser,
              path: "/sharing/story/me",
              text: "Cerita Anda",
            },
            {
              icon: faUsers,
              path: "/sharing/story/people",
              text: "Cerita Lain",
            },
          ],
        },
        {
          path: "/psikiater/",
          text: "Psikiater Terdekat",
          icon: faMapMarked,
          dropdown: null,
        },
        {
          path: "/users/edit",
          text: "Edit Profile",
          icon: faUserEdit,
          dropdown: null,
        },
      ],
      navbarPsikolog: [
        {
          path: "/",
          text: "Home",
          icon: faHome,
          dropdown: null,
        },
        {
          path: "/message",
          text: "Pesan",
          icon: faComments,
          dropdown: null,
        },
        {
          path: "/consultation/approve",
          text: "Approve Konsultasi",
          icon: faClipboardList,
          dropdown: null,
        },
        {
          path: "/videos",
          text: "Video",
          icon: faVideo,
          dropdown: null,
        },
        {
          text: "Sharing Certita",
          icon: faUserFriends,
          dropdown: [
            {
              icon: faUser,
              path: "/sharing/story/me",
              text: "Cerita Anda",
            },
            {
              icon: faUsers,
              path: "/sharing/story/people",
              text: "Cerita Lain",
            },
          ],
        },
        {
          path: "/psikiater/",
          text: "Psikiater Terdekat",
          icon: faMapMarked,
          dropdown: null,
        },
        {
          path: "/users/edit",
          text: "Edit Profile",
          icon: faUserEdit,
          dropdown: null,
        },
      ],
    };
  }
  handleConnectSocket() {
    let role = this.props.user.role === 1 ? "YES" : "NO";
    let socket = io(GetConstant("API_URL"), {
      query: "loggeduser=" + this.props.user._id + "&ispsikolog=" + role,
    });
    socket.on("connect", () => {
      this.props.ChangeGlobalRedux({ type: "CHANGE_SOCKET", value: socket });
    });
    socket.on(this.props.user._id + "-friend-online", (onlineUsers) => {
      this.props.ChangeGlobalRedux({
        type: "CHANGE_ONLINE_FRIEND",
        value: onlineUsers,
      });
    });
    socket.on(this.props.user._id + "-update-friend-online", (users) => {
      let online_users = this.props.online_friend;
      online_users.push(users.id);
      let _set = new Set(online_users);
      this.props.ChangeGlobalRedux({
        type: "CHANGE_ONLINE_FRIEND",
        value: [..._set],
      });
    });
    socket.on(this.props.user._id + "-update-friend-offline", (users) => {
      let online_users = this.props.online_friend;
      let _set = new Set(online_users);
      _set.delete(users.id);
      this.props.ChangeGlobalRedux({
        type: "CHANGE_ONLINE_FRIEND",
        value: [..._set],
      });
    });
  }
  componentDidMount() {
    if (this.props.socket === null && this.props.isLogin) {
      this.handleConnectSocket();
    }
  }
  componentDidUpdate() {
    if (
      this.props.socket === null &&
      this.props.isLogin &&
      this.props.user !== null
    ) {
      this.handleConnectSocket();
    }
  }
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register/:role" component={Register} />
          <PrivateRoute path="/message" component={Message} />
          <Fragment>
            <div className="wrap-box-content">
              {this.props.user !== null && (
                <NavbarSide
                  navbars={
                    this.props.user.role === 1
                      ? this.state.navbarPsikolog
                      : this.props.user.role === 0
                      ? ""
                      : this.state.navbarStudent
                  }
                />
              )}
              <div className="wrap-content">
                <NavbarTop />
                <Switch>
                  <PrivateRoute exact path="/" component={Home} />
                  <PrivateRoute path="/consultation" component={Consultation} />
                </Switch>
              </div>
            </div>
          </Fragment>
        </Switch>
      </Router>
    );
  }
}
const reduxState = (state) => ({
  isLogin: state.isLogin,
  socket: state.socket,
  user: state.user,
  online_friend: state.online_friend,
});
const reduxDispatch = (dispatch) => ({
  ChangeGlobalRedux: (data) => dispatch(ChangeGlobalRedux(data)),
});

export default connect(reduxState, reduxDispatch)(App);

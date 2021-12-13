import "./index.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import DummyDocter from "../../../assets/images/dummy/dummy_psiklolog.png";
import ChatBox from "../../../components/organisms/ChatBox";
import {
  actionGetAllFriend,
  actionGetAllMessage,
  actionSendMessage,
  ChangeGlobalRedux,
} from "../../../configs/redux/action";
import moment from "moment";
import { GetConstant } from "../../../configs/constants";
library.add(faPaperPlane, faArrowLeft);
class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUser: null,
      friends: [],
      currentMessage: [],
      limit: 50,
      skip: 0,
      fieldMessage: "",
      isLoading: false,
      isLoadingMessage: false,
      pressEnter: false,
      count: 0,
      scroll: true,
    };
    this.messagesEndRef = React.createRef();
  }
  componentDidMount() {
    this.scrollToBottom();
    if (!this.props.loadedFriend) {
      let data = {};
      if (this.isPsikolog()) {
        data = {
          psikolog: this.props.user._id,
          limit: 20,
          skip: 0,
        };
      } else {
        data = {
          student: this.props.user._id,
          limit: 20,
          skip: 0,
        };
      }
      this.props
        .getAllFriend(data)
        .then((res) => {
          console.log( this.props.friends)
          this.setState((state) => ({
            ...state,
            friends: this.props.friends.sort((a, b) => {
              return b.updatedAt - a.updatedAt;
            }),
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.setState((state) => ({
        ...state,
        friends: this.props.friends.sort((a, b) => {
          return b.updatedAt - a.updatedAt;
        }),
      }));
    }
  }
  makeReceiver = (data, offset) => {
    data.forEach((datum, index) => {
      if (this.isPsikolog()) {
        let temp = this.props.activedResponden;
        let recName =
          this.props.user._id + "-receive_message-" + datum.student._id;
        if (!temp.includes(recName)) {
          temp.push(recName);
          this.props.changeGlobalDispatch({
            type: "CHANGE_ACTIVE_RESPONDEN",
            value: temp,
          });
          this.props.socket.on(recName, (msg) => {
            this.setState((state) => ({
              ...state,
              scroll: true,
            }));
            this.props.changeGlobalDispatch({
              type: "CHANGE_MESSAGE_RECIEVE",
              value: msg,
              key: datum.psikolog._id + "-" + datum.student._id,
              index: offset + index,
            });
            if (this.state.activeUser !== null) {
              if (this.state.activeUser.id === datum.student._id) {
                this.setState((state) => ({
                  ...state,
                  currentMessage:
                    this.props.messages[
                      datum.psikolog._id + "-" + datum.student._id
                    ],
                }));
              } else {
                this.setState((state) => ({
                  ...state,
                  friends: this.props.friends.sort((a, b) => {
                    return b.updatedAt - a.updatedAt;
                  }),
                }));
              }
            } else {
              this.setState((state) => ({
                ...state,
                friends: this.props.friends.sort((a, b) => {
                  return b.updatedAt - a.updatedAt;
                }),
              }));
            }
          });
        }
      } else {
        let temp = this.props.activedResponden;
        let recName =
          this.props.user._id + "-receive_message-" + datum.psikolog._id;
        if (!temp.includes(recName)) {
          temp.push(recName);
          this.props.changeGlobalDispatch({
            type: "CHANGE_ACTIVE_RESPONDEN",
            value: temp,
          });
          this.props.socket.on(recName, (msg) => {
            this.setState((state) => ({
              ...state,
              scroll: true,
            }));
            this.props.changeGlobalDispatch({
              type: "CHANGE_MESSAGE_RECIEVE",
              value: msg,
              key: datum.psikolog._id + "-" + datum.student._id,
              index: offset + index,
            });
            if (this.state.activeUser !== null) {
              if (this.state.activeUser.id === datum.psikolog._id) {
                this.setState((state) => ({
                  ...state,
                  currentMessage:
                    this.props.messages[
                      datum.psikolog._id + "-" + datum.student._id
                    ],
                }));
              } else {
                this.setState((state) => ({
                  ...state,
                  friends: this.props.friends.sort((a, b) => {
                    return b.updatedAt - a.updatedAt;
                  }),
                }));
              }
            } else {
              this.setState((state) => ({
                ...state,
                friends: this.props.friends.sort((a, b) => {
                  return b.updatedAt - a.updatedAt;
                }),
              }));
            }
          });
        }
      }
    });
  };
  componentDidUpdate() {
    if (
      this.props.socket !== null &&
      this.state.count === 0 &&
      this.props.activedResponden.length === 0 &&
      this.props.friends.length >= 0
    ) {
      this.setState((state) => ({
        ...state,
        count: 1,
      }));
      this.makeReceiver(this.props.friends, 0);
    }
    if (this.state.scroll) {
      this.scrollToBottom();
    }
  }
  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  handleOnclickBack = (event) => {
    const { history } = this.props;
    history.goBack();
  };
  isPsikolog = () => {
    if (this.props.user.role === 1) {
      return true;
    }
    return false;
  };
  isActive = (id) => {
    return this.props.online_friend.includes(id);
  };
  handleCheckIsActive = (student, psikolog) => {
    if (this.state.activeUser !== null) {
      if (this.props.user.role === 1) {
        if (this.state.activeUser.id === psikolog) {
          return true;
        }
      } else if (this.props.user.role === 2) {
        if (this.state.activeUser.id === student) {
          return false;
        }
      }
    }
    return false;
  };

  handleOnclickUser = (event) => {
    let target = event.currentTarget;
    let index = Number(target.getAttribute("data-index"));
    let active = {};
    let key = "";
    this.setState((state) => ({
      ...state,
      scroll: true,
    }));
    let request = {};
    if (this.isPsikolog()) {
      let friend = this.props.friends[index];
      active = {
        id: friend.student._id,
        profile: friend.student.profile,
        fullName: friend.student.students.fullName,
        isPsikolog: false,
      };
      request = {
        student: friend.student._id,
        psikolog: this.props.user._id,
        limit: this.state.limit,
        skip: 0,
      };
      key = this.props.user._id + "-" + friend.student._id;
    } else {
      let friend = this.props.friends[index];
      active = {
        id: friend.psikolog._id,
        profile: friend.psikolog.profile,
        fullName: friend.psikolog.psikolog.fullName,
        isPsikolog: true,
      };
      request = {
        student: this.props.user._id,
        psikolog: friend.psikolog._id,
        limit: this.state.limit,
        skip: 0,
      };
      key = friend.psikolog._id + "-" + this.props.user._id;
    }
    if (this.state.activeUser !== active) {
      this.setState((state) => ({
        ...state,
        activeUser: active,
      }));
      if (!this.props.loadedMessage.includes(key)) {
        this.props
          .getMessage(request)
          .then((res) => {
            this.setState((state) => ({
              ...state,
              currentMessage: this.props.messages[key],
            }));
          })
          .catch((err) => {});
      } else {
        this.setState((state) => ({
          ...state,
          currentMessage: this.props.messages[key],
        }));
      }
    }
  };
  handleOnPressEnter = (event) => {
    let press = false;
    if (event.keyCode === 13) {
      if (!event.shiftKey) {
        press = true;
      }
    }
    this.setState((state) => ({
      ...state,
      pressEnter: press,
    }));
  };
  handleOnChange = (event) => {
    if (!this.state.pressEnter) {
      let value = event.currentTarget.value;
      this.setState((state) => ({
        ...state,
        fieldMessage: value,
      }));
    } else {
      this.sendMessage();
    }
  };
  sendMessage = () => {
    if (
      this.state.activeUser !== null &&
      this.state.fieldMessage.trim() !== ""
    ) {
      let data = {};
      if (this.isPsikolog()) {
        data = {
          psikolog: this.props.user._id,
          student: this.state.activeUser.id,
          message: this.state.fieldMessage,
          isPsikolog: true,
        };
      } else {
        data = {
          psikolog: this.state.activeUser.id,
          student: this.props.user._id,
          message: this.state.fieldMessage,
          isPsikolog: false,
        };
      }
      this.props.sendMessage(data).then((res) => {
        this.setState((state) => ({
          ...state,
          currentMessage:
            this.props.messages[data.psikolog + "-" + data.student],
          fieldMessage: "",
          friends: this.props.friends.sort((a, b) => {
            return b.updatedAt - a.updatedAt;
          }),
        }));
      });
    }
  };
  handleOnSendMessage = (event) => {
    this.sendMessage();
  };
  checkIfCurrentActive = (psikolog, student) => {
    let active = false;
    if (this.state.activeUser !== null) {
      if (this.isPsikolog()) {
        active = this.state.activeUser.id === student._id;
      } else {
        active = this.state.activeUser.id === psikolog._id;
      }
    }
    return active;
  };
  handleOnScroll = (event) => {
    if (event.currentTarget.scrollTop === 0) {
      let request = {};
      let key = "";
      this.setState((state) => ({
        ...state,
        scroll: false,
      }));
      if (this.isPsikolog()) {
        request = {
          student: this.state.activeUser.id,
          psikolog: this.props.user._id,
          limit: this.state.limit,
          skip: this.state.currentMessage.length,
        };
        key = this.props.user._id + "-" + this.state.activeUser.id;
      } else {
        request = {
          student: this.props.user._id,
          psikolog: this.state.activeUser.id,
          limit: this.state.limit,
          skip: this.state.currentMessage.length,
        };
        key = this.state.activeUser.id + "-" + this.props.user._id;
      }
      if (!this.props.dataComplete.includes(key)) {
        this.props
          .getMessage(request)
          .then((res) => {
            if (res > 0) {
              this.setState((state) => ({
                ...state,
                currentMessage: this.props.messages[key],
              }));
            }
          })
          .catch((err) => {});
      }
    }
  };
  render() {
    return (
      <div className="box-message">
        <div className="side-message shadow-sm">
          <div className="header-side-message">
            <button onClick={this.handleOnclickBack}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <span>Pesan</span>
          </div>
          <div className="message-users">
            {this.state.friends.length > 0 &&
              this.state.friends.map((item, index) => {
                return (
                  <div
                    data-index={index}
                    data-id={
                      this.isPsikolog() ? item.student._id : item.psikolog._id
                    }
                    onClick={this.handleOnclickUser}
                    key={index}
                    className={`card-message-users 
                      ${
                        this.handleCheckIsActive(
                          item.student._id,
                          item.psikolog._id
                        )
                          ? "active"
                          : ""
                      }
                     ${
                       this.checkIfCurrentActive(item.psikolog, item.student)
                         ? "selected"
                         : ""
                     }`}
                  >
                    <img
                      src={
                        this.isPsikolog()
                          ? GetConstant("API_URL_IMAGE") + item.student.profile
                          : GetConstant("API_URL_IMAGE") + item.psikolog.profile
                      }
                      alt=""
                      className="shadow-sm"
                    />
                    <div className="status">
                      <div
                        className={
                          this.isActive(
                            this.isPsikolog()
                              ? item.student._id
                              : item.psikolog._id
                          )
                            ? "active"
                            : "offline"
                        }
                      ></div>
                    </div>
                    <span>
                      {this.isPsikolog()
                        ? item.student.students.fullName
                        : item.psikolog.psikolog.fullName}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="message-content">
          <div className="header-message-content">
            <img
              src={
                this.state.activeUser !== null
                  ? GetConstant("API_URL_IMAGE") + this.state.activeUser.profile
                  : DummyDocter
              }
              alt=""
            />
            <div className="header-desc">
              <span>
                {this.state.activeUser !== null
                  ? this.state.activeUser.fullName
                  : "Silahkan pilih user"}
              </span>
              <div className="status">
                <div className="active"></div>
                <span>
                  {this.isActive(
                    this.state.activeUser !== null
                      ? this.state.activeUser.id
                      : ""
                  )
                    ? "Online"
                    : "Offline"}
                </span>
              </div>
            </div>
          </div>

          <div className="messages" onScroll={this.handleOnScroll}>
            {this.state.currentMessage.length > 0 &&
              this.state.currentMessage.map((item, index) => (
                <ChatBox
                  key={index}
                  message={{
                    isMe:
                      (this.isPsikolog() && item.isPsikolog) ||
                      (!this.isPsikolog() && !item.isPsikolog)
                        ? true
                        : false,
                    date: moment(item.date).format("lll"),
                    text: item.message,
                  }}
                />
              ))}
            <div ref={this.messagesEndRef} />
          </div>
          <div className="message-config">
            <textarea
              name="field_message"
              id="field_message"
              disabled={this.state.activeUser === null && !this.state.isLoading}
              onKeyDown={this.handleOnPressEnter}
              value={this.state.fieldMessage}
              onChange={this.handleOnChange}
            ></textarea>
            <button onClick={this.handleOnSendMessage}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const reduxState = (state) => ({
  friends: state.friends,
  user: state.user,
  online_friend: state.online_friend,
  messages: state.messages,
  socket: state.socket,
  activedResponden: state.activedResponden,
  loadedMessage: state.loadedMessage,
  loadedFriend: state.loadedFriend,
  dataComplete: state.dataComplete,
});
const reduxDispatch = (dispatch) => ({
  changeGlobalDispatch: (data) => dispatch(ChangeGlobalRedux(data)),
  getAllFriend: (data) => dispatch(actionGetAllFriend(data)),
  getMessage: (data) => dispatch(actionGetAllMessage(data)),
  sendMessage: (data) => dispatch(actionSendMessage(data)),
});

export default connect(reduxState, reduxDispatch)(Message);

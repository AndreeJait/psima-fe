import { GetConstant } from "../../constants";

const initialState = {
  // Put your variabel here
  isLogin: localStorage.getItem("user") ? true : false,
  isLoading: false,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  psikolog: [],
  friends: [],
  socket: null,
  online_friend: [],
  messages: {},
  activedResponden: [],
  loadedMessage: [],
  loadedFriend: false,
  dataComplete: [],
};
const listAction = [
  // Change Login
  {
    type: "CHANGE_LOGIN",
    name: "isLogin",
    action: null,
  },
  // Change Login
  {
    type: "CHANGE_DATA_COMPLETE",
    name: "dataComplete",
    action: (state, actions) => {
      state.dataComplete.push(actions.value);
      return {
        ...state,
      };
    },
  },
  // Change LOADED_FRIEND
  {
    type: "CHANGE_LOADED_FRIEND",
    name: "loadedFriend",
    action: null,
  },
  // Change LOADED MESSAGE
  {
    type: "CHANGE_LOADED_MESSAGE",
    name: "loadedMessage",
    action: (state, actions) => {
      let loadedMessage = state.loadedMessage;
      if (!loadedMessage.includes(actions.value)) {
        loadedMessage.push(actions.value);
      }
      state.loadedMessage = loadedMessage;
      return {
        ...state,
      };
    },
  },
  // Change ACTIVE RESPONDEN
  {
    type: "CHANGE_ACTIVE_RESPONDEN",
    name: "activedResponden",
    action: null,
  },
  // Change Message
  {
    type: "CHANGE_MESSAGE",
    name: "messages",
    action: (state, actions) => {
      let messages = state.messages;
      if (messages.hasOwnProperty(actions.key)) {
        messages[actions.key] = [
          ...actions.value.reverse(),
          ...messages[actions.key],
        ];
      } else {
        messages[actions.key] = actions.value.reverse();
      }
      return {
        ...state,
      };
    },
  },
  // Change DEFAULT
  {
    type: "CHANGE_DEFAULT",
    name: "default",
    action: (state, actions) => {
      return {
        ...GetConstant("STATE_DEFAULT"),
      };
    },
  },
  // Change Message
  {
    type: "CHANGE_MESSAGE_NEW",
    name: "messages",
    action: (state, actions) => {
      let messages = state.messages;
      if (messages.hasOwnProperty(actions.key)) {
        messages[actions.key] = [
          ...messages[actions.key],
          ...actions.value.reverse(),
        ];
      } else {
        messages[actions.key] = actions.value.reverse();
      }
      if (state.user.role === 1) {
        for (let i = 0; i < state.friends.length; i++) {
          if (state.friends[i].student._id === actions.student) {
            state.friends[i].updatedAt = new Date().getTime();
            break;
          }
        }
        state.socket.emit(
          actions.psikolog + "-message-" + actions.student,
          actions.value
        );
      } else {
        for (let i = 0; i < state.friends.length; i++) {
          if (state.friends[i].psikolog._id === actions.psikolog) {
            state.friends[i].updatedAt = new Date().getTime();
            break;
          }
        }
        state.socket.emit(
          actions.student + "-message-" + actions.psikolog,
          actions.value
        );
      }
      state.messages = messages;
      return {
        ...state,
      };
    },
  },
  // Change Message Recive
  {
    type: "CHANGE_MESSAGE_RECIEVE",
    name: "messages",
    action: (state, actions) => {
      let messages = state.messages;
      if (messages.hasOwnProperty(actions.key)) {
        messages[actions.key] = [
          ...messages[actions.key],
          ...actions.value.reverse(),
        ];
      } else {
        messages[actions.key] = actions.value.reverse();
      }
      state.messages = messages;
      let temp = actions.key.split("-");
      for (let i = 0; i < state.friends.length; i++) {
        if (
          state.friends[i].psikolog._id === temp[0] &&
          state.friends[i].student._id === temp[1]
        ) {
          state.friends[i].updatedAt = new Date().getTime();
          break;
        }
      }
      return {
        ...state,
      };
    },
  },
  // Change Psikolog
  {
    type: "CHANGE_PSIKOLOG",
    name: "psikolog",
    action: (state, actions) => {
      state.psikolog = [...state.psikolog, ...actions.value];
      return {
        ...state,
      };
    },
  },
  // Delete Psikolog
  {
    type: "DELETE_PSIKOLOG",
    name: "psikolog",
    action: (state, actions) => {
      let psikolog = state.psikolog;
      let remove = psikolog.splice(actions.value, 1)[0];
      state.psikolog = psikolog;
      let friend_data = {};
      if (state.user.role === 1) {
        friend_data = {
          _id: actions._id,
          student: {
            _id: remove._id,
            profile: remove.profile,
            students: {
              _id: remove.students._id,
              fullName: remove.students.fullName,
            },
          },
          psikolog: {
            _id: state.user._id,
            profile: state.user.profile,
            psikolog: {
              _id: state.user.psikolog._id,
              fullName: state.user.psikolog.fullName,
            },
          },
          message: [],
          updatedAt: new Date().getTime(),
        };
      } else {
        friend_data = {
          _id: actions._id,
          psikolog: {
            _id: remove._id,
            profile: remove.profile,
            psikolog: {
              _id: remove.psikolog._id,
              fullName: remove.psikolog.fullName,
            },
          },
          student: {
            _id: state.user._id,
            profile: state.user.profile,
            students: {
              _id: state.user.students._id,
              fullName: state.user.students.fullName,
            },
          },
          message: [],
          updatedAt: new Date().getTime(),
        };
      }
      state.friends.push(friend_data);
      return {
        ...state,
      };
    },
  },
  // Change Online Friend
  {
    type: "CHANGE_ONLINE_FRIEND",
    name: "online_friend",
    action: null,
  },
  // Change Friends
  {
    type: "CHANGE_FRIEND",
    name: "friends",
    action: null,
  },
  // Change User
  {
    type: "CHANGE_USER",
    name: "user",
    action: null,
  },
  // Change Socket
  {
    type: "CHANGE_SOCKET",
    name: "socket",
    action: null,
  },
  // Change Loading
  {
    type: "CHANGE_LOADING",
    name: "isLoading",
    action: (state, actions) => {
      state.isLoading = actions.value;
      return {
        ...state,
      };
    },
  },
];
const reducer = (state = initialState, actions) => {
  let found = listAction.find((list) => {
    return list.type === actions.type;
  });
  if (found !== null && found !== undefined) {
    if (found.action !== null) {
      return {
        ...found.action(state, actions),
      };
    }
    state[found.name] = actions.value;
    return {
      ...state,
    };
  }
  return state;
};

export default reducer;

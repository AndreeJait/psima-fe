const initialState = {
  // Put your variabel here
  isLogin: false,
  isLoading: false,
};
const listAction = [
  // Change Login
  {
    type: "CHANGE_LOGIN",
    name: "isLogin",
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
    console.log(state[found.name]);
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

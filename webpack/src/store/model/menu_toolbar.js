// Modelo MenuToolBar

const module = {
  state: {
    title: "SIEP"
  },
  mutations: {
    updateTitle(state,payload) {
      state.title = payload
    }
  }
};

export default module
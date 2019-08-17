const getters = {
  getCurrentProgramContent: state =>
    state.programs.get(state.currentProgramName),
}
export default getters

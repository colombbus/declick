export default {
  getProgramByName: state => name => {
    return state.programs.get(name)
  },
}

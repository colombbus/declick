import jsdomGlobal from 'jsdom-global'
import Datauri from 'datauri'

jsdomGlobal(undefined,{
  pretendToBeVisual: true,
  resources: 'usable',
  beforeParse(window) {
    window.focus = function() {};
  }
})

const datauri = new Datauri()

window.URL.createObjectURL = function (blob) {
  if(blob){
    return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content
  }
}

window.URL.revokeObjectURL = function (objectURL) {
  // Do nothing at the moment
}
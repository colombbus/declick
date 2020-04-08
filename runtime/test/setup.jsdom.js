import jsdomGlobal from 'jsdom-global'

jsdomGlobal(undefined,{
  pretendToBeVisual: true,
  resources: 'usable',
  beforeParse(window) {
    window.focus = function() {};
  },
})
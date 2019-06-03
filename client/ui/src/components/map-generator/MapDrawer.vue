<template lang="pug">
  .map-generator
    header.generator-header
      router-link(to="create")
        img.site-logo(src='../../assets/mini-logo.png' alt='declick log')
      .editor-selector(@click.self="isDrawer = !isDrawer")
        i.fa.fa-paint-brush(@click.self="isDrawer = !isDrawer")
        toggle-button.view-select(:sync="true" v-model='isDrawer')
        i.fa.fa-keyboard(@click.self="isDrawer = !isDrawer")
      span.separator
      .drawer-options(v-show="currentView === 'drawer'")
        label(for='map-height' :title="$t('mapgen.height-desc')") {{$t('mapgen.height')}}
        input.generator-height(type='number' name='map-height' :title="$t('mapgen.height-desc')" :placeholder="$t('mapgen.height')" v-model='rows' max='150' min='1')
        i.button-icon.fas.fa-exchange-alt(:title="$t('mapgen.swap-desc')" @click='swapDimensions')
        label(for='map-width' :title="$t('mapgen.width-desc')") {{$t('mapgen.width')}}
        input.generator-width(type='number' name='map-width' :title="$t('mapgen.width-desc')" :placeholder="$t('mapgen.width')" v-model='columns' max='150' min='1')
        i.button-icon.fas.fa-trash-alt.warn(:title="$t('mapgen.trash-desc')" @click='showReset=true')
        span.separator
        i.button-icon.fas.fa-eraser.warn(:title="$t('mapgen.eraser-desc')" @click='showRemoveAll = true')
        i.button-icon.far.fa-square(:title="$t('mapgen.draw-border')" @click='drawBorders')
        // maze-generator-buttonz
        i.button-icon.fas.fa-fingerprint(type='button' value='generate maze' :title="$t('mapgen.maze-generator-desc')" @click='generateMaze(columns, rows)')
        i.button-icon.fas.fa-calculator(:class="isPathToggled ? 'toggled' : ''" type='button' value='generate maze' :title="$t('mapgen.maze-pathfind-desc')" @click='toggleFindPath')
        span.icon-chooser(v-show="currentView === 'drawer'")
          i.fas.fa-chevron-left(:title="$t('mapgen.previous-tile')" @click='increaseBuildingMaterial')
          i(:class="'icon-screen to-build-' + toBuild" :title="$t('mapgen.tile')")
          i.fas.fa-chevron-right(:title="$t('mapgen.next-tile')" @click='decreaseBuildingMaterial')
      .code-options(v-show="currentView === 'code'")
        input.settings.builder-name(type='text' :placeholder="$t('mapgen.builder-name-desc')" :title="$t('mapgen.builder-name-desc')" @input='updateTextEditor' v-model='builder')
        input.settings.builder-action(type='text' :placeholder="$t('mapgen.builder-action-desc')" :title="$t('mapgen.builder-action-desc')" @input='updateTextEditor' v-model='builderAction')
        i.button-icon.fas.fa-eraser(:title="$t('mapgen.erase-code-desc')" @click="clearTextEditor")
        i.button-icon.fas.fa-clipboard(:title="$t('mapgen.clipboard-desc')" @click='copyToClipboard')
        //- c'est un peut bizar d'avoir un btn pour cca c'etait pas mieux en automatique ??????? ?
        i.button-icon.fas.fa-file-export(:title="$t('mapgen.export-code')" @click='importCodeFromTextarea') 
        i.button-icon.fab.fa-readme(:title="$t('mapgen.info')" @click='help = !help')
      span.cells-count(:title="$t('mapgen.cells-desc')") {{$t('mapgen.cells')}} {{rows*columns}}
      span.button-icon.fab.fa-readme(:title="$t('mapgen.info')" @click='help = !help' v-show="currentView === 'drawer'")
    .map-drawer(v-show="currentView === 'drawer'")
      table#grid(draggable='false')
        tbody
          tr.row(draggable='false' v-for='(row, x) in tiles.length' :key='x')
            td.item.column(draggable='false' @mousedown='mouseManager' @mouseover='cellHightlighter' v-for='(box, y) in tiles[x].length' :key='y' :data-x='x' :data-y='y')
      .dark-layer(v-show='help === true' @click.self='help=false')
        .help-drawer
          i.fas.fa-times-circle(@click='help=false')
          h2 {{ $t('mapgen.help-drawer')}}

    .generator-code(v-show="currentView === 'code'")
      .editor(ref='editor')
      .dark-layer(v-show='help === true' @click.self='help=false')
        .help-drawer
          h3 {{ $t('mapgen.help-editor')}}
          i.fas.fa-times-circle(@click='help=false')
    .dark-layer(v-show='showRemoveAll || showReset' @click='showRemoveAll= false; showReset=false')
      .remove-all(v-show='showRemoveAll')
        | {{$t('mapgen.alert.remove-all')}}
        div
          i.button-icon.far.fa-check-circle(:title="$t('mapgen.alert.accept')" @click='clearMap')
          i.far.fa-times-circle.warn(:title="$t('mapgen.alert.refuse')" @click='showRemoveAll = false')
      .remove-all(v-show='showReset')
        | {{$t('mapgen.alert.reset')}}
        div
          i.far.fa-check-circle(:title="$t('mapgen.alert.accept')" @click='clearAll')
          i.far.fa-times-circle.warn(:title="$t('mapgen.alert.refuse')" @click='showReset = false')
</template>

<script>
import * as Matrix from '../../assets/js/matrix.js'
import * as Maze from '../../assets/js/maze.js'

import Vue from 'vue'
import EasyStar from 'easystarjs'
import * as ace from 'brace'
import { ToggleButton } from 'vue-js-toggle-button'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'brace/mode/javascript'
import 'brace/theme/twilight'

Vue.component('toggle-button', ToggleButton)

export default {
  name: 'mapGenerator',
  data  () {
    return {
      showReset: false,
      showRemoveAll: false,
      builderAction: 'poserLigne',
      builder: 'max',
      currentView: 'drawer',
      toBuild: 1,
      rows: 1,
      columns: 1,
      help: false,
      isMouseDown: false,
      needReverse: false,
      tiles: [],
      mapCode: '',
      editSession: null,
      editor: null,
      selection: null,
      undoManager: null,
      isPathToggled: false
    }
  },
  created  () {
    this.$nextTick(this.createEditor)
  },
  mounted () {
    window.addEventListener('mouseup', () => {
      this.isMouseDown = false
    })
    this.init()
  },
  destroyed () {
    this.editor.destroy()
    this.editor.container.remove()
  },
  computed: {
    isDrawer: {
      get: function () {
        return this.currentView === 'drawer'
      },
      set: function (isDrawerDisplayed) {
        this.help = false
        this.currentView = isDrawerDisplayed ? 'drawer' : 'code'
        if (!isDrawerDisplayed) {
          this.updateTextEditor()
        }
        return this.currentView === 'drawer'
      }
    }
  },
  methods: {
    clearTextEditor () {
      this.mapCode = ''
      this.editSession.setValue(this.mapCode)
    },
    /* create markdown editor */
    createEditor () {
      this.editor = ace.edit(this.$refs.editor)
      this.editSession = this.editor.getSession()
      this.selection = this.editSession.getSelection()
      this.undoManager = this.editSession.getUndoManager()
      // editor options
      this.editor.setTheme(`ace/theme/twilight`)
      this.editor.$blockScrolling = Infinity
      this.editor.setShowPrintMargin(false)
      this.editor.setShowFoldWidgets(false)
      this.editor.setBehavioursEnabled(false)
      // editor session options
      this.editSession.setMode('ace/mode/javascript')
      this.editSession.setUseWrapMode(true)
      this.editSession.setOption('useWorker', false)
      // insert content
      this.editSession.setValue(this.mapCode)
      this.editor.focus()
    } /* listen editor event */,
    editorEvent () {
      // listen editor 'change' event and render markdown
      // this.editSession.on(
      //   'change'
      //   // debounce(() => {
      //   // const content = this.editSession.getValue()
      //   // }, 300)
      // )
    },
    updateCode () {
      const tiles = this.mapCode.match(/([0-9,]*)\)$/gm)
      let rows = tiles.length
      let columns = 0
      for (const anArray in tiles) {
        tiles[anArray] = tiles[anArray].replace(')', '').split(',')
        columns = tiles[anArray].length
      }
      this.setLocalStorage({ rows, columns, tiles })

      this.tiles = tiles
      this.init()
    },
    setLocalStorage (target) {
      if (target === null) {
        window.localStorage.setItem(
          'declick-maze',
          JSON.stringify({
            rows: this.rows,
            columns: this.columns,
            tiles: this.tiles
          })
        )
      } else {
        window.localStorage.setItem('declick-maze', JSON.stringify(target))
      }
    },
    filterTilesArray (toDeletes, anArray) {
      anArray.map(row => {
        row.map((col, index) => {
          if (toDeletes.indexOf(parseInt(col)) > -1) {
            row[index] = 0
          }
        })
      })
    },
    clearPath () {
      this.filterTilesArray([5], this.tiles)
      this.$nextTick(this.updateTiles)
    },
    findTile (anArray, tile) {
      let pos
      anArray.map((row, rowIndex) => {
        const col = row.indexOf(tile)
        if (col > -1) {
          pos = { x: col, y: rowIndex }
        }
      })
      if (typeof pos === 'undefined') {
        pos = -1
      }
      return pos
    },
    toggleFindPath () {
      this.isPathToggled = !this.isPathToggled
      if (this.isPathToggled) {
        this.findPath()
      } else {
        this.clearPath()
      }
    },
    findPath () {
      this.filterTilesArray([5], this.tiles)
      const easystar = new EasyStar.js()
      const start = this.findTile(this.tiles, 3)
      const end = this.findTile(this.tiles, 4)
      const startX = start.x
      const startY = start.y
      const endX = end.x
      const endY = end.y

      easystar.setGrid(this.tiles)
      easystar.setAcceptableTiles([0, 3, 4])

      easystar.findPath(startX, startY, endX, endY, path => {
        if (path !== null) {
          path.map(pos => {
            const lastTile = this.tiles[pos.y][pos.x]
            let skip = false
            // do not erase doors & entrance with path tile
            if (lastTile === 3) {
              skip = true
            }
            if (lastTile === 4) {
              skip = true
            }
            if (!skip) {
              this.tiles[pos.y][pos.x] = 5
            }
          })
          this.updateTiles()
        }
      })
      easystar.calculate()
    },
    swapDimensions () {
      this.tiles = Matrix.transpose(this.tiles)
      this.columns = this.tiles[0].length
      this.rows = this.tiles.length

      this.$nextTick(this.updateTiles)
    },
    importCodeFromTextarea () {
      const selection = this.editor.getSelection()

      selection.selectAll()
      const range = selection.getRange()
      const text = this.editSession.getTextRange(range)

      const fuzzyContent = text.trim()
      const content = fuzzyContent
        .replace(/[\n]+/g, '\n')
        .trim()
        .replace(/.*\(/g, '')
        .replace(/\)/g, '')
      const lines = content
        .split('\n')
        .map(line => line.split(',').map(number => parseInt(number)))
      this.tiles = lines
      this.rows = lines.length
      this.columns = lines[0].length
      this.$nextTick(this.updateTiles)
      this.currentView = 'drawer'

      if (this.isPathToggled) {
        this.findPath()
      }
    },
    increaseBuildingMaterial () {
      return this.toBuild < 5 ? this.toBuild++ : (this.toBuild = 0)
    },
    decreaseBuildingMaterial () {
      return this.toBuild > 0 ? this.toBuild-- : (this.toBuild = 5)
    },
    copyToClipboard () {
      const selection = this.editor.getSelection()
      // save selection position
      const { row, column } = selection.getSelectionAnchor()

      let text
      let needClearSelection = false
      if (selection.isEmpty()) {
        selection.selectAll()
        needClearSelection = true
      }
      const range = selection.getRange()
      text = this.editSession.getTextRange(range)

      const textarea = document.createElement('textarea')
      textarea.innerHTML = text.trim()
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)

      if (needClearSelection) {
        selection.clearSelection()
        this.editor.moveCursorTo(row, column)
      }
      this.editor.focus()
    },
    updateTextEditor () {

      const tiles = this.tiles
      const code = tiles.map(item => {
        if (item.length > 0) {
          return `${this.builder}.${this.builderAction}(${item.join(',')})`
        }
      })
      this.mapCode = code.join('\n')
      this.editSession.setValue(this.mapCode)

      // move cursor to end file & focus
      const selection = this.editor.getSelection()
      selection.selectAll()
      const { end } = this.selection.getRange()
      const { row, column } = end
      this.editor.moveCursorTo(row, column)
      selection.clearSelection()
    },
    generateMaze (columns, rows) {
      const height = parseInt(rows)
      const width = parseInt(columns)
      const rowExitStep = width % 2 ? 1 : 2 // move door if odd/even dimension
      const columnExitStep = height % 2 ? 2 : 3 // move door if odd/even dimension

      // Initialize
      const empty2DArray = Array(height)
        .fill(1)
        .map(() => Array(width).fill(1))
      this.tiles = Maze.generateMaze(empty2DArray)
      this.tiles[0][1] = 3
      this.tiles[this.tiles.length - columnExitStep][this.tiles[0].length - rowExitStep] = 4
      this.$nextTick(this.updateTiles)

      if(this.isPathToggled){
        this.findPath()
      }
    },
    updateTiles () {
      const cells = [...document.querySelectorAll('table#grid td')]
      cells.map(cell => {
        // remove if cell add .to-build-N
        cell.className = cell.className
          .split(' ')
          .filter(aClass => {
            return !aClass.startsWith('to-build-') ? aClass : null
          })
          .join(' ')

        // add real appropriate .to-build-M
        const x = parseInt(cell.dataset['x'])
        const y = parseInt(cell.dataset['y'])
        cell.classList.add('to-build-' + this.tiles[x][y])
      })
    },
    clearMap () {
      this.tiles = Matrix.fillArray2D(this.tiles)
      this.updateTiles()
      this.showRemoveAll = false
    },
    clearAll () {
      this.setLocalStorage({
        rows: 5,
        columns: 7,
        tiles: Matrix.createArray2D(5, 7)
      })
      this.init()
      this.clearMap()
      this.showReset = false
    },
    drawBorders () {
      for (let col = 0; col < this.columns; col++) {
        this.tiles[0][col] = 1
        this.tiles[this.rows - 1][col] = 1
      }
      for (let row = 0; row < this.rows; row++) {
        this.tiles[row][0] = 1
        this.tiles[row][this.columns - 1] = 1
      }
      this.updateTiles()
    },
    mouseManager (e) {
      const event = e
      event.preventDefault()
      this.isMouseDown = true
      const x = event.target.dataset['x']
      const y = event.target.dataset['y']
      const domCell = event.target

      let oldMaterialFound = null
      let last = null
      // remove a class to-build-X
      domCell.className
        .split(' ')
        .filter(aClass => {
          oldMaterialFound = aClass.match(/^to-build-(\d+)/)
          if (Array.isArray(oldMaterialFound)) {
            last = parseInt(oldMaterialFound[1])
            domCell.classList.remove(`to-build-${last}`)
          }
        })
        .join(' ')

      if (this.toBuild === last) {
        domCell.classList.remove(`to-build-${this.toBuild}`)
        this.tiles[x][y] = 0
      } else {
        if (this.toBuild > 0) {
          domCell.classList.add(`to-build-${this.toBuild}`)
        }
        this.tiles[x][y] = this.toBuild
      }
      this.setLocalStorage(null)
    },
    cellHightlighter (e) {
      const event = e
      event.preventDefault()
      const x = event.target.dataset['x']
      const y = event.target.dataset['y']
      const domCell = event.target
      if (this.isMouseDown) {
        let oldMaterialFound = null
        let last = null
        // remove a class to-build-X
        domCell.className
          .split(' ')
          .filter(aClass => {
            oldMaterialFound = aClass.match(/^to-build-(\d+)/)
            if (Array.isArray(oldMaterialFound)) {
              last = parseInt(oldMaterialFound[1])
            }
          })
          .join(' ')

        domCell.classList.remove(`to-build-${last}`)

        if (this.toBuild === 0) {
          domCell.classList.remove(`to-build-${this.toBuild}`)
          this.tiles[x][y] = 0
        } else {
          if (this.toBuild > 0) {
            domCell.classList.add(`to-build-${this.toBuild}`)
          }
          this.tiles[x][y] = this.toBuild
        }
      }
      this.setLocalStorage(null)
    },
    init () {
      let backup = JSON.parse(window.localStorage.getItem('declick-maze'))

      this.toBuild = 1
      if (backup === null) {
        this.rows = 5
        this.columns = 7
        this.tiles = Matrix.createArray2D(5, 7)
      } else {
        this.rows = parseInt(backup.rows)
        this.columns = parseInt(backup.columns)
        this.tiles = backup.tiles
        // JSON.parse cast number value to string
        this.tiles.map(row => {
          row.map((col, index) => (row[index] = parseInt(col)))
        })
        this.$nextTick(this.updateTiles)
      }
    }
  },
  watch: {
    rows () {
      this.tiles = Matrix.resize(this.tiles, this.columns, this.rows, 0)
      return this.tiles.length
    },
    columns () {
      this.tiles = Matrix.resize(this.tiles, this.columns, this.rows, 0)
      return this.tiles[0].length
    },
    mapCode () {
      return this.updateCode()
    }
  }
}
</script>
<style>
:root {
  --main-dark-color: #480a2a;
  --main-spacing: 0.3vw;
  --main-hover-color: #d0d717;
}
</style>

<style scoped>

.editor-selector {
  height: 5vw;
}
.editor-selector > *,
.editor-selector {
  display: flex;
  align-items: center;
}
.view-select {
  transform: rotate(180deg);
  margin-left: 1vw;
}
.fa.fa-paint-brush,
.fa.fa-keyboard {
  margin-left: 1vw;
}
.fa.fa-keyboard {
  margin-right: 0.5vw;
}
.vue-js-switch .v-switch-core {
  width: 2.7vw !important;
  height: 1.2vw !important;
  border-radius: 50vw !important;
  background-color: #480a2a;
}
.vue-js-switch .v-switch-button {
  transform: translate3d(0.1vw, 0.2vw, 0) !important;
}
.vue-js-switch.toggled .v-switch-button {
  transform: translate3d(1.7vw, 0.2vw, 0) !important;
}
.editor-selector:hover
  label.view-select.vue-js-switch.toggled
  div.v-switch-core
  div.v-switch-button {
  background: var(--main-hover-color);
}
.editor {
  font-size: 20px;
}
label.view-select.vue-js-switch.toggled div.v-switch-core div.v-switch-button {
  width: 0.8vw !important;
  height: 0.8vw !important;
}

.generator-header {
  display: flex;
  align-items: center;
  /* position: fixed; */
  top: 0;
  left: 0;
  right: 0;
  height: 5vw;
  background-color: #ddd6dd;
  color: var(--main-dark-color);
  font-size: 1vw;
  z-index: 2;
  position: relative;
}
.map-drawer {
  /* padding-top: 7vw; */
  width: 99vw;
  height: 90vh;
  overflow: auto;
}

.fa-chevron-right:hover,
.fa-chevron-left:hover,
.button-icon:hover:not(.button-disabled) {
  color: #d0d717;
}
.icon-chooser,
.button-icon {
  background-color: #480a2a;
  color: white;
}
.button-icon.fa-calculator.toggled {
  background-color: white;
  color: #480a2a;
}
.button-icon {
  padding: 0.5vw;
  border-radius: 4vw;
  margin-left: var(--main-spacing);
  display: inline-block;
  width: 2vw;
  text-align: center;
}
.cells-count {
  position: absolute;
  right: 2vw;
}
.cells-count,
.builder-action,
.builder-name {
  margin-left: var(--main-spacing);
}
.builder-action {
  width: 15vw;
}
.builder-name,
.generator-width,
.generator-height {
  width: 5vw;
}
.settings,
.builder-action,
.builder-name,
.generator-width,
.generator-height {
  display: inline-block;
  font-size: 2vw;
  padding: 0;
}
.generator-width,
.generator-height {
  margin-left: var(--main-spacing);
}
.generator-header input[type='radio'] {
  display: inline-block;
  margin: 0;
  width: 1vw;
  font-size: 14px;
  margin-left: var(--main-spacing);
}
.generator-header label {
  padding-left: var(--main-spacing);
}
/* .builder-name {
} */
.icon-chooser {
  padding: 0.5vw;
  border-radius: 4vw;
  margin-left: var(--main-spacing);
  display: inline-flex;
}
/* .fa-chevron-left {
} */
.icon-screen {
  display: inline-block;
  content: '';
  width: 2vw;
  height: 2vw;
  vertical-align: middle;
  margin-left: var(--main-spacing);
}
.fa-chevron-right:hover,
.fa-chevron-left:hover {
  border-radius: var(--main-spacing);
}
.fa-chevron-right {
  margin-left: var(--main-spacing);
}
.dark-layer {
  background: #0e0208e8;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 3;
}
.dark-layer .fa-times-circle:hover::before {
  color: var(--main-hover-color);
}
.dark-layer .fa-times-circle {
  font-size: 3vw;
  position: absolute;
  top: -1.5vw;
}
.remove-all,
.help-drawer,
.help-code {
  background: #480a2a;
  padding: 2vw;
  border-radius: 2vw;
  color: white;
  position: fixed;
  top: 6vw;
  bottom: 5vw;
  right: 5vw;
  left: 5vw;
}

.to-build-0 {
  background-color: white;
}
.to-build-1 {
  background: url(../../assets/wall.png) #fff no-repeat round;
}
.to-build-2 {
  background: url(../../assets/brick.png) #fff no-repeat round;
}
.to-build-3 {
  background: url(../../assets/entrance.png) #fff no-repeat round;
}
.to-build-4 {
  background: url(../../assets/exit.png) #fff no-repeat round;
}
.to-build-5 {
  background: url(../../assets/path.png) #fff no-repeat round;
}
.item {
  width: 40px;
  height: 40px;
}

tr {
  white-space: nowrap;
}

td {
  border: 0.05vw solid black;
  padding: 0;
  display: inline-block;
  width: 40px;
  height: 40px;
}
table#grid {
  border-collapse: collapse;
  margin: auto;
}
.generator-code {
  display: block;
  position: relative;
  overflow: auto;
  /* padding-top: 7vw; */
  z-index: 1;
}

.code-content {
  display: block;
  width: 100%;
  height: 80vh;
  padding: 10px;
  font-size: 18px;
}
.separator {
  content: '';
  border-right: 0.1vw solid #480a2a;
  height: 80%;
  margin-left: var(--main-spacing);
}
.maze-generator-button {
  height: 2vw;
  width: 2vw;
  background: url(../../assets/maze.svg) round;
  background-repeat: no-repeat;
  background-size: 63%;
  background-position: 7px 7px;
}
.site-logo {
  height: 4vw;
  margin-left: 0.5vw;
  vertical-align: top;
}
#drawer {
  margin-left: 0.5vw;
}
/* alert box */
/* .box-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  background-color: rgba(22, 21, 22, 0.8);
}
.box-overlay .remove-all {
  background: #ddd6dd;
  padding: 5px 10px;
}
.remove-all div {
  margin: 15px 0;
  display: flex;
  justify-content: space-evenly;
}
.remove-all div i {
  cursor: pointer;
  font-size: 25px;
}
.far.fa-check-circle:hover {
  color: green;
}
.fa-trash-alt.button-icon:hover,
.fa-eraser.button-icon:hover,
i.far.warn:hover {
  color: #7d2a23;
} */
</style>


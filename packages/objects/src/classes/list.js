import i18n from 'es2015-i18n-tag'
import BaseClass from '../base-class'
import 'reflect-metadata'

@Reflect.metadata('translated', i18n`List`)
class List extends BaseClass {
  constructor() {
    super()
    this._list = []
    this._index = 0
  }

  /**
   * Add an object in List.
   */
  @Reflect.metadata('translated', i18n`add`)
  @Reflect.metadata('help', i18n`add_help`)
  add(value) {
    this._list.push(value)
  }

  /**
   * Remove an object in List.
   */
  @Reflect.metadata('translated', i18n`remove`)
  @Reflect.metadata('help', i18n`remove_help`)
  remove(object) {
    this._list = this._list.filter(a => object !== a)
  }
  /**
   * Set index to 0.
   */
  @Reflect.metadata('translated', i18n`returnStart`)
  @Reflect.metadata('help', i18n`returnStart_help`)
  returnStart() {
    this._index = 0
  }

  /**
   * Returns the index object in List, and remove it from the list.
   */
  @Reflect.metadata('translated', i18n`getNextObject`)
  @Reflect.metadata('help', i18n`getNextObject_help`)
  getNextObject() {
    let tmp = this._list.splice(this._index, 1)
    if (this._index === this._list.length) {
      this._index -= 0
    }
    return tmp
  }

  /**
   * Returns true if List has objects, else false.
   */
  @Reflect.metadata('translated', i18n`hasObjects`)
  @Reflect.metadata('help', i18n`hasObjects_help`)
  hasObjects() {
    return this._list.length !== 0
  }

  /**
   * Returns the "index" object in List, and remove it from the list.
   */
  @Reflect.metadata('translated', i18n`getObject`)
  @Reflect.metadata('help', i18n`getObject_help`)
  getObject(index) {
    if (!isNaN(index)) {
      this._index = index - 1
      return this.getNextObject()
    }
  }

  /**
   * Changes "index" object to "object".
   */
  @Reflect.metadata('translated', i18n`modify`)
  @Reflect.metadata('help', i18n`modify_help`)
  modify(index, object) {
    if (!isNaN(index)) {
      this._index = index - 1
      this._list[this._index] = object
    }
  }

  /**
   * Checks if List has "object".
   */
  @Reflect.metadata('translated', i18n`has`)
  @Reflect.metadata('help', i18n`has_help`)
  has(object) {
    if (this._list.indexOf(object) >= 0) {
      return true
    } else {
      return false
    }
  }

  /**
   * Checks if List and "list" have at least one object in common.
   */
  @Reflect.metadata('translated', i18n`hasIn`)
  @Reflect.metadata('help', i18n`hasIn_help`)
  hasIn(object) {
    let list = object._list
    for (let i = 0; i < list.length; i++) {
      if (this.has(list[i])) {
        return true
      }
    }
    return false
  }

  /**
   * Returns the number of objects in List.
   */
  @Reflect.metadata('translated', i18n`getSize`)
  @Reflect.metadata('help', i18n`getSize_help`)
  getSize() {
    return this._list.length
  }

  /**
   * Void List.
   */
  @Reflect.metadata('translated', i18n`void`)
  @Reflect.metadata('help', i18n`void_help`)
  void() {
    this._list.splice(0, this._list.length)
    this._index = 0
  }
}

export default List

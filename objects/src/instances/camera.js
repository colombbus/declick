import i18n from 'es2015-i18n-tag'
import BaseInstance from '../base-instance'
import 'reflect-metadata'
import { checkArguments } from '../utils'

@Reflect.metadata('translated', i18n`camera`)
class CameraClass extends BaseInstance {
  constructor() {
    super()
    this._camera = null
    this.addListener('runtimeInitialized', () => {
      this._graphics = this._runtime.getGraphics()
      this._camera = this._graphics.getScene().cameras.main
    })
  }

  @Reflect.metadata('translated', i18n`follow`)
  @Reflect.metadata('help', i18n`follow_help`)
  @checkArguments(['object'])
  follow(object) {
    this._camera.startFollow(object.getGraphicalObject())
  }

  @Reflect.metadata('translated', i18n`stopFollowing`)
  @Reflect.metadata('help', i18n`stopFollowing_help`)
  stopFollowing() {
    this._camera.stopFollow()
  }
}
export default CameraClass

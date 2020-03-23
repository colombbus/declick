/**
 * @author       colombbus <regis.leloup@colombbus.org>
 * @copyright    2010 - actual colombbus
 * @license      colombbus
 */

export class MainScene extends Phaser.Scene {
  private phaserSprite!: Phaser.GameObjects.Sprite;
  private cursors: any;

  constructor() {
    super({
      key: "MainScene",
    });
  }
  init(): void {
  }

  preload(): void {
    this.load.image("logo", "./src/assets/declick.png");
  }

  create(): void {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.phaserSprite = this.add.sprite(95, 90, "logo");
  }

  update(): void {
    this.handleInput();
  }

  private handleInput(): void {
    if (this.cursors.up.isDown) {
      this.phaserSprite.y -= 1
      console.log('y', this.phaserSprite.y)
    }
    if (this.cursors.right.isDown) {
      this.phaserSprite.x += 1
    }
    if (this.cursors.left.isDown) {
      this.phaserSprite.x -= 1
    }
    if (this.cursors.down.isDown) {
      this.phaserSprite.y += 1
    }
  }
}

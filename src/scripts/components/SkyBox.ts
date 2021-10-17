import MainMenu from "../scenes/MainMenu";

export default class SkyBox {
  public scene: MainMenu
  public x: number
  public y: number

  private leftPart: Phaser.GameObjects.Sprite
  private rightPart: Phaser.GameObjects.Sprite
  private elements: Phaser.GameObjects.Sprite[]

  constructor(scene: MainMenu, x: number, y: number) {
    this.scene = scene
    this.x = x
    this.y = y
    this.init()
  }

  private init(): void {
    this.rightPart = this.scene.add.sprite(this.x, this.y, 'sky')
    this.leftPart = this.scene.add.sprite(this.rightPart.getLeftCenter().x, this.y, 'sky').setOrigin(1, 0.5)
    this.elements = [this.rightPart, this.leftPart]
    this.move()
  }

  private move(): void {
    this.scene.tweens.add({
      targets: this.elements,
      x: '+=1280',
      duration: 10000,
      onComplete: (): void => {
        this.rightPart.setPosition(this.x, this.y)
        this.leftPart.setPosition(this.rightPart.getLeftCenter().x, this.y)
        this.move()
      }
    })
  }
}
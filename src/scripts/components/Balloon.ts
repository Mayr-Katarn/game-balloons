import Game from "../scenes/Game"

export default class Balloon extends Phaser.GameObjects.Sprite {
  public scene: Game
  public x: number
  public y: number

  public color: number
  public durability: number
  public exist: boolean
  private speed: number

  private tail: Phaser.GameObjects.Sprite
  private flyUpAni: Phaser.Tweens.Tween
  private flySideAni: Phaser.Tweens.Tween
  private clickAni: Phaser.Tweens.Tween

  constructor(
    scene: Game,
    x: number,
    y: number,
    durability: number
  ) {
    super(scene, x, y, 'balloon')
    this.scene = scene
    this.x = x
    this.y = y
    this.durability = durability
    this.init()
  }

  private init(): void {
    this.exist = true
    this.speed = Phaser.Math.Between(5000, 10000)
    const colors = [0xff3d3d, 0x3dcfff, 0x463dff, 0xdd3dff, 0x3dff74, 0xd4ff3d, 0xffd43d]
    this.color = colors[Phaser.Math.Between(0, colors.length - 1)]
    const depth = Phaser.Math.Between(2, 5)
    const scale = 0.5
    this.tail = this.scene.add.sprite(this.x, this.y - 10, 'tail').setOrigin(0.5, 0).setDepth(depth).setScale(scale)
    this.scene.add.existing(this).setDepth(depth).setOrigin(0.5, 1).setScale(scale).setTint(this.color).setInteractive().setClick().fly()
  }

  private setClick(): this {
    this.on('pointerup', (): void => {
      if (this.durability > 0) {
        this.durability--
        this.click()
      } else {
        this.blow(true)
      }
    })
    return this
  }

  private fly(): this {
    this.flyUp()
    this.flySide()
    return this
  }

  private stopFly(): this {
    this.flyUpAni?.remove()
    this.flySideAni?.remove()
    return this
  }

  private flyUp(): void {
    const ease = ['linear', 'Power2', 'Power3', 'Quad.easeIn', 'Cubic.easeIn']
    this.flyUpAni = this.scene.tweens.add({
      targets: [ this, this.tail ],
      y: -150,
      duration: this.speed,
      ease: ease[Phaser.Math.Between(0, ease.length - 1)],
      onComplete: (): void => {
        this.blow(false)
      }
    })
  }

  private flySide(): void {
    const ease = ['linear', 'Power2', 'Power3', 'Quad.easeIn', 'Cubic.easeIn']
    const duration = Phaser.Math.Between(2000, 5000)
    const x = `+=${Phaser.Math.Between(10, 100)}`
    this.flySideAni = this.scene.tweens.add({
      targets: [this, this.tail],
      x,
      duration,
      yoyo: true,
      ease: ease[Phaser.Math.Between(0, ease.length - 1)],
      loop: -1
    })
  }

  private click(): void {
    this.clickAni = this.scene.tweens.add({
      targets: [this, this.tail],
      scaleY: '-=0.1',
      duration: 100,
      yoyo: true
    })
  }

  private blow(scorePlus: boolean): void {
    this.exist = false
    this.clickAni?.remove()
    this.scene.balloons = this.scene.balloons.filter(el => el.exist)
    if (scorePlus) this.scene.updateScore()
    this.scene.tweens.add({
      targets: this,
      scale: '+=0.1',
      duration: 150,
      onComplete: (): void => {
        this.tail.setVisible(false)
        this.stopFly().setVisible(false)
        const blow: Phaser.GameObjects.Sprite = this.scene.add.sprite(this.getCenter().x, this.getCenter().y, 'blow').setTint(this.color)
        this.scene.time.addEvent({
          delay: 50,
          callback: (): void => {
            blow.destroy()
            this.tail.destroy()
            this.destroy()
          },
          loop: false
        })
      }
    })
  }
}
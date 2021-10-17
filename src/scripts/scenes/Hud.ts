import langs from "../langs"
import Game from "./Game"
import MainMenu from "./MainMenu"

export default class Hud extends Phaser.Scene {
  constructor() {
    super('Hud')
  }

  public lang: any
  public gameScene: Game
  public mainMenuScene: MainMenu
  public camera: Phaser.Cameras.Scene2D.BaseCamera

  private score: Phaser.GameObjects.Text
  private timer: Phaser.GameObjects.Text


  public init(): void {
    this.lang = langs.ru
    this.gameScene = this.game.scene.keys['Game'] as Game
    this.mainMenuScene = this.game.scene.keys['MainMenu'] as MainMenu
    this.camera = this.cameras.main
  }


  public create(): void {
    this.timer = this.add.text(0, 0, `${this.lang.time} ${this.gameScene.gameTime}`, { font: '40px Marvin', color: 'white' }).setStroke('#000000', 3)
    this.score = this.add.text(0, this.timer.getBottomCenter().y, `${this.lang.score} 0`, { font: '40px Marvin', color: 'white' }).setStroke('#000000', 3)
    this.startTimer()
  }

  private startTimer(): void {
    const countdown: Phaser.Time.TimerEvent = this.time.addEvent({
      delay: 1000,
      callback: (): void => {
        this.gameScene.gameTime--
        this.timer.setText(`${this.lang.time} ${this.gameScene.gameTime}`)
        if (this.gameScene.gameTime <= 5) this.timer.setTint(0xff3d3d)
        if (this.gameScene.gameTime <= 0) {
          this.mainMenuScene.gameOver()
          countdown.remove()
        }
      },
      loop: true
    })
  } 


  public updateScore(): void {
    this.score.setText(`${this.lang.score} ${this.gameScene.score}`)
  }
}
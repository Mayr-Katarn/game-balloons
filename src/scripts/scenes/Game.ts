import Balloon from '../components/Balloon';
import langs from '../langs'
import Hud from './Hud';


export default class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  public lang: any
  public hud: Hud
  private camera: Phaser.Cameras.Scene2D.BaseCamera
  
  public cicle: Phaser.Time.TimerEvent

  public gameIsOver: boolean
  public balloons: Balloon[]
  public gameTime: number
  public balloonReach: number
  public score: number

  private field: Phaser.GameObjects.Sprite

  public init(): void {
    this.lang = langs.ru
    this.hud = this.game.scene.keys['Hud'] as Hud
    this.camera = this.cameras.main

    this.gameIsOver = false

    this.balloons = []
    this.balloonReach = 5
    this.gameTime = 30
    this.score = 0
  }


  public create(): void {
    this.cicle = this.time.addEvent({
      delay: 500,
      callback: (): void => {
        if (this.gameTime < 20 && this.balloonReach < 6) this.balloonReach++
        else if (this.gameTime < 15 && this.balloonReach < 7) this.balloonReach++
        else if (this.gameTime < 10 && this.balloonReach < 8) this.balloonReach++
        else if (this.gameTime < 5 && this.balloonReach < 9) this.balloonReach++
        const rand = Phaser.Math.Between(0, 2)
        if (this.balloons.length < this.balloonReach && (rand === 0 || rand === 1)) {
          const durability = this.gameTime < 20 && Phaser.Math.Between(0, 2) === 0 ? 1 : 0
          this.balloons.push(
            new Balloon(
              this,
              Phaser.Math.Between(100, this.camera.width - 100),
              this.camera.height + 150,
              durability
            )
          )
        }
      },
      loop: true
    })
  }

  public updateScore(): void {
    this.score++
    this.hud.updateScore()
  }
}

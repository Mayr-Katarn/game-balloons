import langs from '../langs'
import ButtonMain from '../components/Buttons/ButtonMain'
import SkyBox from '../components/SkyBox'
import Game from './Game'

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu')
  }

  public lang: any
  public gameScene: Game
  private camera: Phaser.Cameras.Scene2D.BaseCamera

  private score: number
  public newRecords: Irecord[]
  private title: Phaser.GameObjects.Text
  private btnStart: ButtonMain
  private btnRecords: ButtonMain
  
  private back: Phaser.GameObjects.TileSprite
  private mainInput: HTMLInputElement
  private scoreText: Phaser.GameObjects.Text
  private inputText: Phaser.GameObjects.Text
  private inputField: Phaser.GameObjects.TileSprite
  private btnOk: ButtonMain
  private btnCancel: ButtonMain
  private inputElements: Array<Phaser.GameObjects.Text | Phaser.GameObjects.TileSprite | ButtonMain>

  public init() {
    this.lang = langs.ru
    this.gameScene = this.game.scene.keys['Game'] as Game
    this.camera = this.cameras.main
    this.inputElements = []
    this.newRecords = []
  }
  
  public create() {
    new SkyBox(this, this.camera.centerX, this.camera.centerY)

    this.createStartMenu()
    this.createEnterNameMenu()
    
    this.input.keyboard.addKey('W').on('up', (): void => { this.gameOver() })
  }

  private createStartMenu(): void {
    this.title = this.add.text(this.camera.centerX, this.camera.centerY - 200, this.lang.title, { font: '60px Marvin', color: 'white' }).setOrigin(0.5)
    this.btnStart = new ButtonMain(
      this,
      this.camera.centerX,
      this.camera.centerY,
      (): void => { this.startGame() },
      this.lang.start,
    )

    this.btnRecords = new ButtonMain(
      this,
      this.camera.centerX,
      this.camera.centerY + 60,
      (): void => { this.showRecords() },
      this.lang.records,
    )
  }

  private showRecords(): void {
    this.startVisible(false)
    this.scene.launch('Records')
  }

  public startVisible(visible: boolean): void {
    this.title.setVisible(visible)
    this.btnStart.setVisible(visible)
    this.btnRecords.setVisible(visible)
    this.back?.removeAllListeners().removeInteractive()
  }

  private gameOverVisible(visible: boolean): void {
    this.inputElements.forEach(el => el.setVisible(visible))
    if (visible) {
      this.back.setInteractive()
      this.back.on('pointerdown', (): void => {
        this.mainInput.style.display = 'none';
        this.mainInput.blur();
        this.inputText.setText(this.mainInput.value).setCrop(0, 0, 434, 100)
      });
    }
    else this.back.removeAllListeners().removeInteractive()
  }

  private startGame(): void {
    this.startVisible(false)
    this.scene.launch('Game')
    this.scene.launch('Hud')
  }

  public gameOver(): void {
    this.score = this.gameScene.score
    this.scoreText.setText(`${this.lang.score} ${this.score}`)
    this.scene.stop('Game')
    this.scene.stop('Hud')
    this.gameOverVisible(true)
  }

  private createEnterNameMenu(): void {
    let centered: boolean = true
    let padding: number = this.camera.height / 100 * 30
    
    let tempHeight: number = window.innerHeight
    const windowHeight: number = window.innerHeight

    const root: HTMLDivElement = document.querySelector('#root')
    this.mainInput = document.createElement('input')
    root.append(this.mainInput)
    this.mainInput.setAttribute("id", "record")
    this.mainInput.setAttribute("autocomplete", "off")

    this.back = this.add.tileSprite(0, 0, this.camera.width, this.camera.height, 'pixel').setOrigin(0).setAlpha(0.0001)
    this.scoreText = this.add.text(this.camera.centerX, this.camera.centerY, `${this.lang.score} ${this.score}`, { font: '40px Marvin', color: 'white' }).setOrigin(0.5)
    this.inputField = this.add.tileSprite(this.scoreText.x, this.scoreText.getBottomCenter().y + 10, 300, 60, 'pixel').setOrigin(0.5, 0).setTint(0xffffff).setDepth(2).setInteractive()
    this.inputText = this.add.text(this.inputField.getLeftCenter().x + 4, this.inputField.getCenter().y, '', { font: '30px Marvin', color: 'black' }).setOrigin(0, 0.5).setDepth(4)
    this.btnOk = new ButtonMain(this, this.scoreText.x, this.inputField.getBottomCenter().y + 40, (): void => { this.closeGameOver(true) }, this.lang.ok)
    this.btnCancel = new ButtonMain(this, this.scoreText.x, this.inputField.getBottomCenter().y + 100, (): void => { this.closeGameOver(false) }, this.lang.cancel)
    this.inputElements = [this.scoreText, this.inputField, this.btnOk, this.btnCancel, this.inputText]
    this.gameOverVisible(false)

    window.onresize = (): void => {
      tempHeight = window.innerHeight
      if (windowHeight !== tempHeight && centered) {
        root.scrollIntoView(false)
        this.inputElements.forEach((el) => el.setY(el.y + padding))
        this.mainInput.style.top = '82.5%'
        this.mainInput.style.bottom = '12.5%'
        centered = false

      } else if (windowHeight === tempHeight && !centered) {
        this.inputElements.forEach((el) => el.setY(el.y - padding))
        this.mainInput.style.top = '52.5%'
        this.mainInput.style.bottom = '42.5%'
        centered = true
      }
    }

    this.inputField.on('pointerdown', (): void => {
      this.mainInput.style.display = 'block'
      this.mainInput.focus()
    })
  }

  private closeGameOver(newPlayer: boolean): void {
    if (newPlayer && this.mainInput.value !== '') this.newRecords.push({ name: this.mainInput.value, score: this.score })
    this.mainInput.style.display = 'none';
    this.mainInput.blur();
    this.gameOverVisible(false)
    this.startVisible(true)
  }
}

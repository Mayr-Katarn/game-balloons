import { records } from "../config";
import langs from "../langs";
import ScrollingCamera from "../libs/Scrollcam";
import MainMenu from "./MainMenu";

export default class Records extends Phaser.Scene {
  constructor() {
    super('Records');
  }

  public lang: any
  public mainMenu: MainMenu
  private title: Phaser.GameObjects.Text
  private cross: Phaser.GameObjects.Text

  public init(): void {
    this.lang = langs.ru
    this.mainMenu = this.game.scene.keys['MainMenu'] as MainMenu
  }

  public create(): void {
    const players: Irecord[] = records.concat(this.mainMenu.newRecords).sort((a, b) => b.score - a.score)
    const elements: Phaser.GameObjects.Text[] = []
    const centerX = this.cameras.main.centerX
    const offsetY = 60
    let length = this.cameras.main.height - 100
    console.log('Records ~ create ~ players', players)
    this.title = this.add.text(centerX, 0, this.lang.recordsTable, { font: '40px Marvin', color: '#ffeb7c' }).setOrigin(0.5, 0).setStroke('#000000', 3).setDepth(3)
    this.cross = this.add.text(this.cameras.main.width - 30, 1, `X`, { font: '60px Marvin', color: '#ff4e4e' }).setOrigin(1, 0).setStroke('#000000', 3).setDepth(3).setInteractive()

    players.forEach((el, i) => {
      const name: Phaser.GameObjects.Text = this.add.text(centerX - 200, (offsetY * i), `${el.name}`, {
        font: '30px Marvin', color: 'white'
      }).setOrigin(0).setCrop(0, 0, 400, 100)

      const place: Phaser.GameObjects.Text = this.add.text(name.getLeftCenter().x - 4, name.getCenter().y, `${i + 1}.`, {
        font: '30px Marvin', color: '#ffeb7c'
      }).setOrigin(1, 0.5)

      const score: Phaser.GameObjects.Text = this.add.text(centerX + 200, name.getCenter().y, String(el.score), {
        font: '30px Marvin', color: '#9eff7c'
      }).setOrigin(0, 0.5)

      elements.push(name, place, score)
      if (i === players.length - 1 && name.getBottomCenter().y > length) length =  name.getBottomCenter().y + offsetY + 20
    })

    this.cross.on('pointerup', (): void => { this.close() })

    const cameraOptions = {
      y: 60,
      contentBounds: {
        x: 0,
        y: 0,
        length
      },
      wheel: {
        enable: true
      }
    }

    const scroll = new ScrollingCamera(this, cameraOptions)
    this.cameras.cameras[1].ignore([this.title, this.cross])
    this.cameras.cameras[0].ignore(elements)
  }

  private close(): void {
    this.scene.stop()
    this.mainMenu.startVisible(true)
  }
}
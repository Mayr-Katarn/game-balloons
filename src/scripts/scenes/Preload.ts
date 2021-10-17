const balloon: any = require("./../../assets/images/balloon.png");
const tail: any = require("./../../assets/images/tail.png");
const blow: any = require("./../../assets/images/blow.png");
const btn: any = require("./../../assets/images/btn.png");
const sky: any = require("./../../assets/images/sky.png");


export default class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  public preload(): void {
    this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'pixel').setTint(0x50acc7).setOrigin(0)
    let text: Phaser.GameObjects.Text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 120, '0%', {
      font: '24px Marvin',
      color: '#ffffff'
    }).setDepth(1).setOrigin(0.5, 0.5);
  
    const progress: Phaser.GameObjects.TileSprite = this.add.tileSprite(this.cameras.main.centerX - 230, this.cameras.main.centerY - 100, 0, 130, 'load').setTint(0x63d100).setOrigin(0, 0.5);

    this.load.on('progress', (value: number): void => {
      const percent: number = Math.round(value * 100);
      const onePercent: number = 420 / 90;
      const bar: number = Math.round(percent * onePercent);
  
      progress.setDisplaySize(bar, 10)
      text.setText(percent + '%');
    });

    this.load.image('balloon', balloon)
    this.load.image('tail', tail)
    this.load.image('blow', blow)
    this.load.image('btn', btn)
    this.load.image('sky', sky)
  }

  public create(): void {
    this.scene.stop()
    this.scene.start('MainMenu')
  }
}
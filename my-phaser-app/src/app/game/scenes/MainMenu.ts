import * as Phaser from 'phaser';
import { EventBus } from '../EventBus';

export default class MainMenu extends Phaser.Scene {
    private logo!: Phaser.GameObjects.Image;
    private startButton!: Phaser.GameObjects.Image;
    private logoTween!: Phaser.Tweens.Tween | null;

    constructor() {
        super("MainMenu");
        this.logoTween = null;
    }

    preload() {
        // Charger les assets
        this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');
        this.load.image('logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png');
        this.load.image('start-button', '/assets/start-button.png');
    }

    create() {
        // Background
        this.add.image(400, 300, 'background');

        // Logo
        this.logo = this.add.image(400, 150, 'logo');
        this.logo.setScale(0.5);

        // Tween du logo
        this.logoTween = this.tweens.add({
            targets: this.logo,
            y: 170,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Bouton "Play"
        this.startButton = this.add.image(400, 400, 'start-button');
        this.startButton.setScale(0.5);
        this.startButton.setInteractive({ useHandCursor: true });

        // Hover effect
        this.startButton.on('pointerover', () => this.startButton.setTint(0xaaaaaa));
        this.startButton.on('pointerout', () => this.startButton.clearTint());

        // Click -> show intro dialog then launch GameScene
        this.startButton.on('pointerdown', () => {
            if (typeof window !== 'undefined') {
                const event = new CustomEvent('start-dialog', {
                    detail: {
                        message: 'Dans un monde gouverné par les GAFAM, seuls les plus courageux osent défier leur emprise...\n\nÊtes-vous prêt à relever le défi et à restaurer la liberté numérique ?',
                        characterName: 'Narrateur',
                    },
                });
                window.dispatchEvent(event);

                const onDialogEnd = () => {
                    window.removeEventListener('end-dialog', onDialogEnd);
                    this.scene.start('Game');
                };
                window.addEventListener('end-dialog', onDialogEnd);
            } else {
                this.scene.start('Game');
            }
        });

        EventBus.emit('current-scene-ready', this);
    }
}
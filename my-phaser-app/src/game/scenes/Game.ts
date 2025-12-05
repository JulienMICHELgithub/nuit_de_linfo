/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
export default class Game extends Phaser.Scene {

	constructor() {
		super("Game");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// bitemap_1
		this.add.image(510, 328, "bitemap_1");

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	create() {

        this.editorCreate();

        this.cameras.main.setBackgroundColor(0x00ff00);

        EventBus.emit('current-scene-ready', this);

	}

    changeScene ()
    {
        this.scene.start('GameOver');
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

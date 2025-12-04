
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */
'use client';

import { QuestManager } from "../quests/QuestManager";
import { EventBus } from '@/app/game/EventBus';

export default class Game extends Phaser.Scene {

    player: any;
    cursors: any;
    npcs: any[] = [];
    questActive: boolean = false;

    constructor() {
        super("Game");
    }

    preload() {
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
        this.load.spritesheet('npc', '/assets/npc.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');
    }

	create(): void {

		// bitemap_1
		this.add.image(510, 328, "bitemap");

        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.createNPC(600, 400, 'qcm1');
        this.createNPC(200, 200, 'enigme1');

        EventBus.emit('current-scene-ready', this);
    }

    update() {
        const speed = 200;
        this.player.setVelocity(0);
        if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
        if (this.cursors.right.isDown) this.player.setVelocityX(speed);
        if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
        if (this.cursors.down.isDown) this.player.setVelocityY(speed);
    }

    createNPC(x: number, y: number, questId: string) {
        const npc = this.physics.add.sprite(x, y, 'npc');
        npc.setImmovable(true);

        npc.questId = questId;

        npc.play('npc_idle_down');

        // Zone d'interaction
        const zone = this.add.zone(x, y, 50, 50);
        this.physics.world.enable(zone);
        zone.body.setAllowGravity(false);
        zone.body.moves = false;

        this.physics.add.overlap(this.player, zone, () => {
            this.onNPCInteraction(npc);
        });

        npc.interactionZone = zone;

        return npc;
    }

    completeQuest(data?: any) {
        const ok = QuestManager.completeCurrent(data);
        if (ok) this.questActive = false;
        EventBus.emit('quest-completed', ok);
    }

    onNPCInteraction(npc: any) {
    console.log("Interaction avec PNJ → quête :", npc.questId);

    if (!npc.questId) return;

    QuestManager.startQuest(npc.questId);
}


	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here

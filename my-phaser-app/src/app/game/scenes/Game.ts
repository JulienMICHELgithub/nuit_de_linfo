"use client"

import * as Phaser from 'phaser';

// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

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
            frameWidth: 16,
            frameHeight: 32
        });
        this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');
    }

	create(): void {

        this.cameras.main.setZoom(1.5);
        
        // Tilemap and collisions
        const map = this.make.tilemap({ key: 'bitmap' });

        const tilesets: Phaser.Tilemaps.Tileset[] = [];
        const caveTileset = map.addTilesetImage('bitemap', 'bitemap');
        if (caveTileset) tilesets.push(caveTileset);
        const overworldTileset = map.addTilesetImage('Overworld', 'overworld');
        if (overworldTileset) tilesets.push(overworldTileset);

        const layerTilesets: Phaser.Tilemaps.Tileset | Phaser.Tilemaps.Tileset[] = tilesets.length === 1 ? tilesets[0] : tilesets;

        // Render base/grass layer (hidden by default in Tiled)
        const groundLayer = map.getLayer('grass') ? map.createLayer('grass', layerTilesets) : null;
        if (groundLayer) {
            groundLayer.setVisible(true);
            groundLayer.setDepth(0);
        }

        let collisionLayer: Phaser.Tilemaps.TilemapLayer | null = null;
        const objectsLayerIndex = map.getLayerIndex('Objects');
        if (objectsLayerIndex !== null && objectsLayerIndex >= 0) {
            collisionLayer = map.createLayer(objectsLayerIndex, layerTilesets);
        }

        // Fallback: display the first tile layer when the object layer cannot be resolved (e.g. nested Tiled group)
        if (!collisionLayer) {
            const firstTileLayer = map.layers.find((layerData: any) => layerData?.type === 'tilelayer' && layerData?.name !== 'grass');
            if (firstTileLayer?.name) {
                collisionLayer = map.createLayer(firstTileLayer.name, layerTilesets);
            }
        }

        if (collisionLayer) {
            collisionLayer.setVisible(true);
            collisionLayer.setDepth(1);
            collisionLayer.setCollisionByExclusion([-1]);
        }

        // Resize world to map size
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10);
        this.player.setScale(2);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cursors = this.input.keyboard.createCursorKeys();

        const npc1 = this.createNPC(600, 400, 'qcm1');
        const npc2 = this.createNPC(200, 200, 'enigme1');

        // Block the player on NPCs so collisions are physical
        this.physics.add.collider(this.player, npc1);
        this.physics.add.collider(this.player, npc2);
        if (collisionLayer) {
            this.physics.add.collider(this.player, collisionLayer);
        }

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
        npc.scaleX = 1.5;
        npc.scaleY = 1.5;
        const zoneBody = zone.body as Phaser.Physics.Arcade.Body;
        zoneBody.setAllowGravity(false);
        zoneBody.setImmovable(true);
        zoneBody.moves = false;

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

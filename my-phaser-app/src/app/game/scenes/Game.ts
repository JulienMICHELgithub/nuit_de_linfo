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
    interactKey: any;
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
        
        // The Objects layer is nested inside "Group 1" so the full path is "Group 1/Objects"
        try {
            collisionLayer = map.createLayer('Group 1/Objects', layerTilesets);
            console.log('Created Objects layer:', collisionLayer);
        } catch (e) {
            console.log('Failed to create Objects layer:', e);
        }

        if (collisionLayer) {
            collisionLayer.setVisible(true);
            collisionLayer.setDepth(1);
            collisionLayer.setCollisionByExclusion([-1]);
        }

        // Resize world to map size
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.player = this.physics.add.sprite(450, 310, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cursors = (this.input as any).keyboard.createCursorKeys();

        // Key to interact with NPCs (press 'F')
        this.interactKey = (this.input as any).keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        const npc2 = this.createNPC(200, 150, 'enigme1');
        const npc3 = this.createNPC(170, 450, 'puzzle1');
        const npc1 = this.createNPC(600, 400, 'qcm1');
        const npc4 = this.createNPC(760, 260, 'snake1');

        // Block the player on NPCs so collisions are physical
        this.physics.add.collider(this.player, npc1);
        this.physics.add.collider(this.player, npc2);
        this.physics.add.collider(this.player, npc3);
        this.physics.add.collider(this.player, npc4);
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

        // When player presses F, check nearby NPC interaction zones (only if no DOM input is focused)
        const focusedElement = document.activeElement;
        const isInputFocused = focusedElement && focusedElement.tagName === 'INPUT';

        if (Phaser.Input.Keyboard.JustDown(this.interactKey) && !isInputFocused) {
            for (const npc of this.npcs) {
                if (npc.interactionZone && this.physics.overlap(this.player, npc.interactionZone)) {
                    this.onNPCInteraction(npc);
                    break;
                }
            }
        }
    }

    createNPC(x: number, y: number, questId: string) {
        const npc: any = this.physics.add.sprite(x, y, 'npc');
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

        // Register NPC and its interaction zone for manual interaction (press F)
        npc.interactionZone = zone;
        // small hint text above NPC
        const hint = this.add.text(x, y - 36, 'Press F', { fontSize: '12px', color: '#ffffff' }).setOrigin(0.5);
        // Show hint only if quest is available
        hint.setVisible(!!(QuestManager.get && QuestManager.get(questId)));
        npc.hintText = hint;

        this.npcs.push(npc);

        return npc;
    }

    completeQuest(result: { success: boolean; totalScore: number }, questId?: string) {
        const { success, totalScore } = result;
        
        if (success) this.questActive = false;
        EventBus.emit('quest-completed', success);

        if (!this.scene.isVisible()) {
            this.scene.setVisible(true);
        }

        if (questId) {
            for (const npc of this.npcs) {
                if (npc.questId === questId) {
                    if (npc.hintText) npc.hintText.setVisible(false);
                    npc.questId = undefined;
                }
            }
        }

        // Check for victory condition
        if (totalScore >= 500 && typeof window !== 'undefined') {
            const event = new CustomEvent('start-dialog', {
                detail: {
                    message: 'VICTOIRE ! Vous avez atteint 500 points ! Vous avez libéré tous les villages de l\'oppression numérique et restauré la liberté sur Internet. Félicitations, héros !',
                    characterName: '🎉 FIN DU JEU 🎉',
                },
            });
            window.dispatchEvent(event);
        } else if (success && typeof window !== 'undefined') {
            // Show completion dialog
            const event = new CustomEvent('start-dialog', {
                detail: {
                    message: `Félicitations ! Vous avez terminé cette quête. Score total: ${totalScore}/500. Continuez de libérer les autres villages de l\'oppression numérique.`,
                    characterName: 'Narrateur',
                },
            });
            window.dispatchEvent(event);
        }
    }

    onNPCInteraction(npc: any) {
        console.log("Interaction avec PNJ → quête :", npc.questId);

        if (!npc.questId) return;

        // Check that the quest still exists (avoid throwing when quest was already completed)
        const quest = QuestManager.get(npc.questId);
        if (!quest) return;

        // Show dialog before launching quest
        if (typeof window !== 'undefined') {
            const dialogMessage = `${quest.title}\n\n${quest.description}`;
            const event = new CustomEvent('start-dialog', {
                detail: {
                    message: dialogMessage,
                    characterName: 'Zuck',
                },
            });
            window.dispatchEvent(event);

            const onDialogEnd = () => {
                window.removeEventListener('end-dialog', onDialogEnd);
                this.launchQuestScene(quest, npc.questId);
            };
            window.addEventListener('end-dialog', onDialogEnd);
        } else {
            this.launchQuestScene(quest, npc.questId);
        }
    }

    launchQuestScene(quest: any, questId: string) {
        QuestManager.startQuest(questId);

        // Launch the appropriate scene based on quest type
        if (quest.type === 'qcm') {
            this.scene.launch('QCMScene', { questId });
            this.scene.pause();
            this.scene.setVisible(false);
            this.scene.bringToTop('QCMScene');
        } else if (quest.type === 'enigme') {
            this.scene.launch('EnigmeScene', { questId });
            this.scene.pause();
            this.scene.setVisible(false);
            this.scene.bringToTop('EnigmeScene');
        } else if (quest.type === 'puzzle') {
            this.scene.launch('PuzzleScene', { questId });
            this.scene.pause();
            this.scene.setVisible(false);
            this.scene.bringToTop('PuzzleScene');
        } else if (quest.type === 'snake') {
            this.scene.launch('SnakeScene', { questId });
            this.scene.pause();
            this.scene.setVisible(false);
            this.scene.bringToTop('SnakeScene');
        }
    }


    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
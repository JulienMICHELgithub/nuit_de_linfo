import * as Phaser from 'phaser';
import { Scene } from 'phaser';
import { QuestManager } from "../quests/QuestManager";

export default class SnakeScene extends Scene {
    quest: any;
    cursors: any;
    direction: string = 'right';
    moveTimer?: Phaser.Time.TimerEvent;
    tileSize = 20;
    cols = 20;
    rows = 15;
    snake: { x: number; y: number; gfx: Phaser.GameObjects.Rectangle }[] = [];
    items: { x: number; y: number; gfx: Phaser.GameObjects.Container; gafam: boolean }[] = [];
    collected = 0;

    constructor() {
        super('SnakeScene');
    }

    init(data: any) {
        this.quest = QuestManager.get(data.questId);
    }

    create() {
        const cw = this.scale.width;
        const ch = this.scale.height;

        // Dim background and panel
        this.add.rectangle(cw / 2, ch / 2, cw, ch, 0x000000, 0.6).setDepth(0);

        const panelW = Math.min(560, cw - 80);
        const panelH = Math.min(420, ch - 120);
        const panelX = cw / 2;
        const panelY = ch / 2;

        this.add.rectangle(panelX, panelY, panelW, panelH, 0x101020, 0.98).setStrokeStyle(2, 0xffffff);

        this.add.text(panelX, panelY - panelH / 2 + 14, this.quest?.title || 'Mini-Snake', { fontSize: '20px', color: '#ffffff' }).setOrigin(0.5, 0);
        this.add.text(panelX, panelY - panelH / 2 + 42, this.quest?.description || 'Attrape les logos GAFAM (5) sans mourir.', { fontSize: '14px', color: '#cccccc', wordWrap: { width: panelW - 40 }, align: 'center' }).setOrigin(0.5, 0);

        // grid metrics
        const gridX = panelX - panelW / 2 + 20;
        const gridY = panelY - panelH / 2 + 84;
        const gridW = panelW - 40;
        const gridH = panelH - 160;

        this.cols = Math.floor(gridW / this.tileSize);
        this.rows = Math.floor(gridH / this.tileSize);

        // background grid
        const bg = this.add.rectangle(panelX, gridY + gridH / 2, gridW, gridH, 0x0b0b12).setOrigin(0.5, 0.5);

        // init snake in center
        const startX = Math.floor(this.cols / 2);
        const startY = Math.floor(this.rows / 2);
        this.snake = [];
        for (let i = 0; i < 4; i++) {
            const sx = startX - i;
            const sy = startY;
            const px = gridX + sx * this.tileSize + this.tileSize / 2;
            const py = gridY + sy * this.tileSize + this.tileSize / 2;
            const rect = this.add.rectangle(px, py, this.tileSize - 2, this.tileSize - 2, 0x88cc88).setOrigin(0.5);
            this.snake.push({ x: sx, y: sy, gfx: rect });
        }

        // spawn gafam logos (we'll spawn 6 but require 5 to win)
        const gafam = ['Google', 'Apple', 'Facebook', 'Amazon', 'Microsoft', 'Twitter'];
        this.items = [];
        for (let i = 0; i < gafam.length; i++) {
            this.spawnItem(gridX, gridY, gafam[i], true);
        }

        // HUD
        this.collected = 0;
        const hud = this.add.text(panelX + panelW / 2 - 16, panelY - panelH / 2 + 14, `GAFAM: ${this.collected}/5`, { fontSize: '16px', color: '#ffffff' }).setOrigin(1, 0);

        // controls
        this.cursors = (this.input as any).keyboard.createCursorKeys();
        this.input.keyboard.on('keydown', (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp' && this.direction !== 'down') this.direction = 'up';
            if (e.key === 'ArrowDown' && this.direction !== 'up') this.direction = 'down';
            if (e.key === 'ArrowLeft' && this.direction !== 'right') this.direction = 'left';
            if (e.key === 'ArrowRight' && this.direction !== 'left') this.direction = 'right';
        });

        // movement timer
        this.moveTimer = this.time.addEvent({ delay: 120, loop: true, callback: () => this.step(gridX, gridY, gridW, gridH, hud) });

        // back / quit button
        const quitBtn = this.add.rectangle(panelX + panelW / 2 - 16, panelY + panelH / 2 - 22, 90, 32, 0x663333).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
        const quitTxt = this.add.text(quitBtn.x - 44, quitBtn.y, 'Quitter', { fontSize: '14px', color: '#fff' }).setOrigin(0.5);
        quitBtn.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('Game');
        });
    }

    spawnItem(gridX: number, gridY: number, name: string, gafam = true) {
        // find free spot
        let tries = 0;
        while (tries < 200) {
            const x = Phaser.Math.Between(0, this.cols - 1);
            const y = Phaser.Math.Between(0, this.rows - 1);
            // avoid snake
            if (this.snake.some(s => s.x === x && s.y === y)) { tries++; continue; }
            if (this.items.some(it => it.x === x && it.y === y)) { tries++; continue; }
            const px = gridX + x * this.tileSize + this.tileSize / 2;
            const py = gridY + y * this.tileSize + this.tileSize / 2;
            const circle = this.add.circle(0, 0, this.tileSize / 2 - 2, 0xffaa00);
            const text = this.add.text(0, 0, name[0], { fontSize: '12px', color: '#000' }).setOrigin(0.5);
            const container = this.add.container(px, py, [circle, text]);
            this.items.push({ x, y, gfx: container, gafam });
            return;
        }
    }

    step(gridX: number, gridY: number, gridW: number, gridH: number, hud: Phaser.GameObjects.Text) {
        // compute new head
        const head = this.snake[0];
        let nx = head.x;
        let ny = head.y;
        if (this.direction === 'up') ny -= 1;
        if (this.direction === 'down') ny += 1;
        if (this.direction === 'left') nx -= 1;
        if (this.direction === 'right') nx += 1;

        // check collisions with walls
        if (nx < 0 || nx >= this.cols || ny < 0 || ny >= this.rows) {
            this.onDie();
            return;
        }

        // check self collision
        if (this.snake.some((s, idx) => idx > 0 && s.x === nx && s.y === ny)) {
            this.onDie();
            return;
        }

        // move body
        const tail = this.snake.pop() as any;
        tail.x = nx; tail.y = ny;
        tail.gfx.x = gridX + nx * this.tileSize + this.tileSize / 2;
        tail.gfx.y = gridY + ny * this.tileSize + this.tileSize / 2;
        this.snake.unshift(tail);

        // check item collision
        for (let i = this.items.length - 1; i >= 0; i--) {
            const it = this.items[i];
            if (it.x === nx && it.y === ny) {
                // eat
                if (it.gafam) {
                    this.collected += 1;
                }
                it.gfx.destroy();
                this.items.splice(i, 1);
                // grow snake by adding new rect at tail's previous position
                const last = this.snake[this.snake.length - 1];
                const px = gridX + last.x * this.tileSize + this.tileSize / 2;
                const py = gridY + last.y * this.tileSize + this.tileSize / 2;
                const rect = this.add.rectangle(px, py, this.tileSize - 2, this.tileSize - 2, 0x88cc88).setOrigin(0.5);
                this.snake.push({ x: last.x, y: last.y, gfx: rect });
            }
        }

        // update HUD text
        hud.setText(`GAFAM: ${this.collected}/5`);

        // win condition
        if (this.collected >= 5) {
            const ok = QuestManager.completeCurrent({ itemsCollected: this.collected });
            const game = this.scene.get('Game') as any;
            game.completeQuest(ok, this.quest.id);
            // success message
            const cw = this.scale.width;
            const ch = this.scale.height;
            this.add.text(cw / 2, ch / 2 + 120, 'Bravo — tu as gagné !', { fontSize: '20px', color: '#88ff88' }).setOrigin(0.5).setDepth(2);
            this.time.delayedCall(800, () => { this.scene.stop(); this.scene.resume('Game'); }, [], this);
        }
    }

    onDie() {
        // stop movement
        this.moveTimer?.remove(false);

        const cw = this.scale.width;
        const ch = this.scale.height;
        const msg = this.add.text(cw / 2, ch / 2 + 80, 'Le serpent est mort — Réessayez ?', { fontSize: '18px', color: '#ff6666' }).setOrigin(0.5).setDepth(2);

        // retry button
        const retryBtn = this.add.rectangle(cw / 2, ch / 2 + 120, 140, 38, 0x2266cc).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(2);
        const retryTxt = this.add.text(retryBtn.x, retryBtn.y, 'Réessayer', { fontSize: '16px', color: '#fff' }).setOrigin(0.5).setDepth(2);
        retryBtn.on('pointerdown', () => {
            // restart the scene to allow retry
            this.scene.restart({ questId: this.quest.id });
        });
    }
}

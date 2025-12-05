import { Scene } from "phaser";
import { QuestManager } from "../quests/QuestManager";

export default class PuzzleScene extends Scene {
    quest: any;
    tiles: any[] = [];

    constructor() {
        super("PuzzleScene");
    }

    init(data: any) {
        this.quest = QuestManager.get(data.questId);
    }

    create() {
        const cw = this.scale.width;
        const ch = this.scale.height;

        // Dim overlay
        this.add.rectangle(cw / 2, ch / 2, cw, ch, 0x000000, 0.6).setDepth(0);

        // Panel
        const panelW = Math.min(520, cw - 80);
        const panelH = Math.min(380, ch - 120);
        const panelX = cw / 2;
        const panelY = ch / 2;

        this.add.rectangle(panelX, panelY, panelW, panelH, 0x1e1e2f, 0.98).setStrokeStyle(2, 0xffffff);

        // Title and description — centered and spaced
        this.add.text(panelX, panelY - panelH / 2 + 20, this.quest.title || "Mini Puzzle", {
            fontSize: "20px",
            color: "#ffffff"
        }).setOrigin(0.5, 0);

        this.add.text(panelX, panelY - panelH / 2 + 52, this.quest.description || "Active all tiles to solve.", {
            fontSize: "16px",
            color: "#cccccc",
            wordWrap: { width: panelW - 48 },
            align: 'center'
        }).setOrigin(0.5, 0);

        // Clean, minimal themed puzzle aligned with the quest card
        const cols = 3;
        const rows = 2;
        const gap = 16;
        const tileSize = Math.min(120, Math.floor((panelW - 80 - gap * (cols - 1)) / cols));
        const spacingX = tileSize + gap;
        const spacingY = tileSize + gap;

        const startX = panelX - (spacingX * (cols - 1)) / 2;
        // move grid slightly down to avoid overlapping with description
        const startY = panelY - (spacingY * (rows - 1)) / 2 + 42;

        // Items with GAFAM membership flag (false = not in GAFAM)
        const items = [
            { name: "Google", gafam: true },
            { name: "ProtonMail", gafam: false },
            { name: "Facebook", gafam: true },
            { name: "Mozilla", gafam: false },
            { name: "Microsoft", gafam: true },
            { name: "Twitter", gafam: false }
        ];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const i = r * cols + c;
                const cx = startX + c * spacingX;
                const cy = startY + r * spacingY;

                // Group rect + label into a container for clean alignment
                const rect = this.add.rectangle(0, 0, tileSize, tileSize, 0xaa4444).setOrigin(0.5);
                rect.setStrokeStyle(2, 0x222222);

                const label = this.add.text(0, 0, items[i].name || "?", { fontSize: "16px", color: "#ffffff", align: 'center', wordWrap: { width: tileSize - 10 } }).setOrigin(0.5);

                const container = this.add.container(cx, cy, [rect, label]);
                container.setSize(tileSize, tileSize);
                container.setInteractive(new Phaser.Geom.Rectangle(-tileSize/2, -tileSize/2, tileSize, tileSize), Phaser.Geom.Rectangle.Contains);
                // selection flag on container (user selects tiles they think are NOT GAFAM)
                (container as any).selected = false;
                (container as any).rect = rect;
                (container as any).index = i;

                container.on('pointerdown', () => {
                    // toggle selected outline
                    (container as any).selected = !(container as any).selected;
                    const sel = (container as any).selected;
                    rect.setStrokeStyle(4, sel ? 0xffcc00 : 0x222222);
                    this.tweens.add({ targets: label, scale: sel ? 1.08 : 1.0, duration: 120 });
                });

                this.tiles.push(container);
            }
        }

        // Validate button — placed below the grid
        const gridBottomY = startY + (rows - 1) * spacingY + tileSize / 2;
        const validateY = gridBottomY + 28;
        const validateBtn = this.add.rectangle(panelX, validateY, 160, 40, 0x2266cc).setOrigin(0.5).setInteractive({ useHandCursor: true });
        const validateTxt = this.add.text(panelX, validateY, "Valider", { fontSize: "16px", color: "#ffffff" }).setOrigin(0.5);
        validateBtn.on('pointerdown', () => this.validateSelection(items, validateBtn, validateTxt));

        // Instruction — centered and spaced under the button
        this.add.text(panelX, validateY + 36, "Sélectionnez les sociétés qui NE font PAS partie des GAFAM, puis appuyez sur Valider.", { fontSize: "14px", color: "#cccccc", align: 'center', wordWrap: { width: panelW - 48 } }).setOrigin(0.5, 0);
    }

    checkSolved() {
        // Legacy: not used with new validate flow, kept for backward compatibility
        return false;
    }

    validateSelection(items: any[], btn: any, btnTxt: any) {
        // gather selected indices
        const selected = this.tiles.map((c: any, i: number) => ((c as any).selected ? i : -1)).filter((i: number) => i >= 0);

        const correct = items.map((it, i) => (!it.gafam ? i : -1)).filter(i => i >= 0);

        const sSet = new Set(selected);
        const cSet = new Set(correct);

        const equal = sSet.size === cSet.size && [...sSet].every(x => cSet.has(x));

        if (equal) {
            // mark tiles green
            for (const idx of selected) {
                const c = this.tiles[idx] as any;
                c.rect.setFillStyle(0x44aa44);
            }
            const cw = this.scale.width;
            const ch = this.scale.height;
            this.add.text(cw / 2, ch / 2 + 120, "Bravo — puzzle résolu !", { fontSize: "20px", color: "#88ff88" }).setOrigin(0.5).setDepth(2);

            // complete quest
            btn.disableInteractive && btn.disableInteractive();
            btn.setFillStyle && btn.setFillStyle(0x226622);
            const ok = QuestManager.completeCurrent(true);
            const game = this.scene.get("Game") as any;
            game.completeQuest(ok, this.quest.id);

            this.time.delayedCall(900, () => {
                this.scene.stop();
                this.scene.resume("Game");
            }, [], this);
        } else {
            // show error and highlight wrong selections
            const cw = this.scale.width;
            const msg = this.add.text(cw / 2, this.scale.height - 80, "Incorrect — réessayez", { fontSize: "16px", color: "#ff4444" }).setOrigin(0.5).setDepth(2);
            this.time.delayedCall(1200, () => msg.destroy(), [], this);

            // shake and flash wrong tiles
            for (const idx of selected) {
                if (!cSet.has(idx)) {
                    const c = this.tiles[idx] as any;
                    this.tweens.add({ targets: c, x: c.x - 6, duration: 60, yoyo: true, repeat: 2 });
                    this.tweens.add({ targets: c.rect, tint: 0xff4444, duration: 120, yoyo: true });
                    // deselect wrong ones after short delay
                    this.time.delayedCall(700, () => {
                        (c as any).selected = false;
                        c.rect.setStrokeStyle(2, 0x222222);
                    }, [], this);
                }
            }
        }
    }

    companyName(label: string | undefined) {
        switch (label) {
            case 'G': return 'Google';
            case 'A': return 'Amazon/Apple';
            case 'F': return 'Facebook';
            case 'M': return 'Microsoft';
            case 'MS': return 'Microsoft';
            default: return '';
        }
    }
}

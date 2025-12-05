import { Scene } from "phaser";
import { QuestManager } from "../quests/QuestManager";

export default class QCMScene extends Scene {
    quest: any;
    answerButtons: any[] = [];
    panelContainer: any;

    constructor() {
        super("QCMScene");
    }

    init(data: any) {
        this.quest = QuestManager.get(data.questId);
    }

    create() {
        const { question, answers } = this.quest;

        const cw = this.scale.width;
        const ch = this.scale.height;

        // Dim overlay
        this.add.rectangle(cw / 2, ch / 2, cw, ch, 0x000000, 0.6).setDepth(0);

        // Panel
        const panelW = Math.min(700, cw - 80);
        const panelH = Math.min(420, ch - 120);
        const panelX = cw / 2;
        const panelY = ch / 2;

        const panel = this.add.rectangle(panelX, panelY, panelW, panelH, 0x1e1e2f, 0.98)
            .setStrokeStyle(2, 0xffffff);

        // Title / question
        const title = this.add.text(panelX - panelW / 2 + 24, panelY - panelH / 2 + 24, question, {
            fontSize: "22px",
            color: "#ffffff",
            wordWrap: { width: panelW - 48 }
        });

        // Container for buttons
        this.panelContainer = this.add.container(0, 0);

        let startY = panelY - panelH / 2 + 90;
        const btnH = 44;
        const gap = 14;

        answers.forEach((a: string, i: number) => {
            const bx = panelX - panelW / 2 + 40;
            const by = startY + i * (btnH + gap);

            const btnBg = this.add.rectangle(bx + panelW / 2 - 40 - panelW / 2, by, panelW - 80, btnH, 0x2b2b3f)
                .setOrigin(0, 0.5)
                .setInteractive({ useHandCursor: true });

            const btnText = this.add.text(bx, by, a, { fontSize: "18px", color: "#ffffff" })
                .setOrigin(0, 0.5);

            btnBg.on('pointerover', () => btnBg.setFillStyle(0x3b3b5f));
            btnBg.on('pointerout', () => btnBg.setFillStyle(0x2b2b3f));
            btnBg.on('pointerdown', () => this.answer(i));

            this.panelContainer.add([btnBg, btnText]);
            this.answerButtons.push(btnBg);
        });

        // Add small instruction
        this.add.text(panelX - panelW / 2 + 24, panelY + panelH / 2 - 40, "Cliquez pour répondre — ou utilisez la souris/touch", { fontSize: "14px", color: "#cccccc" });
        this.panelContainer.setDepth(1);
    }

    answer(index: number) {
        // Disable input briefly to avoid double clicks
        this.answerButtons.forEach((b: any) => b.disableInteractive && b.disableInteractive());

        // Use QuestManager to complete the current quest with the chosen answer index
        const ok = QuestManager.completeCurrent(index);

        if (ok) {
            // Show success message and prevent retry
            const cw = this.scale.width;
            const ch = this.scale.height;
            const msg = this.add.text(cw / 2, ch / 2 + 120, "Bonne réponse ! Quête terminée.", { fontSize: "20px", color: "#88ff88" })
                .setOrigin(0.5)
                .setDepth(2);

            // Optional: visually mark buttons as disabled/green
            this.answerButtons.forEach((b: any) => b.setFillStyle && b.setFillStyle(0x1f7f1f));

            // retour à GameScene after a short delay to show success
            this.time.delayedCall(1000, () => {
                const game = this.scene.get("Game") as any;
                game.completeQuest(true, this.quest.id);

                this.scene.stop();
                this.scene.resume("Game");
            }, [], this);
        } else {
            // Feedback: incorrect answer, allow retry
            const cw = this.scale.width;
            const msg = this.add.text(cw / 2, this.scale.height - 80, "Mauvaise réponse, réessaye", { fontSize: "18px", color: "#ff4444" })
                .setOrigin(0.5)
                .setDepth(2);
            this.time.delayedCall(1400, () => msg.destroy(), [], this);

            // Re-enable buttons after a short delay
            this.time.delayedCall(600, () => {
                this.answerButtons.forEach((b: any) => b.setInteractive && b.setInteractive({ useHandCursor: true }));
            }, [], this);
        }
    }
}

import { Scene } from "phaser";
import { QuestManager } from "../quests/QuestManager";

export default class EnigmeScene extends Scene {
    quest: any;
    inputField: any;
    submitButton: any;
    panelContainer: any;
    gameContainer: any;

    constructor() {
        super("EnigmeScene");
    }

    init(data: any) {
        this.quest = QuestManager.get(data.questId);
    }

    create() {
        const { description } = this.quest;

        const cw = this.scale.width;
        const ch = this.scale.height;

        // Dim overlay
        this.add.rectangle(cw / 2, ch / 2, cw, ch, 0x000000, 0.6).setDepth(0);

        // Panel
        const panelW = Math.min(600, cw - 80);
        const panelH = Math.min(380, ch - 120);
        const panelX = cw / 2;
        const panelY = ch / 2;

        const panel = this.add.rectangle(panelX, panelY, panelW, panelH, 0x1e1e2f, 0.98)
            .setStrokeStyle(2, 0xffffff);

        // Title / description
        this.add.text(panelX - panelW / 2 + 24, panelY - panelH / 2 + 24, description, {
            fontSize: "20px",
            color: "#ffffff",
            wordWrap: { width: panelW - 48 }
        });

        // Input label
        this.add.text(panelX - panelW / 2 + 40, panelY - 60, "Votre réponse :", { fontSize: "16px", color: "#cccccc" });

        // Get the game container to position input correctly
        const gameContainer = document.getElementById('game-content');
        const gameRect = gameContainer?.getBoundingClientRect() || { left: 0, top: 0 };

        // Calculate input position: panel left + padding, panel top + input y offset
        const inputLeftPx = gameRect.left + (panelX - panelW / 2 + 40);
        const inputTopPx = gameRect.top + (panelY - 20);

        // Input field (text box using DOM input)
        const inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.placeholder = "Entrez votre réponse...";
        inputElement.style.position = "fixed";
        inputElement.style.left = inputLeftPx + "px";
        inputElement.style.top = inputTopPx + "px";
        inputElement.style.width = (panelW - 80) + "px";
        inputElement.style.height = "40px";
        inputElement.style.padding = "8px 12px";
        inputElement.style.fontSize = "16px";
        inputElement.style.backgroundColor = "#2b2b3f";
        inputElement.style.color = "#ffffff";
        inputElement.style.border = "2px solid #ffffff";
        inputElement.style.boxSizing = "border-box";
        inputElement.style.zIndex = "1000";
        inputElement.style.fontFamily = "Arial, sans-serif";
        document.body.appendChild(inputElement);

        this.inputField = inputElement;

        // Submit button
        const submitBtn = this.add.rectangle(panelX, panelY + 80, panelW - 80, 44, 0x2b7f2b)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        const submitText = this.add.text(panelX, panelY + 80, "Soumettre", { fontSize: "18px", color: "#ffffff" })
            .setOrigin(0.5);

        submitBtn.on('pointerover', () => submitBtn.setFillStyle(0x3f9f3f));
        submitBtn.on('pointerout', () => submitBtn.setFillStyle(0x2b7f2b));
        submitBtn.on('pointerdown', () => this.submitAnswer());

        this.submitButton = submitBtn;

        // Allow Enter key to submit, block F key
        inputElement.addEventListener('keypress', (e: any) => {
            if (e.key === 'Enter') this.submitAnswer();
            // Allow typing F in the input (prevent game interaction)
        });

        inputElement.addEventListener('keydown', (e: any) => {
            // Prevent F key from triggering game interactions when input is focused
            if (e.key.toLowerCase() === 'f' || e.key === 'F') {
                e.stopPropagation();
            }
        });

        // Add instruction
        this.add.text(panelX - panelW / 2 + 24, panelY + panelH / 2 - 40, "Entrez votre réponse et cliquez sur Soumettre", { fontSize: "14px", color: "#cccccc" });

        // Focus input
        inputElement.focus();
    }

    submitAnswer() {
        const userAnswer = this.inputField.value.trim();

        if (!userAnswer) {
            // Show error for empty input
            const cw = this.scale.width;
            const msg = this.add.text(cw / 2, this.scale.height - 80, "Veuillez entrer une réponse", { fontSize: "16px", color: "#ff4444" })
                .setOrigin(0.5)
                .setDepth(2);
            this.time.delayedCall(1400, () => msg.destroy(), [], this);
            return;
        }

        // Disable submit button briefly
        this.submitButton.disableInteractive && this.submitButton.disableInteractive();

        // Use QuestManager to complete the current quest with the user's answer
        const ok = QuestManager.completeCurrent(userAnswer);

        if (ok) {
            // Show success message
            const cw = this.scale.width;
            const ch = this.scale.height;
            const msg = this.add.text(cw / 2, ch / 2 + 120, "Bonne réponse ! Énigme résolue.", { fontSize: "20px", color: "#88ff88" })
                .setOrigin(0.5)
                .setDepth(2);

            // Disable input field
            this.inputField.disabled = true;
            this.submitButton.setFillStyle && this.submitButton.setFillStyle(0x1f7f1f);

            // Return to GameScene after a short delay
            this.time.delayedCall(1000, () => {
                const game = this.scene.get("Game") as any;
                game.completeQuest(true, this.quest.id);

                // Clean up input BEFORE stopping scene
                this.cleanupInput();

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

            // Re-enable submit button and clear input
            this.time.delayedCall(600, () => {
                this.submitButton.setInteractive && this.submitButton.setInteractive({ useHandCursor: true });
                this.inputField.value = "";
                this.inputField.focus();
            }, [], this);
        }
    }

    cleanupInput() {
        if (this.inputField) {
            if (this.inputField.parentNode) {
                this.inputField.parentNode.removeChild(this.inputField);
            }
            this.inputField = null;
        }
    }

    shutdown() {
        // Clean up DOM input element on scene shutdown
        this.cleanupInput();
    }
}
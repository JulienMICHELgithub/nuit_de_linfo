import { Scene } from "phaser";
import { QuestManager } from "../quests/QuestManager";

export default class QCMScene extends Scene {
    quest: any;

    constructor() {
        super("QCMScene");
    }

    init(data: any) {
        this.quest = QuestManager.get(data.questId);
    }

    create() {
        const { question, answers } = this.quest;

        let y = 150;

        this.add.text(100, 50, question, { fontSize: "24px", color: "#ffffff" });

        answers.forEach((a: string, i: number) => {
            const txt = this.add.text(100, y, `${i + 1} - ${a}`, { fontSize: "20px" })
                .setInteractive()
                .on("pointerdown", () => this.answer(i));

            y += 50;
        });
    }

    answer(index: number) {
        const ok = this.quest.complete(index);

        QuestManager.completeCurrent(ok);

        // retour à GameScene
        const game = this.scene.get("Game") as any;
        game.completeQuest(ok);

        this.scene.stop();
        this.scene.resume("Game");
    }
}

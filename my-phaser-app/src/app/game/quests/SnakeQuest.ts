import { QuestBase } from "./QuestManager";


type SnakeQuestOptions = Omit<QuestBase, "type">;

export class SnakeQuest implements QuestBase {
    id: string;
    type: "snake" = "snake";
    title: string;
    description: string;
    reward?: string | number;

    constructor(opts: SnakeQuestOptions) {
        this.id = opts.id;
        this.title = opts.title;
        this.description = opts.description;
        this.reward = opts.reward;
    }

    start() {
        console.log(`Snake: ${this.description}`);
    }

    complete(data?: { itemsCollected?: number }) {
        const ok = data?.itemsCollected && data.itemsCollected >= 5;
        console.log(ok ? "Bravo, tu as terminé le Snake !" : "Pas assez d'items...");
        return !!ok;
    }
}
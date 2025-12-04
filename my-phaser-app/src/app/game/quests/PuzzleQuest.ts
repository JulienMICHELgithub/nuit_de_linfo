import { QuestBase } from "./QuestManager";

type PuzzleQuestOptions = Omit<QuestBase, "type">;

export class PuzzleQuest implements QuestBase {
    id: string;
    type: "puzzle" = "puzzle";
    title: string;
    description: string;
    reward?: string | number;

    constructor(opts: PuzzleQuestOptions) {
        this.id = opts.id;
        this.title = opts.title;
        this.description = opts.description;
        this.reward = opts.reward;
    }

    start() {
        console.log(`Puzzle: ${this.description}`);
    }

    complete(data?: any) {
        console.log("Puzzle résolu !");
        return true;
    }
}

import { QuestBase } from "./QuestManager";

type EnigmeQuestOptions = Omit<QuestBase, "type"> & {
    answer: string;
};

export class EnigmeQuest implements QuestBase {
    id: string;
    type: "enigme" = "enigme";
    title: string;
    description: string;
    reward?: string | number;

    answer: string;

    constructor(opts: EnigmeQuestOptions) {
        this.id = opts.id;
        this.title = opts.title;
        this.description = opts.description;
        this.reward = opts.reward;
        this.answer = opts.answer;
    }

    start() {
        console.log(`Énigme: ${this.description}`);
    }

    complete(response: string) {
        const ok = response.toLowerCase() === this.answer.toLowerCase();
        console.log(ok ? "Correct !" : "Incorrect...");
        return ok;
    }
}
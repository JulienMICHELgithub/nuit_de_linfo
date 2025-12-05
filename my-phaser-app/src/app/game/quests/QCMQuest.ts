import { QuestBase } from "./QuestManager";

type QCMQuestOptions = Omit<QuestBase, "type"> & {
    question: string;
    answers: string[];
    correct: number;
};

export class QCMQuest implements QuestBase {
    id: string;
    type: "qcm" = "qcm";
    title: string;
    description: string;
    reward?: string | number;

    question: string;
    answers: string[];
    correct: number;

    constructor(opts: QCMQuestOptions) {
        this.id = opts.id;
        this.title = opts.title;
        this.description = opts.description;
        this.reward = opts.reward;
        this.question = opts.question;
        this.answers = opts.answers;
        this.correct = opts.correct;
    }

    start() {
        console.log(`QCM: ${this.question}`);
        this.answers.forEach((a, i) => console.log(`${i}: ${a}`));
    }

    complete(answerIndex: number) {
        const ok = answerIndex === this.correct;
        console.log(ok ? "Bonne réponse !" : "Mauvaise réponse...");
        return ok;
    }
}

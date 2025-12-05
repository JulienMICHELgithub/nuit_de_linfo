// QuestManager.ts
import { QCMQuest } from "./QCMQuest";
import { EnigmeQuest } from "./EnigmeQuest";
import { PuzzleQuest } from "./PuzzleQuest";
import { SnakeQuest } from "./SnakeQuest";

// Types de quêtes
export type QuestType = "qcm" | "enigme" | "puzzle" | "snake";

export type QuestBase = {
    id: string;
    type: QuestType;
    title: string;
    description: string;
    reward?: string | number;
};

// Interface commune avec méthodes
export interface Quest extends QuestBase {
    start(): void;
    complete(data?: any): boolean;
}

export class QuestManager {
    static totalScore: number = 0;
    
    // Toutes les quêtes sont de type Quest
    static quests: Record<string, Quest> = {
        qcm1: new QCMQuest({
            id: "qcm1",
            title: "*Choisis l'alternative!*",
            description: "Quelle alternative respecte ta vie privée ?",
            reward: 50,
            question: "quelle messagerie respecte ta vie privée ?",
            answers: ["Gmail", "ProtonMail"],
            correct: 1
        }),

        enigme1: new EnigmeQuest({
            id: "enigme1",
            title: "*Résous l'énigme*",
            description: "Trouve le mot de passe secret",
            reward: 100,
            answer: "cypher"
        }),

        puzzle1: new PuzzleQuest({
            id: "puzzle1",
            title: "*Mini-puzzle*",
            description: "Résous le puzzle pour continuer",
            reward: 150
        }),

        snake1: new SnakeQuest({
            id: "snake1",
            title: "*Mini-Snake*",
            description: "Attrape 5 items avec le serpent",
            reward: 200
        })
    };

    static current?: Quest;

    static startQuest(id: string) {
        const quest = this.quests[id];
        if (!quest) throw new Error("Quête inexistante : " + id);
        this.current = quest;

        // Dialog dispatching removed - quest scenes handle their own UI
        quest.start();
    }

    static get(id: string) {
        return this.quests[id];
    }

    static completeCurrent(data?: any): { success: boolean; totalScore: number } {
        if (!this.current) return { success: false, totalScore: this.totalScore };
        const id = this.current.id;
        const ok = this.current.complete(data);
        if (ok) {
            const reward = typeof this.current.reward === 'number' ? this.current.reward : 0;
            this.totalScore += reward;
            console.log("Quête réussie ! Récompense :", reward, "Score total:", this.totalScore);
            // Remove quest so it cannot be retried
            delete this.quests[id];
            this.current = undefined;
        }
        return { success: ok, totalScore: this.totalScore };
    }
}


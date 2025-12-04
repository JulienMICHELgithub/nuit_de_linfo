"use client"

import * as Phaser from 'phaser';
import MainMenuScene from '@/app/game/scenes/MainMenu';
import GameScene from '@/app/game/scenes/Game';
import React, { useRef, useEffect } from 'react';
import QCMScene from "./scenes/QCMScene";

export default function GamePage() {
    const gameRef = useRef<any>(null);

    useEffect(() => {
        if (gameRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-content',
            physics: {
                default: 'arcade',
                arcade: { gravity: { y: 0 }, debug: false }
            },
            scene: [MainMenuScene, GameScene, QCMScene] // <-- MainMenu en premier
        };

        gameRef.current = new Phaser.Game(config);

        return () => {
            gameRef.current.destroy(true);
            gameRef.current = null;
        };
    }, []);

    return <div id="game-content" className="w-full h-screen" />;
}



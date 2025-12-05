"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react';
import DialogBox from '@/components/DialogBox';

const characterName = 'Hero';

export default function GamePage() {
    const gameRef = useRef<any>(null);

    useEffect(() => {
        if (gameRef.current) return;

        const Phaser = require('phaser');
        const PreloaderScene = require('@/app/game/scenes/Preloader').default;
        const MainMenuScene = require('@/app/game/scenes/MainMenu').default;
        const GameScene = require('@/app/game/scenes/Game').default;
        const QCMScene = require('@/app/game/scenes/QCMScene').default;
        const EnigmeScene = require('@/app/game/scenes/EnigmeScene').default;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 920,
            height: 600,
            parent: 'game-content',
            physics: {
                default: 'arcade',
                arcade: { gravity: { y: 0 }, debug: false }
            },
            scene: [PreloaderScene, MainMenuScene, GameScene, QCMScene, EnigmeScene] // Preloader must be first
        };

        gameRef.current = new Phaser.Game(config);

        return () => {
            gameRef.current.destroy(true);
            gameRef.current = null;
        };
    }, []);

    const [message, setMessage] = useState('');
    const [showDialogBox, setShowDialogBox] = useState(false);

    useEffect(() => {
        const dialogBoxEventListener = ({ detail }) => {
            setMessage(detail.message);
            setShowDialogBox(true);
        };
        window.addEventListener('start-dialog', dialogBoxEventListener);

        return () => {
            window.removeEventListener('start-dialog', dialogBoxEventListener);
        };
    });

    const handleMessageIsDone = useCallback(() => {
        const customEvent = new CustomEvent('end-dialog');
        window.dispatchEvent(customEvent);

        setMessage('');
        setShowDialogBox(false);
    }, [characterName]);

    return (
    <div className='flex items-center justify-center h-screen w-screen bg-black'>
        {showDialogBox && (
                <DialogBox
                    message={message}
                    onDone={handleMessageIsDone}
                />
        )}
        <div id="game-content" className="flex items-center justify-center" />
    </div>);
}



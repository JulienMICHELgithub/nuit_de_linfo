'use client';

import React, { useEffect, useRef } from 'react';

export default function Page() {
    const gameRef = useRef<any>(null);

    useEffect(() => {
        const initGame = async () => {
            const Phaser = await import('phaser');
            
            if (gameRef.current) return; // Prevent duplicate initialization

            gameRef.current = new Phaser.Game({
                type: Phaser.AUTO,
                width: 1920,
                height: 1080,
                scene: {
                    preload: function () {
                        this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
                    },
                    create: function () {
                        this.add.image(960, 540, 'sky');
                    }
                },
                parent: 'game-content',
            });
        };

        initGame();

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div id="game-content" />
            <div className="w-full max-w-sm">
            </div>
        </div>
    );
}
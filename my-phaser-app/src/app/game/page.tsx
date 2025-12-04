'use client';
import React, { useEffect, useRef } from 'react';
import { QuestManager } from './quests/QuestManager';

export default function Page() {
    const gameRef = useRef<any>(null);

    useEffect(() => {
        const initGame = async () => {
            const Phaser = await import('phaser');

            if (gameRef.current) return;

            gameRef.current = new Phaser.Game({
                type: Phaser.AUTO,
                width: 800,
                height: 600,
                parent: 'game-content',
                physics: { default: 'arcade' },
                scene: {
                    preload: function () {
                        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
                        this.load.image('item', 'https://labs.phaser.io/assets/sprites/apple.png');
                    },
                    create: function () {
                        // Lancer la quête Snake
                        QuestManager.startQuest('snake1');

                        this.player = this.physics.add.sprite(400, 300, 'player');
                        this.itemsCollected = 0;

                        this.item = this.physics.add.sprite(
                            Phaser.Math.Between(50, 750),
                            Phaser.Math.Between(50, 550),
                            'item'
                        );

                        this.physics.add.overlap(this.player, this.item, () => {
                            this.itemsCollected++;
                            this.item.x = Phaser.Math.Between(50, 750);
                            this.item.y = Phaser.Math.Between(50, 550);

                            if (this.itemsCollected >= 5) {
                                QuestManager.completeCurrent({ itemsCollected: this.itemsCollected });
                            }
                        });

                        this.cursors = this.input.keyboard.createCursorKeys();
                    },
                    update: function () {
                        const speed = 200;
                        this.player.setVelocity(0);

                        if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
                        if (this.cursors.right.isDown) this.player.setVelocityX(speed);
                        if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
                        if (this.cursors.down.isDown) this.player.setVelocityY(speed);
                    }
                }
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

    return <div id="game-content" className="w-full h-[600px] border" />;
}

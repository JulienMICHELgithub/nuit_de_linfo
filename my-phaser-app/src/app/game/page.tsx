'use client';

import { useRef } from 'react';
import { PhaserGame, type IRefPhaserGame } from '@/components/PhaserGame';

export default function GamePage() {
    const phaserRef = useRef<IRefPhaserGame>(null);

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

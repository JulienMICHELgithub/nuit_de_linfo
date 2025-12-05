'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Spline from '@splinetool/react-spline';
import { Button } from '@/components/ui/button';

export default function Home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [hideLoader, setHideLoader] = useState(false);

    return (
        <div className="w-screen h-screen overflow-hidden bg-black relative pt-20">
            {!hideLoader && (
                <div
                    className={`fixed inset-0 z-50 bg-black transition-opacity duration-700 ${
                        isLoading ? 'opacity-100' : 'opacity-0'
                    }`}
                    onTransitionEnd={() => {
                        if (!isLoading) setHideLoader(true);
                    }}
                >
                    <Spline
                        scene="https://prod.spline.design/mhOwjmZfVTs4gG3i/scene.splinecode"
                        onLoad={() => {
                            // laisse le temps à ta timeline de se jouer
                            setTimeout(() => setIsLoading(false), 4000);
                        }}
                    />
                </div>
            )}

            {/* Contenu de ta page */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-[5]">
                <div className="text-center max-w-md px-4">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 drop-shadow-2xl leading-tight">
                        Ready to beat gafam
                    </h1>
                </div>

                <Button
                    size="lg"
                    className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white font-bold text-lg px-8 py-6 shadow-2xl hover:shadow-white/20 transition-all duration-300"
                    onClick={() => router.push('/game')}
                >
                    Play now
                </Button>
            </div>
        </div>
    );
}

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Home() {
    const router = useRouter();

    return (
        <div className="w-screen h-screen overflow-hidden bg-black relative pt-20">
            <script
                type="module"
                src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js"
            />
            <spline-viewer
                url="https://prod.spline.design/p9wS7jduVQ6UExfW/scene.splinecode"
                style={{
                    width: '100vw',
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                }}
                className="!w-full !h-full scale-[2] origin-center"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center z-[5] pointer-events-none">
                <div className="text-center max-w-md px-4 pointer-events-none">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 drop-shadow-2xl leading-tight">
                        Ready to beat gafa
                    </h1>
                </div>

                <Button
                    size="lg"
                    className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white font-bold text-lg px-8 py-6 shadow-2xl hover:shadow-white/20 transition-all duration-300 pointer-events-auto"
                    onClick={() => router.push('/game')}
                >
                    Play now
                </Button>
            </div>
        </div>
    );
}

'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SplineLoader from '@splinetool/loader';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';

function SplineScene() {
    const root = useRef<THREE.Group>(null);
    const inner = useRef<THREE.Group>(null);

    useEffect(() => {
        const loader = new SplineLoader();
        loader.load(
            'https://prod.spline.design/duThNPVljsLGcBdZ/scene.splinecode',
            (scene) => {
                if (!inner.current) return;
                inner.current.add(scene);

                // recentrer grossièrement le contenu si besoin
                // adapte ces valeurs après quelques tests
                inner.current.position.set(-200, -100, 0);
            }
        );
    }, []);

    useFrame(() => {
        if (root.current) {
            root.current.rotation.y += 0.01; // rotation du group parent centré
        }
    });

    return (
        <group ref={root}>
            <group ref={inner} />
        </group>
    );
}

export default function LogoSpline3D() {
    return (
        <div className="h-10 w-24">
            <Canvas camera={{ position: [0, 0, 250], fov: 35 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[2, 4, 5]} intensity={1.2} />
                <SplineScene />
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    );
}

// src/components/navbar-components/LogoThree3D.tsx
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SplineLoader from '@splinetool/loader'; // Même loader que LogoSpline3D
import * as THREE from 'three';
import { useEffect, useRef } from 'react';

function SplineLogoScene() { // Renommé pour clarté
    const root = useRef<THREE.Group>(null);
    const inner = useRef<THREE.Group>(null);

    useEffect(() => {
        const loader = new SplineLoader();
        loader.load(
            'https://prod.spline.design/duThNPVljsLGcBdZ/scene.splinecode', // TON URL Spline
            (scene) => {
                if (!inner.current) return;
                inner.current.add(scene);
                inner.current.position.set(-200, -100, 0); // Même position que LogoSpline3D
            }
        );
    }, []);

    useFrame(() => {
        if (root.current) {
            root.current.rotation.y += 0.01;
        }
    });

    return (
        <group ref={root}>
            <group ref={inner} />
        </group>
    );
}

export default function LogoThree3D() {
    return (
        <div className="h-16 w-32 md:h-50 md:w-100">
            <Canvas camera={{ position: [0, 0, 350], fov: 35 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[2, 4, 5]} intensity={1.2} />
                <SplineLogoScene />
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    );
}

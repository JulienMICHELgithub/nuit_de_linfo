"use client"

import LogoThree3D from "@/components/navbar-components/LogoThree3D";
import serverDev01 from "@/../public/developers/01.jpg"
import mobilDev from "../../../public/developers/04.png"
import webDev from "../../../public/developers/03.png"
import serverDev02 from "../../../public/developers/02.png"

import PixelTransition from '@/components/PixelTransition';

export default function Page() {
    return (
        <main className="bg-black relative pt-20 text-white">
            <section className="grid md:grid-cols-2 items-center gap-8">
                <div className="py-5 flex justify-center">
                    <LogoThree3D /> {/* ← REMPLACE Image */}
                </div>

                <div>
                    <br />
                    <br />
                    <br />
                    <p className="max-w-lg">
                        OpenIt a pour ambition de rendre l’apprentissage de l’indépendance numérique ludique, accessible et captivant. Le projet prend la forme d’un jeu de rôle sur le web, où les joueurs progressent dans un univers interactif en accomplissant des quêtes et en relevant des quiz thématiques. À travers ces défis, ils découvrent comment réduire leur dépendance aux géants du numérique les GAFAM et adopter des alternatives libres, éthiques et ouvertes.
                    </p>
                    <br />
                    <p className="max-w-lg">
                        Chaque mission du jeu invite le joueur à explorer des outils et services issus du monde open source, à comprendre leur fonctionnement et à les comparer à leurs équivalents propriétaires. L’expérience repose autant sur la curiosité que sur la pratique : progresser dans l’aventure, c’est aussi gagner en autonomie numérique. Les décisions prises, les bonnes réponses données ou les choix de logiciels effectués influencent directement la progression du personnage et le développement de son village numérique.
                    </p>
                    <br />
                    <p className="max-w-lg">
                        L’objectif est d’offrir une expérience didactique gamifiée, à mi-chemin entre le jeu d’apprentissage et le parcours initiatique. L’univers visuel et narratif du RPG sert de fil conducteur à une pédagogie immersive : chaque interaction devient un apprentissage concret vers une culture numérique plus responsable et décentralisée. À travers ce projet, LibreQuest aspire à construire une nouvelle façon d’apprendre le numérique — libre, communautaire et ouverte à tous.
                    </p>
                </div>

            </section>
            <section className="py-8 grid md:grid-cols-5 gap-4">
                <PixelTransition
                    firstContent={
                        <img
                            src={serverDev01.src}
                            alt="default pixel transition content, a cat!"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                    secondContent={
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "grid",
                                placeItems: "center",
                                backgroundColor: "#111"
                            }}
                        >
                            <p style={{ fontWeight: 900, fontSize: "2rem", color: "#ffffff" }}>Backend Developer</p>
                        </div>
                    }
                    gridSize={12}
                    pixelColor='#ffffff'
                    animationStepDuration={0.4}
                    className="custom-pixel-card"
                />

                <PixelTransition
                    firstContent={
                        <img
                            src={mobilDev.src}
                            alt="default pixel transition content, a cat!"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                    secondContent={
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "grid",
                                placeItems: "center",
                                backgroundColor: "#111"
                            }}
                        >
                            <p style={{ fontWeight: 900, fontSize: "2rem", color: "#ffffff" }}>Web Developer</p>
                        </div>
                    }
                    gridSize={12}
                    pixelColor='#ffffff'
                    animationStepDuration={0.4}
                    className="custom-pixel-card"
                />

                <PixelTransition
                    firstContent={
                        <img
                            src={webDev.src}
                            alt="default pixel transition content, a cat!"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                    secondContent={
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "grid",
                                placeItems: "center",
                                backgroundColor: "#111"
                            }}
                        >
                            <p  style={{ fontWeight: 900, fontSize: "2rem", color: "#ffffff" }}>Web Developer</p>
                        </div>
                    }
                    gridSize={12}
                    pixelColor='#ffffff'
                    animationStepDuration={0.4}
                    className="custom-pixel-card"
                />

                <PixelTransition
                    firstContent={
                        <img
                            src={serverDev02.src}
                            alt="default pixel transition content, a cat!"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                    secondContent={
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "grid",
                                placeItems: "center",
                                backgroundColor: "#111"
                            }}
                        >
                            <p style={{ fontWeight: 900, fontSize: "2rem", color: "#ffffff" }}>Backend Developer</p>
                        </div>
                    }
                    gridSize={12}
                    pixelColor='#ffffff'
                    animationStepDuration={0.4}
                    className="custom-pixel-card"
                />
            </section>
        </main>
    );
}


'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const COLORS = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Yellow', value: '#eab308' },
];

function getRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export default function NotFound() {
    const [targetColor, setTargetColor] = useState(getRandomColor());
    const [options, setOptions] = useState(shuffleColors(targetColor));
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isInputLocked, setIsInputLocked] = useState(false);

    const correctSound = useRef<HTMLAudioElement | null>(null);
    const wrongSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        correctSound.current = new Audio('/sounds/correct.mp3');
        wrongSound.current = new Audio('/sounds/wrong.mp3');
    }, []);

    function shuffleColors(correct: { name: string; value: string }) {
        const shuffled = [...COLORS].sort(() => 0.5 - Math.random()).slice(0, 4);
        if (!shuffled.includes(correct)) {
            shuffled[Math.floor(Math.random() * 4)] = correct;
        }
        return shuffled;
    }

    function newRound() {
        const newColor = getRandomColor();
        setTargetColor(newColor);
        setOptions(shuffleColors(newColor));
    }

    const handleChoice = (name: string) => {
        if (gameOver || isInputLocked) return;
        setIsInputLocked(true);

        if (name === targetColor.name) {
            correctSound.current?.play();
            setScore((s) => s + 1);
            setTimeout(() => {
                newRound();
                setIsInputLocked(false);
            }, 1000);
        } else {
            wrongSound.current?.play();
            setGameOver(true);
            setIsInputLocked(false);
        }
    };

    const resetGame = () => {
        setScore(0);
        setGameOver(false);
        newRound();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 px-4 flex flex-col md:flex-row items-center justify-center">
            <div className="text-center max-w-md w-full p-12 rounded-xl bg-gray-800 border border-gray-700 shadow-2xl animate-fadeInUp mb-8 md:mb-0 md:mr-10">
                <h1 className="text-6xl md:text-7xl font-extrabold text-blue-400 mb-4 drop-shadow">404</h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">Not Found</h2>
                <p className="text-gray-400 mb-6 text-lg">
                    Oops! Looks like you have ventured into uncharted territory.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 rounded-full text-white font-semibold bg-blue-500 hover:bg-blue-600 transition"
                >
                    Back to Homepage
                </Link>
            </div>

            <div className="w-full max-w-2xs p-6 rounded-xl bg-gray-800 border border-gray-700 shadow-2xl animate-fadeInUp text-center">
                {!gameOver ? (
                    <>
                        <p className="mb-4 text-gray-300">
                            Tap the color: <span className="font-bold text-blue-400">{targetColor.name}</span>
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {options.map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => handleChoice(color.name)}
                                    className="w-full aspect-square rounded-lg focus:outline-none"
                                    style={{ backgroundColor: color.value }}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-400">Score: {score}</p>
                    </>
                ) : (
                    <div>
                        <p className="text-lg text-red-400 font-bold mb-4">Game Over!</p>
                        <p className="text-sm text-gray-400 mb-4">Final Score: {score}</p>
                        <button
                            onClick={resetGame}
                            className="px-6 py-3 bg-blue-500 rounded-full text-white font-semibold hover:bg-blue-600 transition mx-auto"
                        >
                            Play Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

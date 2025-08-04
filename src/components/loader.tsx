import React from 'react';

interface LiquidMorphLoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'cyan' | 'blue' | 'purple' | 'pink' | 'green';
    speed?: 'slow' | 'normal' | 'fast';
    className?: string;
}

const LiquidMorphLoader: React.FC<LiquidMorphLoaderProps> = ({
    size = 'md',
    color = 'cyan',
    speed = 'normal',
    className = '',
    }) => {
    // Size configurations
    const sizeConfig = {
        sm: { dotSize: 'w-1 h-1', spacing: 15, container: 'w-8' },
        md: { dotSize: 'w-2 h-2', spacing: 20, container: 'w-16' },
        lg: { dotSize: 'w-3 h-3', spacing: 25, container: 'w-20' },
        xl: { dotSize: 'w-4 h-4', spacing: 30, container: 'w-24' },
    };

    // Color configurations
    const colorConfig = {
        cyan: { bg: 'bg-cyan-400', color: '#22d3ee' },
        blue: { bg: 'bg-blue-400', color: '#3b82f6' },
        purple: { bg: 'bg-purple-400', color: '#a855f7' },
        pink: { bg: 'bg-pink-400', color: '#ec4899' },
        green: { bg: 'bg-emerald-400', color: '#10b981' },
    };

    // Speed configurations
    const speedConfig = {
        slow: '2s',
        normal: '1.5s',
        fast: '1s',
    };

    const { dotSize, spacing, container } = sizeConfig[size];
    const { bg, color: glowColor } = colorConfig[color];
    const animationDuration = speedConfig[speed];

    return (
        <>
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`relative ${container}`}>
            {[0, 1, 2, 3, 4].map((i) => (
                <div
                key={i}
                className={`absolute ${dotSize} ${bg} rounded-full liquid-morph-dot-${i}`}
                style={{
                    left: `${i * spacing}px`,
                    animationDuration,
                    animationDelay: `${i * 0.2}s`,
                }}
                />
            ))}
            </div>
        </div>

        <style jsx>{`
            .liquid-morph-dot-0,
            .liquid-morph-dot-1,
            .liquid-morph-dot-2,
            .liquid-morph-dot-3,
            .liquid-morph-dot-4 {
            animation: liquidWaveNeon ${animationDuration} ease-in-out infinite;
            }

            .liquid-morph-dot-0 { animation-delay: 0s; }
            .liquid-morph-dot-1 { animation-delay: 0.2s; }
            .liquid-morph-dot-2 { animation-delay: 0.4s; }
            .liquid-morph-dot-3 { animation-delay: 0.6s; }
            .liquid-morph-dot-4 { animation-delay: 0.8s; }

            @keyframes liquidWaveNeon {
            0%, 100% {
                transform: translateY(0) scale(1);
                opacity: 0.4;
                box-shadow: 
                0 0 10px ${glowColor}, 
                0 0 20px ${glowColor}, 
                0 0 30px ${glowColor};
            }
            50% {
                transform: translateY(-20px) scale(1.3);
                opacity: 1;
                box-shadow: 
                0 0 30px ${glowColor}, 
                0 0 60px ${glowColor}, 
                0 0 90px ${glowColor}, 
                0 0 120px ${glowColor};
            }
            }
        `}</style>
        </>
    );
};

export default LiquidMorphLoader;
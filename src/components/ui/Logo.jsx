import React from 'react';

const Logo = ({ className = "h-8", variant = "default", iconOnly = false }) => {
    // Colors from the brand image
    const blueColor = "#00609C"; // Oxycare blue
    const greenColor = "#2EB67D"; // Labs green/teal
    
    // For dark backgrounds, we might want light text
    const textColor1 = variant === "light" ? "#FFFFFF" : blueColor;
    const textColor2 = variant === "light" ? "#FFFFFF" : greenColor;

    return (
        <div className={`flex items-center gap-2 lg:gap-3 select-none ${className}`}>
            {/* Heart Icon with Cross Notch */}
            <svg 
                viewBox="0 0 100 100" 
                className="h-full w-auto drop-shadow-sm"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Main Heart Shape with Cross Notch */}
                <path 
                    d="M50 88L44.5 83C25 65.4 12 53.6 12 39.4C12 27.9 21 18.9 32.5 18.9C39 18.9 45.2 21.9 49.3 26.6H50.7C54.8 21.9 61 18.9 67.5 18.9C79 18.9 88 27.9 88 39.4C88 53.6 75 65.4 55.5 83L50 88Z" 
                    fill={greenColor} 
                />
                
                {/* Blue Inner Curve for the notch styling */}
                <path 
                    d="M50 45C50 45 40 50 35 60C30 70 45 85 50 88C55 85 70 70 65 60C60 50 50 45 50 45Z" 
                    fill={blueColor}
                    opacity="0.8"
                />

                {/* Medical Cross (Cut-out effect using white or background color) */}
                <path 
                    d="M42 42h16v16H42z M48 36h4v28h-4z M36 48h28v4H36z" 
                    fill="#FFFFFF" 
                />
            </svg>

            {!iconOnly && (
                <div className="flex items-baseline font-black tracking-tight leading-none overflow-hidden">
                    <span style={{ color: textColor1 }} className="text-xl lg:text-3xl">Oxycare</span>
                    <span style={{ color: textColor2 }} className="text-xl lg:text-3xl ml-1">Labs</span>
                </div>
            )}
        </div>
    );
};

export default Logo;

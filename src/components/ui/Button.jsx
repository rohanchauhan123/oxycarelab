import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    size = 'md',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-medical-green text-white hover:bg-medical-green-hover shadow-sm hover:shadow-md",
        secondary: "bg-soft-green text-medical-green hover:opacity-80",
        outline: "border-2 border-medical-green text-medical-green hover:bg-soft-green",
        ghost: "text-medical-green hover:bg-soft-green",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm rounded-md",
        md: "px-6 py-2.5 text-base rounded-lg",
        lg: "px-8 py-3.5 text-lg rounded-xl",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

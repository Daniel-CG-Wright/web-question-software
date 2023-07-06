"use client"
// base button used in theme.

interface BaseButtonProps {
    text: string;
    onClick: () => void;
    className?: string;
}

const BaseButton: React.FC<BaseButtonProps> = ({
    text,
    onClick,
    className = "",
}) => {
    return (
        <button
            className={`
            ${className}
            bg-blue-500
            hover:bg-blue-700
            text-white
            font-bold
            py-2
            px-4
            rounded
            `}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default BaseButton;

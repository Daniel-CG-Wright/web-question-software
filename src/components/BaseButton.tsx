"use client"
// base button used in theme.

interface BaseButtonProps {
    text: string;
    onClick: () => void;
    className?: string;
    enabled?: boolean;
}

const BaseButton: React.FC<BaseButtonProps> = ({
    text,
    onClick,
    className = "",
    enabled = true,
}) => {
    return (
        <button
            className={`
            ${className}
            bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                !enabled ? 'opacity-50 cursor-not-allowed hover:bg-blue-500' : ''
              }`}
            onClick={onClick}
            disabled={!enabled}
        >
            {text}
        </button>
    );
}

export default BaseButton;

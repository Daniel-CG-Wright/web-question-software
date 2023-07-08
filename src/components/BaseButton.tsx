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
            basebutton
              `}
            onClick={onClick}
            disabled={!enabled}
        >
            {text}
        </button>
    );
}

export default BaseButton;

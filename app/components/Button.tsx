interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
}
export const Button = ({
    children,
    className,
    onClick,
    disabled,
}: ButtonProps) => {
    const buttonClasses = `${className} rounded-full px-6 py-1 ${
        disabled && "opacity-30"
    } backdrop-blur-md text-sm max-tablet:text-sm`;

    return (
        <button
            className={`${buttonClasses}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

import { useMouse } from "../utils/helper";
interface MouseMoveProps {
    isSpeeking?: boolean;
    text?: string;
}

export default function MouseMoveContainer({
    isSpeeking,
    text,
}: MouseMoveProps) {
    const { x, y } = useMouse();
    const cursorStyle = {
        top: `${y}px`,
        left: `${x}px`,
        transform: "translate(-50%, -50%)",
        zIndex: 99999,
    };
    return (
        <div className="absolute max-tablet:hidden" style={cursorStyle}>
            {text ? (
                <p className="text-black w-[200px] leading-tight text-[13px] font-[arial] font-thin bg-[#ffffff72] py-2 px-2 opacity-100 backdrop-blur-md rounded-xl">
                    {text}
                </p>
            ) : (
                <svg
                    className={`${isSpeeking && "dotAnimation"}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                >
                    <circle
                        cx="10"
                        cy="10"
                        r="5"
                        fill={`${isSpeeking ? "red" : "white"}`}
                        strokeWidth="0"
                    />
                </svg>
            )}
        </div>
    );
}

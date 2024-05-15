import { useRef, useEffect, useState } from "react";

interface NavButtonEntryProps {
    numImages: number;
    activeIndex: number;
    handleScrollToIndex: (index: number) => void;
}

const NavigationButtons = ({
    numImages,
    activeIndex,
    handleScrollToIndex,
}: NavButtonEntryProps) => {
    const [properties, setProperties] = useState("");
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const navElement = navRef.current;
        const buttonWidth = (navElement?.children[activeIndex] as HTMLElement)
            ?.offsetWidth;
        const ratioX = activeIndex * buttonWidth + 15;
        if (activeIndex >= 0) {
            setProperties(`translateX(-${ratioX}px)`);
        }
    }, [activeIndex]);

    return (
        <header className="fixed top-0 h-10 left-[15%] w-[70%] overflow-hidden">
            <nav
                className="relative left-[50%] top-3 z-10 flex flex-nowrap transition-transform duration-[.25s] ease-in-out"
                ref={navRef}
                style={{
                    transform: properties,
                }}
            >
                {Array.from({ length: numImages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            handleScrollToIndex(index);
                        }}
                        className={`w-[30px] px-[15px] text-white ${
                            activeIndex === index ? "opacity-100" : "opacity-50"
                        } hover:opacity-100 text-sm`}
                    >
                        ●
                    </button>
                ))}
            </nav>
        </header>
    );
};

export default NavigationButtons;

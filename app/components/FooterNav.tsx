import { Button } from "./Button";
import { AssistantRes, ProjectData } from "../../types";

interface FooterNavEntryProps {
    activeIndex: number;
    loadingSpeech: boolean;
    startingSpeech: boolean;
    activeItem: number | null;
    showPlayButton: boolean;
    assistantResponse: AssistantRes[];
    projectData: ProjectData[];
    audioElRef: React.RefObject<HTMLAudioElement>;
    isMute: boolean;
    setShowPlayButton: (show: boolean) => void;
    setStartingSpeech: (start: boolean) => void;
    setActiveItem: (index: number | null) => void;
    toggleMute: () => void;
    setShowAbout: (active: boolean) => void;
    setShowImageGallery: (
        value: boolean | ((prevState: boolean) => boolean)
    ) => void;
    showAbout: boolean;
}

const FooterNav = ({
    activeIndex,
    loadingSpeech,
    startingSpeech,
    activeItem,
    showPlayButton,
    assistantResponse,
    projectData,
    setShowPlayButton,
    setStartingSpeech,
    setActiveItem,
    audioElRef,
    toggleMute,
    isMute,
    setShowAbout,
    showAbout,
    setShowImageGallery,
}: FooterNavEntryProps) => {
    const buttonClasses = `absolute bottom-4 z-40 backdrop-blur-xl text-white bg-[#ffffff10] hover:bg-[#ffffff2f] opacity-100 hover:opacity-100 transition-all duration-250`;
    const textClasses = `text-white`;
    const hoverClasses = `hover:opacity-100 hover:text-white transition-all duration-[.35s]`;

    return (
        <>
            {showPlayButton &&
                assistantResponse[assistantResponse.length - 1]?._id ===
                    projectData[activeIndex]?.sys.id && (
                    <Button
                        onClick={async () => {
                            setShowPlayButton(false);
                            setStartingSpeech(true);
                            setActiveItem(null);
                            if (audioElRef?.current) {
                                try {
                                    await audioElRef.current.play();
                                    audioElRef.current.muted = false;
                                    audioElRef.current.onended = () => {
                                        setStartingSpeech(false);
                                    };
                                } catch (error) {
                                    console.error(
                                        "User-initiated playback failed",
                                        error
                                    );
                                }
                            }
                        }}
                        className={`${buttonClasses} origin-right right-[50%] translate-x-[50%]`}
                    >
                        Play Audio
                    </Button>
                )}
            {startingSpeech && activeItem === activeIndex && (
                <Button
                    onClick={toggleMute}
                    className={`${buttonClasses} origin-right right-4 z-[997]`}
                >
                    {isMute ? "Unmute" : "Mute"}
                </Button>
            )}
            {activeItem === activeIndex && (
                <div
                    className={`${
                        !loadingSpeech && !startingSpeech && "hidden"
                    } ${textClasses} ${hoverClasses} bottom-4 absolute origin-left left-4 flex items-end gap-2 z-[997]`}
                >
                    <p className="max-tablet:text-xl text-3xl">
                        {(loadingSpeech && "weaving words") ||
                            (startingSpeech && "narrating")}{" "}
                    </p>
                    {(loadingSpeech || startingSpeech) && (
                        <div className="typing-animation">
                            <div className="dot dot-col-red"></div>
                            <div className="dot dot-col-red"></div>
                            <div className="dot dot-col-red"></div>
                        </div>
                    )}
                </div>
            )}

            <footer>
                {!startingSpeech && !showAbout && (
                    <small
                        className={`${textClasses} fixed bottom-4 left-[50%] translate-x-[-50%] w-full text-center tracking-normal opacity-60`}
                    >
                        Tap an image to listen to its story
                    </small>
                )}
                <p
                    className={`${textClasses} ${hoverClasses} fixed top-[0.6rem] left-4 max-tablet:text-xl max-tablet:top-[1.1rem] text-3xl z-[999]`}
                >
                    fAIrytales
                </p>
                {/* <p
                    onClick={() => setShowImageGallery((toggle) => !toggle)}
                    className={`${textClasses} ${hoverClasses} fixed top-3 left-6 max-tablet:hidden`}
                >
                    Index
                </p> */}
                <Button
                    onClick={() => setShowAbout(true)}
                    className={`${buttonClasses} fixed right-4 top-4 z-0 self-start h-7`}
                >
                    Info
                </Button>
            </footer>
        </>
    );
};

export default FooterNav;

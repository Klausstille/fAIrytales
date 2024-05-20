import { useEffect, useRef, useState } from "react";
import ImageComponent from "./ImageComponent";
import { AssistantRes, ProjectData } from "../../types";
import FullScreenAnimation from "./FullScreenAnimation";
import GetWindowDimensions from "../utils/helper";
import Div100vh from "react-div-100vh";

interface SmoothScrollGalleryEntryProps {
    projectData: ProjectData[];
    registerRef: (index: number, element: HTMLDivElement) => void;
    handleFetchTextAndAudio: () => void;
    handleSubmitAudio: () => void;
    handleListenStoredAudio: (isListenAgain?: boolean | undefined) => void;
    setActiveIndex: (index: number) => void;
    activeIndex: number;
    assistantResponse: AssistantRes[];
    submittingAudio: boolean;
    loadingSpeech: boolean;
    setActiveText: (text: string) => void;
    setHoveredItem: (index: number | null) => void;
    setShowImageGallery: (value: boolean) => void;
    handleScrollToIndex: (index: number) => void;
}

const SmoothScrollGallery = ({
    projectData,
    handleFetchTextAndAudio,
    handleSubmitAudio,
    setActiveIndex,
    activeIndex,
    registerRef,
    assistantResponse,
    handleListenStoredAudio,
    submittingAudio,
    loadingSpeech,
    setActiveText,
    setHoveredItem,
    setShowImageGallery,
    handleScrollToIndex,
}: SmoothScrollGalleryEntryProps) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const galleryRef = useRef<HTMLDivElement>(null);
    const { windowWidth } = GetWindowDimensions();
    useEffect(() => {
        if (windowWidth < 768) {
            const galleryElement = galleryRef.current;
            if (galleryElement) {
                const handleScroll = () => {
                    const totalHeight = galleryElement.scrollHeight;
                    const scrollPosition =
                        galleryElement.scrollTop + galleryElement.clientHeight;
                    if (scrollPosition >= totalHeight && totalHeight !== null) {
                        galleryElement.scrollTo(0, 0);
                    }
                };
                galleryElement.addEventListener("scroll", handleScroll);
                return () => {
                    galleryElement.removeEventListener("scroll", handleScroll);
                };
            }
        }
    }, [windowWidth]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const galleryElement = galleryRef.current;
            if (!galleryElement) return;
            switch (event.key) {
                case "ArrowUp":
                case "ArrowLeft":
                    if (activeIndex === 0) {
                        setActiveIndex(Math.max(0, projectData.length - 1));
                        handleScrollToIndex(
                            Math.max(0, projectData.length - 1)
                        );
                        return;
                    }
                    setActiveIndex(activeIndex - 1);
                    handleScrollToIndex(activeIndex - 1);
                    break;
                case "ArrowDown":
                case "ArrowRight":
                    if (projectData.length - 1 === activeIndex) {
                        setActiveIndex(0);
                        handleScrollToIndex(0);
                        return;
                    }
                    setActiveIndex(activeIndex + 1);
                    handleScrollToIndex(activeIndex + 1);
                    break;
                default:
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [activeIndex]);

    return (
        <>
            <Div100vh
                className="galleryContainer"
                ref={galleryRef as React.RefObject<HTMLDivElement>}
                onClick={() => setShowImageGallery(true)}
            >
                {projectData.map((item: ProjectData, index: number) => (
                    <ImageComponent
                        key={index}
                        src={item.image.url}
                        index={index}
                        setActiveIndex={setActiveIndex}
                        handleFetchTextAndAudio={handleFetchTextAndAudio}
                        handleSubmitAudio={handleSubmitAudio}
                        setIsFullscreen={setIsFullscreen}
                        registerRef={registerRef}
                        handleListenStoredAudio={handleListenStoredAudio}
                        assistantResponse={assistantResponse}
                        activeIndex={activeIndex}
                        projectData={projectData}
                        submittingAudio={submittingAudio}
                        loadingSpeech={loadingSpeech}
                        setActiveText={setActiveText}
                        setHoveredItem={setHoveredItem}
                    />
                ))}
                {windowWidth < 768 && <section className="h-1"></section>}
            </Div100vh>
            <FullScreenAnimation
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
                activeIndex={activeIndex}
                projectData={projectData}
            />
        </>
    );
};

export default SmoothScrollGallery;

import { useState } from "react";
import ImageComponent from "./ImageComponent";
import { AssistantRes, ProjectData } from "../../types";
import FullScreenAnimation from "./FullScreenAnimation";
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
}: SmoothScrollGalleryEntryProps) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    return (
        <>
            <div
                className="galleryContainer"
                onClick={() => setShowImageGallery(true)}
            >
                <Div100vh>
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
                </Div100vh>
            </div>
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

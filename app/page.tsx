"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { fetchText } from "./utils/fetchText";
import { fetchSpeech } from "./utils/fetchSpeech";
import { uploadAudioToContentful } from "./utils/contentful/uploadAudioToContentful";
import { updateProjectItemWithAudio } from "./utils/contentful/updateProjectItemWithAudio";
import NavigationButtons from "./components/NavButtons";
import SmoothScrollGallery from "./components/SmoothScrollGallery";
import ImageGallery from "./components/ImageGallery";
import FooterNav from "./components/FooterNav";
import MouseMoveContainer from "./components/MouseMoveContainer";
import { useSession } from "next-auth/react";
import { AssistantRes, ImageRefs } from "../types";
import UserSessionInfo from "./components/UserSessionInfo";
import { useProjectData } from "./utils/useProjectData";
import { usePromptData } from "./utils/usePromptData";
import { useAudioManager } from "./utils/useAudioManager";
import AboutSection from "./components/AboutSection";

export default function Home() {
    const [assistantResponse, setAssistantResponse] = useState<AssistantRes[]>(
        []
    );
    const [activeItem, setActiveItem] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [showAbout, setShowAbout] = useState<boolean>(false);
    const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
    const [activeText, setActiveText] = useState<string>("");
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
    const audioElRef = useRef<HTMLAudioElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const imageRefs = useRef<ImageRefs>({});
    const registerImageRef = useCallback(
        (index: number, element: HTMLDivElement) => {
            imageRefs.current[index] = element;
        },
        []
    );
    const { projectData, isLoading, mutate, numImages } = useProjectData();
    const { promptData } = usePromptData();
    const {
        isMute,
        toggleMute,
        loadingSpeech,
        setLoadingSpeech,
        startingSpeech,
        setStartingSpeech,
        showPlayButton,
        setShowPlayButton,
        setIsMute,
        submittingAudio,
        setSubmittingAudio,
    } = useAudioManager(audioElRef);
    const { data: session } = useSession();

    const handleScrollToIndex = useCallback((index: number) => {
        const element = imageRefs.current[index];
        if (element) {
            element.scrollIntoView({
                block: "center",
                inline: "center",
            });
        }
    }, []);

    // Fetching new text and audio
    const handleFetchTextAndAudio = async () => {
        // console.log("Fetching new text and audio...");
        if (!abortControllerRef.current) {
            abortControllerRef.current = new AbortController();
        }
        const { signal } = abortControllerRef.current;
        setIsMute(false);
        setActiveItem(activeIndex);
        setLoadingSpeech(true);
        const description = await fetchText(
            signal,
            projectData[activeIndex].image.url,
            projectData[activeIndex].sys.id,
            setAssistantResponse,
            setLoadingSpeech,
            setActiveItem,
            promptData,
            assistantResponse
        );
        if (!description) return;

        await fetchSpeech(
            signal,
            description,
            audioElRef,
            setLoadingSpeech,
            setStartingSpeech,
            setShowPlayButton,
            setActiveItem,
            setAssistantResponse,
            projectData[activeIndex].sys.id,
            promptData
        );
    };

    // Submitting audio to Contentful
    const handleSubmitAudio = async () => {
        // console.log("Submitting audio to contentful.....");
        setSubmittingAudio(true);
        const audioFile = assistantResponse.find(
            (item) => item._id === projectData[activeIndex].sys.id
        )?.audioFormData;
        const description = assistantResponse.find(
            (item) => item._id === projectData[activeIndex].sys.id
        )?.text;

        if (!audioFile || !description) return;
        uploadAudioToContentful(audioFile, description)
            .then((assetId) =>
                updateProjectItemWithAudio(
                    assetId,
                    projectData[activeIndex].sys.id
                )
            )
            .then(() => {
                // console.log(
                //     "Project item updated and published successfully with the new audio!!! 🎉🎉🎉"
                // );
                setSubmittingAudio(false);
                mutate();
            })
            .catch((error) =>
                console.error("Error updating project item:", error)
            );
    };

    // Listening to stored audio
    const handleListenStoredAudio = async (
        isListenAgain: boolean | undefined
    ) => {
        setIsMute(false);
        let audioUrl;
        if (isListenAgain) {
            // console.log("listening again to local audio...", isListenAgain);
            audioUrl = assistantResponse.find(
                (item) => item._id === projectData[activeIndex].sys.id
            )?.audioUrl;
        } else {
            // console.log("listening again to project audio...", isListenAgain);
            audioUrl = projectData.find(
                (item) => item.sys.id === projectData[activeIndex].sys.id
            )?.audioFile?.url;
        }
        if (!audioUrl) return;
        setStartingSpeech(true);
        setActiveItem(activeIndex);
        if (audioElRef.current) {
            audioElRef.current.src = audioUrl;
            audioElRef.current.muted = true;
            try {
                await audioElRef.current.play();
                audioElRef.current.muted = false;
            } catch (err) {
                console.error("Error playing the audio", err);
                setShowPlayButton(true);
            }
            audioElRef.current.onended = () => {
                setStartingSpeech(false);
                setActiveItem(null);
            };
        }
    };

    // Resetting audio and aborting fetchSpeech when activeIndex changes
    useEffect(() => {
        if (audioElRef.current) {
            audioElRef.current.pause();
            audioElRef.current.currentTime = 0;
        }
        setActiveItem(null);
        setLoadingSpeech(false);
        setActiveText("");
        setTimeout(() => {
            setStartingSpeech(false);
        }, 400);
        return () => {
            abortControllerRef.current?.abort();
            abortControllerRef.current = null;
        };
    }, [activeIndex, showImageGallery, setLoadingSpeech, setStartingSpeech]);

    return (
        <>
            <aside className="fixed h-screen w-screen overflow-hidden pointer-events-none z-[999]">
                <MouseMoveContainer
                    text={
                        (!showImageGallery || showImageGallery) &&
                        !startingSpeech &&
                        activeText &&
                        (hoveredItem === activeIndex || showImageGallery)
                            ? activeText
                            : ""
                    }
                    isSpeeking={startingSpeech || loadingSpeech}
                />
            </aside>
            {isLoading && (
                <div className="typing-animation w-[screen] h-screen max-tablet:translate-y-[-6%] flex justify-center items-center">
                    <div className="dot dot-col-white"></div>
                    <div className="dot dot-col-white"></div>
                    <div className="dot dot-col-white"></div>
                </div>
            )}
            {session && <UserSessionInfo session={session} />}
            <AboutSection setShowAbout={setShowAbout} showAbout={showAbout} />
            <NavigationButtons
                numImages={numImages}
                activeIndex={activeIndex}
                handleScrollToIndex={handleScrollToIndex}
            />
            <audio autoPlay ref={audioElRef}></audio>
            <main>
                <ImageGallery
                    showImageGallery={showImageGallery}
                    projectData={projectData}
                    activeIndex={activeIndex}
                    setShowImageGallery={setShowImageGallery}
                    setActiveIndex={setActiveIndex}
                    activeItem={activeItem}
                    setActiveText={setActiveText}
                    setHoveredItem={setHoveredItem}
                    handleScrollToIndex={handleScrollToIndex}
                />
                <SmoothScrollGallery
                    projectData={projectData}
                    handleFetchTextAndAudio={handleFetchTextAndAudio}
                    handleSubmitAudio={handleSubmitAudio}
                    setActiveIndex={setActiveIndex}
                    activeIndex={activeIndex}
                    registerRef={registerImageRef}
                    assistantResponse={assistantResponse}
                    handleListenStoredAudio={handleListenStoredAudio}
                    submittingAudio={submittingAudio}
                    loadingSpeech={loadingSpeech}
                    setActiveText={setActiveText}
                    setHoveredItem={setHoveredItem}
                    setShowImageGallery={setShowImageGallery}
                />
            </main>
            <FooterNav
                activeIndex={activeIndex}
                loadingSpeech={loadingSpeech}
                startingSpeech={startingSpeech}
                activeItem={activeItem}
                audioElRef={audioElRef}
                showPlayButton={showPlayButton}
                isMute={isMute}
                toggleMute={toggleMute}
                setStartingSpeech={setStartingSpeech}
                setShowPlayButton={setShowPlayButton}
                setActiveItem={setActiveItem}
                projectData={projectData}
                assistantResponse={assistantResponse}
                setShowAbout={setShowAbout}
                setShowImageGallery={setShowImageGallery}
                showAbout={showAbout}
            />
        </>
    );
}

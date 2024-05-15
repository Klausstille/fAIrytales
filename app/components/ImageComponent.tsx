import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { AssistantRes, ProjectData } from "../../types";
import { useSession } from "next-auth/react";
import { Button } from "./Button";
import Image from "next/image";

const imageVariants = {
    offscreen: {
        scale: 0.45,
        filter: "blur(150px)",
    },
    onscreen: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: "easeInOut",
        },
    },
};

interface ImageComponentProps {
    src: string;
    index: number;
    activeIndex: number;
    assistantResponse: AssistantRes[];
    setActiveIndex: (index: number) => void;
    handleFetchTextAndAudio: () => void;
    handleSubmitAudio: () => void;
    setIsFullscreen: (isFullscreen: boolean) => void;
    registerRef: (index: number, element: HTMLDivElement) => void;
    handleListenStoredAudio: (isListenAgain?: boolean | undefined) => void;
    projectData: ProjectData[];
    submittingAudio: boolean;
    loadingSpeech: boolean;
    setActiveText: (text: string) => void;
    setHoveredItem: (index: number | null) => void;
}

const ImageComponent = ({
    src,
    index,
    setActiveIndex,
    activeIndex,
    handleFetchTextAndAudio,
    handleSubmitAudio,
    setIsFullscreen,
    registerRef,
    handleListenStoredAudio,
    assistantResponse,
    projectData,
    submittingAudio,
    loadingSpeech,
    setActiveText,
    setHoveredItem,
}: ImageComponentProps) => {
    const { ref, inView } = useInView({
        threshold: 0.5,
    });
    const { data: session } = useSession();
    useEffect(() => {
        if (inView) {
            setActiveIndex(index);
        }
    }, [inView, index, setActiveIndex]);

    const foundAssistantItem =
        assistantResponse?.find(
            (item) => item._id === projectData[activeIndex].sys.id
        )?.audioUrl !== undefined;

    const foundSubmittedItem =
        projectData?.find(
            (item) => item.sys.id === projectData[activeIndex]?.sys.id
        )?.audioFile == null;

    const alreadySubmittedItem =
        assistantResponse?.find(
            (item) => item._id === projectData[activeIndex]?.sys.id
        )?.text !== undefined &&
        assistantResponse?.find(
            (item) => item._id === projectData[activeIndex]?.sys.id
        )?.text === projectData[activeIndex]?.audioFile?.description;

    const disabledButtonCondition =
        !foundAssistantItem || (foundAssistantItem && alreadySubmittedItem);

    return (
        <motion.div
            ref={(node) => {
                ref(node);
                if (node) {
                    registerRef(index, node);
                }
            }}
            key={index}
            className="imageContainer"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: false, amount: 0.8 }}
            variants={imageVariants}
        >
            <Image
                onMouseOver={() => {
                    setActiveText(
                        projectData[activeIndex]?.audioFile?.description
                    );
                    setHoveredItem(index);
                }}
                onMouseOut={() => {
                    setActiveText("");
                    setHoveredItem(null);
                }}
                src={src}
                alt={
                    projectData[activeIndex]?.audioFile?.description ||
                    "Project Image"
                }
                width={projectData[activeIndex]?.image.width ?? 0}
                height={projectData[activeIndex]?.image.height ?? 0}
                priority
                className="h-[80vh] grayscale max-tablet:max-w-[90%] max-tablet:h-auto object-contain w-auto rounded-xl"
                draggable="false"
                onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(index);
                    handleListenStoredAudio();
                    setIsFullscreen(true);
                }}
            />
            {session && (
                // <article className="absolute max-tablet:self-center">
                <article className="absolute">
                    <section className="flex flex-col gap-2 max-tablet:gap-2 backdrop-blur-xl p-6 rounded-3xl">
                        <Button
                            className={`bg-[#a3a3a3ba] ${
                                !foundSubmittedItem ? "hover:opacity-80" : ""
                            } transition-all duration-250 text-white border-none py-2`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleListenStoredAudio();
                            }}
                            disabled={foundSubmittedItem}
                        >
                            Listen to Published Audio
                        </Button>
                        <Button
                            className={`${
                                loadingSpeech
                                    ? "submitAudioAnimation"
                                    : "bg-[#a3a3a3ba] hover:opacity-80 transition-all duration-250 text-white border-none"
                            } py-2`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFetchTextAndAudio();
                            }}
                        >
                            {loadingSpeech
                                ? "Generating..."
                                : "Generate New Audio"}
                        </Button>
                        <Button
                            className={`${
                                foundAssistantItem == undefined
                                    ? "bg-[#555] text-[#aaa] border-[#666] opacity-50 border-none"
                                    : `bg-[#a3a3a3ba] text-white border-none ${
                                          !disabledButtonCondition &&
                                          "hover:opacity-80 transition-all duration-250"
                                      }`
                            } py-2 h-auto`}
                            disabled={disabledButtonCondition}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleListenStoredAudio(true);
                            }}
                        >
                            Listen Again
                        </Button>
                        <Button
                            className={`${
                                submittingAudio
                                    ? "submitAudioAnimation"
                                    : !alreadySubmittedItem &&
                                      foundAssistantItem
                                    ? "bg-[#0f0] hover:bg-[#1f1] border-[#1f1] border-none"
                                    : `bg-[#a3a3a3ba] text-[#fff] border-none ${
                                          !disabledButtonCondition &&
                                          "hover:opacity-80 transition-all duration-250"
                                      }`
                            } py-2 h-auto`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSubmitAudio();
                            }}
                            disabled={disabledButtonCondition}
                        >
                            {submittingAudio
                                ? "Submitting..."
                                : "Submit New Audio"}
                        </Button>
                    </section>
                </article>
            )}
        </motion.div>
    );
};

export default ImageComponent;

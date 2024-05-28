import { motion, AnimatePresence } from "framer-motion";
import { generateRandomPanning } from "../utils/helper";
import { useEffect, useState } from "react";
import { ProjectData } from "@/types";
import Image from "next/image";

export const fullscreenVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeIn" } },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

export default function FullScreenAnimation({
    isFullscreen,
    setIsFullscreen,
    activeIndex,
    projectData,
    isAdminPage,
}: {
    isFullscreen: boolean;
    activeIndex: number;
    projectData: ProjectData[];
    isAdminPage?: boolean;
    setIsFullscreen?: (isFullscreen: boolean) => void;
}) {
    const MotionImage = motion(Image);
    const [panningEffect, setPanningEffect] = useState(generateRandomPanning());

    useEffect(() => {
        if (isFullscreen) {
            setPanningEffect(generateRandomPanning());
        }
    }, [isFullscreen, activeIndex]);

    return (
        <AnimatePresence>
            {isFullscreen && (
                <motion.div
                    variants={fullscreenVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: isAdminPage ? 0 : 35,
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFullscreen && setIsFullscreen(false);
                    }}
                >
                    <MotionImage
                        src={projectData[activeIndex]?.image.url || ""}
                        alt={
                            projectData[activeIndex]?.audioFile?.description ||
                            "Project Image"
                        }
                        width={projectData[activeIndex]?.image.width || 0}
                        height={projectData[activeIndex]?.image.height || 0}
                        loading="eager"
                        initial="initial"
                        animate={panningEffect}
                        style={{
                            filter: "grayscale(100%)",
                            objectFit: "cover",
                            width: "100vw",
                            height: "100vh",
                            minWidth: "100%",
                            minHeight: "100%",
                        }}
                        draggable="false"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

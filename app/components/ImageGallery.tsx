import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { ProjectData } from "@/types";
import FullScreenAnimation from "./FullScreenAnimation";
import { motion, AnimatePresence } from "framer-motion";
import { fullscreenVariant } from "./FullScreenAnimation";

interface ImageGalleryProps {
    projectData: ProjectData[];
    activeIndex: number;
    activeItem: number | null;
    setActiveIndex: (index: number) => void;
    setShowImageGallery: (
        value: boolean | ((prevState: boolean) => boolean)
    ) => void;
    showImageGallery: boolean;
    setActiveText: (text: string) => void;
    setHoveredItem: (index: number | null) => void;
    handleScrollToIndex: (index: number) => void;
}

export default function ImageGallery({
    showImageGallery,
    projectData,
    activeIndex,
    setShowImageGallery,
    setActiveIndex,
    activeItem,
    setActiveText,
    setHoveredItem,
    handleScrollToIndex,
}: ImageGalleryProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [placeItems, setPlaceItems] = useState<string[]>([]);

    const textClasses = `text-white opacity-50`;
    const hoverClasses = `hover:opacity-100 hover:text-white transition-all duration-[.35s]`;

    useEffect(() => {
        const positions = ["start", "center", "end"];
        const newPlaceItems = projectData.map(() => {
            const randomIndex = Math.floor(Math.random() * positions.length);
            return positions[randomIndex];
        });
        setPlaceItems(newPlaceItems);
    }, [projectData]);

    return (
        <AnimatePresence>
            {showImageGallery && (
                <motion.div
                    variants={fullscreenVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={() => setShowImageGallery(false)}
                    className="max-tablet:hidden absolute py-5 px-4 pt-16 grid grid-cols-10 max-desktop-l:grid-cols-8 max-tablet:grid-cols-2 max-desktop:grid-cols-4 gap-4 z-40 overflow-scroll h-screen w-screen backdrop-blur-3xl"
                >
                    {projectData.map((project, index) => {
                        return (
                            <Fragment key={project.sys.id}>
                                <Image
                                    onMouseOver={(e) => {
                                        e.stopPropagation();
                                        setActiveText(
                                            project.audioFile?.description ||
                                                "Project Image"
                                        );
                                        setHoveredItem(index);
                                    }}
                                    onMouseOut={() => {
                                        setActiveText("");
                                        setHoveredItem(null);
                                    }}
                                    // style={{
                                    //     position: "relative",
                                    //     display: "inline-block",
                                    //     placeSelf: placeItems[index],
                                    // }}
                                    className="object-cover aspect-3/4 grayscale rounded-md"
                                    src={project.image.url}
                                    alt={
                                        project.audioFile?.description ||
                                        "Project Image"
                                    }
                                    width={project.image.width}
                                    height={project.image.height}
                                    draggable="false"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveIndex(index);
                                        handleScrollToIndex(index);
                                        setShowImageGallery(false);
                                        // setIsFullscreen(true);
                                    }}
                                    placeholder={
                                        project.image?.blurDataURL
                                            ? "blur"
                                            : "empty"
                                    }
                                    blurDataURL={
                                        project.image?.blurDataURL || ""
                                    }
                                />
                            </Fragment>
                        );
                    })}
                    {/* <FullScreenAnimation
                        isFullscreen={isFullscreen}
                        setIsFullscreen={setIsFullscreen}
                        activeIndex={activeIndex}
                        projectData={projectData}
                    /> */}
                    {/* <p
                        onClick={() => setShowImageGallery((toggle) => !toggle)}
                        className={`${textClasses} ${hoverClasses} fixed top-3 left-6 max-tablet:hidden`}
                    >
                        Close
                    </p> */}
                    {/* <div
                        className="is-opened"
                        onClick={() => setShowImageGallery(false)}
                    >
                        <svg
                            className="hamburger fixed top-4 right-4"
                            stroke="#F8F8F8"
                        >
                            <line
                                x1="0"
                                y1="50%"
                                x2="100%"
                                y2="50%"
                                className="hamburger__bar hamburger__bar--top"
                            />
                            <line
                                x1="0"
                                y1="50%"
                                x2="100%"
                                y2="50%"
                                className="hamburger__bar hamburger__bar--mid"
                            />
                            <line
                                x1="0"
                                y1="50%"
                                x2="100%"
                                y2="50%"
                                className="hamburger__bar hamburger__bar--bot"
                            />
                        </svg>
                    </div> */}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

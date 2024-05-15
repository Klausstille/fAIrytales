import { motion, AnimatePresence } from "framer-motion";
import { fullscreenVariant } from "./FullScreenAnimation";
interface AboutEntryProps {
    setShowAbout: (isActiveAbout: boolean) => void;
    showAbout: boolean;
}
export default function AboutSection({
    setShowAbout,
    showAbout,
}: AboutEntryProps) {
    return (
        <AnimatePresence>
            {showAbout && (
                <motion.div
                    variants={fullscreenVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={() => setShowAbout(false)}
                    className="fixed top-0 left-0 w-screen min-h-screen max-tablet:min-h-[80vh] flex justify-center items-center z-[997] backdrop-blur-2xl"
                >
                    <article className="flex flex-col gap-4 text-white p-3 leading-tight tracking-normal w-[650px] min-w-[350px] text-center m-20 opacity-80">
                        <h1>
                            This project showcases genuine moments captured by
                            Klaus Stille integrating cutting-edge AI
                            technologies. Leveraging the power of OpenAI{"'"}s
                            vision model, each image is analyzed to generate
                            descriptive text that captures the essence of the
                            photograph. <br></br> <br></br>These descriptions
                            are then given voice through ElevenLabs
                            {"'"} text-to-speech synthesis, creating an
                            immersive audio-visual experience. Behind the
                            scenes, the generated text and audio data are
                            seamlessly submitted, where they
                            {"'"}re curated and published.
                        </h1>
                    </article>
                    <p className="fixed bottom-4 text-white text-sm opacity-60 text-center max-tablet:hidden">
                        Design and Development by{" "}
                        <a
                            className="text-sm"
                            href="http://www.stillestudio.com"
                            target="blank"
                            style={{ textDecoration: "none" }}
                        >
                            Klaus Stille
                        </a>{" "}
                        💫
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

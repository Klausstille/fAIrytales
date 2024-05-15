import { AssistantRes, PromptData } from "../../types";

export const fetchSpeech = async (
    signal: AbortSignal,
    description: string | undefined,
    audioElRef: React.RefObject<HTMLAudioElement>,
    setLoadingSpeech: (value: boolean) => void,
    setStartingSpeech: (value: boolean) => void,
    setShowPlayButton: (value: boolean) => void,
    setActiveItem: (value: number | null) => void,
    setAssistantResponse: (value: any) => void,
    sysId: string,
    promptData: PromptData | undefined
) => {
    // console.log("fetching speech:::: ", description);
    try {
        const result = await fetch("/api/generateSpeech", {
            signal,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description: description,
                promptData: promptData,
            }),
        });
        setLoadingSpeech(false);
        setStartingSpeech(true);
        if (audioElRef.current) {
            const audioBlob = await result.blob();
            const audioFile = new File([audioBlob], "speech.mp3", {
                type: "audio/mpeg",
            });
            const formData = new FormData();
            formData.append("audioFile", audioFile);
            const audioUrl = URL.createObjectURL(audioBlob);
            audioElRef.current.src = audioUrl;
            setAssistantResponse &&
                setAssistantResponse((currentValue: Array<AssistantRes>) => {
                    const itemExistsIndex = currentValue.findIndex(
                        (item) => item._id === sysId
                    );
                    if (itemExistsIndex !== -1) {
                        const updatedValue = [...currentValue];
                        updatedValue[itemExistsIndex] = {
                            ...updatedValue[itemExistsIndex],
                            audioFormData: audioFile,
                            audioUrl: audioUrl,
                        };
                        return updatedValue;
                    }
                });
            audioElRef.current.muted = true;

            try {
                await audioElRef.current.play();
                audioElRef.current.muted = false;
            } catch (err: any) {
                console.error("-----------------------------------");
                console.error("Error playing the audio", err);
                setShowPlayButton(true);
                throw new Error(`Failed to play audio: ${err.message}`);
            }
            audioElRef.current.onended = () => {
                setStartingSpeech(false);
                setActiveItem(null);
            };
            return audioFile;
        }
    } catch (error) {
        if ((error as Error).name === "AbortError") {
            // console.log("Fetch operation was aborted! 🙌");
            setStartingSpeech(false);
            setLoadingSpeech(false);
            setActiveItem(null);
            return;
        }
        console.error("Error playing the audio:", error);
    }
};

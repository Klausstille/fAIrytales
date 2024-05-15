import { useState, useCallback } from "react";

export const useAudioManager = (
    audioElRef: React.RefObject<HTMLAudioElement>
) => {
    const [isMute, setIsMute] = useState(false);
    const [loadingSpeech, setLoadingSpeech] = useState(false);
    const [startingSpeech, setStartingSpeech] = useState(false);
    const [showPlayButton, setShowPlayButton] = useState(false);
    const [submittingAudio, setSubmittingAudio] = useState(false);

    const toggleMute = useCallback(() => {
        if (audioElRef.current) {
            audioElRef.current.muted = !isMute;
            setIsMute(!isMute);
        }
    }, [audioElRef, isMute]);

    return {
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
    };
};

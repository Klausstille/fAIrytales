import { AssistantRes, PromptData } from "../../types";

export const fetchText = async (
    signal: AbortSignal,
    image: string,
    sysId: string,
    setAssistantResponse: (value: any) => void,
    setLoadingSpeech: (value: boolean) => void,
    setActiveItem: (value: number | null) => void,
    promptData: PromptData | undefined,
    assistantResponse: Array<AssistantRes>
) => {
    const itemExistsIndex = assistantResponse?.map((item) =>
        item._id === sysId ? { ...item, text: "" } : { ...item }
    );
    setAssistantResponse(itemExistsIndex);
    try {
        const response = await fetch("/api/generateText", {
            signal,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image: image,
                promptData: promptData,
            }),
        });
        if (!response.ok || !response.body) {
            throw new Error("Network response was not ok");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let finalText = "";

        const updateAssistantResponse = (newText: string) => {
            setAssistantResponse((currentValue: Array<AssistantRes>) => {
                const itemExistsIndex = currentValue.findIndex(
                    (item) => item._id === sysId
                );
                if (itemExistsIndex !== -1) {
                    const updatedValue = [...currentValue];
                    updatedValue[itemExistsIndex] = {
                        ...updatedValue[itemExistsIndex],
                        text: updatedValue[itemExistsIndex].text + newText,
                    };
                    return updatedValue;
                } else {
                    return [...currentValue, { _id: sysId, text: newText }];
                }
            });
        };

        while (true) {
            const { value, done } = await reader.read();
            if (value) {
                const textChunk = decoder.decode(value, { stream: true });
                updateAssistantResponse(textChunk);
                finalText += decoder.decode(value);
            }
            if (done) {
                // console.log("Done fetching text");
                return finalText;
            }
        }
    } catch (error) {
        if ((error as Error).name === "AbortError") {
            // console.log("Fetch operation was aborted! 🙌");
            setLoadingSpeech(false);
            setActiveItem(null);
            return;
        }
        console.error("Error fetching the text:", error);
    }
};

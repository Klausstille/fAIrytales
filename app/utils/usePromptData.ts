import { useState, useEffect } from "react";
import useSWR from "swr";
import { getAiPromptInstructions } from "./contentful/api";
import { PromptData } from "@/types";
import createPrompts from "./createPrompts";

export const usePromptData = () => {
    const { data } = useSWR("prompts", () => getAiPromptInstructions());
    const [promptData, setPromptData] = useState<PromptData>();

    useEffect(() => {
        if (data) {
            const name = data.aiPromptInstructions[0].name;
            const system = data.aiPromptInstructions[0].system;
            const user = data.aiPromptInstructions[0].user;
            const createdPrompts = createPrompts({ name, system, user });
            setPromptData(createdPrompts);
        }
    }, [data]);

    return { promptData };
};

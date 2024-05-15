export interface AssistantRes {
    _id: string;
    text: string;
    audioFormData: File | null;
    audioUrl: string;
}

export interface PromptData {
    id: string;
    name: string;
    system: string;
    user: string;
}

export interface ProjectData {
    title: string;
    image: {
        url: string;
        width: number;
        height: number;
        blurDataURL?: string;
    };
    sys: {
        id: string;
    };
    audioFile: {
        url: string | null;
        title: string;
        description: string;
    };
}

export interface ImageRefs {
    [key: number]: HTMLDivElement;
}

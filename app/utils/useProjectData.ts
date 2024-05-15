import { useState, useEffect } from "react";
import { getProjects } from "./contentful/api";
import { ProjectData } from "@/types";
import GetWindowDimensions from "./helper";
import { dynamicBlurDataUrl } from "./helper";
import useSWR from "swr";
interface Projects {
    projects: ProjectData[];
}

export const useProjectData = () => {
    const { windowWidth } = GetWindowDimensions();
    const { data, error, mutate } = useSWR("projects", () =>
        getProjects(windowWidth)
    );
    const [projectData, setProjectData] = useState<ProjectData[]>([]);
    const numImages: number = projectData.length;

    const getResources = async (data: Projects) => {
        const resources = await Promise.all(
            data.projects.map(async (project) => ({
                ...project,
                image: {
                    ...project.image,
                    blurDataURL: await dynamicBlurDataUrl(project.image.url),
                },
            }))
        );
        return resources;
    };

    useEffect(() => {
        if (data) {
            const modifyData = async () => {
                const dataWithBlurHash = await getResources(data);
                const sortedProjects = dataWithBlurHash.sort(
                    (a, b) => Number(a.title) - Number(b.title)
                );
                setProjectData(sortedProjects);
            };

            modifyData();
        }
    }, [data]);

    return { projectData, isLoading: !error && !data, mutate, numImages };
};

async function fetchGraphQL(query: string) {
    const response = await fetch("/api/contentful", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    });
    if (!response.ok) {
        throw new Error("Failed to fetch projects");
    }
    return await response.json();
}

interface FetchResponse {
    data: {
        categoryCollection: {
            items: {
                title: string;
                sys: {
                    id: string;
                };
                audioFile: {
                    url: string;
                    title: string;
                    description: string;
                };
                image: {
                    width: number;
                    height: number;
                    url: string;
                };
            }[];
        };
    };
}

function extractProjectEntries(fetchResponse: FetchResponse) {
    return fetchResponse?.data?.categoryCollection?.items;
}

export async function getAiPromptInstructions() {
    const entries = await fetchGraphQL(
        `query {
        aiPromptInstructionsCollection {
          items {
            name
            system
            user
          }
        }
      }`
    );

    return {
        aiPromptInstructions:
            entries?.data?.aiPromptInstructionsCollection?.items,
    };
}

export async function getProjects(windowWidth: number) {
    const calculateImageWidth = () => {
        if (windowWidth < 600) {
            return 920;
        } else if (windowWidth <= 1440) {
            return 1440;
        } else {
            return 1920;
        }
    };

    const PROJECT_GRAPHQL_FIELDS = `
    title
    sys {
          id
    }
    audioFile {
        url
        title
        description
    }
    image {
        width
        height
        url(transform: {width: ${calculateImageWidth()}})
        sys {
          id
        }
    }`;

    const entries = await fetchGraphQL(
        `query {
        categoryCollection(limit:50) {
          items {
          ${PROJECT_GRAPHQL_FIELDS}
        }
      }
    }`
    );

    return {
        projects: extractProjectEntries(entries),
    };
}

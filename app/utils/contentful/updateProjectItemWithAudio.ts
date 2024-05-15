export async function updateProjectItemWithAudio(
    assetId: string,
    sysId: string
) {
    const response = await fetch("/api/updateProjectItemWithAudio", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ assetId, sysId }),
    });

    if (!response.ok) {
        throw new Error("Failed to update project item with audio");
    }

    return await response.json();
}

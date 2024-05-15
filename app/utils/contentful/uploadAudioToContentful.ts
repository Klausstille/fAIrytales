export async function uploadAudioToContentful(file: File, description: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    // console.log(
    //     "description in uploadAudioToContentful..........::::",
    //     description
    // );
    const response = await fetch("/api/uploadAudio", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload audio");
    }

    const data = await response.json();
    return data.assetId;
}

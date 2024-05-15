import { NextResponse, NextRequest } from "next/server";
const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN;

export async function POST(req: NextRequest, res: NextResponse) {
    const formData = await req.formData();
    const file = formData.get("file");
    const description = formData.get("description");

    try {
        // Step 1: Upload the file to get the upload URL
        const uploadResponse = await fetch(
            `https://upload.contentful.com/spaces/${spaceId}/uploads`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/octet-stream",
                },
                body: file,
            }
        );

        if (!uploadResponse.ok) {
            throw new Error(
                `Failed to upload file: ${uploadResponse.statusText}`
            );
        }

        const uploadData = await uploadResponse.json();

        // Step 2: Create an asset in Contentful using the upload URL
        const assetResponse = await fetch(
            `https://api.contentful.com/spaces/${spaceId}/environments/master/assets`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fields: {
                        title: {
                            "en-US": description
                                ?.toString()
                                .split(" ")
                                .slice(0, 5)
                                .join(" "),
                        },
                        description: {
                            "en-US": description,
                        },
                        file: {
                            "en-US": {
                                contentType: "audio/mpeg",
                                fileName: "audio.mp3",
                                uploadFrom: {
                                    sys: {
                                        type: "Link",
                                        linkType: "Upload",
                                        id: uploadData.sys.id,
                                    },
                                },
                            },
                        },
                    },
                }),
            }
        );

        if (!assetResponse.ok) {
            throw new Error(
                `Failed to create asset: ${assetResponse.statusText}`
            );
        }

        const assetData = await assetResponse.json();

        // Step 3: Process the asset
        const processResponse = await fetch(
            `https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetData.sys.id}/files/en-US/process`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!processResponse.ok) {
            throw new Error(
                `Failed to process asset: ${processResponse.statusText}`
            );
        }

        // Return the ID of the created and published asset
        return Response.json({ assetId: assetData.sys.id });
    } catch (error: any) {
        return new Response(`Webhook error: ${error.message}`, {
            status: 400,
        });
    }
}

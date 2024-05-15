import { NextResponse, NextRequest } from "next/server";
const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN;

export async function POST(req: NextRequest, res: NextResponse) {
    const { assetId, sysId } = await req.json();
    try {
        // Fetch the current version of the project item entry
        const assetResponse = await fetch(
            `https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${sysId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!assetResponse.ok)
            throw new Error("Failed to fetch the entry for updating.");

        const assetData = await assetResponse.json();
        // console.log("entryData..........", assetData);
        // console.log(
        //     "currentVersion from entryData.sys.version:",
        //     assetData.sys.version
        // );

        // Attempt to update the entry
        const updateRes = await fetch(
            `https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${sysId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    "X-Contentful-Version": assetData.sys.version.toString(),
                },
                body: JSON.stringify({
                    fields: {
                        ...assetData.fields,
                        audioFile: {
                            "en-US": {
                                sys: {
                                    type: "Link",
                                    linkType: "Asset",
                                    id: assetId,
                                },
                            },
                        },
                    },
                }),
            }
        );

        if (!updateRes.ok) throw new Error("Failed to update the entry.");

        // Publish the updated asset
        const response = await fetch(
            `https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch asset: HTTP status ${response.status}`
            );
        }

        const asset = await response.json();
        // console.log("VERSION!!!::::::", asset.sys.version);

        const publishResponse = await fetch(
            `https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}/published`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-Contentful-Version": asset.sys.version.toString(),
                },
            }
        );
        const publishResponseBody = await publishResponse.json();
        if (!publishResponse.ok) {
            console.error("Failed to publish the entry:", publishResponseBody);
            throw new Error(`Failed to publish: ${publishResponse.statusText}`);
        }
        // else {
        //     console.log("Publish response:", publishResponseBody);
        // }

        // Publish the entry with updated asset
        const entryResponse = await fetch(
            `https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${sysId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!entryResponse.ok) {
            throw new Error(
                `Failed to fetch entry: HTTP status ${entryResponse.status}`
            );
        }

        const entryData = await entryResponse.json();
        const publishEntry = await fetch(
            `https://api.contentful.com/spaces/${spaceId}/environments/master/entries/${sysId}/published`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-Contentful-Version": entryData.sys.version.toString(),
                },
            }
        );

        if (!publishEntry.ok) {
            const errorBody = await publishEntry.json();
            console.error("Failed to publish entry:", errorBody);
            throw new Error(
                `Failed to publish entry: ${publishEntry.statusText}`
            );
        }

        console.log(
            "Project item updated and published successfully with the new audio!!! 🎉🎉🎉"
        );

        return Response.json({
            message: "Entry updated and published successfully.",
        });
    } catch (error: any) {
        return new Response(`Webhook error: ${error.message}`, {
            status: 400,
        });
    }
}

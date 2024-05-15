import fetch from "node-fetch";
import { NextResponse, NextRequest } from "next/server";
import { VoicePrompt, prompts } from "../../../prompts";
import { PassThrough } from "stream";

async function generateSpeech(text: string, voice: VoicePrompt) {
    console.log(`Start: Generating Speech with voice ${voice.name}`);
    try {
        const options: any = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": process.env.ELEVEN_LABS_KEY,
            },
            body: JSON.stringify({
                model_id: "eleven_multilingual_v2",
                text,
                voice_settings: {
                    similarity_boost: 0.75,
                    stability: 0.3,
                    use_speaker_boost: false,
                    style: 0.65,
                },
            }),
        };
        const res = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voice.id}/stream`,
            options
        );
        // console.log("Done Fetching:::: ", res);
        const passThrough = new PassThrough();
        res.body.pipe(passThrough);
        return passThrough;
    } catch (error: any) {
        console.error("!-------------------------------!");
        console.error("Error in generateSpeech:", error);
        throw new Error(`Failed to generate speech: ${error.message}`);
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    const { description, promptData } = await req.json();
    console.log("Description:::: ", description);
    if (!description) {
        throw new Error("No description");
    }
    const stream = await generateSpeech(description, promptData);

    const readableStream = new ReadableStream({
        start(controller) {
            stream.on("data", (chunk) => controller.enqueue(chunk));
            stream.on("end", () => controller.close());
            stream.on("error", (error) => controller.error(error));
        },
    });

    return new Response(readableStream, {
        status: 200,
        headers: {
            "Content-Type": "audio/mpeg",
        },
    });
}

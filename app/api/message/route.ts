import OpenAI from "openai";
import fetch from "node-fetch";
import { NextResponse, NextRequest } from "next/server";
import { VoicePrompt, prompts } from "../../../prompts";
import { PassThrough } from "stream";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generateSpeech(text: string, voice: VoicePrompt) {
    // console.log(`Start: Generating Speech with voice ${voice.name}`);
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
}

export async function POST(req: NextRequest, res: NextResponse) {
    const { image } = await req.json();
    const response = await openai.chat.completions.create({
        max_tokens: 100,
        messages: [
            {
                role: "system",
                content: prompts["attenborough"].system,
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: prompts["attenborough"].user,
                    },
                    {
                        type: "image_url",
                        image_url: image,
                    },
                ],
            },
        ],
        model: "gpt-4-vision-preview",
    });

    const description = response.choices[0].message.content;
    // console.log("Description:::: ", description);
    if (!description) {
        throw new Error("No description");
    }
    const stream = await generateSpeech(description, prompts["attenborough"]);

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

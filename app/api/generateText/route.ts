import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse, NextRequest } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest, res: NextResponse) {
    console.log("Requesting text generation");
    const { image, promptData } = await req.json();

    const startTime = Date.now();

    const response = await openai.chat.completions.create({
        max_tokens: 100,
        messages: [
            {
                role: "system",
                content: promptData.system,
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: promptData.user,
                    },
                    {
                        type: "image_url",
                        image_url: image,
                    },
                ],
            },
        ],
        model: "gpt-4-vision-preview",
        stream: true,
    });

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    console.log(`Elapsed time: ${elapsedTime}ms`);

    const stream = OpenAIStream(response);
    // console.log("Stream:::: ", stream);
    if (!stream) {
        throw new Error("No description");
    }
    return new StreamingTextResponse(stream);
}

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (typeof prompt !== "string" || !prompt.trim()) {
            return NextResponse.json(
                { error: "`prompt` must be a non-empty string" },
                { status: 400 }
            );
        }

        const response = await openai.responses.create({
            model: "gpt-4o-mini",
            input: `
                Generate exactly 3 short responses.
                Each response must be on a new line.
                Do not number them.

                Prompt:
                ${prompt}
                    `,
        });

        const text = response.output_text;

        // Convert into array of 3 messages
        const messages = text
            .split("\n")
            .map(m => m.trim())
            .filter(Boolean)
            .slice(0, 3);

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

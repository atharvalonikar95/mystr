import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { streamText } from "ai";

export const runtime = "edge";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        const result = await streamText({
            model: "gpt-4o-mini",  // <-- MUST be a string
            messages,
            // api: openai,           // <-- tell Vercel AI SDK to use your OpenAI client
        });

        return result.toTextStreamResponse();
    } catch (error) {
        if(error  instanceof OpenAI.APIError){
            const {name,status,headers,message}=error
            return NextResponse.json({
                name,status,headers,message
            },{status})
        }else{
            console.error("an unexpected error",error)
            throw error
        }
    }
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
export const runtime = "edge";


export async function POST(req: NextRequest): Promise<Response> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt: string = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. Make sure the questions are always random even with the same prompt";

        const res = await model.generateContent(
            {
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: prompt,
                            }
                        ],
                    },
                ],
                generationConfig: {
                    maxOutputTokens: 400,
                    temperature: 0.9,
                }
            }
        );

        if (res && typeof res.response?.text() === "string") {
            return NextResponse.json(
                {
                    success: true,
                    generatedResult: res.response.text(),

                },
                {
                    status: 200,
                }
            )
        } else {
            console.log(res.response.text());
            throw new Error("Unexpexted response structure");
        }
    } catch (error) {
        console.log("Error generating content: ", error)
        return NextResponse.json(
            {
                success: false,
                error: error,
            },
            {
                status: 500,
            }
        )
    }
}


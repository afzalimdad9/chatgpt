import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient()

export async function chatWithModel(messages: { role: string; content: string }[], stream = false) {
    const url = `https://api-inference.huggingface.co/models/${process.env.NEXT_PUBLIC_MODEL_NAME}/v1/chat/completions`;
    const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
    };
    const body = JSON.stringify({
        model: process.env.NEXT_PUBLIC_MODEL_NAME,
        messages,
        max_tokens: 500,
        stream,
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    if (stream) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        let aiResponse = '';

        while (true) {
            const readerData = await reader?.read();
            if (!readerData) break;
            const { done, value } = readerData;
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter(line => line.trim() !== "");

            for (const line of lines) {
                const jsonLine = line.replace(/^data:\s*/, "");
                if (jsonLine.startsWith("{")) {
                    try {
                        const parsedData = JSON.parse(jsonLine);
                        if (!parsedData.choices[0].delta.content) break;
                        aiResponse += (parsedData.choices[0].delta.content) || "";
                    } catch (error) {
                        console.error("Failed to parse JSON:", error);
                    }
                }
            }
        }

        return new ReadableStream({
            async start(controller) {
                await Promise.all(aiResponse.split("").map(async character => {
                    controller.enqueue(character);
                }))
                controller.close();
            },
        });
    }

    const responseBody = await response.json();
    return responseBody.choices[0].delta.content;
}

export const handleChat = async (previousContext: { role: string; content: string }[], userInput: string, callback: (message: string) => void) => {
    try {
        const responseStream = await chatWithModel(
            [
                ...previousContext,
                {
                    role: 'user',
                    content: userInput
                }
            ],
            true
        );

        const reader = responseStream.getReader();

        while (true) {
            const { done, value } = await reader.read();

            if (done || !value) break;

            callback(value);
        }
    } catch (error) {
        console.error("Error in chat:", error);
        callback("Something went wrong")
    }
};
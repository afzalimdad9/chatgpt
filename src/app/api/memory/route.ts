import { prisma } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { memory, userId } = await req.json();

    try {
        const newMemory = await prisma.memory.create({
            data: {
                memory,
                userId,
            },
        });

        return NextResponse.json({ data: newMemory, error: null }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error, data: null }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const userId = new URL(req.url).searchParams.get("userId");
        if (!userId) return NextResponse.json({ data: [], error: null });

        const memories = await prisma.memory.findMany({
            where: { userId },
        });

        return NextResponse.json({ data: memories, error: null });
    } catch (error) {
        return NextResponse.json({ data: null, error }, { status: 500 });
    }
}

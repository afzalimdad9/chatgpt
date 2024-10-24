import { prisma } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await prisma.user.findMany({
            where: {
                email: {
                    contains: "alice@prisma.io",
                },
            },
            cacheStrategy: { ttl: 60 },
        });

        if (!user) return NextResponse.json({ error: "User not found", data: null }, { status: 404 });

        return NextResponse.json({ data: user, error: null })
    } catch (error) {
        return NextResponse.json({ data: null, error }, { status: 500 })
    }
}
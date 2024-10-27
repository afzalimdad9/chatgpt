import { messageSelectKeys } from "@/constants";
import { prisma } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const [, chatId] = req.url.split("/").slice(4);
    const chat = await prisma.chat.findUnique({
      where: { id: Number(chatId) },
    });

    if (!chat)
      return NextResponse.json(
        { data: null, error: "Chat not found" },
        { status: 404 }
      );

    const messages = await prisma.message.findMany({
      where: {
        chatId: Number(chatId),
      },
      select: messageSelectKeys,
      orderBy: {
        createdAt: "asc"
      }
    });

    return NextResponse.json({ data: messages, error: null });
  } catch (error) {
    return NextResponse.json({ error, data: null }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const [, chatId] = req.url.split("/").slice(4);
    const chat = await prisma.chat.findUnique({
      where: { id: Number(chatId) },
    });

    if (!chat)
      return NextResponse.json(
        { data: null, error: "Chat not found" },
        { status: 404 }
      );

    const { content, role, userId, isFailed, isLoading } = await req.json();

    if (!content || !role || typeof userId === 'undefined') {
      return NextResponse.json({
        data: null,
        error: "Please provide content, role and userId to body",
      });
    }
    if (!userId) return NextResponse.json({ data: [], error: null });

    const newMessage = await prisma.message.create({
      data: {
        content,
        role,
        chatId: Number(chatId),
        userId,
        isFailed,
        isLoading,
      },
      select: messageSelectKeys
    });

    return NextResponse.json(
      { data: newMessage, error: null },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error, data: null }, { status: 500 });
  }
}

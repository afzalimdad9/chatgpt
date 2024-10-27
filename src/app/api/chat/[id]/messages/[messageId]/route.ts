import { messageSelectKeys } from "@/constants";
import { prisma } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const [, chatId, , messageId] = req.url.split("/").slice(4);
    const chat = await prisma.chat.findUnique({
      where: { id: Number(chatId) },
    });

    if (!chat)
      return NextResponse.json(
        { data: null, error: "Chat not found" },
        { status: 404 }
      );
    const message = await prisma.message.findUnique({
      where: {
        chatId: Number(chatId),
        id: Number(messageId),
      },
      select: messageSelectKeys
    });

    if (!message)
      return NextResponse.json(
        { data: null, error: "Message not found!" },
        { status: 404 }
      );

    return NextResponse.json({ data: message, error: null });
  } catch (error) {
    return NextResponse.json({ error, data: null }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { content, role, userId, isFailed, isLoading } = await req.json();


  if (!role || !content || !userId)
    return NextResponse.json({
      data: null,
      error: "Please provide role, content and userId to body",
    });

  try {
    const [, chatId, , messageId] = req.url.split("/").slice(4);
    const chat = await prisma.chat.findUnique({
      where: { id: Number(chatId) },
    });

    if (!chat)
      return NextResponse.json(
        { data: null, error: "Chat not found" },
        { status: 404 }
      );
    const message = await prisma.message.findUnique({
      where: {
        chatId: Number(chatId),
        id: Number(messageId),
      }
    });

    if (!message)
      return NextResponse.json(
        { data: null, error: "Message not found!" },
        { status: 404 }
      );
    const updatedMessage = await prisma.message.update({
      where: {
        chatId: Number(chatId),
        id: Number(messageId),
        userId,
      },
      data: {
        role,
        isFailed,
        isLoading,
        content,
      },
      select: messageSelectKeys
    });

    return NextResponse.json({ data: updatedMessage, error: null });
  } catch (error) {
    return NextResponse.json({ error, data: null }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const [, chatId, , messageId] = req.url.split("/").slice(4);
    const chat = await prisma.chat.findUnique({
      where: { id: Number(chatId) },
    });

    if (!chat)
      return NextResponse.json(
        { data: null, error: "Chat not found" },
        { status: 404 }
      );
    const message = await prisma.message.findUnique({
      where: {
        chatId: Number(chatId),
        id: Number(messageId),
      },
    });

    if (!message)
      return NextResponse.json(
        { data: null, error: "Message not found!" },
        { status: 404 }
      );

    await prisma.message.delete({
      where: {
        chatId: Number(chatId),
        id: Number(messageId),
      },
    });

    return NextResponse.json({
      data: "Message deleted successfully!",
      error: null,
    });
  } catch (error) {
    return NextResponse.json({ error, data: null }, { status: 500 });
  }
}

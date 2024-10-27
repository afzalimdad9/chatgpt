import { prisma } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!chat)
      return NextResponse.json(
        { error: "Chat not found!", data: null },
        { status: 404 }
      );

    return NextResponse.json({ data: chat, error: null });
  } catch (error) {
    return NextResponse.json({ error, data: null }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { title } = await req.json();
  if (!title)
    return NextResponse.json({
      data: null,
      error: "Please provide title to body",
    });
  try {
    const [, chatId] = req.url.split("/").slice(4);
    const chat = await prisma.chat.findMany({
      where: {
        id: Number(chatId),
      },
    });

    if (!chat)
      return NextResponse.json(
        { data: null, error: "Chat not found!" },
        { status: 404 }
      );

    const updatedChat = await prisma.chat.update({
      where: {
        id: Number(chatId),
      },
      data: {
        title,
      },
    });

    return NextResponse.json({ data: updatedChat, error: null });
  } catch (error) {
    return NextResponse.json({ error, data: null }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const [, chatId] = req.url.split("/").slice(4);
    const chat = await prisma.chat.findMany({
      where: {
        id: Number(chatId),
      },
    });

    if (!chat)
      return NextResponse.json(
        { data: null, error: "Chat not found!" },
        { status: 404 }
      );

    await prisma.chat.delete({
      where: {
        id: Number(chatId),
      },
    });

    return NextResponse.json({
      data: "Chat deleted successfully!",
      error: null,
    });
  } catch (error) {
    return NextResponse.json({ error, data: null }, { status: 500 });
  }
}

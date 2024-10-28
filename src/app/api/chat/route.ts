import { chatWithModel, prisma } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, title, userId } = await req.json();

  let chatTitle = title || '';

  try {
    if (!title) {
      const newTitle = await chatWithModel([
        {
          role: "user",
          content: `You are a helpful assistant. You are given a message and you need to generate a thread title for it. Strictly give the name only don't add extra words. The message is: ${message}`,
        },
      ]);
      chatTitle = newTitle;
    }

    const newChat = await prisma.chat.create({
      data: {
        title: chatTitle,
        userId,
      },
    });

    return NextResponse.json({ data: newChat, error: null }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error, data: null }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const userId = new URL(req.url).searchParams.get("userId");
    if (!userId) return NextResponse.json({ data: [], error: null });

    const chats = await prisma.chat.findMany({
      where: { userId },
    });

    return NextResponse.json({ data: chats, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error }, { status: 500 });
  }
}

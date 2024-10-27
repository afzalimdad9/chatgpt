import { prisma } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const memory = await prisma.memory.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!memory)
      return NextResponse.json(
        { error: "Memory not found!", data: null },
        { status: 404 }
      );

    return NextResponse.json({ data: memory, error: null });
  } catch (error) {
    return NextResponse.json({ error, data: null }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { memory } = await req.json();
  if (!memory)
    return NextResponse.json({
      data: null,
      error: "Please provide memory to body",
    });
  try {
    const [, memoryId] = req.url.split("/").slice(4);
    const memoryExists = await prisma.memory.findMany({
      where: {
        id: Number(memoryId),
      },
    });

    if (!memoryExists)
      return NextResponse.json(
        { data: null, error: "Memory not found!" },
        { status: 404 }
      );

    const updatedmemory = await prisma.memory.update({
      where: {
        id: Number(memoryId),
      },
      data: {
        memory,
      },
    });

    return NextResponse.json({ data: updatedmemory, error: null });
  } catch (error) {
    return NextResponse.json({ error, data: null }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const [, memoryId] = req.url.split("/").slice(4);
    const memory = await prisma.memory.findMany({
      where: {
        id: Number(memoryId),
      },
    });

    if (!memory)
      return NextResponse.json(
        { data: null, error: "Memory not found!" },
        { status: 404 }
      );

    await prisma.memory.delete({
      where: {
        id: Number(memoryId),
      },
    });

    return NextResponse.json({
      data: "memory deleted successfully!",
      error: null,
    });
  } catch (error) {
    return NextResponse.json({ error, data: null }, { status: 500 });
  }
}

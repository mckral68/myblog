import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  const { id } = params; // Dinamik parametreyi al
  const { title, content } = await request.json();
  const updatedPost = await prisma.post.update({
    where: { id: parseInt(id) },
    data: { title, content },
  });
  return new Response(JSON.stringify(updatedPost), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(request, { params }) {
  const { id } = params; // Dinamik parametreyi al
  await prisma.post.delete({
    where: { id: parseInt(id) },
  });
  return new Response(null, { status: 204 });
}

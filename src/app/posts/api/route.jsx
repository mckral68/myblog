import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const posts = await prisma.post.findMany();
  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request) {
  const { title, content } = await request.json();
  const post = await prisma.post.create({
    data: { title, content },
  });
  return new Response(JSON.stringify(post), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

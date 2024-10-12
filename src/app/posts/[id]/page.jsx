import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function PostDetail({ params }) {
  const { id } = params; // Dinamik parametreyi al
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) }, // ID'yi integer olarak kullan
  });
  if (!post) {
    return <h1>Post not found</h1>;
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}

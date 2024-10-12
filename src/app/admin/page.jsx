"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Loading from "./../components/loading";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [loading, setLoading] = useState(false); // Yükleme durumu
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
    }
    fetchPosts();
  }, [session, status, router]);
  const fetchPosts = async () => {
    setLoading(true); // Yüklemeyi başlat
    const response = await fetch("/posts/api");
    if (!response.ok) {
      console.error("Failed to fetch posts");
      setLoading(false); // Yüklemeyi bitir
      return;
    }
    const data = await response.json();
    setPosts(data);
    setLoading(false); // Yüklemeyi bitir
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingPostId ? "PUT" : "POST";
    const url = editingPostId ? `/posts/api/${editingPostId}` : "/posts/api";

    setLoading(true); // Yüklemeyi başlat
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });
    if (response.ok) {
      const newPost = await response.json();
      if (editingPostId) {
        setPosts(
          posts.map((post) => (post.id === editingPostId ? newPost : post))
        );
      } else {
        setPosts([...posts, newPost]);
      }
      setTitle("");
      setContent("");
      setEditingPostId(null);
    } else {
      console.error("Failed to save post");
    }
    setLoading(false); // Yüklemeyi bitir
  };
  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingPostId(post.id);
  };
  const handleDelete = async (id) => {
    setLoading(true); // Yüklemeyi başlat
    const response = await fetch(`/posts/api/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setPosts(posts.filter((post) => post.id !== id));
    } else {
      console.error("Failed to delete post");
    }
    setLoading(false); // Yüklemeyi bitir
  };

  if (loading) {
    return <Loading />; // Yükleme durumu varsa yükleme bileşenini göster
  }
  if (!session) return null;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Başlık"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <textarea
          placeholder="İçerik"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingPostId ? "Güncelle" : "Post Ekle"}
        </button>
      </form>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="my-2 p-4 border rounded shadow">
            <h2 className="font-semibold">{post.title}</h2>
            <Link href={`/posts/${post.id}`}>
              <p className="text-blue-500">Detayları Göster</p>
            </Link>
            <button
              onClick={() => handleEdit(post)}
              className="bg-yellow-500 text-white p-2 rounded ml-2"
            >
              Düzenle
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              className="bg-red-500 text-white p-2 rounded ml-2"
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

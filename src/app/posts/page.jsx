"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/posts/api");
      if (!response.ok) {
        console.error("Failed to fetch posts");
        return;
      }
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/posts/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      const newPost = await response.json();
      setPosts([...posts, newPost]);
      setTitle("");
      setContent("");
    } else {
      console.error("Failed to create post");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Blog Posts</h1>
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
          Post Ekle
        </button>
      </form>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="my-2 p-4 border rounded shadow">
            <h2 className="font-semibold">{post.title}</h2>
            <Link href={`/posts/${post.id}`}>
              <p className="text-blue-500">Detayları Göster</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { ref } from "vue";

export function usePost() {
  const createPost = async (title, content) => {
    // Mock API call - replace this with actual API logic
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        userId: 1, // Example, replace with actual user ID
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    return response.json();
  };

  return { createPost };
}

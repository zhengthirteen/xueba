import { ref } from "vue";

export function useFetchPosts() {
	const posts = ref([
		{ id: 1, title: "帖子标题1", content: "帖子内容1", date: "2024-01-01" },
		{ id: 2, title: "帖子标题2", content: "帖子内容2", date: "2024-01-02" },
	]);

	return { posts };
}

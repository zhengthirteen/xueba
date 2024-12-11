<template>
	<div class="popular-topics">
		<h2>热门帖子</h2>
		<ul>
			<li
				v-for="topic in topics"
				:key="topic.id"
				@click="goToPostDetail(topic.id)"
			>
				<h3>{{ topic.title }}</h3>
				<p>浏览量: {{ topic.score }}</p>
			</li>
		</ul>
	</div>
</template>

<script>
import axios from "../utils/axios";
import { onMounted, ref, inject } from "vue";

export default {
	name: "PopularTopics",
	setup() {
		const topics = ref([]);
		const showAlert = inject("showAlert");
		const router = inject("router");
		const getTopics = async () => {
			try {
				const res = await axios.get("/api/source/postRecommend");
				if (res.data.code === 1) {
					topics.value = res.data.data;
				} else {
					showAlert("获取热门帖子失败，请稍后重试！", false);
				}
			} catch (error) {
				showAlert("获取热门帖子失败，请稍后重试！", false);
			}
		};
		const goToPostDetail = (id) => {
			router.push({
				name: "PostDetail",
				params: { postID: id },
			});
		};
		const test_getTopics = () => {
			topics.value = [
				{
					title: "china",
					score: 1,
					id: 16,
				},
				{
					title: "这是一个帖子标题",
					score: 0,
					id: 13,
				},
				{
					title: "这是一个测试帖子标题",
					score: 0,
					id: 15,
				},
				{
					title: "chinese",
					score: 0,
					id: 14,
				},
			];
		};
		onMounted(() => {
			// test_getTopics(); //测试用
			getTopics(); //正式用
		});

		return {
			topics,
			goToPostDetail,
		};
	},
};
</script>

<style scoped>
.popular-topics ul {
	list-style: none;
	padding: 0;
}
.popular-topics li {
	border: 1px solid #ddd;
	padding: 10px;
	margin: 10px 0;
}
.popular-topics li:hover {
	background-color: #f0f0f0;
	cursor: pointer;
}
</style>

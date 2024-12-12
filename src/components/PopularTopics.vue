<template>
	<div class="popular-topics">
		<h2>热门帖子</h2>
		<ul class="post-list">
			<li
				v-for="topic in topics"
				:key="topic.id"
				@click="goToPostDetail(topic.id)"
				class="post-item"
			>
				<div class="post-header">
					<h3 class="post-title">{{ topic.title }}</h3>
					<p class="post-score">浏览量: {{ topic.score }}</p>
				</div>
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
		
		onMounted(() => {
			getTopics(); 
		});

		return {
			topics,
			goToPostDetail,
		};
	},
};
</script>

<style scoped>
.post-list {
	list-style: none;
	padding: 0;
	margin: 0;
}
.post-item {
	width: 100%;
	margin: 10px 0;
	padding: 15px;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s, transform 0.3s;
	box-sizing: border-box;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	background-color: #f9f9f9;
}
.post-item:hover {
	background-color: #f1f1f1;
	transform: translateY(-5px);
}
.post-header {
	display: flex;
	flex-direction: column;
}
.post-title {
	font-size: 1.2em;
	margin: 0;
}
.post-score {
	color: #888;
	margin-top: 5px;
}
</style>

<template>
	<div class="tag-home">
		<SearchBar :onSearch="handleSearch" />
		<!-- 添加SearchBar组件 -->
		<h2>{{ tagTitle }}</h2>
		<ul class="post-list">
			<li
				v-for="post in posts"
				:key="post.id"
				@click="goToPostDetail(post.id)"
				class="post-item"
			>
				<div class="post-header">
					<div class="author-info">
						<img :src="post.picURL" alt="作者头像" class="author-avatar" />
						<p class="post-author">{{ post.userName }}</p>
					</div>
					<div class="post-info">
						<h3 class="post-title">{{ post.title }}</h3>
						<p class="post-score">浏览量: {{ post.score }}</p>
						<p class="post-tag">标签: {{ getTagName(post.tagID) }}</p>
					</div>
				</div>
			</li>
		</ul>
		<div v-if="posts.length === 0" class="no-results">
			<p class="no-results-text">抱歉，没有找到匹配的结果。</p>
		</div>
	</div>
</template>

<script>
import axios from "../utils/axios";
import { onMounted, ref, inject } from "vue";
import SearchBar from "./SearchBar.vue"; // 引入SearchBar组件

export default {
	name: "TagHome",
	components: {
		SearchBar, // 注册SearchBar组件
	},
	props: {
		tagID: {
			type: Number,
			required: true,
		},
	},
	setup(props) {
		const posts = ref([]);
		const tagTitle = ref("");
		const router = inject("router");

		const tagNames = {
			1: "校园学习",
			2: "打听求助",
			3: "日常趣事",
			4: "恋爱交友",
			5: "资料分享",
		};

		const getTagName = (tagID) => tagNames[tagID] || "未知标签";

		const fetchPosts = async () => {
			try {
				const res = await axios.get("/api/source/classifybytag", {
					params: { type: props.tagID },
				});
				if (res.data.code === 1) {
					const postsData = res.data.data;
					for (const post of postsData) {
						const picRes = await axios.post("/api/source/picture", {
							picID: post.picID,
							status: 0,
						});
						if (picRes.data.code === 1) {
							post.picURL = picRes.data.data.picURL;
						} else {
							post.picURL = "";
						}
					}
					posts.value = postsData;
					tagTitle.value = getTagName(props.tagID);
				} else {
					console.error("获取标签内容失败:", res.data.msg);
				}
			} catch (error) {
				console.error("请求失败:", error);
			}
		};

		const handleSearch = async (query) => {
			if (!query) {
				fetchPosts();
				return;
			}
			try {
				const res = await axios.get("/api/source/search", {
					params: { keyword: query, type: props.tagID },
				});
				if (res.data.code === 1) {
					const searchResultsData = res.data.data;
					for (const post of searchResultsData) {
						const picRes = await axios.post("/api/source/picture", {
							picID: post.picID,
							status: 0,
						});
						if (picRes.data.code === 1) {
							post.picURL = picRes.data.data.picURL;
						} else {
							post.picURL = "";
						}
					}
					posts.value = searchResultsData;
				} else if (res.data.code === 0 && res.data.msg === "No result") {
					posts.value = [];
				} else {
					console.error("搜索失败:", res.data.msg);
				}
			} catch (error) {
				console.error("搜索请求失败:", error);
			}
		};

		const goToPostDetail = (id) => {
			router.push({
				name: "PostDetail",
				params: { postID: id },
			});
		};

		onMounted(() => {
			fetchPosts();
		});

		return {
			posts,
			tagTitle,
			getTagName,
			goToPostDetail,
			handleSearch, // 返回handleSearch函数
		};
	},
};
</script>

<style scoped>
.top-bar {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 20px;
	position: sticky;
	top: 40px;
	background: white;
	padding: 10px;
	transition: opacity 0.5s, top 0.5s;
	z-index: 10;
	width: 80%;
	margin: 0 auto;
	height: auto;
}

.search-container {
	display: flex;
	width: 100%;
}

.search-bar {
	width: 80%;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 5px 0 0 5px;
	height: 50px;
}

.search-button {
	padding: 10px 20px;
	border: none;
	background-color: #007bff;
	color: white;
	border-radius: 0 5px 5px 0;
	cursor: pointer;
	height: 50px;
	width: 20%;
}

.search-button:hover {
	background-color: #0056b3;
}

.post-list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.post-item {
	width: 48%;
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
	align-items: center;
}
.author-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 130px;
	margin-right: 40px;
}
.author-avatar {
	width: 50px;
	height: 50px;
	border-radius: 50%;
	margin-bottom: 5px;
}
.post-author {
	color: #555;
}
.post-info {
	display: flex;
	flex-direction: column;
}
.post-title {
	font-size: 1.5em;
	margin: 0;
	font-weight: bold;
}
.post-score,
.post-tag {
	color: #555;
	margin: 5px 0;
}
.no-results {
	text-align: center;
	margin-top: 20px;
}
.no-results-text {
	font-size: 1.2em;
	color: #555;
}
</style>

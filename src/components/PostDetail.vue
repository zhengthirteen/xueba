<template>
	<div class="layout">
		<!-- 侧边栏 -->
		<Sidebar />
		<!-- 主内容区 -->
		<div class="main">
			<!-- 帖子详情区域 -->
			<div class="post-detail" v-if="post.postDTO">
				<div class="post-header">
					<h2>{{ post.postDTO.postTitle }}</h2>
					<p class="date">发布于：{{ post.postDTO.createTime }}</p>
					<p class="postScore">当前热度：{{ post.postDTO.postScore }}</p>
				</div>

				<div class="post-content">
					<p>{{ post.content }}</p>
				</div>

				<div class="post-actions">
					<button @click="toggleLike" :class="{ liked: isLiked }">
						<img :src="likeImage" alt="点赞" />
						<span>{{ post.postDTO.score }}</span>
					</button>
					<button @click="toggleFavorite" :class="{ favorited: isFavorited }">
						<img :src="favoriteImage" alt="收藏" />
            <span>{{ post.postDTO.collectNum }}</span>
					</button>
					<button @click="sharePost">
						<img src="@/fig/transmit.png" alt="转发" />
					</button>
				</div>

				<div v-if="shareMessage" class="share-message">
					<p>{{ shareMessage }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "../utils/axios";
import Sidebar from "../components/Sidebar.vue"; // 导入 Sidebar 组件
import { usePostActions } from "../hooks/usePostActions"; // 导入自定义 hook
import likeBlack from "@/assets/like_black.png";
import likeRed from "@/assets/like_red.png";
import starBlack from "@/assets/star_black.png";
import starYellow from "@/assets/star_yellow.png";
export default {
	name: "PostDetail",
	components: {
		Sidebar,
	},
	setup() {
		const router = useRouter();
		const post = ref({});

		const showAlert = inject("showAlert");
		const route = useRoute();
		const postID = route.params.postID;

		const {
			isLiked,
			likeImage,
			isFavorited,
			favoriteImage,
			shareMessage,
			toggleLike,
			toggleFavorite,
			sharePost,
		} = usePostActions(post);

		const fetchPostDetails = async () => {
			try {
				const response = await axios.get("/api/source/postAll", {
					params: { postID, userID: localStorage.getItem("user_id") },
				});
				if (response.data.code === 1) {
					post.value = response.data.data;
					console.log(post.value);
					// 设置点赞图标的初始状态

          isLiked.value = post.value.like === 1;
          isFavorited.value = post.value.collect === 1;

          likeImage.value = isLiked.value ? likeRed : likeBlack;
          favoriteImage.value = isFavorited.value ? starYellow : starBlack;
					console.log(likeImage.value);
				} else {
					showAlert(`获取帖子详情失败: ${response.data.msg}`, false);
				}
			} catch (error) {
				showAlert("获取帖子详情失败，请稍后重试！", false);
			}
		};

		onMounted(() => {
			fetchPostDetails();
		});

		return {
			post,
			isLiked,
			likeImage,
			isFavorited,
			favoriteImage,
			shareMessage,
			toggleLike,
			toggleFavorite,
			sharePost,
		};
	},
};
</script>

<style scoped>
.layout {
	display: flex;
	height: 100%;
	margin: 0 auto;
	width: 75vw;
	margin-left: 10vw;
}

.main {
	position: fixed;
	top: 80px;
	width: 80%;
	padding: 20px;
	overflow-y: auto;
}

.post-detail {
	padding: 20px;
	background-color: #f9f9f9;
	border-radius: 8px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	max-width: 800px;
	margin: 0 auto;
}

.post-header {
	margin-bottom: 20px;
}

h2 {
	font-size: 28px;
	margin-bottom: 10px;
}

.author,
.date {
	color: #888;
	font-size: 14px;
}

.post-content {
	font-size: 16px;
	line-height: 1.5;
	margin-bottom: 20px;
}

.post-actions {
	display: flex;
	justify-content: space-around;
	margin-top: 20px;
}

.post-actions button {
	display: flex;
	align-items: center;
	padding: 10px;
	background-color: transparent;
	border: none;
	cursor: pointer;
}

.post-actions button img {
	width: 30px;
	height: 30px;
}

.post-actions button span {
	margin-left: 5px;
	font-size: 20px;
	color: #888;
}

.share-message {
	margin-top: 20px;
	font-size: 16px;
	color: #28a745;
}
</style>

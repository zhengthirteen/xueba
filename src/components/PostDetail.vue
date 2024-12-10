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
					<p class="date">浏览量：{{ post.postDTO.postScore }}</p>
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
						<img :src="transmitImage" alt="转发" />
					</button>
				</div>

				<div v-if="shareMessage" class="share-message">
					<p>{{ shareMessage }}</p>
				</div>

				<!-- 评论输入框 -->
				<div class="comment-input">
					<textarea
						v-model="commentContent"
						placeholder="发表评论..."
					></textarea>
					<button @click="reply_p">提交评论</button>
				</div>

				<!-- 评论列表 -->
				<ul class="comments">
					<li v-if="!post.msgDTOList || !post.msgDTOList.length">
						暂未有用户评论哦~，快来抢沙发
					</li>
					<li
						v-else
						v-for="comment in post.msgDTOList"
						:key="comment.msgID"
						class="comment"
					>
						<img
							:src="comment.userDTO.picURL"
							alt="用户头像"
							class="user-avatar"
						/>
						<div class="comment-content">
							<p class="user-name">{{ comment.userDTO.userName }}</p>
							<p class="comment-text">{{ comment.msgContent }}</p>
							<p class="comment-time">{{ comment.msgTime }}</p>
						</div>
					</li>
				</ul>
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
import transmitBlack from "@/assets/transmit.png";
import transmitblue from "@/assets/transmit2.png";

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
			commentContent,
			toggleLike,
			toggleFavorite,
			sharePost,
			replyPost,
			transmitImage,
		} = usePostActions(post);

		const fetchPostDetails = async () => {
			try {
				const response = await axios.get("/api/source/postAll", {
					params: { postID, userID: localStorage.getItem("user_id") },
				});
				if (response.data.code === 1) {
					post.value = response.data.data;

					// 设置点赞图标的初始状态
					isLiked.value = post.value.like === 1;
					isFavorited.value = post.value.collect === 1;
					likeImage.value = isLiked.value ? likeRed : likeBlack;
					favoriteImage.value = isFavorited.value ? starYellow : starBlack;

					await Promise.all(
						post.value.msgDTOList.map(async (comment) => {
							const picResponse = await axios.post("/api/source/picture", {
								picID: comment.userDTO.picID,
								status: 0,
							});
							if (picResponse.data.code === 1) {
								comment.userDTO.picURL = picResponse.data.data.picURL;
							} else {
								comment.userDTO.picURL = ""; // 设置默认头像或处理错误
							}
						})
					);
				} else {
					showAlert(`获取帖子详情失败: ${response.data.msg}`, false);
				}
			} catch (error) {
				showAlert("获取帖子详情失败，请稍后重试！", false);
			}
		};
		function handleMouseenter() {
			console.log(1);
			transmitImage.value = transmitblue;
		}
		function handleMouseleave() {
			transmitImage.value = transmitBlack;
		}

		onMounted(() => {
			fetchPostDetails();
			console.log(transmitImage.value);
		});
		async function reply_p() {
			await replyPost();
			await fetchPostDetails();
		}

		return {
			post,
			isLiked,
			likeImage,
			isFavorited,
			favoriteImage,
			shareMessage,
			commentContent,
			toggleLike,
			toggleFavorite,
			sharePost,
			replyPost,
			reply_p,
			transmitImage,
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
	position: relative;
	top: 80px;
	width: 100vw;
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

.comment-input {
	margin-top: 20px;
	display: flex;
	flex-direction: column;
}

.comment-input textarea {
	width: 100%;
	height: 100px;
	padding: 10px;
	margin-bottom: 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
	resize: none;
}

.comment-input button {
	align-self: flex-end;
	padding: 10px 20px;
	background-color: #007bff;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

.comments {
	margin-top: 20px;
	list-style-type: none;
	padding: 0;
}

.comment {
	display: flex;
	align-items: flex-start;
	margin-bottom: 20px;
}

.user-avatar {
	width: 50px;
	height: 50px;
	border-radius: 50%;
	margin-right: 10px;
}

.comment-content {
	background-color: #f1f1f1;
	padding: 10px;
	border-radius: 4px;
	width: 100%;
}

.user-name {
	font-weight: bold;
	margin-bottom: 5px;
}

.comment-text {
	margin-bottom: 5px;
}

.comment-time {
	font-size: 12px;
	color: #888;
}
</style>

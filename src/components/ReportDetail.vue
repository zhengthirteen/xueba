<template>
	<div class="layout">
		<!-- 主内容区 -->
		<div class="main">
			<!-- 帖子详情区域 -->
			<div class="post-detail" v-if="post.postDTO">
				<div class="post-header">
					<h2>{{ post.postDTO.postTitle }}</h2>
					<div class="author-info">
						<img
							:src="authorAvatar"
							alt="作者头像"
							class="author-avatar"
							@mouseenter="handleAvatarMouseenter"
							@mouseleave="handleAvatarMouseleave"
							@click="goToPostToUser"
							:class="{ 'avatar-hover': isAvatarHovered }"
						/>
						<p class="author-name">{{ authorName }}</p>
					</div>
					<p class="author-id">作者ID：{{ authorID }}</p>
					<p class="date">发布于：{{ post.postDTO.createTime }}</p>
					<p class="date">标签：{{ getTagName(post.postDTO.tagID) }}</p>
					<p class="date">浏览量：{{ post.postDTO.postScore }}</p>
				</div>

				<div class="post-content">
					<p>{{ post.content }}</p>
					<!-- 图片展示区域 -->
					<div v-if="post.pictureDTOList[0]" class="image-preview">
						<img :src="post.pictureDTOList[0].picURL" alt="帖子图片" />
					</div>
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
						:class="{ reported: isReported(comment.msgID) }"
					>
						<img
							:src="comment.userDTO.picURL"
							alt="用户头像"
							class="user-avatar"
							@mouseenter="handleCommentAvatarMouseenter(comment.msgID)"
							@mouseleave="handleCommentAvatarMouseleave(comment.msgID)"
							@click="goToUserPage(comment.userDTO.userID)"
							:class="{ 'avatar-hover': isCommentAvatarHovered[comment.msgID] }"
						/>
						<div class="comment-content">
							<p class="user-name">{{ comment.userDTO.userName }}</p>
							<p class="comment-text">{{ comment.msgContent }}</p>
							<p class="comment-time">{{ comment.msgTime }}</p>
							<!-- 举报者信息 -->
							<div v-if="isReported(comment.msgID)" class="report-details">
								<p>举报者信息：</p>
								<ul>
									<li v-for="report in reportDetails" :key="report.reportID">
										<p>举报者：{{ report.reporterName }}</p>
										<p>举报理由：{{ report.reportContent }}</p>
										<p>举报时间：{{ report.reportTime }}</p>
									</li>
								</ul>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<!-- 返回按钮 -->
	<button class="return-button" @click="goBack">
		<img src="@/assets/return.png" alt="返回" />
	</button>
</template>
<script>
import { ref, onMounted, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "../utils/axios";

export default {
	name: "ReportDetail",
	props: {
		msgID: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		const router = useRouter();
		const post = ref({});
		const authorAvatar = ref("");
		const authorName = ref("");
		const authorID = ref("");
		const isAvatarHovered = ref(false);
		const isCommentAvatarHovered = ref({});
		const reportedMsgIDs = ref([]);
		const reportDetails = ref([]);

		const showAlert = inject("showAlert");
		const route = useRoute();
		const msgID = props.msgID;
		const tagNames = {
			1: "校园学习",
			2: "打听求助",
			3: "日常趣事",
			4: "恋爱交友",
			5: "资料分享",
		};
		const getTagName = (tagID) => tagNames[tagID] || "未知标签";

		const fetchReportDetails = async () => {
			try {
				const response = await axios.get("/api/backstage/getreportdetail", {
					params: { msgID },
				});
				if (response.data.code === 1) {
					post.value = response.data.data;

					authorName.value = post.value.postDTO.userName;
					authorID.value = post.value.postDTO.userID;
					const picResponse = await axios.post("/api/source/picture", {
						picID: post.value.postDTO.picID,
						status: 0,
					});
					if (picResponse.data.code === 1) {
						authorAvatar.value = picResponse.data.data.picURL;
					} else {
						authorAvatar.value = ""; // 设置默认头像或处理错误
						showAlert("获取作者头像失败，请稍后再试！", false);
					}

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

					// 所有被举报的评论ID均为props参数msgID
					reportedMsgIDs.value = msgID;

                    // 找出所有与当前msgID相关的举报详情
                    reportDetails.value = post.value.reporterList;
				} else {
					showAlert(`获取举报详情失败: ${response.data.msg}`, false);
				}
			} catch (error) {
				showAlert("获取举报详情失败，请稍后重试！", false);
			}
		};

		function handleAvatarMouseenter() {
			isAvatarHovered.value = true;
		}
		function handleAvatarMouseleave() {
			isAvatarHovered.value = false;
		}
		function handleCommentAvatarMouseenter(msgID) {
			isCommentAvatarHovered.value = {
				...isCommentAvatarHovered.value,
				[msgID]: true,
			};
		}
		function handleCommentAvatarMouseleave(msgID) {
			isCommentAvatarHovered.value = {
				...isCommentAvatarHovered.value,
				[msgID]: false,
			};
		}
		function goToPostToUser() {
			router.push({ name: "PostToUser", params: { userID: authorID.value } });
		}
		function goToUserPage(userID) {
			router.push({ name: "PostToUser", params: { userID } });
		}
		function isReported(may_id) {
			return may_id === parseInt(msgID);
		}

		onMounted(() => {
			fetchReportDetails();
		});

		function goBack() {
			router.go(-1);
		}

		return {
			post,
			authorAvatar,
			authorName,
			authorID,
			goBack,
			isAvatarHovered,
			handleAvatarMouseenter,
			handleAvatarMouseleave,
			handleCommentAvatarMouseenter,
			handleCommentAvatarMouseleave,
			isCommentAvatarHovered,
			goToPostToUser,
			goToUserPage,
			getTagName,
			isReported,
			reportDetails,
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
	top: 3vh;
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
	transition: filter 0.3s;
}

.user-avatar.avatar-hover {
	filter: brightness(0.7);
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

.image-preview {
	margin-top: 15px;
	text-align: center;
}

.image-preview img {
	width: 100%;
	max-width: 100%;
	height: auto;
	border: 1px solid #ccc;
	border-radius: 4px;
}

.author-info {
	display: flex;
	align-items: center;
	margin-top: 10px;
	margin-bottom: 10px;
}

.author-avatar {
	width: 50px;
	height: 50px;
	border-radius: 50%;
	margin-right: 10px;
	transition: filter 0.3s;
}

.author-avatar.avatar-hover {
	filter: brightness(0.7);
}

.author-name {
	font-weight: bold;
	margin-right: 10px;
}

.author-id {
	color: #888;
	font-size: 14px;
}

.return-button {
	position: fixed;
	top: 10vh;
	left: 20vw;
	background-color: transparent;
	border: none;
	cursor: pointer;
}

.return-button img {
	width: 30px;
	height: 30px;
}

.reported{
	border-right: 5px solid red;
}

.report-details {
	background-color: #ffe6e6;
	padding: 10px;
	border-radius: 4px;
	margin-top: 10px;
}
</style>

<template>
	<div class="layout">
		<Sidebar />
		<div class="main">
			<!-- 导航栏 -->
			<nav class="navbar">
				<ul>
					<li><router-link to="/profile">我的</router-link></li>
					<li><router-link to="/publish">发表</router-link></li>
					<li><router-link to="/favorites">收藏夹</router-link></li>
				</ul>
			</nav>

			<!-- 帖子列表 -->
			<div class="posts-list">
				<h2>发表过的帖子</h2>
				<p v-if="posts.length === 0">暂无发表的帖子</p>
				<!-- 帖子项列表 -->
				<ul>
					<li
						v-for="post in posts"
						:key="post.id"
						@click="goToPost(post.id)"
						:class="{ hidden: post.hidden }"
					>
						<h3>{{ post.title }}</h3>
						<p>浏览量：{{ post.hotness }}</p>
						<!-- 删除和隐藏按钮 -->
						<div class="post-actions">
							<button @click.stop="deletePost(post.id)">删除</button>
							<button @click.stop="toggleHide(post.id)">
								{{ post.hidden ? "显示" : "隐藏" }}
							</button>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import Sidebar from "../components/Sidebar.vue";
import { useRouter } from "vue-router";
import axios from "../utils/axios";

export default {
	name: "PublishPage",
	components: {
		Sidebar,
	},
	setup() {
		const posts = ref([]);
		const showAlert = inject("showAlert");
		const showConfirm = inject("showConfirm");
		const router = useRouter();

		const fetchPosts = async () => {
			try {
				const userID = localStorage.getItem("user_id");
				const res = await axios.get("/api/post/myposts", {
					params: {
						userID: userID,
					},
				});
				if (res.data.code === 1) {
					posts.value = res.data.data.map((post) => ({
						id: post.postID,
						title: post.postTitle,
						hotness: post.postScore,
						hidden: post.status === 1,
					}));
				} else {
					showAlert("获取帖子数据失败", false);
				}
			} catch (error) {
				showAlert("获取帖子数据失败，请稍后重试", false);
			}
		};

		const goToPost = (postId) => {
			router.push({
				name: "PostDetail",
				params: { postID: postId },
			});
		};

		const deletePost = (postId) => {
			if (showAlert) {
				showConfirm(
					"确认删除此帖子吗？",
					"删除成功",
					true,
					async (confirmed) => {
						if (confirmed) {
							try {
								const userID = localStorage.getItem("user_id");
								const res = await axios.post("/api/post/deletepost", {
									userID: userID,
									postID: postId,
								});
								if (res.data.code === 1) {
									posts.value = posts.value.filter(
										(post) => post.id !== postId
									);
									showAlert("删除成功");
								} else {
									showAlert("删除失败，请稍后重试");
								}
							} catch (error) {
								showAlert("删除失败，请稍后重试");
							}
						} else {
							showAlert("删除操作已取消");
						}
					}
				);
			}
		};

		const toggleHide = (postId) => {
			const post = posts.value.find((post) => post.id === postId);
			if (post) {
				post.hidden = !post.hidden;
				if (showAlert) {
					showAlert(post.hidden ? "帖子已隐藏！" : "帖子已显示！", post.hidden);
				}
			}
		};

		onMounted(() => {
			fetchPosts();
		});

		return {
			posts,
			goToPost,
			deletePost,
			toggleHide,
		};
	},
};
</script>

<style scoped>
html,
body {
	height: 100%;
	margin: 0;
}
/* 主容器 */
.layout {
	display: flex;
	height: 100vh;
	margin: 0 auto;
	width: 80vw;
	margin-left: 10vw;
}
/* 导航栏样式 */
.navbar {
	position: fixed; /* 固定定位 */
	top: 0; /* 置顶 */
	left: 180px; /* 左对齐 */
	width: calc(100% - 180px); /* 宽度铺满整个屏幕 */
	background-color: lightgray; /* 背景颜色 */
	padding: 10px 0; /* 上下内边距 */
	text-align: center; /* 内容居中 */
	font-size: 20px;
	z-index: 10; /* 确保导航栏在最前面 */
}

.navbar ul {
	list-style-type: none;
	margin: 0;
	padding: 0;
	display: flex; /* 使用 flex 布局 */
	justify-content: center; /* 横向居中对齐 */
}

.navbar li {
	margin: 0 15px; /* 每个选项之间的间距 */
}

.navbar a {
	color: white;
	text-decoration: none;
}

.navbar a:hover {
	text-decoration: underline;
}
/* 主内容区 */
.main {
	top: -10px;
	flex-grow: 1;
	width: 80%;
	padding: 20px;
}

/* 帖子列表样式 */
.post-list {
	list-style-type: none;
	padding: 0;
	margin: 0;
}
.posts-list h2 {
	color: gray;
}
.posts-list p {
	font-size: 20px;
	font-weight: 400;
}
.post-item {
	width: 100%; /* 确保占满全宽 */
	background-color: #f9f9f9;
	margin: 10px 0;
	padding: 15px;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s;
	box-sizing: border-box; /* 确保内外边距不会影响宽度 */
}

.post-item:hover {
	background-color: #f1f1f1;
}

h3 {
	margin: 0;
	font-size: 25px;
	font-weight: 600;
}

p {
	margin: 5px 0;
	color: #888;
}

/* 隐藏帖子时，灰度效果 */
.post-item.hidden {
	filter: grayscale(100%);
}

/* 按钮样式 */
.post-actions {
	margin-top: 10px;
}

.post-actions button {
	margin-right: 10px;
	padding: 5px 10px;
	background-color: #007bff;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

.post-actions button:hover {
	background-color: #0056b3;
}
h2 {
	text-align: center; /* 将标题居中对齐 */
	margin: 40px 0; /* 增加上下的外边距，让标题有更多空间 */
	font-size: 36px; /* 增加字体大小，让标题更加显眼 */
	font-weight: 700; /* 更粗的字体，增加视觉冲击力 */
	letter-spacing: 2px; /* 字母间距，增加可读性 */
	color: #333; /* 设置字体颜色 */

	/* 使用渐变背景 */
	background: linear-gradient(to right, #ff7f50, #ffd700);
	-webkit-background-clip: text; /* WebKit内核浏览器支持 */
	background-clip: text; /* 标准浏览器支持 */
	color: transparent; /* 使文字颜色透明，展示渐变背景 */

	/* 给文字添加阴影效果，使其更有层次感 */
	text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 0, 0, 0.2);

	/* 增加内边距 */
	padding: 10px;

	/* 增加边框，给标题加点装饰 */
	border-bottom: 2px solid grey;
}
</style>

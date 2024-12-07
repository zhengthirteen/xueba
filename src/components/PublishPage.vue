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
				<div
					class="post-item"
					v-for="post in posts"
					:key="post.id"
					@click="goToPost(post.id)"
					:class="{ hidden: post.hidden }"
				>
					<h3>{{ post.title }}</h3>
					<p>热度：{{ post.hotness }}</p>

					<!-- 删除和隐藏按钮 -->
					<div class="post-actions">
						<button @click.stop="deletePost(post.id)">删除</button>
						<button @click.stop="toggleHide(post.id)">
							{{ post.hidden ? "显示" : "隐藏" }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import Sidebar from "../components/Sidebar.vue";
import { useRouter } from "vue-router";
//   export default {
//   name: "PublishPage",
//   data() {
//     return {
//       posts: [], // 初始化为空数组
//     };
//   },
//   methods: {
//     // 跳转到具体帖子页面
//     goToPost(postId) {
//       this.$router.push(`/post/${postId}`);
//     },

//     // 从后端获取帖子列表数据
//     async fetchPosts() {
//       try {
//         const response = await axios.get("https://your-api-endpoint.com/api/posts"); // 你的后端 API 地址
//         this.posts = response.data; // 假设返回的数据是一个帖子数组
//       } catch (error) {
//         console.error("获取帖子数据失败:", error);
//         alert("获取数据失败，请稍后重试！");
//       }
//     },

//     // 删除帖子
//     async deletePost(postId) {
//       if (confirm("确认删除此帖子吗？")) {
//         try {
//           const response = await axios.delete(`https://your-api-endpoint.com/api/posts/${postId}`);
//           if (response.data.success) {
//             this.posts = this.posts.filter(post => post.id !== postId); // 从本地移除已删除的帖子
//             alert("帖子已删除！");
//           } else {
//             alert("删除失败，请稍后重试！");
//           }
//         } catch (error) {
//           console.error("删除失败", error);
//           alert("删除失败，请稍后再试！");
//         }
//       }
//     },

//     // 切换隐藏状态
//     toggleHide(postId) {
//       const post = this.posts.find(post => post.id === postId);
//       if (post) {
//         post.hidden = !post.hidden; // 切换隐藏状态
//         // 如果需要从后端同步隐藏状态，可以发送更新请求
//         axios.post(`https://your-api-endpoint.com/api/posts/${postId}/hide`, { hidden: post.hidden });
//       }
//     },
//   },
//   mounted() {
//     this.fetchPosts(); // 组件加载后，获取帖子数据
//   },
// };
export default {
	name: "PublishPage",
	components: {
		Sidebar,
	},
	setup() {
		// 注入 showAlert 方法
		const showAlert = inject("showAlert");
		const showConfirm = inject("showConfirm");

		// 定义响应式数据
		const posts = ref([]);

		const router = useRouter();

		// 跳转到具体帖子页面
		const goToPost = (postId) => {
			router.push(`/post/${postId}`);
		};

		// 模拟从后端获取帖子数据
		const fetchPosts = () => {
			setTimeout(() => {
				posts.value = [
					{ id: 1, title: "第一个帖子", hotness: 120, hidden: false },
					{ id: 2, title: "第二个帖子", hotness: 95, hidden: false },
					{ id: 3, title: "第三个帖子", hotness: 70, hidden: false },
					{ id: 4, title: "第四个帖子", hotness: 120, hidden: false },
					{ id: 5, title: "第五个帖子", hotness: 95, hidden: false },
					{ id: 6, title: "第六个帖子", hotness: 70, hidden: false },
				];
			}, 100); // 模拟1秒钟的延迟
		};

		// 删除帖子
		const deletePost = (postId) => {
			// 使用 showAlert 代替 confirm 显示删除确认
			if (showAlert) {
				showConfirm("确认删除此帖子吗？", "删除成功", true, (confirmed) => {
					if (confirmed) {
						// 模拟删除操作
						setTimeout(() => {
							posts.value = posts.value.filter((post) => post.id !== postId); // 从本地移除已删除的帖子
						}, 500); // 模拟删除延迟
					} else {
						showAlert("删除操作已取消");
					}
				}).catch(() => {
					console.error("showAlert 错误！");
				});
			} else {
				console.error("showAlert 方法未定义！");
			}
		};
		// 切换隐藏状态
		const toggleHide = (postId) => {
			const post = posts.value.find((post) => post.id === postId);
			if (post) {
				post.hidden = !post.hidden; // 切换隐藏状态
				setTimeout(() => {
					if (showAlert) {
						if (post.hidden) {
							showAlert("帖子已隐藏！", false);
						} else {
							showAlert("帖子已显示！", true);
						}
					}
				}, 500); // 模拟更新延迟
			}
		};

		// 在组件加载时获取数据
		onMounted(() => {
			fetchPosts(); // 获取帖子数据
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
	font-size: 18px;
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
	border-bottom: 2px solid #ffd700;
}
</style>

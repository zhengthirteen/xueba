<template>
	<div class="layout">
		<!-- 侧边栏 -->
		<Sidebar />
		<!-- 主内容区 -->
		<div class="main">
			<!-- 帖子发布区域 -->
			<div class="post-editor">
				<h2>发布新帖子</h2>
				<form @submit.prevent="submitPost">
					<div class="form-group">
						<label for="title">标题</label>
						<input
							type="text"
							id="title"
							v-model="postTitle"
							placeholder="请输入帖子标题"
							required
						/>
					</div>
					<div class="form-group">
						<label for="content">内容</label>
						<textarea
							id="content"
							v-model="postContent"
							placeholder="请输入帖子内容"
							required
						></textarea>
					</div>

					<!-- 插入功能按钮 -->
					<div class="form-group">
						<button type="button" @click="toggleImageUpload">
							<img src="@/fig/picture.png" alt="插入图片" />
							<span>图片</span>
						</button>
						<button type="button" @click="toggleEmojiPicker">
							<img src="@/fig/smile.png" alt="插入表情" />
							<span>表情</span>
						</button>
					</div>

					<!-- 图片上传功能 -->
					<div v-if="isImageUploadVisible" class="image-upload">
						<input type="file" @change="handleImageUpload" />
					</div>

					<!-- 图片展示区域 -->
					<div v-if="imageUrl" class="image-preview">
						<img :src="imageUrl" alt="上传的图片" />
					</div>

					<!-- 表情选择功能 -->
					<div v-if="isEmojiPickerVisible" class="emoji-picker">
						<button type="button" @click="insertEmoji('😊')">😊</button>
						<button type="button" @click="insertEmoji('😂')">😂</button>
						<button type="button" @click="insertEmoji('😎')">😎</button>
						<button type="button" @click="insertEmoji('😍')">😍</button>
						<button type="button" @click="insertEmoji('😭')">😭</button>
					</div>

					<!-- 发布按钮（添加样式，放在右下角） -->
					<div class="submit-button-container">
						<button type="submit" class="submit-button">发布</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "../components/Sidebar.vue"; // 导入 Sidebar 组件
import axios from "../utils/axios"; // 导入 axios

export default {
	name: "PostEditor",
	components: {
		Sidebar,
	},
	setup() {
		const router = useRouter();
		const postTitle = ref("");
		const postContent = ref("");
		const userID = parseInt(localStorage.getItem("user_id")); // 获取用户 ID
		const showAlert = inject("showAlert"); // 使用 inject 获取 showAlert 函数

		// 控制显示/隐藏各个功能区域
		const isImageUploadVisible = ref(false);
		const isEmojiPickerVisible = ref(false);
		const imageUrl = ref(""); // 存储图片URL

		// 发布帖子函数
		const submitPost = async () => {
			try {
				let uploadedImageUrl = imageUrl.value;
				if (uploadedImageUrl) {
					const formData = new FormData();
					const response = await fetch(uploadedImageUrl);
					const blob = await response.blob();
					formData.append("image", blob, "postImage.jpg");

					const uploadResponse = await axios.post(
						"/api/user/upload",
						formData,
						{
							headers: {
								"Content-Type": "multipart/form-data",
							},
						}
					);

					if (uploadResponse.status === 200 && uploadResponse.data.code === 1) {
						uploadedImageUrl = uploadResponse.data.data;
					} else {
						showAlert("图片上传失败，请稍后再试！", false);
						return;
					}
				}

				const response = await axios.post("/api/post/publishpost", {
					pdto: {
						userID: userID,
						postTitle: postTitle.value,
					},
					mdto: {
						content: postContent.value,
						userID: userID,
					},
					picdto: {
						url: uploadedImageUrl || "",
					},
				});

				if (response.data.code === 1) {
					showAlert("帖子发布成功！", true);
					router.push("/"); // 发布成功后跳转到主页或其他页面
				} else {
					showAlert("发布失败，请检查是否有违规内容，请稍后再试！", false);
				}
			} catch (error) {
				showAlert("发布失败，请稍后再试！", false);
			}
		};

		// 控制图片上传显示
		const toggleImageUpload = () => {
			isImageUploadVisible.value = !isImageUploadVisible.value;
			isEmojiPickerVisible.value = false; // 关闭表情选择框
		};

		// 控制表情选择框显示
		const toggleEmojiPicker = () => {
			isEmojiPickerVisible.value = !isEmojiPickerVisible.value;
			isImageUploadVisible.value = false; // 关闭图片上传框
		};

		// 处理图片上传
		const handleImageUpload = (event) => {
			const file = event.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					imageUrl.value = e.target.result;
				};
				reader.readAsDataURL(file); // 转换图片为 base64 格式
			}
		};

		// 插入表情
		const insertEmoji = (emoji) => {
			postContent.value += emoji; // 将表情插入到内容框
		};

		return {
			postTitle,
			postContent,
			submitPost,
			toggleImageUpload,
			toggleEmojiPicker,
			isImageUploadVisible,
			isEmojiPickerVisible,
			handleImageUpload,
			insertEmoji,
			imageUrl,
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

.post-editor {
	padding: 20px;
	background-color: #f4f4f4;
	border-radius: 8px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	max-width: 800px;
	margin: 0 auto;
	position: relative; /* 使发布按钮能够相对定位 */
}

h2 {
	text-align: center;
	font-size: 24px;
	margin-bottom: 20px;
}

.form-group {
	margin-bottom: 15px;
}

input[type="text"],
textarea,
input[type="file"] {
	width: 100%;
	padding: 12px;
	font-size: 16px;
	margin-top: 5px;
	border: 1px solid #ccc;
	border-radius: 4px;
	box-sizing: border-box;
}

textarea {
	resize: vertical;
	min-height: 150px;
}

button {
	width: auto;
	padding: 8px 15px;
	background-color: transparent;
	border: none;
	font-size: 16px;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
}

button img {
	width: 30px;
	height: 30px;
	margin-right: 5px;
}

button:hover {
	opacity: 0.8;
}

/* 插入功能按钮 */
button[type="button"] {
	margin-right: 15px;
}

.image-upload,
.emoji-picker {
	margin-top: 15px;
}

/* 表情选择按钮 */
.emoji-picker {
	display: flex;
	justify-content: space-between;
	margin-top: 10px;
}

.emoji-picker button {
	padding: 5px 10px;
	font-size: 20px;
}

/* 发布按钮的样式 */
.submit-button-container {
	position: absolute;
	right: 20px;
	bottom: 20px;
}

.submit-button {
	padding: 10px 20px;
	background-color: #4caf50;
	color: white;
	border: 1px solid #4caf50;
	border-radius: 5px;
	font-size: 16px;
	cursor: pointer;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.submit-button:hover {
	background-color: #45a049;
}
/* 图片展示区域 */
.image-preview {
	margin-top: 15px;
	text-align: center;
}

.image-preview img {
	width: 100%; /* 设置图片宽度与内容输入框一致 */
	max-width: 100%;
	height: auto;
	border: 1px solid #ccc;
	border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.layout {
		flex-direction: column;
		width: 100vw;
		margin-left: 0;
	}

	.main {
		position: relative;
		top: 0;
		width: 100%;
	}

	.form-group {
		margin-bottom: 10px;
	}

	.emoji-picker button {
		font-size: 18px;
	}
}
</style>

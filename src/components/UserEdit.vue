<template>
	<div class="layout">
		<!-- 侧边栏 -->
		<Sidebar />

		<!-- 主内容区 -->
		<div class="main">
			<!-- 用户编辑资料部分 -->
			<div class="profile-photo">
				<!-- 隐藏的文件输入框，当点击头像时触发 -->
				<input
					type="file"
					accept="image/*"
					ref="fileInput"
					@change="handleAvatarChange"
					style="display: none"
				/>

				<!-- 头像区域，鼠标悬停时会出现更换文字 -->
				<div class="avatar-wrapper" @click="triggerFileInput">
					<img :src="user.avatar" alt="用户头像" class="avatar" />
					<span class="change-text">更换</span>
				</div>
			</div>

			<div class="user-info">
				<label for="email">用户名：</label>
				<input
					class="name"
					v-model="user.name"
					type="text"
					placeholder="用户名"
				/>
				<label for="email">个人简介：</label>
				<textarea v-model="user.bio" placeholder="个人简介"></textarea>
				<label for="gender">性别：</label>
				<select id="gender" v-model="user.gender">
					<option value="保密">保密</option>
					<option value="男">男</option>
					<option value="女">女</option>
				</select>
				<label for="status">状态：</label>
				<select id="status" v-model="user.status">
					<option value="在线">在线</option>
					<option value="忙碌">忙碌</option>
					<option value="隐身">隐身</option>
				</select>
				<label for="email">邮箱：</label>
				<input
					id="email"
					v-model="email"
					type="email"
					placeholder="请输入邮箱"
				/>
				<label for="phone">手机号：</label>
				<input
					id="phone"
					v-model="phone"
					type="tel"
					placeholder="请输入手机号"
				/>
				<label for="address">地址：</label>
				<input
					id="address"
					v-model="address"
					type="text"
					placeholder="请输入地址"
				/>
				<label for="school">学校：</label>
				<input
					id="school"
					v-model="school"
					type="text"
					placeholder="请输入学校"
				/>
			</div>

			<div class="action-buttons">
				<button @click="saveProfile">保存</button>
				<button @click="cancelEdit">取消</button>
			</div>
		</div>
	</div>
</template>

<script>
import { ref } from "vue";
import Sidebar from "../components/Sidebar.vue"; // 导入 Sidebar 组件
import { useRouter } from "vue-router"; // 导入 Vue Router
import axios from "../utils/axios";
export default {
	name: "UserEdit",
	components: {
		Sidebar,
	},
	setup() {
		const router = useRouter();

		// 假设我们从父组件传入用户数据
		const user = ref({
			name: "用户名",
			bio: "这里是用户的个人简介。",
			avatar: "https://via.placeholder.com/100",
			status: "在线",
			gender: "保密", // 性别字段可以修改
		});

		const email = ref("user@example.com");
		const phone = ref("+1 234 567 890");
		const address = ref("1234 Elm Street, Springfield, IL");
		const school = ref("Springfield University");

		// 触发文件输入框
		const triggerFileInput = () => {
			const fileInput = document.querySelector('input[type="file"]');
			fileInput.click();
		};

		// 处理头像更改
		const handleAvatarChange = (event) => {
			const file = event.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = () => {
					user.value.avatar = reader.result;
				};
				reader.readAsDataURL(file);
			}
		};

		// 保存用户信息
		const saveProfile = async () => {
			const userData = {
				name: user.value.name,
				bio: user.value.bio,
				avatar: user.value.avatar,
				status: user.value.status,
				gender: user.value.gender,
				email: email.value,
				phone: phone.value,
				address: address.value,
				school: school.value,
			};

			try {
				const response = await axios.post(
					"https://your-api-endpoint.com/api/user/update",
					userData
				);
				if (response.data.success) {
					alert("资料已保存");
					router.push("/profile");
				} else {
					alert("保存失败，请稍后再试！");
				}
			} catch (error) {
				console.error("保存失败", error);
				alert("保存失败，请稍后再试！");
			}
		};

		// 取消编辑
		const cancelEdit = () => {
			router.push("/profile");
		};

		return {
			user,
			email,
			phone,
			address,
			school,
			saveProfile,
			cancelEdit,
			triggerFileInput,
			handleAvatarChange,
		};
	},
};
</script>

<style scoped>
/* 主容器 */
.layout {
	display: flex;
	height: 100%;
	margin: 0 auto;
	width: 75vw;
	margin-left: 10vw;
	position: relative;
}

/* 主内容区 */
.main {
	margin-left: 200px;
	padding-top: 20px;
	flex-grow: 1;
	height: 100%;
	overflow: auto;
}

.profile-photo {
	display: flex;
	justify-content: center;
	margin-bottom: 20px;
}
/* 用户资料部分样式 */
.user-profile {
	display: flex;
	align-items: center;
	padding: 20px;
	gap: 20px;
}

/* 头像包装容器 */
.avatar-wrapper {
	position: relative;
	cursor: pointer;
	display: inline-block;
}

/* 头像图片 */
.avatar {
	width: 120px;
	height: 120px;
	border-radius: 50%;
	transition: filter 0.3s ease;
}

/* 悬停时头像变灰 */
.avatar-wrapper:hover .avatar {
	filter: grayscale(100%);
}

/*更换文字*/
.change-text {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-55%);
	color: white;
	background-color: rgba(0, 0, 0, 0.5);
	padding: 5px 10px;
	border-radius: 4px;
	font-size: 14px;
	visibility: hidden;
	width: 80%;
	text-align: center;
}

/* 悬停时显示“更换” */
.avatar-wrapper:hover .change-text {
	visibility: visible;
}

.user-info {
	flex-grow: 1;
	text-align: left;
}

.user-info input,
.user-info textarea,
.user-info select {
	width: 100%;
	padding: 10px;
	margin-top: 8px;
	border: 2px solid gray;
	border-radius: 4px;
}

/* 标签样式 */
.user-info label {
	font-weight: bold;
	display: block;
	margin-top: 10px;
}

/* 按钮样式 */
.action-buttons {
	display: flex;
	gap: 10px;
	margin-top: 20px;
	text-align: center;
	justify-content: center;
}

.action-buttons button {
	padding: 10px 20px;
	background-color: #007bff;
	color: white;
	border: none;
	cursor: pointer;
	border-radius: 4px;
}

.action-buttons button:hover {
	background-color: #0056b3;
}
</style>

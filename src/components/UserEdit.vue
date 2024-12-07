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
					<img :src="avatar" alt="用户头像" class="avatar" />
					<span class="change-text">更换</span>
				</div>
			</div>
			<img id="cropper-image" style="display: none" />
			<div class="action-buttons">
				<button v-if="showCropperConfirm" @click="confirmCrop">确认裁切</button>
			</div>

			<div class="user-info">
				<label for="email">用户名：</label>
				<input
					class="name"
					v-model="user.username"
					type="text"
					placeholder="用户名"
				/>
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
					v-model="user.email"
					type="email"
					placeholder="请输入邮箱"
				/>
				<label for="phone">手机号：</label>
				<input
					id="phone"
					v-model="user.phone"
					type="tel"
					placeholder="请输入手机号"
				/>
				<label for="address">地址：</label>
				<input
					id="address"
					v-model="user.address"
					type="text"
					placeholder="请输入地址"
				/>
				<label for="school">学校：</label>
				<input
					id="school"
					v-model="user.school"
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
import { ref, onMounted, reactive, inject } from "vue";
import Sidebar from "../components/Sidebar.vue"; // 导入 Sidebar 组件
import { useRouter } from "vue-router"; // 导入 Vue Router
import axios from "../utils/axios";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

export default {
	name: "UserEdit",
	components: {
		Sidebar,
	},
	setup() {
		const router = useRouter();
		const user = reactive({
			username: "",
			status: "",
			gender: "",
			email: "",
			phone: "",
			address: "",
			school: "",
		});

		let avatar = ref();
		const showAlert = inject("showAlert");
		let cropper = null;
		const showCropperConfirm = ref(false);

		const fetchUserInfo = async () => {
			const userId = localStorage.getItem("user_id");
			if (!userId) {
				showAlert("用户ID未找到", false);
				return;
			}

			try {
				const response = await axios.get(`/api/user/getinfo`, {
					params: { userid: userId },
				});
				const data = response.data.data;
				user.username = data.username;
				user.status = data.status;
				user.gender = data.gender;
				user.email = data.email;
				user.phone = data.phone;
				user.address = data.address;
				user.school = data.school;

				const avatarResponse = await axios.get(`/api/user/getimg`, {
					params: { userid: userId },
				});
				avatar.value = avatarResponse.data.data;
			} catch (error) {
				showAlert("获取用户信息失败", false);
				console.error("Failed to fetch user info", error);
			}
		};

		onMounted(() => {
			fetchUserInfo();
		});

		// 触发文件输入框
		const triggerFileInput = () => {
			const fileInput = document.querySelector('input[type="file"]');
			fileInput.click();
		};

		const handleAvatarChange = async (event) => {
			const file = event.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const image = document.getElementById("cropper-image");
					image.src = e.target.result;
					image.onload = () => {
						cropper = new Cropper(image, {
							aspectRatio: 1,
							viewMode: 1,
							autoCropArea: 1,
						});
						showCropperConfirm.value = true;
					};
				};
				reader.readAsDataURL(file);
			}
		};

		const confirmCrop = () => {
			const canvas = cropper.getCroppedCanvas({
				width: 500,
				height: 500,
			});
			canvas.toBlob(async (blob) => {
				const formData = new FormData();
				formData.append("image", blob, "avatar.jpg");
				try {
					const response = await axios.post("/api/user/upload", formData, {
						headers: {
							"Content-Type": "multipart/form-data",
						},
					});

					if (response.status === 200 && response.data.code === 1) {
						avatar.value = response.data.data;
						try {
							const res = await axios.post("/api/user/updateimg", {
								userid: localStorage.getItem("user_id"),
								url: response.data.data,
							});
							if (res.status === 200 && res.data.code === 1) {
								showAlert("头像已更新", true);
							}
						} catch (error) {
							console.error("Failed to update avatar", error);
						}
						showAlert("头像已更新", true);
					} else {
						showAlert("头像更新失败", false);
						console.error("Server response:", response.data);
					}
				} catch (error) {
					showAlert("头像更新失败，请稍后再试！", false);
					console.error("Failed to upload avatar", error);
				}
			}, "image/jpeg");
			showCropperConfirm.value = false;
			// 销毁裁切器
			cropper.destroy();
		};

		// 保存用户信息
		const saveProfile = async () => {
			if (!user.username || !user.email || !user.phone) {
				showAlert("用户名、邮箱和手机号不能为空", false);
				return;
			}

			const userData = {
				uid: localStorage.getItem("user_id"),
				info: {
					username: user.username,
					gender: user.gender === "男" ? 1 : 0,
					status: user.status,
					email: user.email,
					phone: user.phone,
					address: user.address,
					school: user.school,
				},
			};

			try {
				const response = await axios.post("/api/user/updateuserinfo", userData);
				if (response.status === 200 && response.data.code === 1) {
					showAlert("资料已保存", true);
					router.push("/profile");
				} else {
					showAlert("保存失败，请稍后再试！", false);
				}
			} catch (error) {
				console.error("保存失败", error);
				showAlert("保存失败，请稍后再试！", false);
			}
		};

		// 取消编辑
		const cancelEdit = () => {
			router.push("/profile");
		};

		return {
			user,
			avatar,
			saveProfile,
			cancelEdit,
			triggerFileInput,
			handleAvatarChange,
			confirmCrop,
			showCropperConfirm,
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

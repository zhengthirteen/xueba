<template>
	<div class="layout">
		<!-- 侧边栏 -->
		<Sidebar />

		<!-- 主内容区 -->
		<div class="main">
			<!-- 更新密码部分 -->
			<div class="auth-container">
				<h2>更新密码</h2>
				<form @submit.prevent="handleUpdatePassword">
					<label for="currentPassword">当前密码:</label>
					<input
						v-model="currentPassword"
						id="currentPassword"
						type="password"
						placeholder="输入当前密码"
						required
					/>
					<label for="newPassword">新密码:</label>
					<input
						v-model="newPassword"
						id="newPassword"
						type="password"
						placeholder="输入新密码"
						required
						@input="validatePassword"
					/>
					<!-- 显示密码格式错误提示 -->
					<span v-if="passwordError" class="error-message">{{
						passwordError
					}}</span>
					<label for="confirmPassword">确认新密码:</label>
					<input
						v-model="confirmPassword"
						id="confirmPassword"
						type="password"
						placeholder="再次输入新密码"
						required
					/>
					<div class="action-buttons">
						<button type="submit">提交</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, inject } from "vue";
import Sidebar from "../components/Sidebar.vue"; // 导入 Sidebar 组件
import axios from "../utils/axios";

export default {
	name: "UpdatePassword",
	components: {
		Sidebar,
	},
	setup() {
		const currentPassword = ref("");
		const newPassword = ref("");
		const confirmPassword = ref("");
		const passwordError = ref("");
		const showAlert = inject("showAlert");
		const router = inject("router");

		const validatePassword = () => {
			// 正则表达式：至少8位，且同时包含字母和数字
			const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

			if (!passwordRegex.test(newPassword.value)) {
				passwordError.value = "新密码必须至少8位，且包含字母和数字！";
			} else {
				passwordError.value = ""; // 如果格式正确，则清空错误提示
			}
		};

		const handleUpdatePassword = async () => {
			if (newPassword.value !== confirmPassword.value) {
				showAlert("两次输入的新密码不一致！", false);
				return;
			}
			if (passwordError.value) {
				showAlert("请修正密码格式错误后再提交", false);
				return;
			}
			try {
				const res = await axios.post("/api/user/updatepd", {
					uid: localStorage.getItem("uid"),
					formerPd: currentPassword.value,
					pwd: newPassword.value,
				});
				if (res.data.code === 1) {
					showAlert("密码更新成功，请重新登录！", true);
					router.push("/login");
				} else {
					showAlert("密码更新失败，请检查当前密码是否正确！", false);
				}
			} catch (err) {
				console.log(err);
				showAlert("发送失败，请稍后再试！", false);
			}
		};

		return {
			currentPassword,
			newPassword,
			confirmPassword,
			passwordError,
			handleUpdatePassword,
			validatePassword,
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

.auth-container {
	width: 400px;
	margin: 50px auto;
	padding: 20px;
	border: 1px solid #ddd;
	border-radius: 5px;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.auth-container h2 {
	text-align: center;
	margin-bottom: 20px;
}
.auth-container form {
	display: flex;
	flex-direction: column;
	width: 100%;
}
.auth-container label {
	margin-top: 10px;
}
.auth-container input {
	padding: 10px;
	margin-top: 5px;
	margin-bottom: 10px;
	border: 1px solid #ddd;
	border-radius: 5px;
	width: 90%;
}
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
	height: 40px;
}
.action-buttons button:hover {
	background-color: #0056b3;
}

.error-message {
	color: red;
	font-size: 12px;
	height: 12px;
	padding: 0;
	margin-bottom: 10px;
}
</style>

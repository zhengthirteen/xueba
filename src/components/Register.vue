<template>
	<div class="auth-container">
		<h2>注册</h2>
		<form @submit.prevent="handleRegister">
			<label for="name">用户名:</label>
			<input
				v-model="name"
				id="name"
				type="text"
				placeholder="输入用户名"
				required
			/>

			<label for="gender">性别:</label>
			<select v-model="gender" id="gender" required>
				<option value="">请选择性别</option>
				<option value="男">男</option>
				<option value="女">女</option>
			</select>

			<label for="email">邮箱:</label>
			<input
				v-model="email"
				id="email"
				type="email"
				placeholder="输入邮箱"
				required
				@input="validateEmail"
			/>

			<!-- 显示邮箱格式错误提示 -->
			<span v-if="emailError" class="error-message">{{ emailError }}</span>

			<label for="phone">电话号码:</label>
			<input
				v-model="phone"
				id="phone"
				type="text"
				placeholder="输入电话号码"
				required
				@input="validatePhone"
			/>

			<!-- 显示手机号格式错误提示 -->
			<span v-if="phoneError" class="error-message">{{ phoneError }}</span>

			<label for="address">地址:</label>
			<input
				v-model="address"
				id="address"
				type="text"
				placeholder="输入地址"
				required
			/>

			<label for="school">学校:</label>
			<input
				v-model="school"
				id="school"
				type="text"
				placeholder="输入学校"
				required
			/>

			<label for="password">密码:</label>
			<input
				v-model="password"
				id="password"
				type="password"
				placeholder="输入密码"
				required
				@input="validatePassword"
			/>

			<!-- 显示密码格式错误提示 -->
			<span v-if="passwordError" class="error-message">{{
				passwordError
			}}</span>

			<button type="submit">注册</button>
		</form>
		<p>已有账号？<router-link to="/login">去登录</router-link></p>
	</div>
</template>

<script>
import axios from "axios";
import { inject, ref } from "vue";

export default {
	name: "Register",
	setup() {
		// 响应式数据
		const name = ref("");
		const gender = ref("");
		const email = ref("");
		const phone = ref("");
		const address = ref("");
		const school = ref("");
		const password = ref("");
		const emailError = ref("");
		const phoneError = ref("");
		const passwordError = ref("");
		const showAlert = inject("showAlert");
		const router = inject("router");
		let t_id = null;

		// 邮箱格式验证
		const validateEmail = () => {
			const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|cn)$/;
			if (!emailRegex.test(email.value)) {
				emailError.value = "请输入有效的邮箱地址";
			} else {
				emailError.value = ""; // 如果格式正确，则清空错误提示
			}
		};

		// 手机号格式验证
		const validatePhone = () => {
			const phoneRegex = /^1\d{10}$/; // 以1开头，后面跟10个数字，总共11位
			if (!phoneRegex.test(phone.value)) {
				phoneError.value = "请输入有效的手机号码";
			} else {
				phoneError.value = ""; // 如果格式正确，则清空错误提示
			}
		};

		// 密码格式验证
		const validatePassword = () => {
			// 正则表达式：至少8位，且同时包含字母、数字和符号中的至少两种
			const passwordRegex =
				/^(?![0-9]+$)(?![a-zA-Z]+$)(?![^0-9a-zA-Z]+$).{8,}$/;

			if (!passwordRegex.test(password.value)) {
				passwordError.value =
					"密码必须至少8个字符，且同时包含字母、数字和符号中的至少两种";
			} else {
				passwordError.value = ""; // 如果格式正确，则清空错误提示
			}
		};

		// 注册表单提交
		const handleRegister = async () => {
			if (t_id) clearTimeout(t_id);
			t_id = setTimeout(async () => {
				if (emailError.value) {
					showAlert("请修正邮箱格式错误后再提交", false);
					return; // 如果邮箱格式有误，阻止表单提交
				}
				if (phoneError.value) {
					showAlert("请修正手机号格式错误后再提交", false);
					return;
				}
				if (passwordError.value) {
					showAlert("请修正密码格式错误后再提交", false);
					return;
				}
				try {
					// 发送POST请求到服务器进行注册
					const res = await axios.post("/api/login/register", {
						username: name.value,
						gender: gender.value,
						email: email.value,
						phone: phone.value,
						address: address.value,
						school: school.value,
						pd: password.value,
					});
					if (res.data.code === 1) {
						showAlert("注册成功！", true);
						setTimeout(() => {
							router.push("/login");
						}, 800);
					} else {
						showAlert("该电话已注册！", false);
					}
				} catch (error) {
					showAlert("注册失败，请稍后再试！", false);
				}
			}, 200);
		};

		// 返回响应式数据和方法
		return {
			name,
			gender,
			email,
			phone,
			address,
			school,
			password,
			emailError,
			phoneError,
			passwordError,
			validateEmail,
			validatePhone,
			handleRegister,
			validatePassword,
		};
	},
};
</script>

<style scoped>
.auth-container {
	width: 400px; /* 调整宽度 */
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
	align-items: flex-start;
}
.auth-container label {
	width: 90%;
	margin-top: 10px;
}
.auth-container input {
	padding: 10px;
	margin-top: 5px;
	margin-bottom: 10px;
	border: 1px solid #ddd;
	border-radius: 5px;
	width: 100%;
	box-sizing: border-box;
}

.auth-container select {
	padding: 10px;
	margin-top: 5px;
	margin-bottom: 10px;
	border: 1px solid #ddd;
	border-radius: 5px;
	width: 100%;
}
.auth-container button {
	padding: 10px;
	background-color: #28a745;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	width: 100%;
}
.auth-container p {
	text-align: center;
	margin-top: 10px;
}

.error-message {
	color: red;
	font-size: 12px;
	height: 12px;
	padding: 0;
	margin-bottom: 10px;
}
</style>

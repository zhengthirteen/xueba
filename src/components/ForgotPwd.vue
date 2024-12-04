<template>
	<div class="auth-container">
		<h2>忘记密码</h2>
		<form @submit.prevent="handleForgotPassword">
			<label for="email">邮箱:</label>
			<input
				v-model="email"
				id="email"
				type="email"
				placeholder="输入注册邮箱"
				required
			/>
			<label for="phone">手机号:</label>
			<input
				v-model="phone"
				id="phone"
				type="tel"
				placeholder="输入注册手机号"
				required
			/>
			<label for="password">新密码:</label>
			<input
				v-model="password"
				id="password"
				type="password"
				placeholder="输入新密码"
				required
			/>
			<button type="submit">提交</button>
		</form>
		<p>记得密码了？<router-link to="/login">去登录</router-link></p>
	</div>
</template>

<script>
import { inject, ref } from "vue";
import axios from "../utils/axios";

export default {
	name: "ForgotPassword",
	setup() {
		const email = ref("");
		const phone = ref("");
		const password = ref("");
		const showAlert = inject("showAlert");
		const router = inject("router");

		const handleForgotPassword = async () => {
			try {
				const res = await axios.post("/api/login/regetpd", {
					email: email.value,
					phone: phone.value,
					password: password.value,
				});
				if (res.data.code === 1) {
					showAlert("重置密码成功，请检查邮箱！", true);
					router.push("/login");
				} else {
					showAlert("重置密码失败，请检查手机号或邮箱是否正确！", false);
				}
			} catch (err) {
				console.log(err);
				showAlert("发送失败，请稍后再试！", false);
			}
		};
		return {
			email,
			phone,
			password,
			handleForgotPassword,
		};
	},
};
</script>

<style scoped>
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
.auth-container button {
	padding: 10px;
	background-color: #007bff;
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
</style>

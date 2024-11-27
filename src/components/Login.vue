<template>
	<div class="auth-container">
		<h2>登录</h2>
		<form @submit.prevent="test_handleLogin">
			<label for="identifier">用户名/邮箱/手机号:</label>
			<input
				v-model="identifier"
				id="identifier"
				type="text"
				placeholder="输入用户名/邮箱/手机号"
				required
			/>

			<label for="password">密码:</label>
			<input
				v-model="password"
				id="password"
				type="password"
				placeholder="输入密码"
				required
			/>

			<button type="submit">登录</button>
		</form>
		<p>没有账号？<router-link to="/register">去注册</router-link></p>
	</div>
</template>

<script>
import { inject, ref } from "vue";
import axios from "../utils/axios";

export default {
	name: "Login",
	setup() {
		const identifier = ref("");
		const password = ref("");
		const showAlert = inject("showAlert");
		let t_id = null;

		const test_handleLogin = () => {
			if (t_id) clearTimeout(t_id);
			t_id = setTimeout(() => {
				if (identifier.value === "test001" && password.value === "123456") {
					showAlert("登录成功！", true);
					setTimeout(() => {
						window.location.href = "/";
					}, 800);
				} else {
					showAlert("登录失败，请检查用户名或密码！", false);
				}
			}, 200);
		};

		// 用 axios 写真实登录逻辑
		const handleLogin = () => {
			axios
				.post("/auth/local", {
					id: identifier.value,
					password: password.value,
				})
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		};

		return {
			password,
			identifier,
			test_handleLogin,
			handleLogin,
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

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
		<p>
			没有账号？<router-link to="/register">去注册</router-link>
			<br />
			<router-link to="/forgot-pwd">忘记密码？</router-link>
		</p>
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
		const router = inject("router");
		const showConfirm = inject("showConfirm");
		let t_id = null;

		const test_handleLogin = () => {
			// showConfirm("确认操作？", "操作成功！", true, (result) => {
			// 	if (result === 1) {
			// 		console.log("用户点击了确认");
			// 	} else if (result === 2) {
			// 		console.log("用户点击了取消");
			// 	}
			// });
			if (t_id) clearTimeout(t_id);
			t_id = setTimeout(() => {
				if (identifier.value === "test001" && password.value === "123456") {
					showAlert("登录成功！", true);
					localStorage.setItem("jwt", "test001");
					setTimeout(() => {
						router.push("/");
					}, 800);
				} else {
					showAlert("登录失败，请检查用户名或密码！", false);
				}
			}, 200);
		};

		const handleLogin = async () => {
			if (t_id) clearTimeout(t_id);
			t_id = setTimeout(async () => {
				let type;
				if (/^\d+$/.test(identifier.value)) {
					type = 3; // 手机号
				} else if (identifier.value.includes("@")) {
					type = 2; // 邮箱
				} else {
					type = 1; // 用户名
				}

				try {
					const res = await axios.post("/api/login/login", {
						data: identifier.value,
						pwd: password.value,
						type,
					});
					if (res.data.status === 1) {
						showAlert("登录成功！", true);
						console.log(res.data.jwt);
						localStorage.setItem("jwt", res.data.jwt);
						setTimeout(() => {
							router.push("/");
						}, 800);
					} else {
						showAlert("登录失败，请检查用户名或密码！", false);
					}
				} catch (err) {
					console.log(err);
					showAlert("登录失败，请稍后再试！", false);
				}
			}, 200);
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

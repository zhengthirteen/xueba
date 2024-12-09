<template>
	<div class="layout">
		<!-- 侧边栏 -->
		<Sidebar />
		<!-- 主内容区 -->
		<div class="main">
			<!-- 导航栏 -->
			<nav class="navbar">
				<ul>
					<li><router-link to="/profile">我的</router-link></li>
					<li><router-link to="/publish">发表</router-link></li>
					<li><router-link to="/favorites">收藏夹</router-link></li>
				</ul>
			</nav>
			<!-- 用户资料展示部分 -->
			<div class="user-profile">
				<img :src="avatar" alt="用户头像" />
				<div class="user-info">
					<h2>{{ user.username }}</h2>
					<p>
						<strong>状态：</strong>
						<span :class="statusClass">{{
							user.status === 0
								? "在线"
								: user.status === 1
								? "隐身"
								: user.status === 2
								? "忙碌"
								: "离线"
						}}</span>
					</p>
					<!-- 显示性别 -->
					<p>
						<strong>性别：</strong
						>{{ user.gender === 1 ? "男" : user.gender === 2 ? "女" : "保密" }}
					</p>
					<p><strong>用户id：</strong>{{ user.id }}</p>
				</div>
				<button @click="editProfile">编辑</button>
			</div>

			<!-- 邮箱信息显示部分 -->
			<div class="user-email">
				<p><strong>邮箱：</strong>{{ user.email }}</p>
			</div>

			<!-- 新增手机号信息 -->
			<div class="user-phone">
				<p><strong>手机号：</strong>{{ user.phone }}</p>
			</div>

			<!-- 新增地址信息 -->
			<div class="user-address">
				<p><strong>地址：</strong>{{ user.address }}</p>
			</div>

			<!-- 新增学校信息 -->
			<div class="user-school">
				<p><strong>学校：</strong>{{ user.school }}</p>
			</div>

			<!-- 退出/切换账号按钮 -->
			<div class="logout-btn">
				<button @click="logout">退出/切换账号</button>
				<button @click="goToUpdatePassword">更新密码</button>
				<button @click="deleteAccount">注销账户</button>
			</div>
		</div>
	</div>
</template>

<script>
import { computed, inject, onMounted, ref, reactive } from "vue";
import axios from "../utils/axios";
import { useUserProfile } from "../hooks/useUserProfile.js";
import Sidebar from "../components/Sidebar.vue"; // 导入 Sidebar 组件
import { useUserAvatar } from "../hooks/useUserAvatar";

export default {
	name: "UserProfile",
	components: {
		Sidebar,
	},
	setup() {
		const user = reactive({});
		const { avatar, getUserAvatar, test_getUserAvatar } = useUserAvatar();
		const { editProfile } = useUserProfile();
		const router = inject("router");
		const showAlert = inject("showAlert");

		const getUserInfo = async () => {
			try {
				const res = await axios.get("/api/user/getinfo", {
					params: { userid: localStorage.getItem("user_id") },
				});
				if (res.data.code === 1) {
					user.username = res.data.data.username;
					user.status = res.data.data.onlineStatus;
					user.gender = res.data.data.gender;
					user.email = res.data.data.email;
					user.phone = res.data.data.phone;
					user.address = res.data.data.address;
					user.school = res.data.data.school;
					user.id = res.data.data.userId;
					console.log(user);
				} else {
					showAlert("获取用户信息失败，请稍后再试！", false);
				}
			} catch (err) {
				console.log(err);
				showAlert("获取用户信息失败，请稍后再试！", false);
			}

			try {
				await getUserAvatar(localStorage.getItem("user_id"));
			} catch (err) {
				showAlert("获取用户头像失败", false);
			}
		};

		function test_getUserInfo() {
			user.username = "测试用户名";
			user.status = "在线";
			user.gender = 1;
			user.email = "123@qq.com";
			user.phone = "12345678901";
			user.address = "测试地址";
			user.school = "测试学校";
			test_getUserAvatar();
		}

		onMounted(() => {
			// test_getUserInfo();
			getUserInfo();
		});

		// 动态类绑定，根据用户状态返回对应的 CSS 类
		const statusClass = computed(() => {
			switch (user.status) {
				case 0:
					return "online";
				case 1:
					return "away";
				case 2:
					return "busy";
				case 3:
					return "offline";
				default:
					return "";
			}
		});

		// 退出/切换账号函数
		const logout = () => {
			// 清除用户会话、缓存
			localStorage.removeItem("token"); // 清除 token
			localStorage.removeItem("user_id"); // 清除 user_id
			router.push("/login"); // 跳转到登录页面
		};

		const goToUpdatePassword = () => {
			router.push("/update-password");
		};

		const deleteAccount = async () => {
			const password = prompt(
				"请输入您的密码以确认注销账户，注意：注销账户后所有数据将被删除"
			);
			console.log(password);

			if (!password) {
				showAlert("密码不能为空！", false);
				return;
			}
			try {
				const res = await axios.post("/api/user/delete", {
					user_id: localStorage.getItem("user_id"),
					password: password,
				});
				if (res.data.code === 1) {
					showAlert("账户已注销", true);
					router.push("/login");
				} else {
					showAlert("注销账户失败，请检查密码是否正确！", false);
				}
			} catch (err) {
				console.log(err);
				showAlert("注销失败，请稍后再试！", false);
			}
		};

		return {
			user,
			avatar,
			statusClass,
			logout,
			editProfile,
			goToUpdatePassword,
			deleteAccount,
		};
	},
};
</script>

<style scoped>
/* 页面根元素确保全屏显示 */
html,
body {
	height: 100%;
	margin: 0;
}

/* 主容器 */
.layout {
	display: flex;
	/* flex-direction: column; */
	/* align-items: center; */
	height: 100%;
	margin: 0 auto;
	width: 75vw;
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
	position: fixed;
	top: 80px;
	/* flex-grow: 1; */
	width: 80%;
	padding: 20px;
}

/* 用户资料部分样式 */
.user-profile {
	display: flex;
	align-items: center;
	padding: 20px;
	gap: 20px;
}

.user-profile img {
	width: 80px;
	height: 80px;
	border-radius: 50%;
}

.user-info {
	flex-grow: 1;
	text-align: left;
}

.user-profile button {
	margin-top: 10px;
	padding: 8px 16px;
	background-color: #666;
	color: white;
	border: none;
	cursor: pointer;
}

.user-profile button:hover {
	background-color: #555;
}

/* 信息部分样式 */
.user-email,
.user-phone,
.user-address,
.user-school {
	padding: 20px;
	background-color: #f4f4f4;
	margin-top: 20px;
	border-radius: 8px;
}

.user-email p,
.user-phone p,
.user-address p,
.user-school p {
	font-size: 16px;
	font-weight: bold;
}

/* 用户状态的颜色 */
.online {
	color: green;
}

.away {
	color: gray;
}

.busy {
	color: red;
}

/* 退出按钮样式 */
.logout-btn {
	margin-top: 20px;
	padding: 20px;
	text-align: center;
}

.logout-btn button {
	padding: 10px 20px;
	background-color: lightskyblue;
	color: white;
	border: none;
	font-size: 16px;
	cursor: pointer;
	margin-right: 50px;
	margin-left: 50px;
	border-radius: 6px;
}

.logout-btn button:hover {
	background-color: deepskyblue;
}
</style>

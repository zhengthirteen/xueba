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
		  <img :src="user.avatar" alt="用户头像" />
		  <div class="user-info">
			<h2>{{ user.name }}</h2>
			<p>{{ user.bio }}</p>
			<p><strong>状态：</strong><span :class="statusClass">{{ user.status }}</span></p>
			<!-- 显示性别 -->
			<p><strong>性别：</strong>{{ user.gender }}</p> <!-- 性别不可修改 -->
		  </div>
		  <button @click="editProfile">编辑</button>
		</div>
  
		<!-- 邮箱信息显示部分 -->
		<div class="user-email">
		  <p><strong>邮箱：</strong>{{ email }}</p>
		</div>
  
		<!-- 新增手机号信息 -->
		<div class="user-phone">
		  <p><strong>手机号：</strong>{{ phone }}</p>
		</div>
  
		<!-- 新增地址信息 -->
		<div class="user-address">
		  <p><strong>地址：</strong>{{ address }}</p>
		</div>
  
		<!-- 新增学校信息 -->
		<div class="user-school">
		  <p><strong>学校：</strong>{{ school }}</p>
		</div>
  
		<!-- 退出/切换账号按钮 -->
		<div class="logout-btn">
		  <button @click="logout">退出/切换账号</button>
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  import { computed } from "vue";
  import { useUserProfile } from "../hooks/useUserProfile.js";
  import Sidebar from "../components/Sidebar.vue"; // 导入 Sidebar 组件
  import { useRouter } from "vue-router"; // 导入 Vue Router
  
  export default {
	name: "UserProfile",
	components: {
	  Sidebar,
	},
	setup() {
	  const { user, email, phone, address, school, editProfile } = useUserProfile();
	  const router = useRouter(); // 获取路由实例
  
	  // 动态类绑定，根据用户状态返回对应的 CSS 类
	  const statusClass = computed(() => {
		switch (user.status) {
		  case '在线':
			return 'online';
		  case '忙碌':
			return 'busy';
		  case '隐身':
			return 'away';
		  default:
			return '';
		}
	  });
  
	  // 退出/切换账号函数
	  const logout = () => {
		// 这里可以添加清除用户会话、缓存等操作
		router.push("/login"); // 跳转到登录页面
	  };
  
	  return { user, email, phone, address, school, statusClass, logout, editProfile };
	},
  };
  </script>
  
  <style scoped>
  /* 页面根元素确保全屏显示 */
  html, body {
	height: 100%;
	margin: 0;
  }
  
  /* 主容器 */
  .layout {
	display: flex;
	min-height: 100vh;
	flex-direction: row;
	height: 100%;
  }
  
  /* 侧边栏 */
  .sidebar {
	width: 200px;
	background: #333;
	color: white;
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	overflow-y: auto;
  }
   /* 导航栏样式 */
	.navbar {
	position: fixed; /* 固定定位 */
	top: 0; /* 置顶 */
	left: 200px; /* 左对齐 */
	width: calc(100% - 200px); /* 宽度铺满整个屏幕 */
	background-color: #333; /* 背景颜色 */
	padding: 10px 0; /* 上下内边距 */
	text-align: center; /* 内容居中 */
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
	margin-left: 200px;
	padding-top: 40px;
	flex-grow: 1;
	height: 100%;
	overflow: auto;
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
	background-color: #ff4d4f;
	color: white;
	border: none;
	font-size: 16px;
	cursor: pointer;
  }
  
  .logout-btn button:hover {
	background-color: #e43f3b;
  }
  </style>
  
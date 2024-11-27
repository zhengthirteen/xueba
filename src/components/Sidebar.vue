<template>
	<nav class="sidebar">
		<ul>
			<li v-for="item in menuItems" :key="item.title">
				<router-link :to="item.link">{{ item.title }}</router-link>
			</li>
		</ul>
	</nav>
</template>

<script>
export default {
	name: "Sidebar",
	data() {
		return {
			menuItems: [
				{ title: "首页", link: "/" },
				{ title: "发布", link: "/post" },
				{ title: "用户中心", link: "/profile" },
				{ title: "联系人", link: "/contacts" },
				{ title: "消息通知", link: "/notifications" },
			],
		};
	},
};
</script>

<style scoped>
.sidebar {
	width: 200px;
	background: #333;
	color: white;
}
.sidebar ul {
	list-style: none;
	padding: 0;
}
.sidebar li {
	padding: 10px;
}
</style>

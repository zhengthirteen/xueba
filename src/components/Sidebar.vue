<template>
	<nav class="sidebar">
		<ul>
			<li
				v-for="item in menuItems"
				:key="item.title"
				@click="navigateTo(item.link)"
			>
				<span class="link">{{ item.title }}</span>
			</li>
		</ul>
	</nav>
</template>

<script>
import { ref, inject } from "vue";
export default {
	name: "Sidebar",

	setup() {
		const menuItems = [
			{ title: "首页", link: "/" },
			{ title: "发布", link: "/post" },
			{ title: "用户中心", link: "/profile" },
			{ title: "联系人", link: "/contacts" },
		];
		const router = inject("router");
		const clearSearch = inject("clearSearch");
		const navigateTo = (link) => {
			if (link === "/") {
				router.push(link);
				clearSearch();
			}
			router.push(link);
		};

		return { menuItems, navigateTo, clearSearch };
	},
};
</script>

<style scoped>
.sidebar {
	width: 180px;
	background: #333;
	color: white;
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	overflow-y: auto;
}
.sidebar ul {
	list-style: none;
	padding: 0;
	margin: 0;
}
.sidebar li {
	padding: 40px;
	cursor: pointer;
}
.sidebar li:hover {
	background-color: #444;
}
.sidebar .link {
	color: white;
	text-decoration: none;
	font-size: 20px;
	display: block;
	width: 100%;
	height: 100%;
	transition: color 0.3s ease; /* 添加渐变效果 */
}
.sidebar .link:hover {
	color: aquamarine;
}
</style>

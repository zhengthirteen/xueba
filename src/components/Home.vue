<template>
	<div class="home">
		<Sidebar />
		<div class="main-content">
			<SearchBar :onSearch="handleSearch" />
			<div class="content">
				<PopularTopics />
			</div>
		</div>
		<img
			:src="avatar"
			alt="用户头像"
			class="user-avatar"
			@click="goToProfile"
		/>
	</div>
</template>

<script>
import { ref, inject, onMounted } from "vue";
import PopularTopics from "./PopularTopics.vue";
import { useUserProfile } from "../hooks/useUserProfile.js";
import SearchBar from "./SearchBar.vue";
import Sidebar from "./Sidebar.vue";
import axios from "../utils/axios";
import { useUserAvatar } from "../hooks/useUserAvatar";

export default {
	name: "Home",
	components: {
		PopularTopics,
		SearchBar,
		Sidebar,
	},
	setup() {
		const { user } = useUserProfile();
		const router = inject("router");
		const { avatar, getUserAvatar, test_getUserAvatar } = useUserAvatar();

		const goToProfile = () => {
			router.push("/profile");
		};

		const handleSearch = (query) => {
			console.log("搜索内容:", query);
			// 在这里处理搜索逻辑
		};
		onMounted(() => {
			getUserAvatar(localStorage.getItem("user_id"));
		});

		return { user, goToProfile, avatar, handleSearch };
	},
};
</script>

<style scoped>
.home {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	margin: 0 auto;
	width: 75vw;
	margin-left: 10vw;
}

.main-content {
	position: relative;
	width: 100%;
	padding: 20px;
}

.user-avatar {
	width: 70px;
	height: 70px;
	border-radius: 50%;
	cursor: pointer;
	position: fixed;
	top: 50px;
	right: 50px;
}
.user-avatar:hover {
	opacity: 0.8;
}
.content {
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-top: 50px;
}

.content > * {
	margin-bottom: 20px;
}
</style>

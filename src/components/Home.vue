<template>
	<div class="home">
		<Sidebar />
		<div class="main-content">
			<!-- <div class="top-bar" :class="{ hidden: isHidden }" ref="topBar">
				<input type="text" placeholder="搜索..." class="search-bar" />
				<button class="search-button">搜索</button>
			</div> -->
			<SearchBar :onSearch="handleSearch" />
			<div class="content">
				<PopularTopics />
				<PopularChannels />
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
import { ref } from "vue";
import PopularTopics from "./PopularTopics.vue";
import PopularChannels from "./PopularChannels.vue";
import { useUserProfile } from "../hooks/useUserProfile.js";
import { useRouter } from "vue-router";
import avatarImage from "../assets/logo.jpg";
import SearchBar from "./SearchBar.vue";
import Sidebar from "./Sidebar.vue";

export default {
	name: "Home",
	components: {
		PopularTopics,
		PopularChannels,
		SearchBar,
		Sidebar
	},
	setup() {
		const { user } = useUserProfile();
		const router = useRouter();
		const avatar = ref(avatarImage);

		const goToProfile = () => {
			router.push("/profile");
		};

		const handleSearch = (query) => {
      console.log("搜索内容:", query);
      // 在这里处理搜索逻辑
    };

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

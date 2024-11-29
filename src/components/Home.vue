<template>
	<div class="home">
		<div class="main-content">
			<div class="top-bar" :class="{ hidden: isHidden }" ref="topBar">
				<input type="text" placeholder="搜索..." class="search-bar" />
				<button class="search-button">搜索</button>
			</div>
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
import { ref, onMounted, onUnmounted } from "vue";
import PopularTopics from "./PopularTopics.vue";
import PopularChannels from "./PopularChannels.vue";
import { useUserProfile } from "../hooks/useUserProfile.js";
import { useRouter } from "vue-router";
import avatarImage from "../assets/logo.jpg";

export default {
	name: "Home",
	components: {
		PopularTopics,
		PopularChannels,
	},
	setup() {
		const { user } = useUserProfile();
		const router = useRouter();
		const isHidden = ref(false);
		const topBar = ref(null);

		// 设置头像为变量
		const avatar = ref(avatarImage);

		const goToProfile = () => {
			router.push("/profile");
		};

		const handleScroll = () => {
			const scrollTop = window.scrollY;
			if (scrollTop > 100) {
				isHidden.value = true;
			} else {
				isHidden.value = false;
			}
		};

		onMounted(() => {
			window.addEventListener("scroll", handleScroll);
		});

		onUnmounted(() => {
			window.removeEventListener("scroll", handleScroll);
		});

		return { user, goToProfile, isHidden, topBar, avatar };
	},
};
</script>

<style scoped>
.home {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
}

.main-content {
	width: 70vw; /* 使用视口宽度的70% */
	padding: 20px;
	margin-left: -300px;
}

.top-bar {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 20px;
	position: sticky;
	top: 40px;
	background: white;
	padding: 10px;
	transition: opacity 0.5s, top 0.5s;
	z-index: 10;
	width: 100%;
	height: 60px;
}

.top-bar.hidden {
	opacity: 0;
	top: 0;
}

.search-bar {
	width: 60%;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 5px;
	height: 50px;
}
.search-button {
	padding: 10px 20px;
	margin-left: 10px;
	border: none;
	background-color: #007bff;
	color: white;
	border-radius: 5px;
	cursor: pointer;
	height: 50px;
}
.search-button:hover {
	background-color: #0056b3;
}

.user-avatar {
	width: 50px;
	height: 50px;
	border-radius: 50%;
	cursor: pointer;
	position: fixed;
	top: 50px;
	right: 50px;
}

.content {
	width: 70vw; /* 使用视口宽度的70% */
	display: flex;
	flex-direction: column;
}

.content > * {
	margin-bottom: 20px;
}
</style>

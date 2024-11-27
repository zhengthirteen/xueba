<template>
	<div class="user-profile">
		<img :src="user.avatar" alt="用户头像" />
		<h2>{{ user.name }}</h2>
		<p>{{ user.bio }}</p>
		<button @click="editProfile">编辑</button>
	</div>
</template>

<script>
import { useUserProfile } from "../hooks/useUserProfile.js";
export default {
	name: "UserProfile",
	setup() {
		const { user, editProfile } = useUserProfile();
		return { user, editProfile };
	},
};
</script>

<style scoped>
.user-profile {
	text-align: center;
}
.user-profile img {
	width: 100px;
	border-radius: 50%;
}
</style>

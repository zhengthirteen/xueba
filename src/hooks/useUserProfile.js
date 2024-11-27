import { ref } from "vue";

export function useUserProfile() {
	const user = ref({
		name: "用户名",
		bio: "这里是用户的个人简介。",
		avatar: "https://via.placeholder.com/100",
	});

	function editProfile() {
		alert("编辑用户资料");
	}

	return { user, editProfile };
}
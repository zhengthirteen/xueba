import { ref } from "vue";

export function useGroupChat() {
	const participants = ref([]);

	const startGroupChat = (selectedUsers) => {
		participants.value = selectedUsers;
		console.log("群聊参与者:", participants.value);
	};

	return { participants, startGroupChat };
}

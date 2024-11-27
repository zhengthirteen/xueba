import { ref } from "vue";

export function useChat() {
	const messages = ref([]);
	const sendMessage = (message) => {
		messages.value.push(message);
	};

	return { messages, sendMessage };
}
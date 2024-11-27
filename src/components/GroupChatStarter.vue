<template>
	<div class="group-chat-starter">
		<h2>发起群聊</h2>
		<ul>
			<li v-for="friend in friends" :key="friend.id">
				<label>
					<input type="checkbox" :value="friend" v-model="selectedFriends" />
					{{ friend.name }}
				</label>
			</li>
		</ul>
		<button @click="startGroupChat">发起群聊</button>
	</div>
</template>

<script>
import { ref } from "vue";
import { useGroupChat } from "../hooks/useGroupChat";

export default {
	name: "GroupChatStarter",
	setup() {
		const { participants, startGroupChat } = useGroupChat();
		const friends = [
			{ id: 1, name: "好友A" },
			{ id: 2, name: "好友B" },
			{ id: 3, name: "好友C" },
		];
		const selectedFriends = ref([]);

		const handleStartGroupChat = () => {
			startGroupChat(selectedFriends.value);
			alert(
				`发起了群聊：${selectedFriends.value.map((f) => f.name).join(", ")}`
			);
		};

		return {
			friends,
			selectedFriends,
			startGroupChat: handleStartGroupChat,
		};
	},
};
</script>

<style scoped>
.group-chat-starter {
	padding: 20px;
}
.group-chat-starter ul {
	list-style: none;
	padding: 0;
}
.group-chat-starter li {
	margin: 10px 0;
}
</style>

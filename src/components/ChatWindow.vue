<template>
  <div class="chat-window">
    <div v-for="message in messages" :key="message.id">
      <p>{{ message.sender }}: {{ message.content }}</p>
    </div>
    <input v-model="newMessage" placeholder="输入消息" />
    <button @click="sendMessage">发送</button>
  </div>
</template>

<script>
export default {
  name: "ChatWindow",
  data() {
    return {
      messages: [
        { id: 1, sender: "好友A", content: "你好！" },
        { id: 2, sender: "我", content: "你好！最近怎么样？" },
      ],
      newMessage: "",
    };
  },
  methods: {
    sendMessage() {
      this.messages.push({ id: Date.now(), sender: "我", content: this.newMessage });
      this.newMessage = "";
    },
  },
};
</script>

<style scoped>
.chat-window {
  padding: 20px;
}
</style>

<template>
  <div class="chat-history">
    <div class="header">
      <h1>{{ userName }} 的聊天记录</h1>
    </div>

    <div v-if="messages.length === 0" class="no-messages">
      <p>暂无聊天记录。</p>
    </div>

    <div v-else class="messages">
      <div v-for="message in messages" :key="message.id" :class="['message', message.sender === '我' ? 'sent' : 'received']">
        <div class="bubble">
          <p>{{ message.content }}</p>
        </div>
        <div class="message-info">
          <span>{{ message.sender }}</span>
          <span class="timestamp">{{ message.timestamp }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "ChatHistory",
  setup() {
    const route = useRoute();
    const userId = route.params.userId;  // 从路由获取用户ID
    const userName = route.params.userName; // 获取用户名

    const messages = ref([]);

    // 模拟请求聊天记录
    const fetchChatHistory = () => {
      // 这里可以用实际的 API 请求来获取聊天记录
      if (userId === "1") {
        messages.value = [
          { id: 1, sender: "张三", content: "你好，李四！", timestamp: "2024-12-04 09:00" },
          { id: 2, sender: "李四", content: "你好，张三！最近怎么样？", timestamp: "2024-12-04 09:02" },
          { id: 3, sender: "张三", content: "一切都很好，谢谢！", timestamp: "2024-12-04 09:05" },
        ];
      } else if (userId === "2") {
        messages.value = [
          { id: 1, sender: "李四", content: "你好吗？", timestamp: "2024-12-04 10:00" },
          { id: 2, sender: "张三", content: "很好，谢谢！你呢？", timestamp: "2024-12-04 10:05" },
        ];
      }
    };

    onMounted(() => {
      fetchChatHistory(); // 获取聊天记录
    });

    return {
      userName,
      messages,
    };
  },
};
</script>

<style scoped>
.chat-history {
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  max-width: 800px;
  margin: 30px auto;
  font-family: 'Arial', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 24px;
  color: #333;
}

.no-messages {
  text-align: center;
  font-size: 18px;
  color: #888;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 75%;
}

.message.sent {
  align-items: flex-end;
}

.message.received {
  align-items: flex-start;
}

.bubble {
  background-color: #007bff;
  color: white;
  padding: 12px 18px;
  border-radius: 20px;
  max-width: 80%;
  word-wrap: break-word;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s ease;
}

.bubble p {
  margin: 0;
  font-size: 16px;
}

.message-info {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 12px;
  color: #888;
}

.timestamp {
  color: #bbb;
}

.message.sent .bubble {
  background-color: #28a745;
}

.message.received .bubble {
  background-color: #007bff;
}

.message:hover .bubble {
  transform: translateY(-3px);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .chat-history {
    width: 100%;
    padding: 15px;
  }

  .message {
    max-width: 100%;
  }

  .bubble {
    max-width: 90%;
  }
}
</style>

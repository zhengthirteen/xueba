<template>
	<div class="layout">
	  <Sidebar />
	  <div class="main">
		<!-- 左侧联系人列表 -->
		<div class="contact-list">
		  <input type="text" v-model="searchQuery" placeholder="Search friends..." class="search-box" />
		  <div v-if="filteredContacts.length === 0" class="no-matches">
			<p>无匹配对象</p>
		  </div>
		  <div v-for="(contact, index) in filteredContacts" :key="index" class="contact-item" :class="{ active: selectedContact === contact }" @click="selectContact(contact)">
			<p>{{ contact.name }}</p>
			<button class="menu-button" @click.stop="goToDetailPage(contact)">
			  <span class="dot"></span>
			  <span class="dot"></span>
			  <span class="dot"></span>
			</button>
		  </div>
		</div>
  
		<!-- 右侧聊天框 -->
		<div class="chat-box">
		  <div class="chat-header">
			<h2>{{ selectedContact?.name || 'Select a contact' }}</h2>
		  </div>
		  <div class="message-list" ref="messageList">
			<div v-if="!selectedContact" class="welcome-message">
			  <p>欢迎来到学吧！</p>
			</div>
			<div v-else>
			  <div v-for="(message, index) in selectedContact?.messages" :key="index" class="message" :class="{ 'my-message': message.sender === 'me', 'other-message': message.sender !== 'me' }">
				<div class="message-content">
				  <p>{{ message.text }}</p>
				</div>
				<div class="message-time">
				  <span>{{ message.time }}</span>
				</div>
			  </div>
			</div>
		  </div>
  
		  <div v-if="selectedContact" class="chat-input">
			<textarea v-model="newMessage" placeholder="Type a message..." @keydown="handleKeydown"></textarea>
			<button @click="sendMessage">Send</button>
		  </div>
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  import { ref, nextTick, computed } from 'vue';
  import Sidebar from "../components/Sidebar.vue";
  import { useRouter } from 'vue-router';  // 使用 Vue Router 进行页面跳转
  
  export default {
	name: 'ChatApp',
	components: {
	  Sidebar,
	},
	setup() {
	  const newMessage = ref('');
	  const selectedContact = ref(null);
	  const searchQuery = ref('');
	  const router = useRouter();  // 获取 Vue Router 实例
  
	  const contacts = ref([
		{ name: 'Alice', messages: [{ text: 'Hi there!', time: '9:00', sender: 'other' }, { text: 'How are you?', time: '9:05', sender: 'other' }] },
		{ name: 'Bob', messages: [{ text: 'Hello!', time: '9:10', sender: 'other' }, { text: 'What\'s up?', time: '9:12', sender: 'other' }] },
	  ]);
  
	  const filteredContacts = computed(() => {
		return contacts.value.filter(contact => contact.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
	  });
  
	  const selectContact = (contact) => {
		selectedContact.value = contact;
	  };
  
	  const sendMessage = () => {
		if (newMessage.value.trim() && selectedContact.value) {
		  const message = {
			text: newMessage.value,
			time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			sender: 'me'
		  };
		  selectedContact.value.messages.push(message);
		  newMessage.value = '';
		  nextTick(() => {
			const messageList = document.querySelector('.message-list');
			messageList.scrollTop = messageList.scrollHeight;
		  });
		}
	  };
  
	  const handleKeydown = (event) => {
		if (event.key === 'Enter' && event.shiftKey) {
		  sendMessage();
		}
	  };
  
	  const goToDetailPage = (contact) => {
		// 跳转到联系人详细信息页面，假设路由设置了 /contact/:name 路径
		router.push({ name: 'contact-detail', params: { name: contact.name } });
	  };
  
	  return { newMessage, contacts, selectedContact, selectContact, sendMessage, searchQuery, filteredContacts, handleKeydown, goToDetailPage };
	}
  };
  </script>
  
  <style scoped>
  html,
  body {
	height: 100%;
	margin: 0;
  }
  
  .layout {
	display: flex;
	margin: 0 auto;
	align-content: stretch;
	align-items: baseline;
	flex-direction: column-reverse;
	flex-wrap: nowrap;
	justify-content: space-evenly;
	background-image: url('../assets/background.jpg');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
  }
  
  .main {
	display: flex;
	height: 80vh;
	width: 80vw;
	margin-left: 30vh;
	border: 1px solid #ccc;
	border-radius: 10px;
	opacity: 0.9;
  }
  
  .contact-list {
	width: 25%;
	background-color: #f0f0f0;
	border-right: 1px solid #ccc;
	padding: 10px;
	overflow-y: auto;
  }
  
  .search-box {
	width: 100%;
	padding: 10px;
	margin-bottom: 10px;
	border-radius: 5px;
	border: 1px solid #ccc;
  }
  
  .no-matches {
	text-align: center;
	color: #888;
	font-size: 16px;
	margin-top: 20px;
  }
  
  .contact-item {
	display: flex;
	justify-content: space-between;
	padding: 10px;
	cursor: pointer;
	border-radius: 5px;
  }
  
  .contact-item.active {
	background-color: #4CAF50;
	color: white;
  }
  
  .menu-button {
	background: transparent;
	border: none;
	color: white;
	font-size: 24px;
	cursor: pointer;
	display: flex;
	flex-direction: row;  /* 水平排列 */
	align-items: center;  /* 垂直居中 */
	gap: 5px;  /* 点与点之间的间距 */
  }
  
  .dot {
	width: 3px;
	height: 3px;
	background-color: white;
	border-radius: 50%;
	display: inline-block;
  }
  
  .chat-box {
	width: 75%;
	display: flex;
	flex-direction: column;
  }
  
  .chat-header {
	background-color: #4CAF50;
	color: white;
	text-align: center;
	padding: 10px;
  }
  
  .message-list {
	flex: 1;
	padding: 10px;
	background-color: #f9f9f9;
	overflow-y: auto;
  }
  
  .message {
	padding: 10px;
	border-radius: 10px;
	margin-bottom: 10px;
	max-width: 50%;
  }
  
  .my-message {
	background-color: #d1ffd6;
	align-self: flex-end;
	margin-left: 50%;
  }
  
  .other-message {
	background-color: #f1f1f1;
	align-self: flex-start;
  }
  
  .message-time {
	font-size: 12px;
	color: #888;
	text-align: right;
  }
  
  .chat-input {
	display: flex;
	padding: 10px;
	background-color: #f0f0f0;
	border-top: 1px solid #ccc;
  }
  
  .chat-input textarea {
	flex: 1;
	padding: 10px;
	border-radius: 5px;
	border: 1px solid #ddd;
	resize: none;
  }
  
  .chat-input button {
	margin-left: 10px;
	padding: 10px;
	background-color: #4CAF50;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
  }
  
  .chat-input button:hover {
	background-color: #45a049;
  }
  
  .welcome-message {
	text-align: center;
	font-size: 24px;
	margin-top: 50px;
	color: #4CAF50;
  }

  </style>
  
<template>
	<div class="layout">
	  <Sidebar />
	  <div class="main">
		<!-- 左侧联系人列表 -->
		<div class="contact-list">
		  <div class="search-container">
			<input type="text" v-model="searchQuery" placeholder="Search friends..." class="search-box" />
			<div class="plus-icon" @click="toggleMenu">
			  <span>+</span>
			</div>
		  </div>
		  
		  <!-- 菜单显示 -->
		   <div v-if="isMenuVisible" class="menu">
		    <button @click="openAddFriendDialog">添加好友</button>
		    <button @click="openGroupChatDialog">发起群聊</button>
			<button @click="openReceivedRequestsDialog">收到申请</button>
		  </div>
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
  
	  <!-- 添加好友的弹框 -->
	  <div v-if="isAddFriendDialogOpen" class="dialog">
		<div class="dialog-content">
		  <h3>添加好友</h3>
		  <input type="text" v-model="newFriendName" placeholder="请输入好友id" />
		  <button @click="addFriend">发送</button>
		  <button @click="closeAddFriendDialog">取消</button>
		</div>
	  </div>
  
	  <!-- 发起群聊的弹框 -->
	  <div v-if="isGroupChatDialogOpen" class="dialog">
		<div class="dialog-content">
		  <h3>选择联系人</h3>
		  <div v-for="(contact, index) in contacts" :key="index">
			<input type="checkbox" v-model="selectedContactsForGroupChat" :value="contact" /> {{ contact.name }}
		  </div>
		  <button @click="startGroupChat">开始群聊</button>
		  <button @click="closeGroupChatDialog">取消</button>
		</div>
	  </div>
	</div>
	<!-- 收到申请的弹框 -->
	<div v-if="isReceivedRequestsDialogOpen" class="dialog">
	<div class="dialog-content">
		<h3>收到的好友请求</h3>
		<div v-for="(request, index) in receivedRequests" :key="index">
		<p>{{ request.name }}</p>
		<button @click="acceptRequest(request)">接受</button>
		<button @click="rejectRequest(request)">拒绝</button>
		</div>
		<button @click="closeReceivedRequestsDialog">关闭</button>
	</div>
	</div>
  </template>
  
<script>
import { ref, nextTick, computed,inject } from 'vue';
import Sidebar from "../components/Sidebar.vue";
import { useRouter } from 'vue-router';  // 使用 Vue Router 进行页面跳转
import axios from '../utils/axios';

export default {
  name: 'ChatApp',
  components: {
    Sidebar,
  },
  setup() {
    const newMessage = ref('');
    const selectedContact = ref(null);
    const searchQuery = ref('');
    const newFriendName = ref('');
	const showAlert = inject("showAlert");
    const router = useRouter();  // 获取 Vue Router 实例

    const contacts = ref([]);

    const fetchContacts = async () => {
      const userID = localStorage.getItem("user_id");
      try {
        const response = await axios.post('/api/friend/allfriend', {
          userID: parseInt(userID, 10)
        });

        contacts.value = response.data.data.map(contact => ({
          name: contact.friendName,
          messages: [], // 假设消息不在初始数据中
        }));
      } catch (error) {
        console.error('获取联系人时出错:', error);
        showAlert('获取联系人时出错'); // 使用 showAlert 抛出提示
      }
    };

    // 调用 fetchContacts
    fetchContacts();
	const receivedRequests = ref([ // 收到的好友请求列表
  		{ name: 'Charlie', status: 'pending' }, // 假设有一些请求
  		{ name: 'David', status: 'pending' }
	]);

    const selectedContactsForGroupChat = ref([]);
    const isAddFriendDialogOpen = ref(false);
    const isGroupChatDialogOpen = ref(false);
	const isReceivedRequestsDialogOpen = ref(false); // 控制“收到申请”对话框的显示状态
    const isMenuVisible = ref(false);

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

    // 显示和隐藏菜单
    const toggleMenu = () => {
      isMenuVisible.value = !isMenuVisible.value;
    };

    // 打开添加好友对话框
    const openAddFriendDialog = () => {
      isAddFriendDialogOpen.value = true;
      isMenuVisible.value = false; // 隐藏菜单
    };

    // 关闭添加好友对话框
    const closeAddFriendDialog = () => {
      isAddFriendDialogOpen.value = false;
    };

	// 添加好友
	const addFriend = async () => {
	if (newFriendName.value.trim()) {
		// 构建请求体
		const friendRequest = {
		userID: localStorage.getItem("user_id"),    // 当前用户ID
		friendID: newFriendName.value,  // 目标好友的ID或者用户名
		};

		try {
		// 使用axios发送请求到服务器
		const response = await axios.post('/api/friend/apply', friendRequest);

		if (response.status === 200) {
			// 请求成功，处理响应结果
			showAlert("请求已发送，请等待对方的回应。", true);
			newFriendName.value = '';  // 清空输入框
			closeAddFriendDialog();    // 关闭添加好友弹窗
		} else {
			// 处理错误响应
			showAlert(`请求失败: ${response.data.message}`, false);
		}
		} catch (error) {
		// 捕获并处理网络请求错误
		showAlert(`请求错误: ${error.response ? error.response.data.message : error.message}`, false);
		}
	} else {
		// 输入为空时提示
		showAlert("请输入好友id", false);
	}
	};

    // 打开发起群聊对话框
    const openGroupChatDialog = () => {
      isGroupChatDialogOpen.value = true;
      isMenuVisible.value = false; // 隐藏菜单
    };

    // 关闭发起群聊对话框
    const closeGroupChatDialog = () => {
      isGroupChatDialogOpen.value = false;
    };

    // 开始群聊
    const startGroupChat = () => {
      if (selectedContactsForGroupChat.value.length > 0) {
        // 将群聊联系人添加到聊天框
        selectedContact.value = { name: 'Group Chat', messages: [] };
        selectedContactsForGroupChat.value.forEach(contact => {
          contact.messages.forEach(msg => {
            selectedContact.value.messages.push(msg);
          });
        });
        closeGroupChatDialog();
      }
    };
	// 打开“收到申请”对话框
	const openReceivedRequestsDialog = () => {
  		isReceivedRequestsDialogOpen.value = true;
  		isMenuVisible.value = false; // 隐藏菜单
	};
	// 关闭“收到申请”对话框
	const closeReceivedRequestsDialog = () => {
		isReceivedRequestsDialogOpen.value = false;
	};

	// 接受好友请求
	const acceptRequest = (request) => {
		// 将联系人添加到通讯录
		contacts.value.push({ name: request.name, messages: [] });

		// 从收到的请求列表中移除已接受的请求
		receivedRequests.value = receivedRequests.value.filter(r => r !== request);

		// 发送一条消息给对方
		const message = {
			text: `Hi ${request.name}, I accepted your friend request!`, // 自动回复信息
			time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			sender: 'me'
		};

		// 找到接受请求的联系人并将该消息加入联系人聊天记录
		const contact = contacts.value.find(contact => contact.name === request.name);
		if (contact) {
			contact.messages.push(message);
		}

		// 弹出提示框通知用户
		showAlert("您已接受" + request.name + "的好友请求", true);

		// 关闭收到申请对话框
		closeReceivedRequestsDialog();
	};

	// 拒绝好友请求
	const rejectRequest = (request) => {
		receivedRequests.value = receivedRequests.value.filter(r => r !== request);
		closeReceivedRequestsDialog();
	};

    return {
      newMessage, contacts, selectedContact, selectContact, sendMessage, searchQuery, filteredContacts, handleKeydown, goToDetailPage,
      isAddFriendDialogOpen, newFriendName, openAddFriendDialog, closeAddFriendDialog, addFriend,
      isGroupChatDialogOpen, selectedContactsForGroupChat, openGroupChatDialog, closeGroupChatDialog, startGroupChat,
      isMenuVisible, toggleMenu,isReceivedRequestsDialogOpen, receivedRequests, openReceivedRequestsDialog, closeReceivedRequestsDialog, acceptRequest, rejectRequest
    };
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
  .layout .sidebar {
	  opacity: 0.9;
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
	background-color: black;
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

.search-container {
  display: flex;
  align-items: center;
}

.search-box {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.plus-icon {
  font-size: 30px;
  cursor: pointer;
  margin-left: 10px;
  margin-bottom: 5%;
  position: relative;
  z-index: 10;
}

.menu {
  position: absolute;
  top: 16vh; /* 使菜单出现在加号下面 */
  left: 33vw;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  width: 150px;
  z-index: 5;
}

.menu button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}

.menu button:hover {
  background-color: #45a049;
}

.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.dialog-content {
  display: flex;
  flex-direction: column;
}

.dialog input {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>

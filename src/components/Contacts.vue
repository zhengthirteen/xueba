<template>
	<div class="layout" @click="hideMenu">
		<Sidebar />
		<div class="main">
			<!-- 左侧联系人列表 -->
			<div class="contact-list">
				<div class="search-container" @click.stop>
					<input
						type="text"
						v-model="searchQuery"
						placeholder="Search friends..."
						class="search-box"
					/>
					<div class="plus-icon" @click="toggleMenu">
						<span>+</span>
						<span v-if="hasNewFriendRequest" class="red-dot"></span>
					</div>
				</div>

				<!-- 菜单显示 -->
				<div v-if="isMenuVisible" class="menu">
					<button @click="openAddFriendDialog">添加好友</button>
					<button @click="openGroupChatDialog">发起群聊</button>
					<button @click="openReceivedRequestsDialog">
						收到申请
						<span v-if="hasNewFriendRequest" class="red-dot2"></span>
					</button>
				</div>
				<div v-if="filteredContacts.length === 0" class="no-matches">
					<p>无匹配对象</p>
				</div>
				<div
					v-for="(contact, index) in filteredContacts"
					:key="index"
					class="contact-item"
					:class="{
						active:
							selectedContact && selectedContact.friendID === contact.friendID,
					}"
					@click="selectContact(contact)"
				>
					<img :src="contact.avatarURL" alt="好友头像" class="contact-avatar" />
					<p>{{ contact.name }}</p>

					<button class="menu-button" @click.stop="goToDetailPage(contact)">
						<span class="dot"></span>
						<span class="dot"></span>
						<span class="dot"></span>
						<div v-if="contact.hasNewMessage" class="red-dot3"></div>
					</button>
					
				</div>
			</div>

			<!-- 右侧聊天框 -->
			<div class="chat-box">
				<div class="chat-header">
					<h2>{{ selectedContact?.name || "Select a contact" }}</h2>
				</div>
				<div class="message-list" ref="messageList">
					<div v-if="!selectedContact" class="welcome-message">
						<p>欢迎来到学吧！</p>
					</div>
					<div v-else>
						<div
							v-for="(message, index) in selectedContact?.messages"
							:key="index"
							class="message"
							:class="{
								'my-message': message.sender === 'me',
								'other-message': message.sender !== 'me',
							}"
						>
							<div class="message-content">
    <p v-html="message.text.replace(/\n/g, '<br>')"></p>
</div>
							<div class="message-time">
								<span>{{ message.time }}</span>
							</div>
						</div>
					</div>
				</div>

				<div v-if="selectedContact" class="chat-input">
					<textarea
						v-model="newMessage"
						placeholder="Type a message..."
						@keydown="handleKeydown"
					></textarea>
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
					<input
						type="checkbox"
						v-model="selectedContactsForGroupChat"
						:value="contact"
					/>
					{{ contact.name }}
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
			<div v-if="receivedRequests.length === 0"><p>暂无好友申请</p></div>
			<div
				v-for="(request, index) in receivedRequests"
				:key="index"
				class="tmp"
			>
				<p>{{ request.name }}</p>
				<button @click="acceptRequest(request)" class="apply">接受</button>
				<button @click="rejectRequest(request)" class="reject">拒绝</button>
			</div>
			<button @click="closeReceivedRequestsDialog">关闭</button>
		</div>
	</div>
</template>

<script>
import { ref, nextTick, computed, inject, onMounted, onUnmounted } from "vue";
import Sidebar from "../components/Sidebar.vue";
import { useRouter } from "vue-router"; // 使用 Vue Router 进行页面跳转
import axios from "../utils/axios";

export default {
	name: "ChatApp",
	components: {
		Sidebar,
	},
	setup() {
		const newMessage = ref("");
		const selectedContact = ref(null);
		const searchQuery = ref("");
		const newFriendName = ref("");
		const showAlert = inject("showAlert");
		const router = useRouter(); // 获取 Vue Router 实例

		const contacts = ref([]);
		let intervalID1;
		let intervalID2;

		const hideMenu = () => {
			isMenuVisible.value = false;
		};

		// 用于显示是否有新好友请求的红点
		const hasNewFriendRequest = ref(false);

		const checkNewFriendRequests = async () => {
			const userID = localStorage.getItem("user_id");
			try {
				const response = await axios.post("/api/friend/applyforget", {
					userID: parseInt(userID, 10),
				});
				if (response.data.data.length > 0) {
					hasNewFriendRequest.value = true;
					await fetchReceivedRequests();
				} else {
					hasNewFriendRequest.value = false;
				}
			} catch (error) {
				console.error("获取好友请求时出错:", error);
				showAlert("获取好友请求时出错"); // 使用 showAlert 抛出提示
			}
		};

		// 获取好友列表的函数
		const fetchContacts = async () => {
			const userID = localStorage.getItem("user_id"); // 从本地存储中获取用户ID
			try {
				// 发送请求到服务器获取好友列表
				const response = await axios.post("/api/friend/allfriend", {
					userID: parseInt(userID, 10),
				});
				console.log(response.data.data);

				// 将服务器返回的好友数据映射到 contacts 列表中
				const newContacts = response.data.data.map(async (contact) => {
					const picResponse = await axios.post("/api/source/picture", {
						picID: contact.friendImgID,
						status: 0,
					});
					const avatarURL =
						picResponse.data.code === 1 ? picResponse.data.data.picURL : "";
					return {
						name: contact.friendName, // 好友名称
						friendID: contact.friendID, // 好友ID
						relationID: contact.relationID,
						messages: [], // 假设消息不在初始数据中
						avatarURL, // 好友头像URL
						status: contact.status, // 好友状态
					};
				});
				if (JSON.stringify(newContacts) !== JSON.stringify(contacts.value)) {
					contacts.value = await Promise.all(newContacts);
				}
			} catch (error) {
				console.error("获取联系人时出错:", error);
				showAlert("获取联系人时出错"); // 使用 showAlert 抛出提示
			}
		};

		// 调用 fetchContacts 函数获取好友列表
		fetchContacts();

		const receivedRequests = ref([]);

		const fetchReceivedRequests = async () => {
			const userID = localStorage.getItem("user_id");
			try {
				const response = await axios.post("/api/friend/applyforget", {
					userID: parseInt(userID, 10),
				});

				receivedRequests.value = response.data.data.map((request) => ({
					name: request.name,
					status: request.relationStatus,
					friendID: request.userID,
					relationID: request.relationID,
				}));
				// console.log(receivedRequests.value);
			} catch (error) {
				console.error("获取好友请求时出错:", error);
				showAlert("获取好友请求时出错"); // 使用 showAlert 抛出提示
			}
		};

		// 调用 fetchReceivedRequests 函数获取收到的好友请求
		fetchReceivedRequests();

		const selectedContactsForGroupChat = ref([]);
		const isAddFriendDialogOpen = ref(false);
		const isGroupChatDialogOpen = ref(false);
		const isReceivedRequestsDialogOpen = ref(false); // 控制“收到申请”对话框的显示状态
		const isMenuVisible = ref(false);

		// 计算属性，返回过滤后的联系人列表
		const filteredContacts = computed(() => {
			return contacts.value.filter((contact) =>
				contact.name.toLowerCase().includes(searchQuery.value.toLowerCase())
			);
		});
		// console.log("contacts", contact);

		// 选择联系人并获取该联系人的消息
		const selectContact = async (contact) => {
			selectedContact.value = contact;
			await fetchMessages(contact.friendID);
			nextTick(() => {
				const messageList = document.querySelector(".message-list");
				messageList.scrollTop = messageList.scrollHeight;
			});
		};

		// 发送消息
		const sendMessage = async () => {
			if (newMessage.value.trim() && selectedContact.value) {
				if (selectedContact.value.status === 0) {
					showAlert("无法发送消息，对方已将您删除", false);
					return;
				}
				const userID = parseInt(localStorage.getItem("user_id"), 10);
				console.log(selectedContact.value);

				const message = {
					msgType: 2,
					userID: userID,
					picID: "", // 假设 picID 与 userID 相同
					relaID: selectedContact.value.friendID,
					status: 0,
					msgContent: newMessage.value,
				};
				// console.log(message);

				try {
					const response = await axios.post("/api/friend/sendmessage", message);

					if (response.status === 200 && response.data.code === 1) {
						const sentMessage = {
							text: newMessage.value,
							time: new Date().toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							}),
							sender: "me",
						};
						selectedContact.value.messages.push(sentMessage);
						newMessage.value = "";
						nextTick(() => {
							const messageList = document.querySelector(".message-list");
							messageList.scrollTop = messageList.scrollHeight;
						});
					} else {
						showAlert(`消息发送失败: ${response.data.msg}`, false);
					}
				} catch (error) {
					showAlert(
						`消息发送错误: ${
							error.response ? error.response.data.msg : error.message
						}`,
						false
					);
				}
			}
		};
		const lastMessages = ref({});

		// 修改 fetchMessages 函数
		const fetchMessages = async (friendID = null) => {
			const userID = parseInt(localStorage.getItem("user_id"), 10);

			if (friendID) {
				// 获取指定联系人的消息
				try {
					const response = await axios.post("/api/friend/getmessage", {
						userID: userID,
						friendID: friendID,
					});

					if (response.status === 200 && response.data.code === 1) {
						selectedContact.value.messages = response.data.data.map((msg) => ({
							text: msg.msgContent,
							time: msg.msgTime,
							sender: msg.userID === userID ? "me" : "friend",
						}));
						// 更新 lastMessages
						lastMessages.value[friendID] = selectedContact.value.messages;
					} else {
						showAlert(`获取消息失败: ${response.data.msg}`, false);
					}
				} catch (error) {
					showAlert(
						`获取消息错误: ${
							error.response ? error.response.data.msg : error.message
						}`,
						false
					);
				}
			} else {
				// 获取所有联系人的消息
				try {
					const responses = await Promise.all(
						contacts.value.map((contact) =>
							axios.post("/api/friend/getmessage", {
								userID: userID,
								friendID: contact.friendID,
							})
						)
					);

					responses.forEach((response, index) => {
						if (response.status === 200 && response.data.code === 1) {
							const newMessages = response.data.data.map((msg) => ({
								text: msg.msgContent,
								time: msg.msgTime,
								sender: msg.userID === userID ? "me" : "friend",
							}));

							const contact = contacts.value[index];
							const lastMessage = lastMessages.value[contact.friendID];

							// if (
							// 	!lastMessage ||
							// 	JSON.stringify(lastMessage) !== JSON.stringify(newMessages)
							// ) {
							// 	contact.hasNewMessage = true;
							// } else {
							// 	contact.hasNewMessage = false;
							// }
							if (!lastMessage) {
								lastMessages.value[contact.friendID] = newMessages;
							} else if (
								JSON.stringify(lastMessage) !== JSON.stringify(newMessages)
							) {
								contact.hasNewMessage = true;
							} else {
								contact.hasNewMessage = false;
							}
						}
					});
				} catch (error) {
					showAlert(
						`获取消息错误: ${
							error.response ? error.response.data.msg : error.message
						}`,
						false
					);
				}
			}
		};
		// 获取指定联系人的消息
		// const fetchMessages = async (friendID) => {
		// 	const userID = parseInt(localStorage.getItem("user_id"), 10);

		// 	try {
		// 		const response = await axios.post("/api/friend/getmessage", {
		// 			userID: userID,
		// 			friendID: friendID,
		// 		});

		// 		if (response.status === 200 && response.data.code === 1) {
		// 			selectedContact.value.messages = response.data.data.map((msg) => ({
		// 				text: msg.msgContent,
		// 				time: msg.msgTime,
		// 				sender: msg.userID === userID ? "me" : "friend",
		// 			}));
		// 		} else {
		// 			showAlert(`获取消息失败: ${response.data.msg}`, false);
		// 		}
		// 	} catch (error) {
		// 		showAlert(
		// 			`获取消息错误: ${
		// 				error.response ? error.response.data.msg : error.message
		// 			}`,
		// 			false
		// 		);
		// 		// console.log(response.data);
		// 	}
		// };

		const handleKeydown = (event) => {
			if (event.key === "Enter" && event.shiftKey) {
				sendMessage();
			}
		};

		const goToDetailPage = (contact) => {
			// 跳转到联系人详细信息页面，并传递联系人的id
			// console.log(contact);
			console.log(contact.relationID);

			router.push({
				name: "contact-detail",
				params: { id: contact.friendID, relationID: contact.relationID },
			});
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
					userID: parseInt(localStorage.getItem("user_id"), 10), // 当前用户ID
					friendID: parseInt(newFriendName.value, 10), // 目标好友的ID
					status: 0, // 好友申请中
				};

				try {
					// 使用axios发送请求到服务器
					const response = await axios.post("/api/friend/apply", friendRequest);

					if (response.status === 200 && response.data.code === 1) {
						// 请求成功，处理响应结果
						showAlert("请求已发送，请等待对方的回应。", true);
						newFriendName.value = ""; // 清空输入框
						closeAddFriendDialog(); // 关闭添加好友弹窗

						await fetchContacts();
					} else {
						// 处理错误响应
						showAlert(`请求失败: ${response.data.msg}`, false);
					}
				} catch (error) {
					// 捕获并处理网络请求错误
					showAlert(
						`请求错误: ${
							error.response ? error.response.data.msg : error.message
						}`,
						false
					);
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
				selectedContact.value = { name: "Group Chat", messages: [] };
				selectedContactsForGroupChat.value.forEach((contact) => {
					contact.messages.forEach((msg) => {
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

		// 接受好友请求并自动发送一条消息
		const acceptRequest = async (request) => {
			const userID = parseInt(localStorage.getItem("user_id"), 10);
			const handleRequest = {
				relationID: request.relationID,
				relationStatus: 1, // 成为好友
				userID: request.friendID,
				friendID: userID,
			};
			console.log("requese", request);
			console.log("handle", handleRequest);

			try {
				const response = await axios.post(
					"/api/friend/applyforhandle",
					handleRequest
				);

				if (response.status === 200 && response.data.code === 1) {
					// 将联系人添加到通讯录
					contacts.value.push({ name: request.name, messages: [] });

					// 从收到的请求列表中移除已接受的请求
					receivedRequests.value = receivedRequests.value.filter(
						(r) => r !== request
					);

					// 自动发送一条消息给对方
					const messagePayload = {
						msgType: 2,
						userID: userID,
						picID: "",
						relaID: request.friendID,
						msgStatus: 0,
						msgContent: `Hi ${request.name}, 我已经同意了你的好友请求，快来和我聊天吧`, // 自动回复信息
					};

					const messageResponse = await axios.post(
						"/api/friend/sendmessage",
						messagePayload
					);

					if (
						messageResponse.status === 200 &&
						messageResponse.data.code === 1
					) {
						const message = {
							text: messagePayload.content,
							time: new Date().toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							}),
							sender: "me",
						};
						// console.log("request", message);

						// 找到接受请求的联系人并将该消息加入联系人聊天记录
						const contact = contacts.value.find(
							(contact) => contact.name === request.name
						);
						if (contact) {
							contact.messages.push(message);
						}
					} else {
						showAlert(`消息发送失败: ${messageResponse.data.msg}`, false);
					}

					// 弹出提示框通知用户
					showAlert("您已接受" + request.name + "的好友请求", true);

					// 关闭收到申请对话框
					closeReceivedRequestsDialog();
				} else {
					showAlert(`请求处理失败: ${response.data.msg}`, false);
				}
			} catch (error) {
				showAlert(
					`请求处理错误: ${
						error.response ? error.response.data.msg : error.message
					}`,
					false
				);
			}
		};

		// 拒绝好友请求
		const rejectRequest = async (request) => {
			const userID = parseInt(localStorage.getItem("user_id"), 10);
			const handleRequest = {
				relationID: request.relationID,
				relationStatus: 2, // 拒绝申请
				userID: request.friendID,
				friendID: userID,
			};
			console.log("requese", request);
			console.log("handle", handleRequest);

			try {
				const response = await axios.post(
					"/api/friend/applyforhandle",
					handleRequest
				);

				if (response.status === 200 && response.data.code === 1) {
					receivedRequests.value = receivedRequests.value.filter(
						(r) => r !== request
					);
					showAlert("您已拒绝" + request.name + "的好友请求", true);
					closeReceivedRequestsDialog();
				} else {
					showAlert(`请求处理失败: ${response.data.msg}`, false);
				}
			} catch (error) {
				showAlert(
					`请求处理错误: ${
						error.response ? error.response.data.msg : error.message
					}`,
					false
				);
			}
		};
		onMounted(() => {
			intervalID1 = setInterval(() => {
				if (selectedContact.value) {
					fetchMessages(selectedContact.value.friendID);
				} else {
					fetchMessages();
				}
			}, 500);
			intervalID2 = setInterval(async () => {
				await fetchContacts();
				await checkNewFriendRequests();
			}, 1000);
		});
		onUnmounted(() => {
			clearInterval(intervalID1);
			clearInterval(intervalID2);
		});

		return {
			newMessage,
			contacts,
			selectedContact,
			selectContact,
			sendMessage,
			searchQuery,
			filteredContacts,
			handleKeydown,
			goToDetailPage,
			isAddFriendDialogOpen,
			newFriendName,
			openAddFriendDialog,
			closeAddFriendDialog,
			addFriend,
			isGroupChatDialogOpen,
			selectedContactsForGroupChat,
			openGroupChatDialog,
			closeGroupChatDialog,
			startGroupChat,
			isMenuVisible,
			toggleMenu,
			isReceivedRequestsDialogOpen,
			receivedRequests,
			openReceivedRequestsDialog,
			closeReceivedRequestsDialog,
			acceptRequest,
			rejectRequest,
			hasNewFriendRequest,
			hideMenu,
		};
	},
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
	background-image: url("../assets/background.jpg");
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
	height: 85vh;
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
	align-items: center; /* 垂直居中 */
	justify-content: space-between;
	padding: 10px;
	cursor: pointer;
	border-radius: 5px;
}

.contact-name {
	flex: 1;
	margin-left: 10px;
}

.contact-item.active {
	background-color: #4caf50;
	color: white;
}

.menu-button {
	background: transparent;
	position: relative;
	border: none;
	color: white;
	font-size: 24px;
	cursor: pointer;
	display: flex;
	flex-direction: row; /* 水平排列 */
	align-items: center; /* 垂直居中 */
	gap: 5px; /* 点与点之间的间距 */
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
	background-color: #4caf50;
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
	background-color: #4caf50;
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
	color: #4caf50;
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
	background-color: #4caf50;
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
	width: 500px;
	display: flex;
	flex-direction: column;
	text-align: center;
}

.dialog input {
	margin-bottom: 10px;
	padding: 10px;
	border-radius: 5px;
	border: 1px solid #ccc;
}
.dialog-content button {
	padding: 10px;
	background-color: #4caf50;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	margin-top: 10px;
}
.dialog-content p {
	text-align: center;
	font-size: 20px;
	font-weight: 600;
}
.dialog-content button.apply,
.dialog-content button.reject {
	padding: 10px;
	width: 120px; /* 增加按钮宽度 */
	font-size: 16px;
	font-weight: bold;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	margin: 10px; /* 增加按钮间距 */
	transition: background-color 0.3s ease;
}

.dialog-content button.apply {
	background-color: #4caf50;
	color: white;
}

.dialog-content button.apply:hover {
	background-color: #45a049;
}

.dialog-content button.reject {
	background-color: #f44336;
	color: white;
}

.dialog-content button.reject:hover {
	background-color: #e53935;
}
.red-dot {
	position: absolute;
	top: 10px;
	right: 0;
	width: 6px;
	height: 6px;
	background-color: red;
	border-radius: 50%;
}
.red-dot2 {
	position: absolute;
	top: 103px;
	right: 8px;
	width: 10px;
	height: 10px;
	background-color: red;
	border-radius: 50%;
}
.red-dot3 {
	position: absolute;
	right: 1px;
	width: 10px;
	height: 10px;
	background-color: red;
	border-radius: 50%;
	transform: translateY(-20px) translateX(7px);
}
.contact-avatar {
	width: 50px;
	height: 50px;
	border-radius: 50%;
	margin-right: 10px;
}
</style>

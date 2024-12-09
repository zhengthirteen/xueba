<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <Sidebar />
    <!-- 主内容区 -->
    <div class="main">
      <!-- 用户资料展示部分 -->
      <div class="user-profile">
        <img :src="avatar" alt="用户头像" />
        <div class="user-info">
          <h2>{{ user.name }}</h2>
          <p>{{ user.bio }}</p>
          <p><strong>状态：</strong><span :class="statusClass">{{ user.status }}</span></p>
          <p><strong>性别：</strong>{{ user.gender }}</p>
        </div>
      </div>

      <!-- 邮箱信息显示部分 -->
      <div class="user-email">
        <p><strong>邮箱：</strong>{{ user.email }}</p>
      </div>

      <!-- 新增手机号信息 -->
      <div class="user-phone">
        <p><strong>手机号：</strong>{{ user.phone }}</p>
      </div>

      <!-- 新增地址信息 -->
      <div class="user-address">
        <p><strong>地址：</strong>{{ user.address }}</p>
      </div>

      <!-- 新增学校信息 -->
      <div class="user-school">
        <p><strong>学校：</strong>{{ user.school }}</p>
      </div>

      <!-- 退出/切换账号按钮 -->
      <div class="logout-btn">
        <button @click="confirmDelete">删除好友</button>
      </div>
    </div>
    
    <!-- 返回按钮 -->
    <button class="back-btn" @click="editProfile">返回</button>
    <button class="find-chat-btn" @click="showChatHistory">查找聊天记录</button>

    <!-- 聊天记录弹窗 -->
    <div v-if="showChatModal" class="chat-modal">
      <div class="chat-modal-content">
        <span class="close" @click="closeChatModal">&times;</span>
        <h2>聊天记录</h2>
        <input type="text" v-model="searchQuery" placeholder="搜索聊天记录" />
        <div class="chat-history">
          <div v-for="message in filteredMessages" :key="message.msgID" class="chat-message">
            <p><strong>{{ message.msgTime }}</strong>: {{ message.msgContent }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject, reactive } from "vue";
import { useRoute, useRouter } from "vue-router"; // 导入 Vue Router
import Sidebar from "../components/Sidebar.vue"; // 导入 Sidebar 组件
import axios from '../utils/axios'; // 导入 axios

export default {
  name: "ContactDetail",
  components: {
    Sidebar,
  },
  setup() {
    const showAlert = inject("showAlert");
    const showConfirm = inject("showConfirm");
    const router = useRouter();
    const route = useRoute();

    // 用户数据的响应式引用
    const user = reactive({
      name: "",
      status: "",
      gender: "",
      email: "",
      phone: "",
      address: "",
      school: "",
    });

    // 用户头像的单独引用
    const avatar = ref("");

    // 从路由参数获取用户ID
    const userId = route.params.id;

    // 聊天记录相关状态
    const showChatModal = ref(false);
    const chatMessages = ref([]);
    const searchQuery = ref("");

    // 获取用户数据的函数
    const fetchUserData = async () => {
      try {
        const userInfoResponse = await axios.get('/api/user/getinfo', {
          params: { userid: userId }
        });

        if (userInfoResponse.data.code === 1) {
          const data = userInfoResponse.data.data;
          user.name = data.username;
          user.status = data.status || ""; // 假设没有 status 信息
          user.gender = data.gender === 1 ? "男" : "女";
          user.email = data.email;
          user.phone = data.phone;
          user.address = data.address;
          user.school = data.school;
        } else {
          showAlert(userInfoResponse.data.msg);
        }
      } catch (error) {
        console.error('获取用户信息时出错:', error);
        showAlert('获取用户信息时出错');
      }
    };

    // 获取用户头像的函数
    const fetchUserAvatar = async () => {
      try {
        const userAvatarResponse = await axios.get('/api/user/getimg', {
          params: { userid: userId }
        });

        if (userAvatarResponse.data.code === 1) {
          avatar.value = userAvatarResponse.data.data;
        } else {
          showAlert(userAvatarResponse.data.msg);
        }
      } catch (error) {
        console.error('获取用户头像时出错:', error);
        showAlert('获取用户头像时出错');
      }
    };

    // 计算用户状态的 CSS 类
    const statusClass = computed(() => {
      switch (user.status) {
        case "在线":
          return "online";
        case "忙碌":
          return "busy";
        case "隐身":
          return "away";
        default:
          return "";
      }
    });

    // 删除好友的逻辑
    const confirmDelete = () => {
      showConfirm("您确定要删除这个好友吗？", "好友已删除", true, async (confirmed) => {
        if (confirmed) {
          try {
            const response = await axios.post('/api/friend/deletefriend', {
              relationID: userId, // 假设 userId 是好友关系ID
              relationStatus: 3
            });

            if (response.data.code === 1) {
              showAlert(response.data.msg);
              router.push("/contacts"); // 假设跳转回联系人列表页面
            } else {
              showAlert(response.data.msg);
            }
          } catch (error) {
            console.error('删除好友时出错:', error);
            showAlert('删除好友时出错');
          }
        }
      });
    };

    // 返回功能
    const editProfile = () => {
      router.push(`/contacts`);
    };
    
    // 显示聊天记录弹窗
    const showChatHistory = async () => {
      const userID = parseInt(localStorage.getItem("user_id"));
      try {
        const response = await axios.post('/api/friend/getmessage', {
          userID: userID,
          friendID: userId
        });

        if (response.data.code === 1) {
          chatMessages.value = response.data.data;
          showChatModal.value = true;
        } else {
          showAlert(response.data.msg);
        }
      } catch (error) {
        console.error('获取聊天记录时出错:', error);
        showAlert('获取聊天记录时出错');
      }
    };

    // 关闭聊天记录弹窗
    const closeChatModal = () => {
      showChatModal.value = false;
    };

    // 过滤聊天记录
    const filteredMessages = computed(() => {
      return chatMessages.value.filter(message =>
        message.msgContent.includes(searchQuery.value)
      );
    });

    // 在组件挂载时调用数据加载函数
    onMounted(() => {
      fetchUserData();
      fetchUserAvatar();
    });

    return {
      user,
      avatar,
      statusClass,
      editProfile,
      showChatHistory,
      confirmDelete,
      showChatModal,
      closeChatModal,
      searchQuery,
      filteredMessages,
    };
  },
};
</script>

<style scoped>
/* 页面根元素确保全屏显示 */
html,
body {
  height: 100%;
  margin: 0;
}

/* 主容器 */
.layout {
  display: flex;
  height: 100%;
  width: 75vw;
  margin-left: 10vw;
  position: relative; /* 确保返回按钮定位到正确位置 */
}

/* 主内容区 */
.main {
  position: fixed;
  top: 80px;
  width: 80%;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* 用户资料部分样式 */
.user-profile {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 20px;
}

.user-profile img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.user-info {
  flex-grow: 1;
  text-align: left;
}

.user-profile button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #666;
  color: white;
  border: none;
  cursor: pointer;
}

.user-profile button:hover {
  background-color: #555;
}

/* 信息部分样式 */
.user-email,
.user-phone,
.user-address,
.user-school {
  padding: 20px;
  background-color: #f4f4f4;
  margin-top: 20px;
  border-radius: 8px;
}

.user-email p,
.user-phone p,
.user-address p,
.user-school p {
  font-size: 16px;
  font-weight: bold;
}

/* 用户状态的颜色 */
.online {
  color: green;
}

.away {
  color: gray;
}

.busy {
  color: red;
}

/* 删除好友按钮样式 */
.logout-btn {
  margin-top: 20px;
  padding: 10px 20px;  /* 调整为和返回按钮一致的内边距 */
  text-align: center;
}

.logout-btn button {
  padding: 10px 20px;
  background-color: #ff4d4f;  /* 设置和返回按钮一致的背景色 */
  color: white;
  border: none;
  border-radius: 5px;  /* 设置圆角和返回按钮一致 */
  cursor: pointer;
  font-size: 16px;  /* 字体大小一致 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);  /* 阴影和返回按钮一致 */
  transition: all 0.3s ease;  /* 设置过渡效果 */
}

.logout-btn button:hover {
  background-color: #e43f3b;  /* 设置悬停时的背景色一致 */
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);  /* 悬停时阴影效果一致 */
}


/* 返回按钮样式 */
.back-btn {
  position: fixed;
  top: 4vh;
  left: 13vw;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.back-btn:hover {
  background-color: #0056b3;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
}

/* 查找聊天记录按钮样式 */
.find-chat-btn {
  position: fixed;
  top: 20vh;
  left: 80vw;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.find-chat-btn:hover {
  background-color: #0056b3;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
}

/* 聊天记录弹窗样式 */
.chat-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.chat-modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 60%;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  position: relative;
}

.chat-modal-content .close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 30px;
  cursor: pointer;
}

.chat-modal-content h2 {
  margin-top: 0;
  text-align: center;
}

.chat-modal-content input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.chat-history {
  margin-top: 20px;
}

.chat-message {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.chat-message p {
  margin: 0;
}
</style>

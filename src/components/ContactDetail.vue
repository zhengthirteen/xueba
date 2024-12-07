<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <Sidebar />
    <!-- 主内容区 -->
    <div class="main">
      <!-- 用户资料展示部分 -->
      <div class="user-profile">
        <img :src="user.avatar" alt="用户头像" />
        <div class="user-info">
          <h2>{{ user.name }}</h2>
          <p>{{ user.bio }}</p>
          <p><strong>状态：</strong><span :class="statusClass">{{ user.status }}</span></p>
          <p><strong>性别：</strong>{{ user.gender }}</p>
        </div>
      </div>

      <!-- 邮箱信息显示部分 -->
      <div class="user-email">
        <p><strong>邮箱：</strong>{{ email }}</p>
      </div>

      <!-- 新增手机号信息 -->
      <div class="user-phone">
        <p><strong>手机号：</strong>{{ phone }}</p>
      </div>

      <!-- 新增地址信息 -->
      <div class="user-address">
        <p><strong>地址：</strong>{{ address }}</p>
      </div>

      <!-- 新增学校信息 -->
      <div class="user-school">
        <p><strong>学校：</strong>{{ school }}</p>
      </div>

      <!-- 退出/切换账号按钮 -->
      <div class="logout-btn">
        <button @click="confirmDelete">删除好友</button>
      </div>
    </div>
    
    <!-- 返回按钮 -->
    <button class="back-btn" @click="editProfile">返回</button>
    <button class="find-chat-btn" @click="findChat">查找聊天记录</button>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router"; // 导入 Vue Router
import Sidebar from "../components/Sidebar.vue"; // 导入 Sidebar 组件

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
    const user = ref({
      name: "",
      bio: "",
      avatar: "",
      status: "",
      gender: "",
    });

    // 用户的其他信息
    const email = ref("");
    const phone = ref("");
    const address = ref("");
    const school = ref("");

    // 从路由参数获取用户ID（假设你通过路由参数传递）
    const userId = "1";

    // 模拟获取用户数据的函数
    const fetchUserData = () => {
      // 这里模拟从后端获取用户信息
      // 根据 userId 模拟请求返回不同的用户信息
      if (userId === "1") {
        user.value = {
          name: "张三",
          bio: "这是张三的个人简介。",
          avatar: "https://via.placeholder.com/100",
          status: "在线",
          gender: "男",
        };
        email.value = "user1@example.com";
        phone.value = "+1 234 567 890";
        address.value = "1234 Elm Street, Springfield, IL";
        school.value = "Springfield University";
      } else if (userId === "2") {
        user.value = {
          name: "李四",
          bio: "这是李四的个人简介。",
          avatar: "https://via.placeholder.com/100",
          status: "忙碌",
          gender: "女",
        };
        email.value = "user2@example.com";
        phone.value = "+1 234 567 891";
        address.value = "5678 Oak Avenue, Springfield, IL";
        school.value = "Greenwood College";
      }
    };

    // 计算用户状态的 CSS 类
    const statusClass = computed(() => {
      switch (user.value.status) {
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
      showConfirm("您确定要删除这个好友吗？", "好友已删除", true, (confirmed) => {
        if (confirmed) {
          router.push("/contacts"); // 假设跳转回联系人列表页面
        }
      });
    };

    // 返回功能
    const editProfile = () => {
      router.push(`/contacts`);
    };
    
    // 查找聊天记录
    const findChat = () => {
      // 跳转到聊天记录页面并传递用户ID和用户名
      router.push(`/chat-history/${userId}/${user.value.name}`);
    }

    // 在组件挂载时调用数据加载函数
    onMounted(() => {
      fetchUserData();
    });

    return {
      user,
      email,
      phone,
      address,
      school,
      statusClass,
      editProfile,
      findChat,
      confirmDelete,
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
</style>

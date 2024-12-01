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
            <!-- 显示性别 -->
            <p><strong>性别：</strong>{{ user.gender }}</p>
          </div>
          <button @click="editProfile">编辑</button>
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
          <button @click="logout">退出/切换账号</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router"; // 导入 Vue Router
  import Sidebar from "../components/Sidebar.vue"; // 导入 Sidebar 组件
  
  export default {
    name: "ContactDetail",
    components: {
      Sidebar,
    },
    setup() {
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
      const userId = route.params.userId;
  
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
        // 你可以根据不同的 userId 加载不同的用户数据
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
  
      // 编辑资料的逻辑
      const editProfile = () => {
        router.push(`/user-edit/${userId}`); // 跳转到编辑页面
      };
  
      // 退出/切换账号的逻辑
      const logout = () => {
        router.push("/login"); // 跳转到登录页面
      };
  
      // 在组件挂载时调用数据加载函数
      onMounted(() => {
        fetchUserData(); // 获取用户数据
      });
  
      return {
        user,
        email,
        phone,
        address,
        school,
        statusClass,
        editProfile,
        logout,
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
  }

  
  /* 主内容区 */
  .main {
    position: fixed;
    top: 80px;
    width: 80%;
    padding: 20px;
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
  
  /* 退出按钮样式 */
  .logout-btn {
    margin-top: 20px;
    padding: 20px;
    text-align: center;
  }
  
  .logout-btn button {
    padding: 10px 20px;
    background-color: #ff4d4f;
    color: white;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }
  
  .logout-btn button:hover {
    background-color: #e43f3b;
  }
  </style>
  
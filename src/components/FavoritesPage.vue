<template>
    <div>
      <!-- 导航栏 -->
      <nav class="navbar">
        <ul>
          <li><router-link to="/profile">我的</router-link></li>
          <li><router-link to="/publish">发表</router-link></li>
          <li><router-link to="/favorites">收藏夹</router-link></li>
        </ul>
      </nav>
  
      <!-- 收藏的帖子列表 -->
      <div class="posts-list">
        <h2>我收藏的帖子</h2>
        <!-- 帖子项列表 -->
        <div class="post-item" 
             v-for="post in posts" 
             :key="post.id" 
             @click="goToPost(post.id)">
          <h3>{{ post.title }}</h3>
          <p>热度：{{ post.hotness }}</p>
  
          <!-- 删除按钮 -->
          <div class="post-actions">
            <button @click.stop="deletePost(post.id)">删除</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  // 导入 axios
// import axios from "axios";

// export default {
//   name: "FavoritesPage",
//   data() {
//     return {
//       posts: [], // 用来存放获取到的收藏的帖子
//     };
//   },
//   methods: {
//     // 跳转到具体帖子页面
//     goToPost(postId) {
//       this.$router.push(`/post/${postId}`);
//     },

//     // 从后端获取收藏的帖子数据
//     async fetchPosts() {
//       try {
//         const response = await axios.get("https://your-api-endpoint.com/api/favorites"); // 替换成你的后端接口
//         this.posts = response.data; // 假设返回的数据是一个帖子数组
//       } catch (error) {
//         console.error("获取收藏帖子数据失败:", error);
//         alert("获取收藏数据失败，请稍后重试！");
//       }
//     },

//     // 删除收藏的帖子
//     async deletePost(postId) {
//       if (confirm("确认删除此帖子吗？")) {
//         try {
//           // 发送删除请求
//           const response = await axios.delete(`https://your-api-endpoint.com/api/favorites/${postId}`);
//           if (response.data.success) {
//             this.posts = this.posts.filter(post => post.id !== postId); // 从本地移除已删除的帖子
//             alert("帖子已删除！");
//           } else {
//             alert("删除失败，请稍后重试！");
//           }
//         } catch (error) {
//           console.error("删除失败", error);
//           alert("删除失败，请稍后再试！");
//         }
//       }
//     },
//   },
//   mounted() {
//     this.fetchPosts(); // 组件加载后，获取收藏的帖子数据
//   }
  export default {
    name: "FavoritesPage",
    data() {
      return {
        posts: [], // 初始化为空数组
      };
    },
    methods: {
      // 跳转到具体帖子页面
      goToPost(postId) {
        this.$router.push(`/post/${postId}`);
      },
  
      // 模拟从后端获取收藏的帖子数据
      fetchPosts() {
        // 模拟获取数据
        setTimeout(() => {
          this.posts = [
            { id: 1, title: "第一个收藏的帖子", hotness: 120 },
            { id: 2, title: "第二个收藏的帖子", hotness: 95 },
            { id: 3, title: "第三个收藏的帖子", hotness: 70 },
          ];
        }, 1000); // 模拟1秒钟的延迟
      },
  
      // 删除收藏的帖子
      deletePost(postId) {
        if (confirm("确认删除此帖子吗？")) {
          // 模拟删除操作
          setTimeout(() => {
            this.posts = this.posts.filter(post => post.id !== postId); // 从本地移除已删除的帖子
            alert("帖子已删除！");
          }, 500); // 模拟删除延迟
        }
      },
    },
    mounted() {
      this.fetchPosts(); // 组件加载后，获取帖子数据
    },
  };
  </script>
  
  <style scoped>
  /* 导航栏样式 */
  .navbar {
    position: fixed; /* 固定定位 */
    top: 0; /* 置顶 */
    left: 200px; /* 左对齐 */
    width: calc(100% - 200px); /* 宽度铺满整个屏幕 */
    background-color: #333; /* 背景颜色 */
    padding: 10px 0; /* 上下内边距 */
    text-align: center; /* 内容居中 */
    z-index: 10; /* 确保导航栏在最前面 */
  }
  
  .navbar ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex; /* 使用 flex 布局 */
    justify-content: center; /* 横向居中对齐 */
  }
  
  .navbar li {
    margin: 0 15px; /* 每个选项之间的间距 */
  }
  
  .navbar a {
    color: white;
    text-decoration: none;
  }
  
  .navbar a:hover {
    text-decoration: underline;
  }
  
  /* 帖子列表样式 */
  .posts-list {
    margin-top: 80px; /* 为了避开固定的导航栏 */
    padding: 20px;
  }
  
  h2 {
    text-align: left; /* 将标题左对齐 */
    margin: 0; /* 取消默认外边距 */
    font-size: 24px; /* 调整字体大小 */
    font-weight: bold;
  }
  
  .post-item {
    width: 100%; /* 确保占满全宽 */
    background-color: #f9f9f9;
    margin: 10px 0;
    padding: 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    box-sizing: border-box; /* 确保内外边距不会影响宽度 */
  }
  
  .post-item:hover {
    background-color: #f1f1f1;
  }
  
  h3 {
    margin: 0;
    font-size: 18px;
  }
  
  p {
    margin: 5px 0;
    color: #888;
  }
  
  /* 按钮样式 */
  .post-actions {
    margin-top: 10px;
  }
  
  .post-actions button {
    margin-right: 10px;
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .post-actions button:hover {
    background-color: #0056b3;
  }
  </style>
  
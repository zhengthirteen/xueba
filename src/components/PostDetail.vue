<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <Sidebar />
    <!-- 主内容区 -->
    <div class="main">
      <!-- 导航栏 -->
      <nav class="navbar">
        <ul>
          <li><router-link to="/profile">我的</router-link></li>
          <li><router-link to="/publish">发布帖子</router-link></li>
          <li><router-link to="/favorites">收藏夹</router-link></li>
        </ul>
      </nav>
      
      <!-- 帖子详情区域 -->
      <div class="post-detail">
        <div class="post-header">
          <h2>{{ post.title }}</h2>
          <p class="author">发布者：{{ post.author }}</p>
          <p class="date">发布于：{{ post.date }}</p>
        </div>
        
        <div class="post-content">
          <p>{{ post.content }}</p>
        </div>
        
        <div class="post-actions">
            <button @click="toggleLike" :class="{'liked': isLiked}">
                <img :src="likeImage" alt="点赞" />
            </button>
            <button @click="toggleFavorite" :class="{'favorited': isFavorited}">
                <img :src="favoriteImage" alt="收藏" />
            </button>
            <button @click="sharePost">
                <img src="@/fig/transmit.png" alt="转发" />
            </button>
        </div>

        <div v-if="shareMessage" class="share-message">
          <p>{{ shareMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from '../components/Sidebar.vue'; // 导入 Sidebar 组件
import { usePostActions } from '../hooks/usePostActions'; // 导入自定义 hook

export default {
  name: "PostDetail",
  components: {
    Sidebar,
  },
  setup() {
    const router = useRouter();
    
    // 模拟帖子数据
    const post = ref({
      title: "帖子标题",
      content: "这是帖子内容。这里可以写一些文本，介绍帖子内容。",
      author: "作者名字",
      date: "2024-11-30",
    });

    // 使用 usePostActions hook 来管理点赞、收藏、转发功能
    const { 
      isLiked, 
      likeImage,
      isFavorited, 
      favoriteImage,
      shareMessage, 
      toggleLike, 
      toggleFavorite, 
      sharePost 
    } = usePostActions();

    return {
      post,
      isLiked,
      likeImage,
      isFavorited,
      favoriteImage,
      shareMessage,
      toggleLike,
      toggleFavorite,
      sharePost,
    };
  },
};
</script>


<style scoped>
.layout {
  display: flex;
  height: 100%;
  margin: 0 auto;
  width: 75vw;
  margin-left: 10vw;
}

.navbar {
  position: fixed;
  top: 0;
  left: 180px;
  width: calc(100% - 180px);
  background-color: #333;
  padding: 10px 0;
  text-align: center;
  font-size: 18px;
  z-index: 10;
}

.navbar ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}

.navbar li {
  margin: 0 15px;
}

.navbar a {
  color: white;
  text-decoration: none;
}

.navbar a:hover {
  text-decoration: underline;
}

.main {
  position: fixed;
  top: 80px;
  width: 80%;
  padding: 20px;
  overflow-y: auto;
}

.post-detail {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.post-header {
  margin-bottom: 20px;
}

h2 {
  font-size: 28px;
  margin-bottom: 10px;
}

.author, .date {
  color: #888;
  font-size: 14px;
}

.post-content {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.post-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

button {
  padding: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

button img {
  width: 30px;
  height: 30px;
}



.share-message {
  margin-top: 20px;
  font-size: 16px;
  color: #28a745;
}
</style>

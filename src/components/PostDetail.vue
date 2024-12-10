<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <Sidebar />
    <!-- 主内容区 -->
    <div class="main">
      <!-- 帖子详情区域 -->
      <div class="post-detail">
        <div class="post-header">
          <h2>{{ post.postDTO.postTitle }}</h2>
          <p class="date">发布于：{{ post.postDTO.createTime }}</p>
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
import { ref, onMounted, inject } from 'vue';
import axios from '../utils/axios';
import Sidebar from '../components/Sidebar.vue';
import { usePostActions } from '../hooks/usePostActions'; // 自定义 hook

export default {
  name: "PostDetail",
  components: {
    Sidebar,
  },
  props: {
    postID: {
      type: String,
      required: true,  // 确保 postID 必须传递
    },
  },
  setup(props) {
    const post = ref({});
    const showAlert = inject("showAlert");

    const fetchPostDetails = async () => {
      try {
        const response = await axios.get('/api/source/postAll', {
          params: { postID: props.postID }, // 使用传入的 postID
        });
        if (response.data.code === 1) {
          post.value = response.data.data;
        } else {
          showAlert(`获取帖子详情失败: ${response.data.msg}`, false);
        }
      } catch (error) {
        showAlert("获取帖子详情失败，请稍后重试！", false);
      }
    };

    onMounted(() => {
      fetchPostDetails();
    });

    const { isLiked, likeImage, isFavorited, favoriteImage, shareMessage, toggleLike, toggleFavorite, sharePost } = usePostActions(post);

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

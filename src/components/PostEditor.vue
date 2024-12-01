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
      <!-- 帖子发布区域 -->
      <div class="post-editor">
        <h2>发布新帖子</h2>
        <form @submit.prevent="submitPost">
          <div class="form-group">
            <label for="title">标题</label>
            <input type="text" id="title" v-model="postTitle" placeholder="请输入帖子标题" required />
          </div>
          <div class="form-group">
            <label for="content">内容</label>
            <textarea id="content" v-model="postContent" placeholder="请输入帖子内容" required></textarea>
          </div>

          <!-- 插入功能按钮 -->
          <div class="form-group">
            <button type="button" @click="toggleImageUpload">
              <img src="@/fig/picture.png" alt="插入图片" />
              <span>图片</span>
            </button>
            <button type="button" @click="toggleVideoLink">
              <img src="@/fig/video.png" alt="插入视频" />
              <span>视频</span>
            </button>
            <button type="button" @click="toggleEmojiPicker">
              <img src="@/fig/smile.png" alt="插入表情" />
              <span>表情</span>
            </button>
          </div>

          <!-- 图片上传功能 -->
          <div v-if="isImageUploadVisible" class="image-upload">
            <input type="file" @change="handleImageUpload" />
          </div>

          <!-- 视频插入功能 -->
          <div v-if="isVideoLinkVisible" class="video-link">
            <input type="text" v-model="videoUrl" placeholder="粘贴视频链接" />
            <button type="button" @click="insertVideo">插入视频</button>
          </div>

          <!-- 表情选择功能 -->
          <div v-if="isEmojiPickerVisible" class="emoji-picker">
            <button type="button" @click="insertEmoji('😊')">😊</button>
            <button type="button" @click="insertEmoji('😂')">😂</button>
            <button type="button" @click="insertEmoji('😎')">😎</button>
            <button type="button" @click="insertEmoji('😍')">😍</button>
            <button type="button" @click="insertEmoji('😭')">😭</button>
          </div>

          <!-- 发布按钮（添加样式，放在右下角） -->
          <div class="submit-button-container">
            <button type="submit" class="submit-button">发布</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "../components/Sidebar.vue"; // 导入 Sidebar 组件
import { usePost } from "../hooks/usePost.js"; // 假设你有一个 hooks 用于处理发布逻辑

export default {
  name: "PostEditor",
  components: {
    Sidebar,
  },
  setup() {
    const router = useRouter();
    const postTitle = ref("");
    const postContent = ref("");
    const videoUrl = ref("");
    
    // 控制显示/隐藏各个功能区域
    const isImageUploadVisible = ref(false);
    const isVideoLinkVisible = ref(false);
    const isEmojiPickerVisible = ref(false);

    const { createPost } = usePost(); // 假设你有一个自定义 hook 用于处理帖子发布

    // 发布帖子函数
    const submitPost = async () => {
      try {
        await createPost(postTitle.value, postContent.value);
        alert("帖子发布成功！");
        router.push("/"); // 发布成功后跳转到主页或其他页面
      } catch (error) {
        alert("发布失败，请稍后再试！");
      }
    };

    // 控制图片上传显示
    const toggleImageUpload = () => {
      isImageUploadVisible.value = !isImageUploadVisible.value;
      isVideoLinkVisible.value = false; // 关闭视频链接输入框
      isEmojiPickerVisible.value = false; // 关闭表情选择框
    };

    // 控制视频链接输入框显示
    const toggleVideoLink = () => {
      isVideoLinkVisible.value = !isVideoLinkVisible.value;
      isImageUploadVisible.value = false; // 关闭图片上传框
      isEmojiPickerVisible.value = false; // 关闭表情选择框
    };

    // 控制表情选择框显示
    const toggleEmojiPicker = () => {
      isEmojiPickerVisible.value = !isEmojiPickerVisible.value;
      isImageUploadVisible.value = false; // 关闭图片上传框
      isVideoLinkVisible.value = false; // 关闭视频链接输入框
    };

    // 处理图片上传
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target.result;
          postContent.value += `<img src="${imageUrl}" alt="插入的图片" />`;
        };
        reader.readAsDataURL(file); // 转换图片为 base64 格式并插入
      }
    };

    // 插入视频链接
    const insertVideo = () => {
      if (videoUrl.value) {
        postContent.value += `<video controls><source src="${videoUrl.value}" type="video/mp4">您的浏览器不支持该视频格式。</video>`;
        videoUrl.value = ''; // 清空视频链接输入框
      }
    };

    // 插入表情
    const insertEmoji = (emoji) => {
      postContent.value += emoji; // 将表情插入到内容框
    };

    return {
      postTitle,
      postContent,
      submitPost,
      toggleImageUpload,
      toggleVideoLink,
      toggleEmojiPicker,
      isImageUploadVisible,
      isVideoLinkVisible,
      isEmojiPickerVisible,
      handleImageUpload,
      videoUrl,
      insertVideo,
      insertEmoji,
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

.post-editor {
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
  position: relative; /* 使发布按钮能够相对定位 */
}

h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

input[type="text"],
textarea,
input[type="file"] {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
  min-height: 150px;
}

button {
  width: auto;
  padding: 8px 15px;
  background-color: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

button img {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}

button:hover {
  opacity: 0.8;
}

/* 插入功能按钮 */
button[type="button"] {
  margin-right: 15px;
}

.image-upload,
.video-link,
.emoji-picker {
  margin-top: 15px;
}

/* 表情选择按钮 */
.emoji-picker {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.emoji-picker button {
  padding: 5px 10px;
  font-size: 20px;
}

/* 发布按钮的样式 */
.submit-button-container {
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: 1px solid #4CAF50;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.submit-button:hover {
  background-color: #45a049;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    width: 100vw;
    margin-left: 0;
  }

  .main {
    position: relative;
    top: 0;
    width: 100%;
  }

  .navbar {
    width: 100%;
  }

  .form-group {
    margin-bottom: 10px;
  }

  .emoji-picker button {
    font-size: 18px;
  }
}
</style>

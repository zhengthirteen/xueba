<template>
  <div class="section-topics">
    <div v-for="(topics, index) in allTopics" :key="index" class="section">
      <h2>{{ getSectionTitle(index + 1) }}</h2>
      <ul class="post-list">
        <li
          v-for="topic in topics"
          :key="topic.postID"
          @click="goToPostDetail(topic.postID)"
          class="post-item"
        >
          <div class="post-header">
            <div class="author-info">
              <img :src="topic.picURL" alt="作者头像" class="author-avatar" />
              <p class="post-author">{{ topic.userName }}</p>
            </div>
            <div class="post-info">
              <h3 class="post-title">{{ topic.postTitle }}</h3>
              <p class="post-score">浏览量: {{ topic.postScore }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "../utils/axios";
import { onMounted, ref, inject } from "vue";

export default {
  name: "SectionTopics",
  setup() {
    const allTopics = ref([]);
    const showAlert = inject("showAlert");
    const router = inject("router");

    const getSectionTitle = (tagID) => {
      const titles = {
        1: "校园学习",
        2: "打听求助",
        3: "日常趣事",
        4: "恋爱交友",
        5: "资料分享",
      };
      return titles[tagID] || "未知板块";
    };

    const getTopics = async () => {
      try {
        const res = await axios.get("/api/source/searchbytag");
        if (res.data.code === 1) {
          const topicsData = res.data.data;
          for (const topics of topicsData) {
            for (const topic of topics) {
              const picRes = await axios.post("/api/source/picture", {
                picID: topic.picID,
                status: 0,
              });
              if (picRes.data.code === 1) {
                topic.picURL = picRes.data.data.picURL;
              } else {
                topic.picURL = "";
              }
            }
          }
          allTopics.value = topicsData;
        } else {
          showAlert("获取板块热门帖子失败，请稍后重试！", false);
        }
      } catch (error) {
        showAlert("获取板块热门帖子失败，请稍后重试！", false);
      }
    };

    const goToPostDetail = (id) => {
      router.push({
        name: "PostDetail",
        params: { postID: id },
      });
    };

    onMounted(() => {
      getTopics();
    });

    return {
      allTopics,
      goToPostDetail,
      getSectionTitle,
    };
  },
};
</script>

<style scoped>
.section {
  margin-bottom: 20px;
}
.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.post-item {
  width: 48%;
  margin: 10px 0;
  padding: 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  box-sizing: border-box;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}
.post-item:hover {
  background-color: #f1f1f1;
  transform: translateY(-5px);
}
.post-header {
  display: flex;
  align-items: center;
}
.author-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 130px;
  margin-right: 40px;
}
.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 5px;
}
.post-author {
  color: #555;
}
.post-info {
  display: flex;
  flex-direction: column;
}
.post-title {
  font-size: 1.5em;
  margin: 0;
  font-weight: bold;
}
.post-score {
  color: #555;
  margin: 5px 0;
}
</style>
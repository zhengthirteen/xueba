<template>
    <div class="home">
        <Sidebar />
        <div class="main-content">
            <SearchBar :onSearch="handleSearch" />
            <div class="content">
                <PopularTopics v-if="!isSearching" />
                <div v-else class="search-results">
                    <h2>搜索结果</h2>
                    <ul v-if="searchResults.length > 0" class="post-list">
                        <li
                            v-for="topic in searchResults"
                            :key="topic.id"
                            @click="goToPostDetail(topic.id)"
                            class="post-item"
                        >
                            <div class="post-header">
                                <div class="author-info">
                                    <img :src="topic.picURL" alt="作者头像" class="author-avatar" />
                                    <p class="post-author">{{ topic.userName }}</p>
                                </div>
                                <div class="post-info">
                                    <h3 class="post-title">{{ topic.title }}</h3>
                                    <p class="post-score">浏览量: {{ topic.score }}</p>
                                    <p class="post-tag">标签: {{ getTagName(topic.tagID) }}</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div v-else class="no-results">
                        <p class="no-results-text">抱歉，没有找到匹配的结果。</p>
                    </div>
                </div>
                <SectionTopics v-if="!isSearching" />
            </div>
        </div>
        <img
            :src="avatar"
            alt="用户头像"
            class="user-avatar"
            @click="goToProfile"
        />
    </div>
</template>

<script>
import { ref, inject, onMounted, provide } from "vue";
import PopularTopics from "./PopularTopics.vue";
import { useUserProfile } from "../hooks/useUserProfile.js";
import SearchBar from "./SearchBar.vue";
import Sidebar from "./Sidebar.vue";
import axios from "../utils/axios";
import { useUserAvatar } from "../hooks/useUserAvatar";
import SectionTopics from "./SectionTopics.vue";
import { parse } from "vue/compiler-sfc";

export default {
  name: "Home",
  components: {
    PopularTopics,
    SearchBar,
        Sidebar,
        SectionTopics
  },
  setup() {
    const { user } = useUserProfile();
    const router = inject("router");
    const { avatar, getUserAvatar } = useUserAvatar();
    const searchResults = ref([]);
    const isSearching = ref(false);
    const searchQuery = ref("");

    const goToProfile = () => {
      router.push("/profile");
    };

    const handleSearch = async (query,tmp_type) => {
      if (!query) {
        isSearching.value = false;
        return;
      }
      try {
        const res = await axios.get("/api/source/search", {
          params: { keyword: query, type: parseInt(tmp_type) },
        });
        if (res.data.code === 1) {
          const searchResultsData = res.data.data;
          for (const topic of searchResultsData) {
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
          searchResults.value = searchResultsData;
          console.log(searchResults.value);
          isSearching.value = true;
        } else if (res.data.code === 0 && res.data.msg === "No result") {
          searchResults.value = [];
          isSearching.value = true;
        } else {
          console.error("搜索失败:", res.data.msg);
        }
      } catch (error) {
        console.error("搜索请求失败:", error);
      }
    };

    const clearSearch = () => {
      searchQuery.value = "";
      handleSearch("");
    };

    const goToPostDetail = (id) => {
      router.push({
        name: "PostDetail",
        params: { postID: id },
      });
    };

    const getTagName = (tagID) => {
      const tagNames = {
        1: "校园学习",
        2: "打听求助",
        3: "日常趣事",
        4: "恋爱交友",
        5: "资料分享",
      };
      return tagNames[tagID] || "未知标签";
    };

    onMounted(() => {
      getUserAvatar(localStorage.getItem("user_id"));
    });

    provide("clearSearch", clearSearch);

    return { user, goToProfile, avatar, handleSearch, searchResults, isSearching, goToPostDetail, clearSearch, searchQuery, getTagName };
  },
};
</script>

<style scoped>
.home {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    margin: 0 auto;
    width: 75vw;
    margin-left: 10vw;
}

.main-content {
    position: relative;
    width: 100%;
    padding: 20px;
}

.user-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    cursor: pointer;
    position: fixed;
    top: 50px;
    right: 50px;
}
.user-avatar:hover {
    opacity: 0.8;
}
.content {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 50px;
}

.content > * {
    margin-bottom: 20px;
}

.search-results ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.search-results li {
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
.search-results li:hover {
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
.post-score, .post-tag {
    color: #555;
    margin: 5px 0;
}
.no-results {
    text-align: center;
    margin-top: 20px;
}
.no-results-text {
    font-size: 1.2em;
    color: #555;
}
</style>
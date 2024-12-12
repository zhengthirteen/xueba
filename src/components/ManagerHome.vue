<template>
	<div class="home">
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
								<h3 class="post-title">{{ topic.title }}</h3>
								<p class="post-score">浏览量: {{ topic.score }}</p>
							</div>
						</li>
					</ul>
					<div v-else class="no-results">
						<p class="no-results-text">抱歉，没有找到匹配的结果。</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, inject, provide } from "vue";
import PopularTopics from "./PopularTopics.vue";
import { useUserProfile } from "../hooks/useUserProfile.js";
import SearchBar from "./SearchBar.vue";
import axios from "../utils/axios";

export default {
  name: "Home",
  components: {
    PopularTopics,
    SearchBar,
  },
  setup() {
    const { user } = useUserProfile();
    const router = inject("router");
    const searchResults = ref([]);
    const isSearching = ref(false);
    const searchQuery = ref("");

    const goToProfile = () => {
      router.push("/profile");
    };

    const handleSearch = async (query) => {
      if (!query) {
        isSearching.value = false;
        return;
      }
      try {
        const res = await axios.get("/api/source/search", {
          params: { keyword: query, type: 1, fuzzy: true },
        });
        if (res.data.code === 1) {
          searchResults.value = res.data.data;
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

    provide("clearSearch", clearSearch);

    return { user, goToProfile, handleSearch, searchResults, isSearching, goToPostDetail, clearSearch, searchQuery };
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
}
.search-results li {
	border: 1px solid #ddd;
	padding: 10px;
	margin: 10px 0;
}
.search-results li:hover {
	background-color: #f0f0f0;
	cursor: pointer;
}

.post-list {
	list-style: none;
	padding: 0;
	margin: 0;
}
.post-item {
	width: 100%;
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
	flex-direction: column;
}
.post-title {
	font-size: 1.2em;
	margin: 0;
}
.post-score {
	color: #888;
	margin-top: 5px;
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

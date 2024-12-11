<template>
	<div class="home">
		<Sidebar />
		<div class="main-content">
			<SearchBar :onSearch="handleSearch" />
			<div class="content">
				<PopularTopics v-if="!isSearching" />
				<div v-else class="search-results">
					<h2>搜索结果</h2>
					<ul>
						<li
							v-for="topic in searchResults"
							:key="topic.id"
							@click="goToPostDetail(topic.id)"
						>
							<h3>{{ topic.title }}</h3>
							<p>浏览量: {{ topic.score }}</p>
						</li>
					</ul>
				</div>
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

export default {
  name: "Home",
  components: {
    PopularTopics,
    SearchBar,
    Sidebar,
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

    const handleSearch = async (query) => {
      if (!query) {
        isSearching.value = false;
        return;
      }
      try {
        const res = await axios.get("/api/source/search", {
          params: { keyword: query ,type: 1},
        });
        if (res.data.code === 1) {
          searchResults.value = res.data.data;
          console.log(searchResults.value);
          
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

    onMounted(() => {
      getUserAvatar(localStorage.getItem("user_id"));
    });

    provide("clearSearch", clearSearch);

    return { user, goToProfile, avatar, handleSearch, searchResults, isSearching, goToPostDetail, clearSearch, searchQuery };
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
</style>

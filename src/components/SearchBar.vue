<!-- SearchBar.vue -->
<template>
  <div class="top-bar" :class="{ hidden: isHidden }" ref="topBar">
    <input type="text" placeholder="搜索..." class="search-bar" v-model="searchQuery" @keyup.enter="handleSearch" />
    <button class="search-button" @click="handleSearch">搜索</button>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
  name: "SearchBar",
  props: {
    onSearch: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const searchQuery = ref("");
    const isHidden = ref(false);
    const topBar = ref(null);

    const handleSearch = () => {
      props.onSearch(searchQuery.value);
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        isHidden.value = true;
      } else {
        isHidden.value = false;
      }
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return { searchQuery, isHidden, topBar, handleSearch };
  },
};
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  position: sticky;
  top: 40px;
  background: white;
  padding: 10px;
  transition: opacity 0.5s, top 0.5s;
  z-index: 10;
  width: 80%;
  margin: 0 auto;
  height: 60px;
}

.top-bar.hidden {
  opacity: 0;
  top: 0;
}

.search-bar {
  width: 80%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 50px;
}
.search-button {
  padding: 10px 20px;
  margin-left: 5%;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  height: 50px;
  width: 10%;
}
.search-button:hover {
  background-color: #0056b3;
}
</style>
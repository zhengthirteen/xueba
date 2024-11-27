<template>
  <div class="post-list">
    <div v-for="post in posts" :key="post.id" class="post-item">
      <h3>{{ post.title }}</h3>
      <p>{{ post.content }}</p>
      <span>发布时间: {{ post.date }}</span>
    </div>
  </div>
</template>

<script>
import { useFetchPosts } from "../hooks/useFetchPosts.js";


export default {
  name: "PostList",
  setup() {
    const { posts } = useFetchPosts();
    return { posts };
  },
};
</script>

<style scoped>
.post-list {
  margin: 20px;
}
.post-item {
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
}
</style>

<template>
  <div class="popular-topics">
    <h2>热门帖子</h2>
    <ul>
      <li v-for="topic in topics" :key="topic.id">
        <h3>{{ topic.title }}</h3>
        <p>热度: {{ topic.popularity }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "PopularTopics",
  data() {
    return {
      topics: [
        { id: 1, title: "帖子标题1", popularity: 100 },
        { id: 2, title: "帖子标题2", popularity: 150 },
        { id: 3, title: "帖子标题3", popularity: 200 },
        { id: 4, title: "帖子标题3", popularity: 200 },
        { id: 5, title: "帖子标题3", popularity: 200 },
        { id: 6, title: "帖子标题3", popularity: 200 },
        { id: 7, title: "帖子标题3", popularity: 200 },
        { id: 8, title: "帖子标题3", popularity: 200 },
        { id: 9, title: "帖子标题3", popularity: 200 },
        { id: 10, title: "帖子标题3", popularity: 200 },
      ],
    };
  },
};
</script>

<style scoped>
.popular-topics ul {
  list-style: none;
  padding: 0;
}
.popular-topics li {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
}
</style>

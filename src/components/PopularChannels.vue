<template>
  <div class="popular-channels">
    <h2>热门频道</h2>
    <ul>
      <li v-for="channel in channels" :key="channel.id">
        <h3>{{ channel.name }}</h3>
        <p>订阅数: {{ channel.subscribers }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "PopularChannels",
  data() {
    return {
      channels: [
        { id: 1, name: "频道1", subscribers: 1000 },
        { id: 2, name: "频道2", subscribers: 1500 },
        { id: 3, name: "频道3", subscribers: 2000 },
        { id: 4, name: "频道3", subscribers: 2000 },
        { id: 5, name: "频道3", subscribers: 2000 },
        { id: 6, name: "频道3", subscribers: 2000 },
        { id: 7, name: "频道3", subscribers: 2000 },
        { id: 8, name: "频道3", subscribers: 2000 },
        { id: 9, name: "频道3", subscribers: 2000 },
        { id: 10, name: "频道3", subscribers: 2000 },
      ],
    };
  },
};
</script>

<style scoped>
.popular-channels ul {
  list-style: none;
  padding: 0;
}
.popular-channels li {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
}
</style>
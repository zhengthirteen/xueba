<template>
  <div class="post-editor">
    <textarea v-model="content" placeholder="写下你的内容..."></textarea>
    <button @click="submitPost">发布</button>
  </div>
</template>

<script>
export default {
  name: "PostEditor",
  data() {
    return {
      content: "",
    };
  },
  methods: {
    submitPost() {
      // 发送请求保存帖子
      alert(`发布内容: ${this.content}`);
    },
  },
};
</script>

<style scoped>
.post-editor textarea {
  width: 100%;
  height: 150px;
  margin-bottom: 10px;
}
</style>

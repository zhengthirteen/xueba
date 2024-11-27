<template>
  <div class="comment-section">
    <h2>评论区</h2>
    <ul>
      <li v-for="comment in comments" :key="comment.id">
        <p>{{ comment.author }}: {{ comment.content }}</p>
      </li>
    </ul>
    <textarea v-model="newComment" placeholder="写下你的评论..."></textarea>
    <button @click="addComment">提交评论</button>
  </div>
</template>

<script>
export default {
  name: "CommentSection",
  data() {
    return {
      comments: [
        { id: 1, author: "用户A", content: "这是一条评论" },
        { id: 2, author: "用户B", content: "另一条评论" },
      ],
      newComment: "",
    };
  },
  methods: {
    addComment() {
      if (this.newComment.trim()) {
        this.comments.push({
          id: Date.now(),
          author: "我",
          content: this.newComment,
        });
        this.newComment = "";
      } else {
        alert("请输入评论内容");
      }
    },
  },
};
</script>

<style scoped>
.comment-section ul {
  list-style: none;
  padding: 0;
}
.comment-section textarea {
  width: 100%;
  margin-top: 10px;
}
</style>

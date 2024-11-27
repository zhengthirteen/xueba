<template>
  <div class="chat-list">
    <h2>联系人</h2>
    <ul>
      <li v-for="contact in contacts" :key="contact.id">
        <router-link :to="'/chat/' + contact.id">{{ contact.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ChatList",
  data() {
    return {
      contacts: [
        { id: 1, name: "好友A" },
        { id: 2, name: "好友B" },
      ],
    };
  },
};
</script>

<style scoped>
.chat-list {
  padding: 10px;
}
.chat-list ul {
  list-style: none;
}
</style>

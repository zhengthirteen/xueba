<template>
  <nav class="sidebar">
    <ul>
      <li v-for="item in menuItems" :key="item.title">
        <router-link :to="item.link">{{ item.title }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      menuItems: [
        { title: "首页", link: "/" },
        { title: "发布", link: "/post" },
        { title: "用户中心", link: "/profile" },
        { title: "联系人", link: "/contacts" },
      ],
    };
  },
};
</script>

<style scoped>
.sidebar {
  width: 12vw;
  background: #333;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  overflow-y: auto;
}
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar li {
  padding: 40px;
}
.sidebar a {
  color: white;
  text-decoration: none;
  font-size: 20px;
}
.sidebar a:hover {
  text-decoration: underline;
}
</style>
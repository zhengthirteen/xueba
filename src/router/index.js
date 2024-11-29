import { createRouter, createWebHistory } from "vue-router";
import PostList from "../components/PostList.vue";
import PostEditor from "../components/PostEditor.vue";
import UserProfile from "../components/UserProfile.vue";
import GroupChatStarter from "../components/GroupChatStarter.vue";
import AddFriendGroup from "../components/AddFriendGroup.vue";
import PopularTopics from "../components/PopularTopics.vue";
import CommentSection from "../components/CommentSection.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Home from "../components/Home.vue";


const routes = [
	{ path: "/", name: "Home", component: Home },
	{ path: "/post", name: "PostEditor", component: PostEditor },
	{ path: "/profile", name: "UserProfile", component: UserProfile },
	{
		path: "/group-chat",
		name: "GroupChatStarter",
		component: GroupChatStarter,
	},
	{
		path: "/add-friend-group",
		name: "AddFriendGroup",
		component: AddFriendGroup,
	},
	{ path: "/popular-topics", name: "PopularTopics", component: PopularTopics },
	{ path: "/comments", name: "CommentSection", component: CommentSection },
	{ path: "/login", name: "Login", component: Login },
	{ path: "/register", name: "Register", component: Register },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;

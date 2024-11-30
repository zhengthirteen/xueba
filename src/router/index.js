import { createRouter, createWebHistory } from "vue-router";
import PostList from "../components/PostList.vue";
import PostEditor from "../components/PostEditor.vue";
import UserProfile from "../components/UserProfile.vue";
import PublishPage from "../components/PublishPage.vue";
import FavoritesPage from "../components/FavoritesPage.vue";
import GroupChatStarter from "../components/GroupChatStarter.vue";
import AddFriendGroup from "../components/AddFriendGroup.vue";
import PopularTopics from "../components/PopularTopics.vue";
import CommentSection from "../components/CommentSection.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Home from "../components/Home.vue";
import UserEdit from "../components/UserEdit.vue";
import Contacts from "../components/Contacts.vue";
import ForgotPwd from "../components/ForgotPwd.vue";
import ContactDetail from '../components/ContactDetail.vue';

const routes = [
	{ path: "/", name: "Home", component: Home },
	{ path: "/post", name: "PostEditor", component: PostEditor },
	{ path: "/profile", name: "UserProfile", component: UserProfile },
	{
		path: '/contact/:name',
		name: 'contact-detail',
		component: ContactDetail,
		props: true
	},
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
	{
		path: "/publish",
		name: "PublishPage",
		component: PublishPage,
	},
	{
		path: "/favorites",
		name: "FavoritesPage",
		component: FavoritesPage,
	},
	{
		path: "/user-edit",
		name: "UserEdit",
		component: UserEdit,
	},
	{ path: "/popular-topics", name: "PopularTopics", component: PopularTopics },
	{ path: "/comments", name: "CommentSection", component: CommentSection },
	{ path: "/login", name: "Login", component: Login },
	{ path: "/register", name: "Register", component: Register },
	{ path: "/contacts", name: "Contacts", component: Contacts },
	{ path: "/forgot-pwd", name: "ForgotPwd", component: ForgotPwd },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	const isAuthenticated = !!localStorage.getItem("jwt"); // 检查是否存在 JWT

	if (
		to.name !== "Login" &&
		to.name !== "Register" &&
		to.name !== "ForgotPwd" &&
		!isAuthenticated
	) {
		// 如果用户未登录且访问的不是登录或注册页面，则重定向到登录页面
		next({ name: "Login" });
	} else {
		// 否则允许进入页面
		next();
	}
});

export default router;

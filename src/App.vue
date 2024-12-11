<template>
	<div id="app">
		<router-view />
		<MyAlert :msg="alertMsg" :isTrue="alertIsTrue" />
		<MyConfirm
			:confirmMsg="confirmMsg"
			:msg="confirmAlertMsg"
			:isTrue="confirmIsTrue"
			@confirm-result="handleConfirmResult"
		/>
	</div>
</template>

<script>
import { ref, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import Sidebar from "./components/Sidebar.vue";
import MyAlert from "./components/MyAlert.vue";
import MyConfirm from "./components/MyConfirm.vue";

export default {
	name: "App",
	components: {
		Sidebar,
		MyAlert,
		MyConfirm,
	},
	setup() {
		const route = useRoute();
		const router = useRouter();

		// 全局状态管理
		const alertMsg = ref("");
		const alertIsTrue = ref(false);
		const confirmMsg = ref("");
		const confirmAlertMsg = ref("");
		const confirmIsTrue = ref(false);
		let confirmCallback = null;

		// 提供 showAlert 方法
		const showAlert = (msg, isTrue) => {
			alertMsg.value = "";
			alertIsTrue.value = false;
			setTimeout(() => {
				alertMsg.value = msg;
				alertIsTrue.value = isTrue;
			}, 0);
		};

		// 提供 showConfirm 方法
        const showConfirm = (confirmMessage, msg, isTrue, callback) => {
            confirmMsg.value = "";
            confirmAlertMsg.value = "";
            confirmIsTrue.value = false;
            confirmCallback = callback;

            setTimeout(() => {
                confirmMsg.value = confirmMessage;
                confirmAlertMsg.value = msg;
                confirmIsTrue.value = isTrue;
            }, 0);
        };

		 // 处理确认结果
        const handleConfirmResult = (result) => {
            if (result === 1 && confirmCallback) {
                confirmCallback(true);
                confirmCallback = null;
            } else if (confirmCallback) {
                confirmCallback(false);
                confirmCallback = null;
            }
        };

		// 提供 showAlert、showConfirm 和 router 供下级组件使用
		provide("showAlert", showAlert);
		provide("showConfirm", showConfirm);
		provide("router", router);

		return {
			alertMsg,
			alertIsTrue,
			confirmMsg,
			confirmAlertMsg,
			confirmIsTrue,
			showAlert,
			showConfirm,
			handleConfirmResult, // 确保返回 handleConfirmResult 方法
		};
	},
};
</script>

<style>
#app {
	display: flex;
}
</style>

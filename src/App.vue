<template>
    <div id="app">
        <router-view />
        <MyAlert :msg="alertMsg" :isTrue="alertIsTrue" />
    </div>
</template>

<script>
import { computed, ref, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import Sidebar from "./components/Sidebar.vue";
import MyAlert from "./components/MyAlert.vue";

export default {
    name: "App",
    components: {
        Sidebar,
        MyAlert,
    },
    setup() {
        const route = useRoute();
        const router = useRouter();

        // 全局状态管理
        const alertMsg = ref("");
        const alertIsTrue = ref(false);

        // 提供 showAlert 方法
        const showAlert = (msg, isTrue) => {
            console.log("showAlert");

            alertMsg.value = "";
            alertIsTrue.value = false; 
            setTimeout(() => {
                alertMsg.value = msg;
                alertIsTrue.value = isTrue;
            }, 0);
        };

        // 提供 showAlert 和 router 供下级组件使用
        provide("showAlert", showAlert);
        provide("router", router);

        return {alertMsg, alertIsTrue, showAlert };
    },
};
</script>

<style>
#app {
    display: flex;
}
</style>
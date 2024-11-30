<template>
    <div>
        <div v-if="visible" class="confirm-box">
            <div class="confirm-msg">{{ confirmMsg }}</div>
            <div class="confirm-buttons">
                <button class="confirm-button" @click="confirm">
                    {{ confirmButtonText }}
                </button>
                <button class="cancel-button" @click="cancel">
                    {{ cancelButtonText }}
                </button>
            </div>
        </div>
        <div
            v-if="showAlert"
            :class="[
                'alert-box',
                { 'alert-success': isTrue, 'alert-failure': !isTrue },
            ]"
        >
            {{ msg }}
        </div>
    </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
    name: "MyConfirm",
    props: {
        confirmMsg: {
            type: String,
            default: "确认操作？",
        },
        msg: {
            type: String,
            default: "",
        },
        isTrue: {
            type: Boolean,
            default: false,
        },
        confirmButtonText: {
            type: String,
            default: "确认",
        },
        cancelButtonText: {
            type: String,
            default: "取消",
        },
    },
    setup(props, { emit }) {
        const visible = ref(false);
        const showAlert = ref(false);

        const confirm = () => {
            visible.value = false;
            showAlert.value = true;
            emit("confirm-result", 1); // 传递确认按钮的值
            setTimeout(() => {
                showAlert.value = false;
            }, 2000);
        };

        const cancel = () => {
            visible.value = false;
            emit("confirm-result", 2); // 传递取消按钮的值
        };

        watch(
            () => props.confirmMsg,
            (newConfirmMsg) => {
                if (newConfirmMsg) {
                    visible.value = true;
                }
            }
        );

        return { visible, showAlert, confirm, cancel };
    },
};
</script>

<style scoped>
.confirm-box {
	position: fixed;
	top: 50px;
	left: 50%;
	transform: translateX(-50%);
	width: 300px;
	padding: 20px;
	background-color: white;
	border: 1px solid #ccc;
	border-radius: 5px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	z-index: 1000;
}

.confirm-msg {
	margin-bottom: 20px;
	text-align: center;
	font-size: 16px;
	font-weight: bold;
}

.confirm-buttons {
	display: flex;
	justify-content: space-around;
}

.confirm-button,
.cancel-button {
	padding: 10px 20px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-size: 14px;
}

.confirm-button {
	background-color: #4caf50;
	color: white;
}

.confirm-button:hover {
	background-color: #45a049;
}

.cancel-button {
	background-color: #f44336;
	color: white;
}

.cancel-button:hover {
	background-color: #e53935;
}

.alert-box {
	position: fixed;
	top: 100px;
	left: 50%;
	transform: translateX(-50%);
	width: 300px;
	padding: 10px;
	text-align: center;
	border-radius: 5px;
	transition: opacity 0.5s ease-out;
	z-index: 1000;
}

.alert-success {
	background-color: lightgreen;
}

.alert-failure {
	background-color: lightcoral;
}
</style>

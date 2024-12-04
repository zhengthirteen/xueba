<template>
	<div
		v-if="visible"
		:class="[
			'alert-box',
			{ 'alert-success': isTrue, 'alert-failure': !isTrue },
		]"
	>
		{{ msg }}
	</div>
</template>

<script>
import { watch, ref } from "vue";

export default {
	name: "MyAlert",
	props: {
		msg: {
			type: String,
			default: "",
		},
		isTrue: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		let visible = ref(false);

		const show = () => {
			console.log("show");
			visible.value = true;
			setTimeout(() => {
				visible.value = false;
			}, 1500);
		};

		watch([() => props.msg, () => props.isTrue], ([newMsg, newIsTrue]) => {
			if (newMsg || newIsTrue !== undefined) {
				show();
			}
		});

		return { visible };
	},
};
</script>

<style scoped>
.alert-box {
	position: fixed;
	top: 50px;
	left: 50%;
	transform: translateX(-50%);
	min-width: 250px; /* 调整最小宽度 */
	height: 40px; /* 调整高度 */
	line-height: 40px; /* 调整行高 */
	padding-left: 15px;
	padding-right: 10px;
	text-align: center;
	border-radius: 5px;
	z-index: 1000;
	transition: opacity 0.5s ease-out;
}
.alert-success {
	background-color: lightgreen;
}
.alert-failure {
	background-color: lightcoral;
}
</style>

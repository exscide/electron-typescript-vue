<script setup lang="ts">
import { getCurrentWindow } from "@electron/remote"
import { ref } from "vue"

const win = getCurrentWindow()

const maximized = ref(win.isMaximized())

win.on("maximize", () => {
	maximized.value = true
})

win.on("unmaximize", () => {
	maximized.value = false
})

</script>

<template>
	<div class="container" :class="{ maximized }">
		<div class="topbar"></div>

	</div>
</template>

<style lang="sass" scoped>
	@use "./colors"

	.container
		width: 100%
		height: 100%

		background-color: colors.$background
		color: colors.$foreground
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif

		--angle: 0deg
		border: 1px solid transparent
		border-image: conic-gradient(from var(--angle), #b827fc, #2c90fc, #b8fd33, #fec837, #fd1892, #b827fc) 1
		animation: 10s rotate linear infinite
		box-sizing: border-box

		&.maximized
			border: 1px solid #000

	.topbar
		position: relative
		width: 100%
		height: 31px

		//border-bottom: 1px solid colors.$dark

		-webkit-user-select: none
		-webkit-app-region: drag

	@keyframes rotate
		to
			--angle: 360deg

	@property --angle
		syntax: '<angle>'
		initial-value: 0deg
		inherits: false
	

</style>

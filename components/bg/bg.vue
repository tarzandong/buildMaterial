<template>
	<view class='bg'>
		<image :src=src style='width: 100%;height: 100%;' v-if='src'></image>
	</view>
</template>

<script>
	export default{
		props:{
			src:''
		},
		computed:{
			// fw(){
			// 	return this.$store.state.fullWidth
			// },
			// fh(){
			// 	return this.$store.state.fullHeight
			// }
		}
	}
</script>

<style lang="scss">
	.bg{
		display: block;
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #f8f8f8;
	}
	
</style>

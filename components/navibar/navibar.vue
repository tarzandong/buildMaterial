<template>
	<view class="navbar" :style="'top:'+String(this.$store.state.safeTop)+'px;'+'width:100%;'">
		<view class='navlead' ><slot name="lead"></slot></view>
		<view class='navcenter'><slot name="center"></slot></view>
		<view class='navtail'><slot name="tail"></slot></view>
	</view>
</template>

<script>
	export default{}
</script>

<style lang="scss">
	.navbar{
		position: fixed;
		left: 0;
		z-index: 10;
		display: flex;
		width: 100%;
		height: 45px;
		// background-color: $color-success;
		color: $text-color;
		background-image: linear-gradient(to top left,$bg-active,darken($bg-active,20%));
		backdrop-filter: blur(5px);
	}
	.navlead{
		display: flex;
		width: 80px;
		flex: 1;
		text-align: center;
		align-items: center;
		justify-content: center;
	}
	.navtail{
		display: flex;
		flex-direction: row-reverse;
		width: 80px;
		flex: 1;
		align-items: center;
		padding-right: 10px;
	}
	.navcenter{
		display: flex;
		flex: 2;
		text-align: center;
		align-items: center;
		justify-content: center;
	}
</style>

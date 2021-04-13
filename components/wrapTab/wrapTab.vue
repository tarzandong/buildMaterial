<template>
	<view>
		<view v-for="m in parseInt(tabList.length/5)+1 " :key='m'>
			<view class="row mt" style="flex-wrap: wrap;">
				<view v-for="n in 5" style="flex:1" :key='n+5*m' :class="'tabItem noWrap fs12 ml '"
				 v-if="tabList[n+5*m-6]" @click="$emit('tabClick',n+5*m-6)">
				 <text :class="curIndex==n+5*m-6? 'active':''">{{tabList[n+5*m-6].subCategoryName}}</text></view>
			</view>
		</view>
		
		<!-- <view class="row" style="flex-wrap: wrap;height: 40px;">
			<view v-for="n in 5" style="flex:1;" :key='n+5' class="tabItem noWrap fs12 ml" v-if="tabList[n+4]">{{tabList[n+4]}}</view>
		</view> -->
	</view>
</template>

<script>
	export default{
		props:{
			tabList:{type:Array,default:[]},
			curIndex:0
		},
		data(){
			return{
				
			}
		}
	}
</script>

<style lang="scss">
	.tabItem{
		line-height: 24px;
		max-width: 120px;
		// background-color: #fff;
		color: lighten($text-color,20%);
		text-align: center;
		transform: none;
		// transition: transform 0.2s;
		// box-shadow: 0 -1px 4px $text-color;
	}
	.active{
		color: $text-color;
		// border-color: $text-color;
		font-size: 14px;
		border-bottom: 2px solid $text-color;
		font-weight: bold;
		// box-shadow: 0 0 4px $text-color;
		// transform: scale(1.2);
	}
</style>

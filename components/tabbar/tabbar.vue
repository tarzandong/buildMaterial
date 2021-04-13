

<template>
	<view class="tab">
		<view class="tabWrap">
			
		  <view v-for="(item,i1) in tabList"  @click='itemClick(i1)' :key='i1' :class="index==i1? 'active':'notactive'">
				<image :src="index==i1? iconSrc[i1]+'.png':iconSrc[i1]+'1.png'" class='tabicon' v-if="iconSrc.length>0"></image>
		    <view class="itemtxt">{{item}}</view>
				
		  </view>
		  <view class="bedge" v-if='lengthOfCar' style="position: absolute;	top:10px;	left:55%;">{{lengthOfCar}}</view>
			
		</view>
	</view>
  
</template>

<script>
  export default{
    name:'tabbar',
		data(){
			return{
				// index:0,
			}
		},
    props:{
			tabList:{type:Array,default:[]},
			lengthOfCar:null,
			index:{type:Number,default:0},
			iconSrc:{type:Array,default:[]}
		},
		computed:{
			
			// textStyle(){
			// 	if (this.$store.state.tabBarCur==1) {
			// 		return 'text-shadow: 1px 1px 1px #229966;color:#fff;'
			// 	}
			// 	else {
			// 		return 'text-shadow: none;color:#ff8b42;'
			// 	}
			// },
			
			// title(){
			// 	return this.tabList[1]
			// },
			// floatLeft(){
				
			// 	if (this.$store.state.fullWidth>400) {return 188-39}
			// 	else	return this.$store.state.fullWidth/2-39 //39是中间图片的一半宽度
				
			// }
		},
		methods:{
			// midclick(){this.$store.commit('setTBC',1)},
			itemClick(i){
				// this.index=i
				console.log('click')
				console.log(this.$store.state.fullHeight,this.$store.getters.mpMainHeight,this.$store.state.safeTop)
				this.$emit('tabIndex',i)
			}
		},
		mounted() {
			
		}
  }
</script>

<style lang="scss">
	
	.floattab{
		
		width: 80px;
		height: 70px;
		position: fixed;
		bottom: 0;
		/* background-image: url(../../static/images/tabbar/activetab.png); */
		background-size: contain;
		background-repeat: no-repeat;
		overflow: visible;
		z-index: 20;
		/* transition: left 0.2s; */
	}
	.tabicon{
		width: 24px;
		height: 24px;
		margin-top: 2px;
	}
	.title{
		transform: translateY(35px) ;
		/* font-size: 18px; */
		white-space: nowrap;
	}
	
	.itemtxt{
		line-height: 24px;
	}
	.tabWrap{
		width: 100%;
		display: flex;
		flex-direction: row;
		height: 50px;
		text-align: center;
		background-image: linear-gradient(to bottom right,$bg-color,darken($bg-color,20%));
		backdrop-filter: blur(5px);
	}
	
	.tabItem{
		flex: 1;
	}
	.active {
		flex: 1;
	  // color: $text-color-inverse;
		color:$text-color;
		box-shadow: 1px 0 1px #000, -1px 0 1px #fff;
		font-size: 12px;
		font-weight: bold;
		// text-shadow: 1px 1px 1px $color-primary;
		transition: color 0.5s;
	}
	.notactive {
		font-size: 12px;
		flex:1;
		color: $text-color-grey;
	}
</style>

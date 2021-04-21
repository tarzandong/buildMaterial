<template>
	<view :style="'top:'+String($store.state.safeTop)+'px;'+
		'height:'+String($store.state.fullHeight-$store.state.safeTop)+'px;'+
		 'width:'+String($store.state.fullWidth)+'px;'+
			'position:relative;' ">
		<view :style="'height:'+String($store.state.safeTop)+'px;'+
		'width:'+String($store.state.fullWidth)+'px;' " class="safetop"></view>
		<view class='bg'>
			
				<image :src=src :style="'width:100%;height:100%; transition: opacity 0.3s;'+(src? 'opacity:1;' : 'opacity:0;' )"></image>
			
			
		</view>
		<view class="head" >
			<navibar >
				<view slot='lead' style="display: flex; align-items: center;" @click="back">
					<image src="../../static/images/common/leftArrow.png" class="leftarrow" v-if="navL!=='-1'"></image>
					<view class="back" v-if="navL!=='-1'">{{navL}}</view>
				</view>
				<view slot='center' style="font-size: 20px;">{{navC}}</view>
				<view slot='tail' ><image :src="navRsrc" class="icon-mid" @click="$emit('menuClick')"></image></view>
			</navibar>
		</view>
		<uni-popup ref="popup" type="center" >
		    <uni-popup-message type="warn" :message="message" :duration="d"></uni-popup-message>
				<!-- <view style="z-index: 100;">{{$store.state.warnMessage}}</view> -->
		</uni-popup>
		<view class="main" :style="bottomTab? 'height:'+String($store.getters.mpMainHeight)+'px;':'' " >
			<slot name="main" ></slot>
		</view>
		<loading></loading>
		<view v-if='notLogin' style="width: 100%;background-color: #808080;position: fixed;bottom: 60px;display: flex;flex-direction: row-reverse;">
			<view class="button mr" style="width: 60px;" @click="toRigist">立即登录</view>
		</view>
	</view>	
</template>

<script>
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	export default{
		components:{
			uniPopupMessage,
		},
		data(){
			return {
				user:'test',
				// message:'test'
			}
		},
		props:{
			navL:'',
			navC:'',
			navRsrc:'',
			bottomTab:{type:Boolean,default:true},
			src:'',
			rigistPage:{type:Boolean,default:false},
		},
		computed:{
			d(){
				if (this.$store.state.warnMessage.length>20) return 5000
				else return 2000
			},
			message(){
				return this.$store.state.warnMessage
			},
			notLogin(){
				return (!this.$store.state.hasLogin && !this.rigistPage)
			}
		},
		methods:{
			toRigist(){
				uni.navigateTo({
					url:'/pages/rigist?status=1'
				})
			},
			back(){
				if (getCurrentPages().length==1){
					uni.redirectTo({
						url:'../home'
					})
					return
				}
				uni.navigateBack()
			},
			
			
		},
		updated() {
			// uni.$on('pop',()=>{
			// 	if (this.$refs.popup){
			// 		console.log('mpshow')
			// 		this.$store.state.popref=this.$refs.popup
			// 		this.$emit('pop')
			// 	}
				
			// })
		},
		mounted() {
			this.$store.state.popref=this.$refs.popup
			if (this.$store.state.warnMessage !=='') {
				this.$refs.popup.open()
				setTimeout(()=>{
					this.$store.state.warnMessage=''
				},this.d)
			}
		}
	}
</script>

<style lang="scss">
	.head{
		width: 100%;
		color: #fff;
		overflow: hidden;
		// position: absolute;
		// top:0;
		// left: 0;
		height: 45px;
	}	
	.safetop{
		display: block;
		position: fixed;
		top:0;
		// background-color: $bg-color;
		z-index: 10;
		// background-color: $color-success;
	}
	.leftarrow{
		width: 16px;
		height: 16px;
		// transform: rotate(180deg) ;
	}
	.back{
		margin-left: 6px;
		color: $text-color-grey;
		display: inline;
		font-size: 16px;
	}
	.main{
		width: 100%;
		position: absolute;
		left: 0;
		top: 45px;
		overflow: scroll;
	}
	.bg{
		display: block;
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		// background-image: linear-gradient(to bottom right,darken($bg-color,20%),#fff,darken($bg-color,20%));
		// background-color: #f8f8f8;
	}
</style>

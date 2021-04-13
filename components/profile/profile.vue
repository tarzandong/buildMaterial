<template>
	<view class="profile">
		<view class="centerTitle mt fs20">我的相关信息</view>
		<view class="row mt" style="justify-content: center;">
			<view class="fs20 fwb mr" v-if="hasLogin">{{nickName}}</view>
			<view class="button lightShadow" @click="switchUser" style="transform: scale(0.8);">{{account}}</view>
		</view>
		<view :style="'overflow:hidden;transition:height 0.5s; height:'+(submitState && hasLogin? '160px;' : '0;')">
			<view class="tip">完善相关资料：</view>
			<view class="row mt pt" style="justify-content: center;">
				<view class="prepend">昵      称:</view>
				<input v-model="name" class="input1 pl" placeholder="如:王先生" placeholder-class="phc"/>
			</view>
			<view class="row mt pt" style="justify-content: center;" v-if="!existPassword ">
				<view class="prepend">设定密码:</view>
				<input v-model="password" password="true" class="input1 pl" placeholder="字母数字组合" placeholder-class="phc"/>
			</view>
			<view class="row mt pt" style="justify-content: center;">
				<view class="button" @click="updateProfile">提交</view>
			</view>
		</view>
		<view class="row" style="width: 95%;margin: auto;" v-if="hasLogin">
			<view class="" style="border-bottom: 4px double #808080;width: 70%;"></view>
			<view style="font-size: 12px;" @click="toggleSub">{{submitState? '暂不提交':'完善资料' }}</view>
			<image src="/static/images/home/dau.png" :class="submitState? 'up':'down' " style="width: 16px;height: 16px;transition: transform 0.5s;"></image>
			<view class="f1" style="border-bottom: 4px double #808080;"></view>
		</view>
		<view class="glass pt pb pl pr" style="width: 95%;margin: auto;margin-top: 10px;" v-if="listInOrder.length>0">
			<view class="fs12 pl" style="line-height: 20px;border-bottom: 2px double #532E1C;">我的订单：</view>
			<view v-for="(item,index) in listInOrder" :key='index'>
				<view class="row mt" >
					<view class="bedge" style="background-color: #e48257;;">{{index+1}}</view>
					<view style="width: 185px;padding: 0 20px;">{{item.categoryName+' '+item.norms}}</view>
					<view style="width: 50px;">{{item.orderNumber+item.unit}}</view>
					<view style="width: 90px;text-align: end;">{{item.getAmount}}元</view>
				</view>
				<view class="row">
					<uni-steps :options="steps(index)" :active="item.orderState-1" :cancel="item.orderState==3" class="mt" @sign='sign(index)'></uni-steps>
					<!-- <view class="button fs12 lightShadow" style="padding: 0 5px;width: 80px;" v-if='item.orderState==2'>确认收货</view> -->
				</view>
				
				<view class="tip">请联系客服/销售,地址：{{item.userAddress}},{{item.userInfo}},{{item.userPhone}}</view>
				<view class="line"></view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			existPassword:{type:Boolean,default:false}
		},
		computed:{
			hasLogin(){
				return this.$store.state.hasLogin
			},
			listInOrder(){
				return this.$store.state.backEnd.listInOrder
			},
			nickName(){
				if (this.$store.state.userInfo)
				return this.$store.state.userInfo.nickName
				else return ''
			},
			account(){
				if (this.hasLogin) return '切换账户'
				else return '登录'
			}
		},
		watch:{
			existPassword(val){
				if (val) this.submitState=false
			}
		},
		data(){
			return {
				// steps:[{title:'已下单'},{title:'已发货'},{title:'签收'}],
				name:'',
				password:'',
				submitState:true,
			}
		},
		methods:{
			updateProfile(){
				this.$request('/api/build/user/updateInformation',{nickName:this.name,password:this.password}).then((data)=>{
					this.submitState=false
					this.$store.commit('changeNick',data.nickName)
					this.$emit('updated')
				})
			},
			toggleSub(){
				this.submitState=!this.submitState
			},
			switchUser(){
				this.$store.commit('logout')
				uni.navigateTo({
					url:'rigist?status=1'
				})
			},
			steps(i){
				let tempList=[{title:'已下单'},{title:'已发货'},{title:'签收'}]
				tempList[0].desc=this.listInOrder[i].createTime.slice(0,10)
				tempList[1].desc=this.listInOrder[i].updateTime.slice(0,10)
				if (this.listInOrder[i].orderState==4) tempList[2].title='已签收'
				if (this.listInOrder[i].orderState==3) {tempList[1].title='已取消';tempList.length=2}
				return tempList
			},
			sign(i){
				uni.showModal({
					title:'确认收货',
					showCancel:true,
					success: () => {
						this.$request('/api/build/order/update/state',{orderId:[this.listInOrder[i].id],orderState:4}).then((data)=>{
							this.$request('/api/build/order/list',{userId:this.$store.state.userInfo.userId,orderState:0}).then((data)=>{
								this.$store.commit('setLIC',data.orderTasks)
							})
							this.$request('/api/build/order/all/list',{userId:this.$store.state.userInfo.userId}).then((data)=>{
								this.$store.commit('setLIO',data.orderTasks)
							})
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.profile{
		color: $text-color;
	}
	.up{
		transform: rotate(0deg);
	}
	.down{
		transform: rotate(180deg);
	}
</style>

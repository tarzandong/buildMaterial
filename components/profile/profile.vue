<template>
	<view class="profile">
		<view class="centerTitle mt fs20">我的相关信息</view>
		<view class="row mt" style="justify-content: center;">
			<view class="fs20 fwb mr" v-if="hasLogin">{{nickName}}</view>
			<view class="button lightShadow" @click="switchUser" style="transform: scale(0.8);white-space: pre;">{{account}}</view>
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
		<view class="pb pl pr" style="width: 95%;margin: auto;margin-top: 10px;" >
			<view class="fs12 pl" style="line-height: 20px;border-bottom: 2px double #532E1C;">我的订单：</view>
			<wrapTab :tabList="orderStates" :curIndex='tabIndex' @tabClick='tabClick'></wrapTab>
			<scroll-view scroll-y="true" :style=" 'height:'+String(parseInt($store.getters.mpMainHeight)-170)+'px;' " @scrolltolower="()=>{$emit('loadMore')}" v-if="listInOrder.length>0">
				<view v-for="(item,index) in listInOrder" :key='index' class="glass pl pr mt pt">
					<view class="row" >
						<view >{{index+1}}</view>
						<view style="width: 165px;padding: 0 20px;" class="noWrap">{{item.categoryName+' '+item.norms}}</view>
						<view style="width: 50px;">{{item.orderNumber+item.unit}}</view>
						<view style="width: 110px;text-align: end;">{{item.amount}}元</view>
					</view>
					<view class="row">
						<uni-steps :options="steps(index)" :active="item.orderState==5? 0 : item.orderState-1"  :activeColor="color(item.orderState)" class="mt" @sign='showSign(index)' @cancelOrder='showCancel(index)'></uni-steps>
						<!-- <view class="button fs12 lightShadow" style="padding: 0 5px;width: 80px;" v-if='item.orderState==2'>确认收货</view> -->
					</view>
					
					<view class="tip">请联系客服/销售,地址：{{item.userAddress}},{{item.userInfo}},{{item.userPhone}}</view>
					<!-- <view class="line mt" style="border-color: #e6e6e6;"></view> -->
				</view>
			</scroll-view>
			<view v-else class="column1" style="margin-top: 50px;">
				<image src="/static/images/home/order1.png" class="icon64 "></image>
				<view class="mt">您还没有相关订单</view>
			</view>
			
		</view>
		<uni-popup ref='dialog' type="dialog">
			<uni-popup-dialog type="info" :title="tip" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default{
		components:{
			uniPopupDialog
		},
		props:{
			existPassword:{type:Boolean,default:false}
		},
		computed:{
			tip(){
				if (this.dialog==0) return '确认取消订单？'
				else return '确认收货？'
			},
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
				else return '  登    录  '
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
				orderStates:[
					{value:'',title:'全部'},
					{value:1,title:'待发货'},
					{value:2,title:'已发货'},
					{value:4,title:'已签收'},
					{value:3,title:'已取消'},
				],
				tabIndex:0,
				dialog:0,
				current:-1,
			}
		},
		methods:{
			color(orderState){
				if (orderState==5) return '#f6830f'
				else if (orderState==3) return 'red'
				else return '#0e918c'
			},
			tabClick(i){
				this.tabIndex=i
				this.$emit('queryOrder',this.orderStates[i].value)
			},
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
				if (this.listInOrder[i].orderState==5) tempList[0].title='取消待审核'
				return tempList
			},
			confirm(done){
				if (this.dialog==0) return this.cancelOrder(done)
				else return this.sign(done)
			},
			showSign(i){
				this.current=i
				this.dialog=1
				this.$refs.dialog.open()
			},
			showCancel(i){
				this.current=i
				this.dialog=0
				this.$refs.dialog.open()
			},
			sign(done){
				this.$request('/api/build/order/update/state',{orderId:[this.listInOrder[this.current].id],orderState:4}).then((data)=>{
					this.$request('/api/build/order/all/list',{userId:this.$store.state.userInfo.userId}).then((data)=>{
						this.$store.commit('setLIO',data.orderTasks)
					})
				})
				done()
			},
			cancelOrder(done){
				this.$request('/api/build/order/update/state',{orderId:[this.listInOrder[this.current].id],orderState:5}).then((data)=>{
					this.$request('/api/build/order/all/list',{userId:this.$store.state.userInfo.userId}).then((data)=>{
						this.$store.commit('setLIO',data.orderTasks)
					})
				})
				done()
			},			
		},
		mounted() {
			if (this.existPassword) this.submitState=false
			else this.submitState=true
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

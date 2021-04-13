<template>
	<view class="textc">
		<mpframe :src='bgSrc' navL='返回' :navC='item.type' :bottomTab='false'>
			<view slot="main">
				<view class="glass pt pb">
					<view class="mt row" style='justify-content: center;' >
						<view class="imgp" key='1'></view>
					</view>
					<view class="mt row" style='justify-content: center;'>
						来自{{item.brandName}}的{{item.categoryName}} {{item.norms}}
					</view>
					<view class="mt row" style='justify-content: center;'>
						单价 <text class="fs20 pl hc fwb"> {{item.getPrice}}</text>元/{{item.unit}}
					</view>
				</view>
					
				<view class="glass bt bb mt">
					<view class="mt row pt" style="justify-content: center;">
						<input placeholder="请输入数量" class="input1" placeholder-class="phc" type="number" style="text-align: center;" v-model="orderQty"/>
						<text class="fs12">({{item.unit}})</text>
					</view>
					<view class="mt row" style="justify-content: center;">
						<view style="font-size: 12px;" class="fwb">库存:{{item.stock+item.unit}}</view>
					</view>
					<view class="mt row pb" style="flex-direction: row-reverse;">
						<view class="pr">
							总价<text class="fs20 pl hc fwb">{{item.getPrice*orderQty}}</text>元
						</view>
					</view>
				</view>
				<!-- <view class="line"></view> -->
				<view class="glass pl pr pb pt" style="width: 90%;margin: auto;margin-top: 10px;">
					<text class="tip">
						1 可将所选商品先加入购物车，最后在购物车页面进行合并下单;
						
						2 注意，加入购物车商品，其库存和价格均不能锁定，只有下单商品才能锁定，为保证供货顺利还请及时下单；
						
						3 下单商品可在“我的”页面中进行查询，并可查看公司对口联系人，我司承诺在一个工作日内与您取得联系以安排订单商务事宜。
					</text>
				</view>
				<view class='floatButtons'>
					<view class="mt row" style="justify-content: space-around;">
						<view class="button lightShadow" style="width: 100px;" @click="showOrder">
							<image src="/static/images/home/order.png" class="icon-sm"></image>
							<text class='pl'> 立即下单</text>
						</view>
						<view class="button lightShadow" style="width: 100px;" @click="addToCar">
							<image src="/static/images/home/shopCar.png" class="icon-sm"></image>
							<text class='pl'> 加入购物车</text>
						</view>
					</view>
				</view>
				
				
			</view>
		</mpframe>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				item:null,
				orderQty:'',
				bgSrc:'',
			}
		},
		onLoad(option){
			// console.log(option)
			this.item=JSON.parse(option.item)
			this.bgSrc=option.bg
		},
		methods:{
			updateOrder(){
				this.$request('/api/build/order/list',{userId:this.$store.state.userInfo.userId,orderState:0}).then((data)=>{
					data.orderTasks.map((item)=>{
						item.orderTasks.map((item)=>{
							item.picked=false
							return item
						})
					})
					this.$store.commit('setLIC',data.orderTasks)
					// this.$forceUpdate()
				})
				this.$request('/api/build/order/all/list',{userId:this.$store.state.userInfo.userId}).then((data)=>{
					this.$store.commit('setLIO',data.orderTasks)
				})
			},
			addToCar(){
				if (!this.$store.state.hasLogin) {
					this.$store.dispatch('warn','请先登录')
					setTimeout(()=>{
						uni.navigateTo({
							url:'../rigist?status=1'
						})
					},3000)
				}
				else {
					if(this.orderQty>0){
						console.log(this.item)
						let body={
							amount:this.orderQty*this.item.getPrice,
							number:this.orderQty,
							price:this.item.getPrice,
							remark:'',
							userId: this.$store.state.userInfo.userId,
							commodityId:this.item.id,
						}
						body.orderState=0,
							
						this.$request('/api/build/order/add',body).then((data)=>{
							this.updateOrder()
							this.$store.dispatch('warn',"已添加至购物车，可在'购物车'页面查看")
							uni.navigateBack()
						})
						
					}
					else this.$store.dispatch('warn','请输入合适数量')
				}
				
			},
			showOrder(){
				uni.showModal({
					title:'确认下单？',
					showCancel:true,
					success: (e) => {
						if (e.confirm) this.order()
					}
				})
			},
			order(){
				if (!this.$store.state.hasLogin) {
					this.$store.dispatch('warn','请先登录')
					setTimeout(()=>{
						uni.navigateTo({
							url:'../rigist?status=1'
						})
					},3000)
				}
				else {
					if (this.orderQty>0){
						let body={
							amount:this.orderQty*this.item.getPrice,
							number:this.orderQty,
							price:this.item.getPrice,
							remark:'',
							userId: this.$store.state.userInfo.userId,
							commodityId:this.item.id,
						}
						body.orderState=1,
							
						this.$request('/api/build/order/add',body).then((data)=>{
							this.updateOrder()
							this.$store.dispatch('warn',"已下单，可在'我的'页面查看")
							uni.navigateBack()
						})
						
						
					}
					else this.$store.dispatch('warn','请输入合适数量')
				}
				
			}
		}
	}
</script>

<style lang="scss">
	.detail{}
	.floatButtons{
		position: fixed;
		bottom: 20px;
		width: 100%;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
	}
	.imgp{
		width: 300px;
		height: 200px;
		background-image: url('/static/images/temp/333.jpg');
		background-repeat: no-repeat;
		background-size: cover;
	}
</style>

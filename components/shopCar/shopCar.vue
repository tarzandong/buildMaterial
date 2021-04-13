<template>
	<view class="profile">
		<view class="centerTitle mt fs20" @click="ac">购物车</view>
			<view v-if="listInCar.length>0" style="width: 95%;margin: auto;" >
				<view v-for='(item,i) in listInCar' :key="item.brandName" class="glass mt" style="box-shadow: 2px 2px 5px rgba(0,0,0,0.3);">
					<view style="line-height: 40px;background-color:#eabf9f;padding-left: 5px;">
						<switch type="checkbox" @change="toggleBrand($event,i)" color="#e48257" :checked="brandAll(i)" style="transform: scale(0.7);"></switch>
						<text>{{listInCar[i].brandName}}</text>
					</view>
					
					
					<view v-for="(item1,j) in listInCar[i].orderTasks" :key="item1.id" class="pl">
						<view class="row mt" >
							<!-- <view class="bedge" style="background-color:#e48257;">{{j+1}}</view> -->
							<switch type="checkbox" @change="selectItem($event,i,j)" color="#e48257" :checked="listInCar[i].orderTasks[j].picked" style="transform: scale(0.7);"></switch>
							<view style="width: 160px;padding: 0 5px;">{{item1.categoryName+' '+item1.norms}}</view>
							<view style="width: 80px;display: flex;">
								<input :value="item1.orderNumber" type="number" style="width: 50px;text-align: center;background-color: #fff;" @blur='changeQty($event,item1.id)'/>
								{{item1.unit}}
							</view>
							<view style="width: 100px;">{{item1.getPrice}}元/{{item1.unit}}</view>
						</view>
						<view class="row mt" style="flex-direction: row-reverse;">
							<view style="color: #e48257;" class="pr">{{item1.getAmount}}元</view>
						</view>
						<view class="line" v-if="j!==listInCar[i].orderTasks.length-1"></view>
					</view>
				</view>
			</view>
			<view style="width: 95%;text-align: end;" class="mt glass pt pb">小计：{{sum}}元</view>
			
			<view class="pf row" style="bottom: 20px;width: 95%;left: 10px;justify-content: space-around;" v-if="listInCar.length>0">
				<view><switch type="checkbox"  @change="selectAll" color="#e48257" :checked="all()" style="transform: scale(0.7);"></switch >全选</view>
				<view class="button buttonDelete" @click="removeFromCar">删除</view>
				<view class="button lightShadow" @click="showOrder">结算</view>
				
			</view>
			
		
			
		
		
	</view> 
</template>

<script>
	export default{
		// props:{
		// 	listInCar:{type:Array,default:[]}
		// },
		data(){
			return {
				// selectCargo:[],
				brand:[],
				value:[],
				a:false,
				
			}
		},
		computed:{
			sum(){
				let s=0
				this.listInCar.map((item)=>{
					item.orderTasks.map((item1)=>{
						if (item1.picked){
							s+=Number(item1.getAmount) 
						}
					})
				})
				return s
			},
			listInCar(){
				return this.$store.state.backEnd.listInCar
			},
			selectCargo(){
				let tempList=[]
				this.listInCar.map((item)=>{
					item.orderTasks.map((item)=>{
						if (item.picked) {
							tempList.push(item.id)
						}
					})
				})
				console.log(tempList)
				return tempList
			}
		},
		watch:{
			
		},
		methods:{
			showOrder(){
				uni.showModal({
					title:'确认下单？',
					showCancel:true,
					success: (e) => {
						if (e.confirm) this.order()
					}
				})
			},
			changeQty(e,id){
				this.$request('/api/build/order/update/number',{number:e.detail.value,orderId:id}).then((data)=>{
					this.updateOrder()
				})
			},
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
			brandAll(i){
				let n=0
				this.listInCar[i].orderTasks.map((item)=>{
					if (item.picked) {n++}
				})
				if (this.listInCar[i].orderTasks.length==n) return true 
				else return false
			},
			toggleBrand(e,i){
				if (e.detail.value) {
					
					this.listInCar[i].orderTasks.map((item)=>{
						item.picked=true
					})
				}
				else {
					this.listInCar[i].orderTasks.map((item)=>{
						item.picked=false
					})
				}
				
			},
			selectItem(e,i,j){
				if (e.detail.value){
					this.listInCar[i].orderTasks[j].picked=true
				}
				else this.listInCar[i].orderTasks[j].picked=false
				
			},
			ac(){
				this.a=!(this.a)
				console.log(this.a)
			},
			selectAll(e){
				if (e.detail.value){
					this.listInCar.map((item)=>{
						item.orderTasks.map((item)=>{
							item.picked=true
						})
					})
				}
				else {
					this.listInCar.map((item)=>{
						item.orderTasks.map((item)=>{
							item.picked=false
						})
					})
				}
			},
			all(){
				let b=true
				this.listInCar.map((item,index)=>{
					if (!this.brandAll(index)) b=false
				})
				return b
			},
			order(){
				if (this.selectCargo.length>0){
					// this.$store.commit('pushToOrder',this.selectCargo)
					// this.$store.commit('resetCar',this.leftCargo)
					this.$request('/api/build/order/update/state',{orderId:this.selectCargo,orderState:1}).then((data)=>{
						this.updateOrder()
					})
				}
				else this.$store.dispatch('warn','您尚未选中任何商品')
			},
			removeFromCar(){
				if (this.selectCargo.length>0){
					// this.$store.commit('resetCar',this.leftCargo)
					this.$request('/api/build/order/deleted',{orderId:this.selectCargo}).then((data)=>{
						this.updateOrder()
					})
					
				}
				else this.$store.dispatch('warn','您尚未选中任何商品')
			}
		},
		mounted() {
			
		}
	}
</script>

<style lang="scss">
	.profile{
		color: $text-color;
	}
	.floatButtons1{
		position: fixed;
		bottom: 20px;
		width: 100%;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
	}
</style>

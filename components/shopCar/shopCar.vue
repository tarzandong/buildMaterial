<template>
	<view class="profile">
		<view class="centerTitle mt fs20" @click="ac">购物车</view>
			<view v-if="listInCar.length>0" style="width: 95%;margin: auto;" >
				<view v-for='(item,i) in listInCar' :key="item.brandName" class="glass mt" style="box-shadow: 2px 2px 5px rgba(0,0,0,0.3);">
					<view style="line-height: 40px;background-color:#e6e6e6;padding-left: 5px;">
						<switch type="checkbox" @change="toggleBrand($event,i)" color="#e48257" :checked="brandAll(i)" style="transform: scale(0.7);"></switch>
						<text>{{listInCar[i].brandName}}</text>
					</view>
					
					
					<view v-for="(item1,j) in listInCar[i].orderTasks" :key="item1.id" class="pl">
						<view class="row mt" >
							<!-- <view class="bedge" style="background-color:#e48257;">{{j+1}}</view> -->
							<switch type="checkbox" @change="selectItem($event,i,j)" color="#e48257" :checked="listInCar[i].orderTasks[j].picked" style="transform: scale(0.7);"></switch>
							<view style="width: 140px;padding: 0 5px;" class="noWrap">{{item1.commodityName+' '+item1.norms}}</view>
							<view style="width: 80px;display: flex;">
								<input :value="item1.orderNumber" type="number" style="width: 50px;text-align: center;background-color: #fff;" @blur='changeQty($event,item1.id)'/>
								{{item1.unit}}
							</view>
							<view style="width: 120px;">{{item1.price}}元/{{item1.unit}}</view>
						</view>
						<view class="row mt" style="flex-direction: row-reverse;">
							<view style="color: #e48257;" class="pr">{{item1.amount}}元</view>
						</view>
						<view class="line" v-if="j!==listInCar[i].orderTasks.length-1" style="border-bottom: 1px solid #e6e6e6;"></view>
					</view>
				</view>
			</view>
			<view style="width: 95%;text-align: end;" class="mt pt pb">小计：{{sum}}元</view>
			
			<view class="pf row" style="bottom: 20px;width: 95%;left: 10px;justify-content: space-around;" v-if="listInCar.length>0">
				<view><switch type="checkbox"  @change="selectAll" color="#e48257" :checked="all()" style="transform: scale(0.7);"></switch >全选</view>
				<view class="button buttonDelete" @click="showOrder(1)">删除</view>
				<view class="button lightShadow" @click="showOrder(0)">下单</view>
				
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
		// props:{
		// 	listInCar:{type:Array,default:[]}
		// },
		data(){
			return {
				// selectCargo:[],
				brand:[],
				value:[],
				a:false,
				dialog:0,
			}
		},
		computed:{
			tip(){
				if (this.dialog==0) return '确认下单？'
				else return '确认删除？'
			},
			sum(){
				let s=0
				this.listInCar.map((item)=>{
					item.orderTasks.map((item1)=>{
						if (item1.picked){
							s+=Number(item1.amount) 
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
			confirm(done){
				if (this.dialog==0) return this.order(done)
				else return this.removeFromCar(done)
			},
			showOrder(i){
				// uni.showModal({
				// 	title:'确认下单？',
				// 	showCancel:true,
				// 	success: (e) => {
				// 		if (e.confirm) this.order()
				// 	}
				// })
				this.dialog=i
				if (this.selectCargo.length>0){
					this.$refs.dialog.open()
				}
				else this.$store.dispatch('warn','您尚未选中任何商品')
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
			order(done){
				
					this.$request('/api/build/order/update/state',{orderId:this.selectCargo,orderState:1}).then((data)=>{
						this.$emit('updated')
						this.updateOrder()
						this.$store.dispatch('warn','下单成功，可在我的页面查看')
						done()
					}).catch(()=>{done()})
					done()
			},
			removeFromCar(done){
				
					this.$request('/api/build/order/deleted',{orderId:this.selectCargo}).then((data)=>{
						this.updateOrder()
						done()
					}).catch(()=>{done()})
					
					done()
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

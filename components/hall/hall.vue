<template>
	<view class="hall">
		
		<swiper duration="500" autoplay="true" circular="true"
						:style="'width:100%;height:70px;'+
										'margin:auto;' ">
			<swiper-item v-for='n in 3' :key='n' @click="test">
				<image :src="'http://203.135.96.136:8850/images/home/lunbo'+n+'.jpg'" style='width: 100%;height: 70px;' 
				 ></image>
			</swiper-item>
			
		</swiper>
		<!-- <image src="http://203.135.96.136:8850/images/home/lunbo.jpg" style='width: 100%;height: 210px;' @click='test'></image> -->
		<view class="bgQuote1" style="overflow: scroll;">
			<view class="centerTitle pt pl" style="text-align: start;">最新报价</view>
			<view class='row tableHead mt pl' >
				<view class='f1' >{{tableHead[0]}}</view>
				<view class='f2' >{{tableHead[1]}}</view>
				<view class='f2' >{{tableHead[2]}}</view>
				<view class='f1' >{{tableHead[3]}}</view>
				<view class='f1' >{{tableHead[4]}}</view>
				<view class='f2' >{{tableHead[5]}}</view>
			</view>
			<view class='line'></view>
			<view :class="'row lh28 tableLine pl'" v-for="(item,index) in updateList" :key="index" @click="openDetail(item)" >
				<view class='f1 fs12 noWrap'>{{item.brandName}}</view>
				<view class='f2 fs12 noWrap'>{{item.name}}</view>
				<view class='f2 fs12 noWrap'>{{item.norms}}</view>
				<view class='f1 fs12 noWrap'>{{item.stock}}</view>
				<view class='f1 fs12 noWrap'>{{item.unit}}</view>
				<view class='f2 fs12 noWrap'>{{item.price}}</view>
			</view>
		</view>
		<!-- <tabbar :tabList="bmTypes" :index="bmTypeIndex" @tabIndex='typeClick' class="typeTab mt"></tabbar> -->
		<view class=" mb row pl pr" style="width: 100%; justify-content: space-between;border-top: 2px solid #532e1c;">
			<view class="fs20 fwb">钢材</view>
			<radio-group @change="setLayout" >
				<view class=" pr" style="justify-content: space-around;font-size: 14px;">
					<label class="pl pr" style="line-height: 30px;border-radius: 15px;">
						<radio value="0" checked="layout==0" style="transform:scale(0.7);" color="#e48257"></radio>
						紧凑模式
					</label>
					<label class="pl pr" style="line-height: 30px;border-radius: 15px;">
						<radio value="1" checked="layout==1" style="transform:scale(0.7);" color="#e48257"></radio>
						舒适模式
					</label>
				</view>
				
			</radio-group>
		</view>
		<wrapTab :tabList="brandList" :curIndex='tabIndex' @tabClick='tabClick'></wrapTab>
		
		<scroll-view scroll-y="true" :style=" 'height:'+String(parseInt($store.getters.mpMainHeight)-84)+'px;' " @scrolltolower="()=>{$emit('loadMore')}">
			<view v-if="layout==0" class="table">
				<view class='row tableHead mt pl' >
					<view class='f1' >{{tableHead[0]}}</view>
					<view class='f2' >{{tableHead[1]}}</view>
					<view class='f2' >{{tableHead[2]}}</view>
					<view class='f1' >{{tableHead[3]}}</view>
					<view class='f1' >{{tableHead[4]}}</view>
					<view class='f2' >{{tableHead[5]}}</view>
				</view>
				<view class='line'></view>
				<view :class="'row lh28 tableLine pl'" v-for="(item,index) in quoteList" :key="index" @click="openDetail(item)" >
					<view class='f1 fs12 noWrap'>{{item.brandName}}</view>
					<view class='f2 fs12 noWrap'>{{item.name}}</view>
					<view class='f2 fs12 noWrap'>{{item.norms}}</view>
					<view class='f1 fs12 noWrap'>{{item.stock}}</view>
					<view class='f1 fs12 noWrap'>{{item.unit}}</view>
					<view class='f2 fs12 noWrap'>{{item.price}}</view>
				</view>
			</view>
			<view v-else class="row2">
				<view v-for="(item,index) in quoteList" :key="index" @click="openDetail(item)">
					<view class="square">
						<view class='type lh22 noWrap'>{{item.name+' '+item.norms}}</view>
						<view class='type lh22'>{{item.stock+item.unit}}</view>
						<view class='price lh22'>{{item.price}}/{{item.unit}}</view>
						<view class='brand lh22 noWrap'>来自{{item.brandName}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default{
		props:{
			updateList:{type:Array,default:[]},
			quoteList:{type:Array,default:[]},
		},
		data(){
			return {
				bmTypes:['','','钢材'],
				bmTypeIndex:2,
				layout:1,
				// brandList:['重钢123','宝钢','鞍钢','珠海粤钢','重钢','宝钢','鞍钢','珠海粤钢','重钢','珠海粤钢','重钢'],
				tabIndex:0,
				tableHead:['品牌','名称','规格','数量','单位','单价(元)'],
			}
				
		},
		computed:{
			bgSrc(){
				// return 'http://203.135.96.136:8850/images/bg/home'+this.bmTypeIndex+'.jpg'
				return ''
			},
			brandList(){
				return this.$store.state.brandList
			}
			// bmTypes(){
			// 	let tempList=[]
			// 	this.$store.state.categoryList.map((item)=>{
			// 		tempList[item.type]=item.lable
			// 	})
			// 	return tempList
			// }
		},
		methods:{
			tabClick(i){
				if (this.tabIndex!==i) {
					this.tabIndex=i
					this.$emit('changeBrand',i)
				}
				
			},
			openDetail(item){
				// console.log(item)
				setTimeout(()=>{
					uni.navigateTo({
						url:'detail/detail?item='+JSON.stringify(item)+'&bg='+this.bgSrc
					})
				},300)
				
			},
			test(){
				
			},
			typeClick(i){
				// this.bmTypeIndex=i
				// this.$emit('changeType',i)
			},
			setLayout(e){
				this.layout=e.detail.value
			}
		},
	}
</script>

<style lang="scss">
	.hall{
		color: $text-color;
	}
	.bgQuote1{
		// background-color: $bg-active;
		backdrop-filter: blur(2px);
		height: 220px;
	}
	.table{
		// background-color: $bg-active;
		backdrop-filter: blur(5px);
	}
	.row2{
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: start;
		font-weight: lighter;
	}
	.square{
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100px;
		height: 100px;
		border-radius: 5px;
		// background-color: $bg-active;
		border: 1px solid $bg-active;
		margin: 5px;
		padding: 5px;
		backdrop-filter: blur(5px);
	}
	.square:active{
		background-color: $color-warning;
	}
	.type{
		width: 100%;
		text-align: center;
		font-size: 12px;
	}
	.price{
		width:100%;
		text-align: center;
		font-size: 16px;
		color: darken($text-color,20%);
		font-weight: bold;
	}
	.brand{
		width: 100%;
		text-align: end;
		font-size: 12px;
	}
	.tableLine{
		height: 35px;
		border-bottom: 0.5px solid #e6e6e6;
	}
	.tableLine:active{
		background-color: $color-warning;
	}
</style>

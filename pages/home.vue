<template>
	<view style="display: block;width: 100%;height: 100%;">
		<mpframe navL='-1' navC='建材中心' :src="bg12" :bottomTab="true" :navRsrc="menuSrc" @menuClick='share'>
			
			<view slot='main' >
				<swiper @change="switchTab" :current="tabIndex" :style="tabIndex==0? 'height:'+( parseInt($store.getters.mpMainHeight)+280)+'px;overflow: scroll;' : 'height:'+parseInt($store.getters.mpMainHeight)+'px;overflow: scroll;'">
					<swiper-item>
						<hall :updateList="updatedList" :quoteList="typeList" @changeType='changeType' @changeBrand='changeBrand' @loadMore='loadMore'></hall>
					</swiper-item>
					<swiper-item style="overflow: scroll;">
						<shopCar ></shopCar>
					</swiper-item>
					<swiper-item style="overflow: scroll;">
						<profile :existPassword="existPassword" @updated='updateProfile'></profile>
					</swiper-item>
				</swiper>
				
				
			</view>
			
		</mpframe>
		<tabbar :tabList="tabList" :index="tabIndex" :iconSrc="tabIcons" @tabIndex='tabClick' class="mainTab" :lengthOfCar="lengthOfCar"></tabbar>
		<uni-popup type="center" ref='download'>
			<view class="card">
				<view class="centerTitle">有新版本</view>			
				<view class="mt">为更好的用户体验，请下载新版</view>
				<view class="mt button" @click="download">下载新版</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	
	export default{
		components:{
			uniPopupMessage
		},
		data(){
			return {
				tabIcons:['/static/images/home/home','/static/images/home/shopCar','/static/images/home/profile'],
				tabIndex:0,
				tabList:['首页','购物车','我的'],
				downloadUrl:'',
				existPassword:false,
				urls:{
					updatedQuote:'/api/build/commodity/new/info',
					typeQuote:'/api/build/commodity/type/list',
					order:'/api/build/order/list',
					typeList:'/api/build/category/list',
				},
				body:{
					"page": 1,
					"pageSize": 18,
					"type": 2,
					"userId": this.$store.state.userInfo.userId,
					orderState:0,
				},
				updatedList:[],
				typeList:[],
				brandList:[],
			}
		},
		computed:{
			hasLogin(){
				return this.$store.state.hasLogin
			},
			bgSrc(){
				return 'http://203.135.96.136:8850/images/bg/home'+this.bmTypeIndex+'.jpg'
			},
			bg12(){
				// if (this.tabIndex>0) return '/static/images/bg/bgShop.jpg'
				// else 
				return ''
			},
			lengthOfCar(){
				let l=0
				this.$store.state.backEnd.listInCar.map((item)=>{
					l=l+item.orderTasks.length
				})
				return l
			},
			
			menuSrc(){
				if (this.$store.state.platform=='wx') return ''
				else return '/static/images/common/menu.png'
				// return ''
			}
			// lang(){
			// 	return this.$store.getters.lang
			// },
			// home(){
			// 	return this.lang.home
			// }
		},
		methods:{
			updateProfile(){
				this.$request('/api/build/user/existPassword',{}).then((data)=>{
					this.existPassword=!Boolean(data.existPassword) 
					console.log('exits',this.existPassword)
				})
			},
			share(){
				// try{
					// uni.shareWithSystem({
					//   summary: '中山建材',
					//   href: this.$store.state.downloadUrl,
					//   success(){
					//     // 分享完成，请注意此时不一定是成功分享
					//   },
					//   fail(){
					//     // 分享失败
					//   }
					// })
				// }
				// catch(e){}
				uni.navigateTo({
					url:'share/share'
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
			changeType(i){
				this.body.type=i
				this.$request(this.urls.typeQuote,this.body).then((data)=>{
					this.typeList=data.commodities.records
				})
			},
			changeBrand(i){
				this.body.page=1
				this.body.brandId=this.$store.state.brandList[i].id
				console.log(this.body)
				this.$request(this.urls.typeQuote,this.body).then((data)=>{
					this.typeList=data.commodities.records
				})
			},
			loadMore(){
				console.log('load')
				this.body.page++
				this.$request(this.urls.typeQuote,this.body).then((data)=>{
					this.typeList.push(...data.commodities.records) 
				})
			},
			tabClick(i){
				this.tabIndex=i
				if (i==0){
					this.$request('/api/build/commodity/new/info',this.body).then((data)=>{
						this.updatedList=data.commodities
						this.updatedList.length=4
					})
					this.$request('/api/build/commodity/type/list',this.body).then((data)=>{
						this.typeList=data.commodities.records
					})
				}
				
			},
			switchTab(e){
				this.tabIndex=e.detail.current
				if (e.detail.current==0) {
					this.$request('/api/build/commodity/new/info',this.body).then((data)=>{
						this.updatedList=data.commodities
						this.updatedList.length=4
						// console.log('update',this.updatedList)
					})
					this.$request('/api/build/commodity/type/list',this.body).then((data)=>{
						this.typeList=data.commodities.records
					})
				}
				
			},
			download(){
				try{
					// plus.runtime.openURL(this.downloadUrl)
					let dtask = plus.downloader.createDownload(
					this.downloadUrl, {},
					function(d, status) {
						uni.showToast({
							title: '下载完成',
							mask: false,
							duration: 1000
						});
						// 下载完成
						if (status == 200) {
							plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, e => e, function(error) {
								uni.showToast({
									title: '安装失败-01',
									mask: false,
									duration: 1500
								});
							})
						} else {
							uni.showToast({
								title: '更新失败-02',
								mask: false,
								duration: 1500
							});
						}
					});
					dtask.start(); // 开启下载的任务
					let prg = 0;
					let showLoading = plus.nativeUI.showWaiting("正在下载");  //创建一个showWaiting对象 
					dtask.addEventListener('statechanged', function(
						task,
						status
					) {
						// 给下载任务设置一个监听 并根据状态  做操作
						switch (task.state) {
						case 1:
							showLoading.setTitle("正在下载");
							break;
						case 2:
							showLoading.setTitle("已连接到服务器");
							break;
						case 3:
							prg = parseInt(
							(parseFloat(task.downloadedSize) /
								parseFloat(task.totalSize)) *
								100
							);
							showLoading.setTitle("  正在下载" + prg + "%  ");
							break;
						case 4:
							 plus.nativeUI.closeWaiting();
							//下载完成
							break;
						}
					});
					
				}catch(e){
					//TODO handle the exception
				}
				
				this.$refs.download.close()
				
			}
		},
		onBackPress() {
			// if (this.subPage){
			// 	this.$store.state.backFromSub()
			// 	this.subPage=false
			// 	return true
			// }
		},
		onShow() {
			if (this.hasLogin){
				this.updateOrder()
				this.$request('/api/build/user/existPassword',{}).then((data)=>{
					this.existPassword=!Boolean(data.existPassword) 
					console.log('exits',this.existPassword)
				})
			}
			
		},
		onLoad() {
			this.$request('/api/build/commodity/new/info',this.body).then((data)=>{
				this.updatedList=data.commodities
				this.updatedList.length=4
			})
			this.$request('/api/build/commodity/type/list',this.body).then((data)=>{
				this.typeList=data.commodities.records
			})
			this.$request(this.urls.typeList,{}).then((data)=>{
				let tempList=[]
				let tempItem={}
				data.categories.map((item)=>{
					tempItem.value=item.id
					tempItem.lable=item.name
					tempItem.type=item.type
					tempList.push({...tempItem})
				})
				this.$store.commit('setCL',tempList)
			})
			this.$request('/api/build/commodity/brand/list',{}).then((data)=>{
				data.subCategories.unshift({subCategoryName:'所有',id:''})
				this.$store.commit('setBL',data.subCategories)
			})
			uni.getStorage({
				key:'userInfo',
				success:res=>{
					this.$store.commit('login',JSON.parse(res.data))
					// console.log(this.$store.state.userInfo.token)
					
					
					this.updateOrder()
				},
				fail() {
					// uni.redirectTo({
					// 	url:'rigist?status=0'
					// })
				}
			})
			
			
		},
		mounted() {
			this.$request('/api/build/user/version/detail',{'version':100})
			.then(data=>{
				this.$store.state.downloadUrl=data.downloadAddress
				this.$store.state.downloadIos=data.iosDownloadAddress
				this.downloadUrl=data.downloadAddress
			})
			try{
				let v=plus.runtime.version
				let vi=parseInt(v.slice(0,1))*100+parseInt(v.slice(2,3))*10+parseInt(v.slice(4)) 
				
				this.$request('/api/build/user/version/detail',{'version':vi})
				.then(data=>{
					this.downloadUrl=data.downloadAddress
					if (data.state){
						
						this.$refs.download.open()
					}
				})
			}catch(e){
				
				//TODO handle the exception
			}
		}
	}
</script>

<style lang="scss">
	.label1{
		margin-top: 5px;
		background-image: linear-gradient(to bottom right,$bg-active,darken($bg-active,20%));
		backdrop-filter: blur(2px);
		padding: 0 5px;
		border-radius: 10px;
		box-shadow: 0 0 3px rgba($color: #000000, $alpha: 0.5);
	}
	.mainTab{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		font-size: 16px;
		font-weight: bold;
	}
	.bgQuote{
		width: 100%;
		// height: 200px;
		// display: block;
		// background-color: $bg-active;
		color: $text-color;
		// font-weight: bold;
	}
	.typeTab{
		font-size: 14px;
		
	}	
</style>

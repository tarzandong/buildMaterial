<template>
	<view style="display: block;width: 100%;height: 100%;">
		<mpframe  navL='返回' navC='分享本应用' :bottomTab='false'>
			<view slot="main">
				<view class="content" ref='mainContent'>
					
					
						<view style="font-size: 12px;margin-top: 20px;">'请根据您的手机平台扫描相应二维码'</view>
						<view class="glass content" style="margin-top: 20px;">
							
							<view style="width: 100%;text-align: center;">安卓 Anodroid</view>
							<!-- <view style="background-image: url(../../static/images/popularize/outline.png);width: 120px;height: 120px;display: flex;align-items: center;justify-items: center;background-size: cover;"> -->
								<!-- <ay-qrcode qrcode_id='android' :url="url" :modal="true" :size="100" style="margin: auto;box-shadow: 0 0 5px #fff,0 0 10px #fff;" ></ay-qrcode> -->
							<!-- </view> -->
							<view style='margin-top: 10px;padding-left: 20px;'>
								<ay-qrcode ref="android1" :qrcode_id="'android1'" :modal="modal_qr" :url="url" @hideQrcode="hideQrcode" :height="200" :width="200" 
								:is_themeImg="true"
								themeImg="/static/logo.png"
								:h_w_img="40"/>
							</view>
							
						</view>	
						
						<view class="glass">
							<view style="width: 100%;text-align: center;">苹果 IOS</view>
							<view style='margin-top: 10px;padding-left: 20px;'>
								<ay-qrcode ref="ios1" :qrcode_id="'ios1'" :modal="modal_qr" :url="url1" @hideQrcode="hideQrcode" :height="200" :width="200" 
								:is_themeImg="true"
								themeImg="/static/logo.png"
								:h_w_img="40"/>
							</view>
						</view>
						
						<view class='button mt' @click='shot'>截屏</view>
						<view class='button mt' @click='share'>分享</view>
						<view class='fs12'>限安卓app</view>
					
				</view>	
			</view>//slotmain
		</mpframe>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				modal_qr:false
			}
		},
		computed:{
			url(){
				return this.$store.state.downloadUrl
				
			},
			url1(){
				return this.$store.state.downloadIos
			},
		},
		onLoad() {
				this.showQrcode();//一加载生成二维码

		},
		methods: {
			share(){
				try{
					uni.shareWithSystem({
					  summary: '中山建材',
					  href: this.$store.state.downloadUrl,
					  success(){
					    // 分享完成，请注意此时不一定是成功分享
					  },
					  fail(){
					    // 分享失败
					  }
					})
				}catch(e){
					//TODO handle the exception
				}
			},
				shot(){
					try{
						var pages = getCurrentPages();
						var page = pages[pages.length - 1];  
						var bitmap=null;  
						var currentWebview = page.$getAppWebview();
						bitmap = new plus.nativeObj.Bitmap('amway_img');  
						// 将webview内容绘制到Bitmap对象中  
						currentWebview.draw(bitmap,function(){  
								console.log('截屏绘制图片成功');  
								bitmap.save( "../Screenshots/enveQR.jpg"  
								,{}  
								,function(i){  
										console.log('保存图片成功：'+JSON.stringify(i));  
										uni.saveImageToPhotosAlbum({  
												filePath: i.target,  
												success: function () {  
														bitmap.clear(); //销毁Bitmap图片  
														uni.showToast({  
																title: '保存图片成功',  
																mask: false,  
																duration: 1500  
														});  
												}  
										});  
								}  
								,function(e){  
										console.log('保存图片失败：'+JSON.stringify(e));  
								});  
						},function(e){  
								console.log('截屏绘制图片失败：'+JSON.stringify(e));  
						});  
					}catch(e){
						//TODO handle the exception
					}
				},
				
				// 展示二维码
				showQrcode() {
						this.modal_qr = true;
						// uni.showLoading()
						setTimeout(()=> {
								// uni.hideLoading()
								this.$refs.android1.crtQrCode()
								this.$refs.ios1.crtQrCode()
						}, 50)
				},

				//传入组件的方法
				hideQrcode() {
						this.modal_qr = false;
				},
		}
	}
</script>

<style lang="scss">
	.content{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>

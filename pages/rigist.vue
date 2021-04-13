<template>
	<view>
		<mpframe :src="'http://203.135.96.136:8850/images/bg/rigist.jpg'" navL='-1' :navC="title" :rigistPage="true">
			<view slot="main">
				<view class="glass formBody" v-if="status==0">
					<view class="mt row pt" style="justify-content: center; position: relative;">
						<view>手机号:</view>
						<input placeholder="输入手机号" v-model="body.phone" class="input1 ml" placeholder-class="phc"/> 
						<view class="button button2 fs12" :style="'position: absolute;padding:0 10px; right: -5px;bottom: 0;'+(send? 'box-shadow:none;':'')" @click="requestValid">{{sendValid}}</view>
					</view>
					<view class="row mt pt" style="justify-content: center;">
						<view class="prepend">验证码:</view>
						<input placeholder="输入验证码" v-model="body.verifyCode" class="input1 ml" placeholder-class="phc"/>
					</view>
					<!-- <input placeholder="请输入昵称" v-model="body.nickName" class="input1 mt" placeholder-class="phc" v-if="nextStep"/>
					<input password="true" v-model="body.newPassword" placeholder="请设置您的密码" class="input1 mt" placeholder-class="phc" v-if="nextStep"/>
					<input password="true" v-model="body.newPassword2" placeholder="请再次输入" class="input1 mt" placeholder-class="phc" v-if="nextStep"/> -->
					<view class="mt button lightShadow" @click="submit" v-if="nextStep">确定</view>
					<view class="ul mt tip" @click="setStatus(1)">已有账户</view>
				</view>
				<view class="glass formBody" v-else-if="status==1 || status==4">
					<view class="row mt pt" style="justify-content: center; position: relative;">
						<view class="prepend">手机号:</view>
						<input placeholder="请输入手机号码" v-model="body.phone" class="input1 ml" placeholder-class="phc"/>
						<view class="button button2 fs12" :style="'position: absolute;padding:0 10px; right: -5px;bottom: 0;'+(send? 'box-shadow:none;':'')" @click="requestValid" v-if="status==4">{{sendValid}}</view>
					</view>
					<view class="row mt pt" style="justify-content: center;" v-if="status==1">
						<view class="prepend" style="white-space: pre;">密    码:</view>
						<input password="true" v-model="body.password" placeholder="请输入您的密码" class="input1 ml" placeholder-class="phc"/>
					</view>
					<view class="row mt pt" style="justify-content: center;" v-if="status==4">
						<view class="prepend">验证码:</view>
						<input placeholder="输入验证码" v-model="body.verifyCode" class="input1 ml" placeholder-class="phc"/>
					</view>
					<view class="mt button lightShadow" @click="login">确定</view>
					<view style="display: flex;flex-direction: row;">
						<text class="mt ul br pr fs12" @click="setStatus(4)" v-if="status==1">验证码登录</text>
						<text class="mt ul br pr fs12" @click="setStatus(1)" v-else-if="status==4">密码登录</text>
						<text class="mt ul br pr pl fs12" @click="setStatus(2)" >重设密码</text><text class="mt ul pl fs12" @click="setStatus(3)">忘记密码</text>
					</view>
					<view class="ul mt tip" @click="setStatus(0)">注册新账户</view>
				</view>
				<view class="glass formBody" v-else-if="status==2">
					<input placeholder="请输入旧密码" v-model="body.oldPassword" password="true" class="input1 mt" placeholder-class="phc"/>
					<input password="true" v-model="body.newPassword" placeholder="请输入您想设置的新密码" class="input1 mt" placeholder-class="phc"/>
					<input password="true" v-model="body.newPassword2" placeholder="请再次输入" class="input1 mt" placeholder-class="phc"/>
					<view class="mt button lightShadow" @click="reset">确定</view>
					<view style="display: flex;flex-direction: row;">
						<text class="mt ul fs12" @click="setStatus(1)" >返回登录</text>
					</view>
					<view class="ul mt tip" @click="setStatus(0)">注册新账户</view>
				</view>
				<view class="glass formBody" v-else-if="status==3">
					<view class="mt" style="display: flex;flex-direction: row; position: relative;">
						<input placeholder="请输入手机号码" v-model="body.phone" class="input1" placeholder-class="phc"/> 
						<view class="button button2 fs12" :style="'position: absolute;right: -50px;bottom: 0;'+(send? 'box-shadow:none;':'')" @click="requestValid">{{sendValid}}</view>
					</view>
					
					<input placeholder="请输入验证码" v-model="body.verifyCode" class="input1 mt" placeholder-class="phc"/>
					<input password="true" v-model="body.newPassword" placeholder="请输入您想设置的新密码" class="input1 mt" placeholder-class="phc"/>
					<input password="true" v-model="body.newPassword2" placeholder="请再次输入" class="input1 mt" placeholder-class="phc"/>
					<view class="mt button lightShadow" @click="forget">确定</view>
					<view style="display: flex;flex-direction: row;">
						<text class="mt ul fs12" @click="setStatus(1)" >返回登录</text>
					</view>
					<view class="ul mt tip" @click="setStatus(0)">注册新账户</view>
				</view>
			</view>
		</mpframe>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				status:'',
				body:{
					phone:'',
					password:'',
					verifyCode: "",
					oldPassword:'',
					newPassword:'',
					newPassword2:'',
					zoneCode:'86',
					nickName:'',
					token:'',
					userId:'',
				},
				sendValid:'获取验证码',
				send:false,
				nextStep:false,
				urls:{
					valid:'/api/build/user/verify',
					submit:'/api/build/user/register',
					login:'/api/build/user/login',
					reset:'/api/build/user/updatePassword',
					forget:'/api/build/user/restPassword',
				}
			}
		},
		onLoad(option) {
			this.status=option.status
			uni.getStorage({
				key:'userInfo',
				success: (res) => {
					this.body=JSON.parse(res.data)
				}
			})
		},
		computed:{
			title(){
				switch (parseInt(this.status) ){
					case 0: return '注册'
					case 1: return '登录'
					case 3: return '忘记密码'
					case 2: return '重设密码'
					// default: return '注册'
				}
			}
		},
		mounted() {
			// console.log(this.status)
		},
		methods:{
			testphone(num){
				return (/^1[3456789]\d{9}$/.test(num))  //index为0,1,2分别代表大陆、香港、澳门区号的手机
				
			},
			setStatus(i){
				this.status=i
			},
			requestValid(){
				if (this.send) return
				if (!this.testphone(this.body.phone)) {
					this.$store.dispatch('warn','手机号码有误')
					return
				}
				else {
					this.$request(this.urls.valid,this.body).then((data)=>{
						this.send=true
						this.sendValid='已发送'
						this.$store.dispatch('warn','验证码已发送')
						this.nextStep=true
						setTimeout(()=>{
							this.send=false
							this.sendValid='再次获取'
						},60000)
					})
				}
			},
			submit(){
				if (this.body.newPassword !==this.body.newPassword2) {
					this.$store.dispatch('warn','两次密码输入不一致')
					return
				}
				else {
					this.body.password=this.body.newPassword
					this.$request(this.urls.submit,this.body).then((data)=>{
						// console.log(data)
						this.$store.dispatch('warn','注册成功')
						this.login()
					})
				}
			},
			
			login(){
				this.$request(this.urls.login,this.body).then((data)=>{
					// console.log(data)
					this.body.token=data.token
					this.body.nickName=data.nickName
					this.body.password=''
					this.body.oldPassword=''
					this.body.newPassword=''
					this.body.newPassword2=''
					this.body.userId=data.userId
					this.$store.commit('login',this.body)
					uni.redirectTo({
						url:'home'
					})
				})
			},
			
			reset(){
				if (this.body.newPassword !==this.body.newPassword2) {
					this.$store.dispatch('warn','两次密码输入不一致')
					return
				}
				else {
					this.$request(this.urls.reset,this.body).then((data)=>{
						this.$store.dispatch('warn','重设成功')
						this.body.password=this.body.newPassword
						this.login()
					})
				}
				
			},
			
			forget(){
				if (this.body.newPassword !==this.body.newPassword2) {
					this.$store.dispatch('warn','两次密码输入不一致')
					return
				}
				else {
					this.$request(this.urls.forget,this.body).then((data)=>{
						this.$store.dispatch('warn','重设成功')
						this.body.password=this.body.newPassword
						this.login()
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.formBody{
		margin: auto;
		margin-top: 50%;
		padding: 10px;
		width: 85%;
		color: $text-color;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.phc{
		color: lighten($text-color,30%);
	}
</style>

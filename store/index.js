import Vue from 'vue'
import Vuex from 'vuex'
// import request from '../network/myrequest.js'
// import lang from '../common/lang.js'

Vue.use(Vuex);//vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
    state:{
			fullHeight:0,
			fullWidth:0,
			safeTop:0,
			platform:'',
			
			baseUrl:'http://203.135.96.136:8850',
			
			hasLogin: false,
			userInfo:{},
			loading:false,
			
			
			warnMessage:'',
			popupShow:false,
			popref:null,
			
			categoryList:[],
			brandList:[],
			
			backEnd:{
				listInCar:[],
				listInOrder:[],
			}
    },
		getters:{
			
			mpMainHeight(state){
				return state.fullHeight-state.safeTop-95 //95是顶部和底部导航栏的高度和
			}
		},
		mutations:{
			login(state,body){
				state.hasLogin=true
				state.userInfo=body
				body.verifyCode=''
				uni.setStorage({//将用户信息保存在本地
					key: 'userInfo',  
					data: JSON.stringify(body)  
				}) 
			},
			logout(state){
				state.hasLogin=false
				state.userInfo={}
				state.backEnd.listInCar=[]
				state.backEnd.listInOrder=[]
				uni.removeStorage({
					key:'userInfo'
				})
			},
			changeNick(state,name){
				state.userInfo.nickName=name
				uni.setStorage({//将用户信息保存在本地
					key: 'userInfo',  
					data: JSON.stringify(state.userInfo)  
				})
			},
			setCL(state,list){
				state.categoryList=list
			},
			setBL(state,list){
				state.brandList=list
			},
			setLIC(state,list){
				state.backEnd.listInCar=list
			},
			setLIO(state,list){
				state.backEnd.listInOrder=list
			},
			setLoading(state,b){
				state.loading=b
			},
			
			setPlatForm(state,s){
				state.platform=s
			},
			setFW(state,fw){
				state.fullWidth=fw
			},
			setFH(state,fh){
				state.fullHeight=fh
			},
			setST(state,st){
				state.safeTop=st
			},
			setWarn(state,m){
				state.warnMessage=m
			},
			setPopShow(state,b){
				state.popupShow=b
			},
			setTBC(state,i){
				state.tabBarCur=i;
			},
			
			resetCar(state,list){
				state.backEnd.listInCar=list
			},
			pushToCar(state,item){
				state.backEnd.listInCar.push(item)
			},
			pushToOrder(state,list){
				if (list instanceof Array)
				state.backEnd.listInOrder=[...state.backEnd.listInOrder,...list]
				else
				state.backEnd.listInOrder.push(list)
			}
		},
		actions:{
			warn(context,message){
				let d=3000
				context.commit('setWarn',message)
				context.state.popref.open()
				setTimeout(()=>{
					context.commit('setWarn','')
				},3000)
				
			},
			
		}
})
export default store
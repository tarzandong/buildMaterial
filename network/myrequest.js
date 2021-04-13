import store from '../store/index.js'


const baseUrl=store.state.baseUrl


export default function  myRequest(api,body,method='POST', url=baseUrl){
	let phone= this.$store.state.userInfo.userPhone? this.$store.state.userInfo.userPhone :''
	let token=this.$store.state.userInfo.token? this.$store.state.userInfo.token : ''
	// let lang=''
	// if (store.state.langType=='en') lang='en'
	// if (store.state.langType=='cn')	lang='zh'
	// if (store.state.langType=='tw')	lang='tw'
	// console.log(token)
	store.commit('setLoading',true)
	return new Promise(function(res,rej){
		uni.request({
			url:url+api,
			method:method,
			
			header:{
				token:token,
				// lang,
			},
			data:{
				body:body,
				header:{
					phone:phone,
					token:token
				}
			},
			success(data) {
				// console.log(data)
				store.commit('setLoading',false)
				if (data.statusCode==200){
					if (data.data.code==200){
						console.log(data)
						res(data.data.body);
					}
					else if (data.data.code==401){
						console.log('err')
						// store.dispatch('warn',data.data.message)
						store.commit('logout')
						
						// uni.showToast({
						// 		title: data.data.message,  
						// 		mask: false,  
						// 		duration: 1500  
						// });
						
					}
					else {
						store.dispatch('warn',data.data.message)
						
					}
				}
				
				else {
					store.dispatch('warn',data.data.message)
					
				}
			},
			fail() {
				store.commit('setLoading',false)
				store.dispatch('warn','网络异常')
			}
		})
		
	}) 
	
}
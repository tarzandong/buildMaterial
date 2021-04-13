<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			let devH=0
			let devW=0
			let safeT=0
			let that=this
			
			this.$store.state.platform=uni.getSystemInfoSync().platform
			try{
				plus.screen.lockOrientation('portrait-primary')
			}catch(e){
				//TODO handle the exception
			}
			uni.getSystemInfo({
				success: function (res) {
					console.log(res);
					safeT=res.safeArea.top
					devW=res.windowWidth
					devH=res.windowHeight
					if(devW>devH){
						that.$store.commit('setST',safeT)
						that.$store.commit('setFW',devH)
						that.$store.commit('setFH',devW)
					}
					else{
						that.$store.commit('setST',safeT)
						that.$store.commit('setFW',devW)
						that.$store.commit('setFH',devH)
					}
					if (res.SDKVersion) {
						that.$store.commit('setPlatForm','wx')
					}
				},
			})
			
			try{
				if (window.innerHeight){
					this.$store.commit('setPlatForm','h5')
					devW=window.innerWidth
					devH=window.innerHeight
					
					console.log(devW)
					that.$store.commit('setFW',devW)
					that.$store.commit('setFH',devH)
					window.onresize=()=>{
						devW=window.innerWidth
						devH=window.innerHeight
						that.$store.commit('setFW',devW)
						that.$store.commit('setFH',devH)
					}
				}
			}
			catch(err){
				console.log(err)
				if (!this.$store.state.platform)
				this.$store.commit('setPlatForm','app')
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>

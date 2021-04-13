export default{
	onShow(){
		if (this.$store.state.warnMessage!==''){
			this.$store.state.showWarn()
		}
	}
}
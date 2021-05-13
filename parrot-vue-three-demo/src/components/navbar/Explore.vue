<template>
    <div id="explore">
        <div id="explore-button-wrapper">
            <input id="explore-button" type="button" value="开始探索" @click='startExplore'>
        </div>
    </div>
</template>

<script type="text/javascript"> 
import { mapGetters,mapActions } from "vuex"; 
export default {
 
    methods: {
        startExplore: startExplore,
        routeTo: function(routePath) {
            this.$router.push(routePath)
        },
        ...mapActions(['setContentWrapperView'])
    },
    computed: {
      ...mapGetters(['getContentWrapperCurrentView']),
    },
    components: {

    },
    mounted: function() {
        // 检测ie版本，如果非ie，返回undefined，ie返回版本号
        // var tridentVersion =  typeof ScriptEngineMajorVersion === "function" ?  ScriptEngineMajorVersion() : undefined
        // if(tridentVersion) {
        //     document.getElementById('navigator').style.background = '#131418'
        // }
    }
}

function startExplore() {
    this.setContentWrapperView("Realtime")
    this.routeTo("/realtime")
    document.getElementById('nav-bar').style.visibility = 'visible'
    document.getElementById('explore').style.display = 'none'
}

</script>

<style lang="scss">
@import url("./test1.scss");
</style>

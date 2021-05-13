<template>
    <div id="content-wrapper">
        <!-- <overview></overview>
        <moving-routines></moving-routines>
        <component :is='tracedCurrentView' transition="fade" transition-mode="out-in" keep-alive></component>
        <component :is='tracedCurrentView'></component>
        <router-view keep-alive></router-view> -->
        <router-view></router-view>
    </div>
</template>

<script>
    import Overview from './overview/Overview.vue'
    import Realtime from './realtime/Realtime.vue'
    import Statistic from './statistic/Statistic.vue'
    import Leaflet from './leaflet/Leaflet.vue' 
    import { mapGetters,mapActions } from "vuex"; 

    export default {
        components: {
            Overview,
            Realtime,
            Statistic,
            Leaflet
        },
        computed: {
            ...mapGetters(['getContentWrapperCurrentView']),
        }, 
        data() {
            return {

            }
        },
        methods: {

        },
        computed: {
            // 用计算属性自动跟踪vuex中的变量更方便，不用手动赋值getters更新
            tracedCurrentView: function() {
                return this.getContentWrapperCurrentView
            }
        }
        // ,mounted: setWrapperHeight
    }

</script>

<style lang="scss">
@import url("./index.scss");
</style>

<template>
    <div id="side-bar">
        <!-- <div class="menu-option" v-for='menu in menuConfig' @click='setContentWrapperView(menu.contentWrapperView)'>
            <span v-bind:class='menu.menuIcon' aria-hidden="true"></span>
            <span class='menu-label'>{{ menu.menuName }}</span>
        </div> -->
        <div class="menu-option" v-for='menu in menuConfig' v-bind:class="{ 'actived': menu.contentWrapperView == getContentWrapperCurrentView }"  @click='setContentWrapperView(menu.contentWrapperView)'>
            <div class="menuWrapper">
                <span v-bind:class='menu.menuIcon' aria-hidden="true"></span>
                <span class='menu-label'>{{ menu.menuName }}</span>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">  

    export default {  
        methods:{
            ...mapActions(['setContentWrapperView'])
        },
        data () {
            return {
                menuConfig: [
                    {
                        menuName: '风场地图',
                        menuIcon: 'glyphicon glyphicon-random',
                        actived: true,
                        contentWrapperView: 'WindMapWrapper'
                    },
                    {
                        menuName: '排污监测',
                        menuIcon: 'glyphicon glyphicon-eye-open',
                        actived: false,
                        contentWrapperView: 'PolutionWrapper'
                    },
                    {
                        menuName: '农业金融',
                        menuIcon: 'glyphicon glyphicon-usd',
                        actived: false,
                        contentWrapperView: 'FinanceWrapper'
                    }
                ]
            }
        },
        components: {

        },
        computed: {
            activeButton: function(viewComp) {
                viewComp == ''
            },
            ...mapGetters(['getContentWrapperCurrentView']),
        }
    }

</script>

<style lang="scss">
@import url("./test.scss");
</style>

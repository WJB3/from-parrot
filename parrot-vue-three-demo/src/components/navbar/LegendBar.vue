<template>
    <div id="legend-bar">
        <div id="legend-site" class='legend-block'>
            <div id="legend-site-block" class='legend-block-common'></div>
            <div class="legend-title">
                网点
            </div>
        </div>

        <div id="legend-spot" class='legend-block'>
            <div id="legend-spot-block" class='legend-block-common'></div>
            <div class="legend-title">
                配送点
            </div>
        </div>

        <div id="legend-shop" class='legend-block'>
            <div id="legend-shop-block" class='legend-block-common'></div>
            <div class="legend-title">
                商家
            </div>
        </div>

        <div id="legend-routine-normal" class='legend-block'>
            <div id="legend-routine-normal-block" class='legend-block-common'></div>
            <div class="legend-title">
                正常配送
            </div>
        </div>

        <div id="legend-routine-delay" class='legend-block'>
            <div id="legend-routine-delay-block" class='legend-block-common'></div>
            <div class="legend-title">
                延误配送
            </div>
        </div>

        <div id="legend-border" class='legend-block'>
            <div id="legend-border-block" class='legend-block-common'></div>
            <div class="legend-title">
                区边界
            </div>
        </div>
    </div>
</template>

<script type="text/javascript"> 

export default { 
    data () {
        return {
            menuConfig: [
                {
                    menuName: 'Weather',
                    menuIcon: 'glyphicon glyphicon-cloud',
                    actived: true
                },
                {
                    menuName: 'Alert',
                    menuIcon: 'glyphicon glyphicon-tag',
                    actived: false
                },
                {
                    menuName: 'Report',
                    menuIcon: 'glyphicon glyphicon-list-alt',
                    actived: false
                },
                {
                    menuName: 'Options',
                    menuIcon: 'glyphicon glyphicon-cog',
                    actived: false
                },
                {
                    menuName: 'About',
                    menuIcon: 'glyphicon glyphicon-user',
                    actived: false
                }
            ]
        }
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

</script>

<style lang="scss">
@import url("./test2.scss");
</style>

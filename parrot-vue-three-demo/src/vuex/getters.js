export default {
    getStaticAssetPath (state){ 
        if (state.dataPath.mode == 'develop') {
            return state.dataPath.devDataPath
        } else if (state.dataPath.mode == 'electron') {
            return state.dataPath.electronDataPath
        } else {
            return state.dataPath.deployDataPath
        }
    },
    getAllData(state){
        return state.allData
    },
    getPersistData (state){
        return state.persistData
    },
    getAnimatorId (state){
        return state.animatorId
    },
    getCanvasSize (state) {
        return state.viewPort
    },
    getWidgetDonutViewport  (state){
        return state.widgetDonutViewPort
    },
    getChinaMapData  (state){
        return state.macroEconomyData
    },
    getMacroEconomyData (state){
        return state.macroEconomyData
    },
    getContentWrapperCurrentView  (state){
        return state.contentWrapperCurrentView
    },
    getWindDetailSpeed  (state){
        return state.windDetailWidget.speed
    },
    getWindDetailDirection  (state){
        return state.windDetailWidget.direction
    },
    getWindDetailLon (state){
        return state.windDetailWidget.lon
    },
    getWindDetailLat (state){
        return state.windDetailWidget.lat
    }
    
    
}

 
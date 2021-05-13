export default {
    fetchAllData({ dispatch,commit }){
        commit('FETCH_ALLDATA')
    },
    setPersistData({ dispatch,commit }, data){
        var persistDataArray = []
    
        for (var i = 0; i < data.length; i++) {
            persistDataArray.push(data[i])
        }
    
        commit('SET_PERSIST_DATA', persistDataArray)
    },
    setAnimatorId({ dispatch }, animatorId){
        dispatch('SET_ANIMATOR_ID')
    },
    fetchCanvasSize({ dispatch }){
        dispatch('FETCH_CANVAS_SIZE')
    },
    fetchWidgetDonutViewport({ dispatch }, divId){
        dispatch('FETCH_WIDGET_DONUT_VIEWPORT', divId)
    },
    fetchChinaMapData({ dispatch }){
        dispatch('FETCH_CHINAMAP')
    },
    fetchMacroEconomyData({ dispatch }){
        dispatch('FETCH_MACRO_ECONOMY_DATA')
    },
    setContentWrapperView({ dispatch,commit }, component){
        commit('SET_CONTENT_WRAPPER_VIEW', component)
    },
    setContentWrapperCustomerExperienceView ({ dispatch }) {
        dispatch('SET_CONTENT_WRAPPER_VIEW_CUSTOMER_EXPERIENCE')
    },
    setWindDetailSpeed ({ dispatch }, speed){
        dispatch('SET_WIND_DETAIL_SPEED', speed)
    },

    setWindDetailDirection({ dispatch }, direction){
        dispatch('SET_WIND_DETAIL_DIRECTION', direction)
    },
    setWindDetailLon({ dispatch }, lon) {
        dispatch('SET_WIND_DETAIL_LON', lon)
    },
    setWindDetailLat({ dispatch }, lat){
        dispatch('SET_WIND_DETAIL_LAT', lat)
    }
    
    
} 

 
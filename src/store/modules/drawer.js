const state = {
    showDrawer: null
}

const mutations = {
    SET_SHOW_DRAWER: (state, showDrawer) => {
        state.showDrawer = showDrawer
    }
}

export default {
    namespace: true,
    state,
    mutations,
}
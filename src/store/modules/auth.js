import axios from 'axios'

export const state = {
    user: {
        email: localStorage.getItem('user_email') || null,
        token: localStorage.getItem('access_token') || null
    }
}

export const getters = {
    isAuthenticated: state => !!state.user.email
}

export const mutations = {
    SET_USER(state, user){
        state.user = user
    },
    LOG_OUT(state){
        state.user = {
            email: null,
            token: null
        }
    },

}

export const actions = {
    async LogIn({commit}, User) {
        await axios.post('auth/login', User).then(response => {
            const token = response.data.data.access_token
            localStorage.setItem('access_token', token)
            localStorage.setItem('user_email', User.email)
            let userData = {
                email: User.email,
                token: token
            }
            commit('SET_USER', userData)
        }).catch(error => {
            throw new Error(`API ${error}`);
        });
    },
    async LogOut({commit}) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_email')
        commit('LOG_OUT')
    }
}
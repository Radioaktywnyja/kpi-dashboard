import axios from 'axios'

export const state = {
    user: {
        email: localStorage.getItem('user_email') || null,
        token: localStorage.getItem('access_token') || null,
        refreshToken: localStorage.getItem('refresh_token') || null,
        isAdmin: localStorage.getItem('is_admin') || false
    }
}

export const getters = {
    isAuthenticated: state => !!state.user.email,
    getTokens: state => {
        return {
            token: state.user.token,
            refreshToken: state.user.refreshToken,
        }
    }
}

export const mutations = {
    SET_USER(state, user){
        state.user = user
    },
    SET_ADMIN(state){
        state.user.isAdmin = true
    },
    REFRESH_TOKENS(state, tokens) {
        state.user = {
            ...state.user,
            token: tokens.access_token,
            refreshToken: tokens.refresh_token
        }
    },
    LOG_OUT(state){
        state.user = {
            email: null,
            token: null,
            refreshToken: null
        }
    },

}

export const actions = {
    async LogIn({commit}, User) {
        await axios.post('auth/login', User).then(response => {
            const token = response.data.data.access_token
            const refreshToken = response.data.data.refresh_token
            localStorage.setItem('access_token', token)
            localStorage.setItem('refresh_token', refreshToken)
            localStorage.setItem('user_email', User.email)
            let userData = {
                email: User.email,
                token: token,
                refreshToken: refreshToken,
                isAdmin: false
            }
            commit('SET_USER', userData)
            return userData
        })
        .then(async (userData) => {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userData.token 
            }
            await axios.get('users/me', { headers }).then((response) => {
                let adminRoleIds = process.env.VUE_APP_ADMIN_ROLE_IDS.split(',')
                if (adminRoleIds.includes(response.data.data.role)) {
                    localStorage.setItem('is_admin', true)
                    commit('SET_ADMIN')
                }
            });
        })
        .catch(error => {
            throw new Error(`API ${error}`);
        });
    },
    refreshTokens({commit}, Tokens) {
        localStorage.setItem('access_token', Tokens.access_token)
        localStorage.setItem('refresh_token', Tokens.refresh_token)
        commit('REFRESH_TOKENS', Tokens)
    },
    async LogOut({commit}) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_email')
        localStorage.removeItem('is_admin')
        commit('LOG_OUT')
    }
}
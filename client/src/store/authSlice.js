import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: null,
    accessToken: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = {
                _id: action.payload._id,
                name: action.payload.name,
                email: action.payload.email,
                role: action.payload.role,
            };
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
        },
        updateAccessToken: (state, action) => {
            state.accessToken = action.payload.accessToken;
        },
        updateUserInfo: (state, action) => {
            state.userInfo = {
                ...state.userInfo,
                name: action.payload.name,
                email: action.payload.email,
            };
        },
        logout: (state) => {
            state.userInfo = null;
            state.accessToken = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, updateAccessToken, updateUserInfo, logout } = authSlice.actions;
export default authSlice.reducer;

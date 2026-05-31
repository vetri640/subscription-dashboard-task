import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentSubscription: null,
    plans: [],
    loading: false,
    error: null,
};

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        setSubscription: (state, action) => {
            state.currentSubscription = action.payload;
        },
        setPlans: (state, action) => {
            state.plans = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearSubscription: (state) => {
            state.currentSubscription = null;
        }
    },
});

export const { setSubscription, setPlans, setLoading, setError, clearSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;

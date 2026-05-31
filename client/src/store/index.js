import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import subscriptionReducer from './subscriptionSlice';
import themeReducer from './themeSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    subscription: subscriptionReducer,
    theme: themeReducer,
});

const persistConfig = {
    key: 'root',
    storage: storage.default || storage,
    whitelist: ['auth', 'theme'], // only persist auth and theme
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
            },
        }),
});

export const persistor = persistStore(store);

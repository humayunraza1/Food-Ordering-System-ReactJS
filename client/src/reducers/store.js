// store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk'; // Middleware for async actions
import userReducer from './userReducer';

const rootReducer = combineReducers({
    user: userReducer,
});

const persistConfig = {
    key: 'root', // Change this key if needed
    storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };

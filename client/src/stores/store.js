// store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk'; // Middleware for async actions
import fetchUserReducer from '../reducers/fetchUserReducer';
import updateUserReducer from '../reducers/updateUserReducer';

const rootReducer = combineReducers({
    fetchUser: fetchUserReducer,
    updateUser: updateUserReducer
});

const persistConfig = {
    key: 'root', // Change this key if needed
    storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };

import{ configureStore } from '@reduxjs/toolkit';
import goodSlice from './goodSlice';


export const store = configureStore({
    reducer: {
        good: goodSlice,
        
    }
})



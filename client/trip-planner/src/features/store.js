import {configureStore} from '@reduxjs/toolkit'
import trip from "../features/trip/tripSlice";

export const store = configureStore({
    reducer : {
        trip
    }
})
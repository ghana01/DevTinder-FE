
import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const appSotre =configureStore({
    reducer:{
        user:userReducer
    }
})

export default appSotre;
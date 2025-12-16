
import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import { connect } from "react-redux";
const appSotre =configureStore({
    reducer:{
        user:userReducer,
        feed:feedReducer,
        connection:connectionReducer
    }
})

export default appSotre;
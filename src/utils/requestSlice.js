import { createSlice } from "@reduxjs/toolkit";

const RequestSlice =createSlice({
    name:'request',
    initialState:null,
    reducers:{
        addRequest:(state,action)=>{
            return action.payload;
        },
        removeRequest:(state,action)=>{
            return null;
        }
    }
})

export const {addRequest,removeRequest}= RequestSlice.actions;
export default RequestSlice.reducer;
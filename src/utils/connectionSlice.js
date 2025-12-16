import { createSlice } from "@reduxjs/toolkit";

const ConnectionSlice = createSlice({
    name: 'connection',
    initialState: null, // Change to null to better handle "loading" state
    reducers: {
        addConnection: (state, action) => {
            return action.payload; // FIX: Replace the state with the new array
        },
        removeConnection: (state, action) => {
            return null;
        }
    },
});

export const { addConnection, removeConnection } = ConnectionSlice.actions;
export default ConnectionSlice.reducer;
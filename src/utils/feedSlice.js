import { createSlice } from "@reduxjs/toolkit"

const feedSlice = createSlice({
    name: 'feed',
    initialState: null,
    reducers: {
        addFeed: (state, action) => {
            return action.payload;
        },
        removeFeed: (state, action) => {
            // LOGIC: Filter out the user whose _id matches the action.payload
            const newFeed = state.filter((user) => user._id !== action.payload);
            return newFeed;
        }
    },
});

export const { addFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
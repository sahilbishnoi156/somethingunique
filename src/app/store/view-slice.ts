// viewSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ViewState {
    viewType:
        | 'default'
        | 'createPost'
        | 'showComments'
        | 'showSearch';
    postId: string | null; // To store the post ID for showing comments
}

const initialState: ViewState = {
    viewType: 'default',
    postId: null,
};

export const viewSlice = createSlice({
    name: 'view',
    initialState,
    reducers: {
        toggleCreatePost: (state) => {
            if (state.viewType === 'createPost') {
                state.viewType = 'default';
                return;
            } else {
                state.viewType = 'createPost';
                state.postId = null;
            }
        },
        showComments: (state, action: PayloadAction<string>) => {
            state.viewType = 'showComments';
            state.postId = action.payload; // Set the post ID for the comments
        },
        resetView: (state) => {
            state.viewType = 'default';
            state.postId = null;
        },
        showSearch: (state) => {
            state.viewType = 'showSearch';
        },
    },
});

export const {
    toggleCreatePost,
    showComments,
    resetView,
    showSearch,
} = viewSlice.actions;

export default viewSlice.reducer;

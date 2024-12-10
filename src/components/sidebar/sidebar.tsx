import { RootState } from '@/app/store/store';
import { resetView } from '@/app/store/view-slice';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CreatePost from '../feed/create-post';
import { X } from 'lucide-react';
import DefaultSidebar from '../default-sidebar';
import Comments from './show-comments';
import SearchUsers from './search-users';

const SideBar = () => {
    const { viewType, postId } = useSelector(
        (state: RootState) => state.view
    );
    const dispatch = useDispatch();

    return (
        <>
            {viewType !== 'default' && (
                <button
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                    }}
                    onClick={() => dispatch(resetView())}
                >
                    <X />
                </button>
            )}
            {viewType === 'createPost' && <CreatePost />}
            {viewType === 'showComments' && (
                <Comments postId={postId} />
            )}
            {viewType === 'showSearch' && <SearchUsers />}
            {viewType === 'default' && <DefaultSidebar />}
        </>
    );
};

export default SideBar;

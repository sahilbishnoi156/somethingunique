import { RootState } from '@/app/store/store';
import { resetView } from '@/app/store/view-slice';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CreatePost from './feed/create-post';
import { X } from 'lucide-react';
import DefaultSidebar from './default-sidebar';

const Component2 = () => {
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
                <div>Showing comments for post ID: {postId}</div>
            )}
            {viewType === 'default' && <DefaultSidebar />}
        </>
    );
};

export default Component2;

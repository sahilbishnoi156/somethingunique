import { RootState } from '@/app/store/store';
import { resetView } from '@/app/store/view-slice';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CreatePost from '../feed/create-post';
import { X } from 'lucide-react';
import DefaultSidebar from '../default-sidebar';
import Comments from './show-comments';
import SearchUsers from './search-users';
import { Button } from '../ui/button';

const SideBar = () => {
    const { viewType, postId } = useSelector(
        (state: RootState) => state.view
    );
    const dispatch = useDispatch();

    return (
        <>
            {viewType !== 'default' && (
                <Button
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                    }}
                    size={'icon'}
                    className="z-50"
                    onClick={() => dispatch(resetView())}
                >
                    <X />
                </Button>
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

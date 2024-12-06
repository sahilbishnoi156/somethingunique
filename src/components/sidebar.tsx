import { increment, decrement } from '@/app/store/slice';
import { RootState } from '@/app/store/store';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

export function SideBar() {
    const count = useSelector(
        (state: RootState) => state.counter.value
    );
    const dispatch = useDispatch();

    return (
        <div>
            <div>
                <button
                    aria-label="Increment value"
                    onClick={() => dispatch(increment())}
                >
                    Increment
                </button>
                <span>{count}</span>
                <button
                    aria-label="Decrement value"
                    onClick={() => dispatch(decrement())}
                >
                    Decrement
                </button>
            </div>
        </div>
    );
}

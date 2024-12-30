import React from 'react';

export default function Loader({
    isLogo = false,
}: {
    isLogo?: boolean;
}) {
    return (
        <div>
            <div
                className={`"text-white" ${
                    isLogo ? 'three-body-slow' : 'three-body '
                }`}
            >
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
            </div>
        </div>
    );
}

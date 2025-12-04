import * as React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                url?: string;
                onLoad?: () => void;
                style?: React.CSSProperties;
            };
        }
    }
}

export {};

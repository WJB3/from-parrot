
import React from 'react';

/**
 * 兼容children
 * @param incomingchildren
 */
export default function toChildrenArray (incomingchildren: React.ReactNode) {
    const ret = [];

    if (!incomingchildren) {
        return [];
    }

    React.Children.forEach(incomingchildren, (c) => {
        ret.push(c);
    });

    return ret;
}

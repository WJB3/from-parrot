import React from 'react';

export default function useCenter (incomingCenter:undefined|boolean, internalCenter:boolean|undefined) {
    return React.useMemo(() => {
        if (incomingCenter) {
            return incomingCenter;
        }
        return internalCenter;
    }, [incomingCenter, internalCenter])
}

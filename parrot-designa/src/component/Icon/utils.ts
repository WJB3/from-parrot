import React from 'react';

export const svgBaseProps={
    width:"1em",
    height:"1em",
    fill:"currentColor"
} 



export function generate(node,key,rootProps){
    if(!rootProps){ 

        return React.createElement(
            node.tag,
            {
                key,
                ...node.attrs,
            },
            (node.children||[]).map((child,index)=>generate(child,`${key}-${node.tag}-${index}`))
        );
    }

    return React.createElement(
        node.tag,
        {
            key,
            ...node.attrs,
            ...rootProps
        },
        (node.children || []).map((child, index) => generate(child, `${key}-${node.tag}-${index}`)),
    )
}
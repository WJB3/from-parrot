export function getKey(key,pos){
    if(key!==null && key!==undefined){
        return key;
    }
    return pos;
}


export function convertDataToEntities(
    dataNodes
){
    const posEntities={};
    const keyEntities={};

    traverseDataNodes(
        dataNodes,
        (item)=>{
            const { node,index,pos,parentPos,key,level }=item;
            const entity={ node,index,pos,level,key };

            const mergedKey=getKey(key,pos);

            posEntities[pos]=entity;
            keyEntities[mergedKey]=entity;

            entity.parent=posEntities[parentPos];

            if(entity.parent){
                entity.parent.children=entity.parent.children || [];
                entity.parent.children.push(entity);
            }  
        }
    );

    return { 
        keyEntities
    }
}

export function getPosition(level,number){
    return `${level}-${number}`
}

export function traverseDataNodes(dataNodes,callback){

    function process(node,index,parent){
        
        const children=node?node.children:dataNodes;
        const pos=node?getPosition(parent.pos,index):"0"; 

        if(node){
            const info={
                key:getKey(node?.key,pos),
                pos:pos,
                level:parent.level+1,
                node:node,
                parentPos:parent.node?parent.pos:null,
                index:index
            }

            callback?.(info);
        }
        

        if(children){
            children.forEach((subNode,subIndex)=>{
                process(
                    subNode,
                    subIndex,
                    {
                        pos:pos,
                        node:node,
                        level:parent?parent.level+1:-1
                    }
                )
            })
        }

    }

    process(null);
}


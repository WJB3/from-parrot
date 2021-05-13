 
const imgUrl="http://yxs-zygl.oss-cn-beijing.aliyuncs.com/";
const fileUrl="http://yxs-zygl.oss-cn-beijing.aliyuncs.com/";


const OSS_IMAGE_BASE_URL="http://mec.hml-media.net/";

const OSS_FILE_BASE_URL="http://mec.hml-media.net/"

export function isImage(file){
    return !!['jpg', 'jpeg', 'png', 'gif'].some((item: string) => file.type.includes(item))
}

export function getUrl(file,url){  

    if(isImage(file)){//是图片
        return url.replace(imgUrl,'').replace(/\?uploadId=(.)*$/,"")
    }else{
        return url.replace(fileUrl,'').replace(/\?uploadId=(.)*$/,"")
    }
}

export function getImageUrl(file,url){   
    if(isImage(file)){//是图片
        return OSS_IMAGE_BASE_URL+url
    } else{
        return OSS_IMAGE_BASE_URL+url
    }
}

export function visibleToSuccess(url){   
    return url.replace(OSS_IMAGE_BASE_URL,``)
}

export function showImage(url){
    return OSS_IMAGE_BASE_URL+url
}
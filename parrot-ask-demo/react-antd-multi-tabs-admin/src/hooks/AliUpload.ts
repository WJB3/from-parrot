import React from 'react'
import AliOss from './AliOss'
import { message } from 'antd'
import moment from 'moment'

export default async function AliUpload(
    progressFn?: (arg0?: number) => void,
    uploadFile?: CommonObjectType,
    fileType?: string
) {

    const aliOssClient = await AliOss();

    const extraParams = {
        progress: (p: number) => {
            progressFn(p)
        }
    }
    // 要上传到oss上的路径
    const uploadPath = (path: string, file: CommonObjectType) => {
        console.log("uploadPath",`/${path}/${moment().format('YYYYMMDD')}/${+new Date()}.${file.type.split('/')[1]}`)
        return `/${path}/${moment().format('YYYYMMDD')}/${+new Date()}.${file.type.split('/')[1]}`
    }

    const uploadToOss = (path: string, file: CommonObjectType, extraParams: Object) => { 
        message.loading({ content: '上传中...', key: 'updatable', duration: 0 })
        const url:string = uploadPath(path, file) 
        return new Promise((resolve, reject) => {
            aliOssClient
                .multipartUpload(url, file, extraParams)
                .then((data: unknown) => {
                    resolve({data,customUrl:url})
                })
                .catch((error: unknown) => {
                    reject(error)
                })

        })
    }

    return uploadToOss(fileType, uploadFile, extraParams)

}
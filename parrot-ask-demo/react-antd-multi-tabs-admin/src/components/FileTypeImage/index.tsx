 
import React from 'react';
import style from './index.module.less';

const PDF_IMG=require('./PDF.png');
const PNG_IMG=require('./PNG.png');
const ZIP_IMG=require('./ZIP.png');
const MAP_IMG=require('./MP3.png');

const FileTypeImage=(props)=>{

    const {
        fileType='pdf'
    }=props;

    const mapImageUrl={
        'png':PNG_IMG,
        'image/png':PNG_IMG,
        'image/jpeg':PNG_IMG,
        'pdf':PDF_IMG,
        'application/pdf':PDF_IMG,
        'application/x-gzip':ZIP_IMG,
        'application/zip':ZIP_IMG,
        'video/mp3':MAP_IMG,
        'video/mp4':MAP_IMG,
    }

    return (
        <div className={style.fileTypeImage} >
            <img src={mapImageUrl[fileType]} />
        </div>
    )
}

export default FileTypeImage;
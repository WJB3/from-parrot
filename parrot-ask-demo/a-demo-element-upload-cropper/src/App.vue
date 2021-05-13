<template>
  <div id="app">
    <el-upload
      class="avatar-uploader"
      :http-request="uploadFile"
      action=""
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
      <div style="height: 500px; width: 500px">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :fixedBox="option.fixedBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :centerBox="option.centerBox"
          :high="option.high"
          :infoTrue="option.infoTrue"
          :maxImgSize="option.maxImgSize"
          :enlarge="option.enlarge"
          :mode="option.mode"
          :limitMinSize="option.limitMinSize"
          @realTime="realTime"
          @imgLoad="imgLoad"
          @cropMoving="cropMoving"
        ></vueCropper>
        <el-button @click="confirm">确定剪裁</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
function blobToFile(theBlob, fileName) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

import { VueCropper } from "vue-cropper";
import axios from "axios";
export default {
  data() {
    return {
      imageUrl: "",
      imgBlob: null,
      dialogVisible: false,
      downImg: "#",
      previewStyle1: {},
      previewStyle2: {},
      previewStyle3: {},
      previewStyle4: {},
      code0: "",
      code1: "",
      code2: "",
      code3: "",
      preview3: "",
      option: {
        img: "http://cdn.xyxiao.cn/Landscape_1.jpg",
        size: 1,
        full: false,
        outputType: "png",
        canMove: true,
        fixedBox: false,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 200,
        autoCropHeight: 150,
        centerBox: false,
        high: false,
        cropData: {},
        enlarge: 1,
        mode: "contain",
        maxImgSize: 3000,
        limitMinSize: [100, 120],
      },
    };
  },
  components: {
    VueCropper,
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    imgLoad(msg) {
      console.log(msg);
    },
    // 实时预览函数
    realTime(data) {
      var previews = data;
      var h = 0.5;
      var w = 0.2;

      this.previewStyle1 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: h,
      };

      this.previewStyle2 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: w,
      };

      this.previewStyle3 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: 100 / previews.w,
      };

      this.previewStyle4 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: 100 / previews.h,
      };

      this.previews = data;
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    cropMoving(data) {
      this.option.cropData = data;
    },
    confirm() {
      this.$refs.cropper.getCropBlob((data) => {
        console.log(data);

        var formData = new FormData(); 
        let newFile=new window.File([data], "083b64062157e7807b22f4ca86dd3836.jpeg", { type: data.type });
        newFile['uid'] = 1619539046358

        console.log("newFile",newFile);

        formData.append(
          "avatar",
          newFile,
          "test"
        );
        var configs = {
          headers: { "Content-Type": "multipart/form-data" },
        };

        axios
          .post(
            "https://www.mocky.io/v2/5cc8019d300000980a055e76",
            formData,
            configs
          )
          .then((res) => {
            console.log(res);
          });
        // this.downImg = window.URL.createObjectURL(data);
        // if (window.navigator.msSaveBlob) {
        //   var blobObject = new Blob([data]);
        //   window.navigator.msSaveBlob(blobObject, "demo.png");
        // } else {
        //   this.$nextTick(() => {
        //     this.$refs.downloadDom.click();
        //   });
        // }
      });
    },
    uploadFile(params) {
      console.log("uploadFile", params);

      this.option.img = window.URL.createObjectURL(params.file);
      // //console.log("imgBlob",this.option.img)

      this.dialogVisible = true;

      // const _file = params.file;
      // const isLt2M = _file.size / 1024 / 1024 < 2;

      console.log("000params.file00",params.file)
      // // 通过 FormData 对象上传文件
      var formData = new FormData();
      formData.append("avatar", params.file,params.file.name);

      var configs = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      axios
        .post(
          "https://www.mocky.io/v2/5cc8019d300000980a055e76",
          formData,
          configs
        )
        .then((res) => {
          console.log(res);
        });

      // if (!isLt2M) {
      //   this.$message.error("请上传2M以下的.xlsx文件");
      //   return false;
      // }

      // // 发起请求
      // RequestUploads(formData).then((res) => {
      //   console.log("_RequestUploads_", res);
      //   if (code === 2000) {
      //     this.$message({
      //       type: "success",
      //       message: res.msg,
      //     });

      //     // 隐藏弹出框
      //     this.importDialog = false;
      //   } else {
      //     this.$message({
      //       type: "warning",
      //       message: res.msg,
      //     });
      //   }
      // });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

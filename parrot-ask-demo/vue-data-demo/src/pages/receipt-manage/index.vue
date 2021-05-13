<template>
    <div class="home">
        <Tabbar title="收款管理" :leftArrow="true"/>
        <van-tabs>
            <van-tab title="支付宝">
                <van-field label="账号" placeholder="请输入账号" v-model="temp.aliname"/>
                <van-field label="昵称" placeholder="请输入昵称" v-model="temp.alino"/>
                <div class="tipTitle">收款码：</div>
                <van-uploader :after-read="afterRead" :accept="'image/*'" v-if="temp.aliqrcode">
                    <img class="cover" :src="temp.aliqrcode"/>
                </van-uploader>
                <van-uploader :after-read="afterRead" :accept="'image/*'" v-else>
                    <img class="cover" src="../../assets/images/loading.png"/>
                </van-uploader>
                <div class="tipTitle">上传二维码</div>
            </van-tab>
            <van-tab title="微信">
                <van-field label="账号" placeholder="请输入账号" v-model="temp.wxname"/>
                <van-field label="昵称" placeholder="请输入昵称" v-model="temp.wxno"/>
                <div class="tipTitle">收款码：</div>
                <van-uploader :after-read="afterRead1" :accept="'image/*'" v-if="temp.wxqrcode">
                    <img class="cover" :src="temp.wxqrcode"/>
                </van-uploader>
                <van-uploader :after-read="afterRead1" :accept="'image/*'" v-else>
                    <img class="cover" src="../../assets/images/loading.png"/>
                </van-uploader>
                <div class="tipTitle">上传二维码</div>
            </van-tab>
            <van-tab title="银行卡">
                <div class="card1">
                    <van-field label="开户银行" placeholder="请输入开户银行" v-model="temp.bankname"/>
                    <van-field label="开户支行" placeholder="请输入开户支行" v-model="temp.branch"/>
                    <van-field label="开户姓名" placeholder="请输入开户姓名" v-model="temp.cardname"/>
                    <van-field label="银行卡号" placeholder="请输入银行卡号" v-model="temp.cardno"/>
                </div>
            </van-tab>
        </van-tabs>
        <van-button class="button" :disabled="disabled" @click="submit()">提交</van-button>
    </div>
</template>

<script>
    import Vue from "vue";
    import {gathering, gatheringCommit, fileUpload} from "@/api/home";
    import axios from "axios";
    import Tabbar from "@/components/tabbar";

    export default {
        components: {Tabbar},
        created() {
            gathering().then(res => {
                this.temp = res;
                console.log(res.type);
                this.temp.aliqrcode = res.aliqrcode;
                this.temp.wxqrcode = res.wxqrcode;
                if (res.type == 1) {
                    this.disabled = false;
                } else if (res.type == 2) {
                    this.disabled = false;
                }
            });
        },
        data() {
            return {
                temp: {
                    aliname: "",
                    alino: "",
                    aliqrcode: "",
                    bankname: "",
                    branch: "",
                    cardname: "",
                    cardno: "",
                    wxname: "",
                    wxno: "",
                    wxqrcode: "",
                    type: ""
                },
                disabled: false
            };
        },
        mounted() {
        },
        methods: {
            afterRead(file) {
                let formData = new FormData();
                formData.append("image", file.file);
                fileUpload(formData).then(res => {
                    this.temp.aliqrcode = res.path;
                });
            },
            afterRead1(file) {
                let formData = new FormData();
                formData.append("image", file.file);
                fileUpload(formData).then(res => {
                    this.temp.wxqrcode = res.path;
                });
            },
            submit() {
                gatheringCommit(this.temp).then(res => {
                    this.$toast('编辑成功')
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .home {
        min-height: 640px;
        font-size: 14px;

        [class*="van-hairline"]::after {
            border: 0;
        }

        /deep/ .van-hairline--top-bottom::after {
            border: 0;
        }

        .van-cell {
            color: #333333;
            background: transparentf;
        }

        /deep/ .van-cell__value {
            input {
                // color: #f8f8f8;
            }
        }

        width: 100%;
        padding-bottom: 50px;

        .van-hairline--top-bottom::after {
            border: none;
        }

        /deep/ .van-tabs__line {
            background-color: #e56a17;
        }

        /deep/ .van-tabs {
            width: 100%;
        }

        /deep/ .van-tab {
            color: #e56a17;
            background: transparentf;
            border-bottom: 1px solid #ffffff;
        }

        .van-tabs__nav {
            width: 100%;
        }

        .button {
            width: 100%;
            height: 40px;
            text-align: center;
            color: #ffffff;
            position: fixed;
            bottom: 0;
            font-size: 18px;
            line-height: 40px;
            background: #fba318;
        }

        .tipTitle {
            margin: 15px 16px;
            color: #fff;
        }

        .card1 {
            overflow: hidden;
            width: 90%;
            border-radius: 10px;
            margin: 12px auto;

            .van-cell {
                width: 96%;
                color: black;
            }

            /deep/ .van-cell__value {
                input {
                    color: black;
                }
            }
        }

        .card {
            align-items: center;
            display: flex;
            width: 90%;
            height: 80px;
            border-radius: 10px;
            margin: 12px auto;
            background: #ffffff;

            .content {
                span {
                    margin-right: 15px;
                }

                display: flex;
                align-items: center;
            }
        }
    }

    .cover {
        width: 80px;
        height: 80px;
        margin-left: 15px;
        margin-bottom: 8px;
    }
</style>



// WEBPACK FOOTER //
// src/pages/receipt-manage/index.vue
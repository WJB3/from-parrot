<template>
    <div class="home">
        <van-nav-bar title="抢单池"/>
        <video id="video" style="display:none">
            <source :controls="controls" src="../assets/images/bird.mp3" hidden="true"/>
        </video>
        <div class="Grab-single">
            <div class="Grab-single-box" v-for="(grab,index) in grabData" :key="index">
                <img class="img-size" :src="grab.image" alt="鸟"/>
                <!-- <img class="img-size" src="../assets/images/rob/bird1.png" alt="鸟" /> -->
                <button class="btn" v-if="grab.status==1" @click="grabOrder(grab.id)">
                    <span>抢单预约</span>
                </button>
                <button :disabled="true" class="nopre" v-if="grab.status==2">
                    <span>不可预约</span>
                </button>
                <button class="grab" v-if="grab.status==3" @click="grabHandle(grab.id)">
                    <span>抢购</span>
                </button>
            </div>
        </div>
        <!-- 预约时间为：00：00-12：00 -->
        <p class="time">抢单池抢单</p>
        <div class="subscribe">
            <div class="subscribe-item pt-11-5" v-for="(order,index) in orderData" :key="index">
                <div class="phone">
                    <!-- <img src="../assets/images/rob/ion.png" alt /> -->
                </div>
                <span>{{order.member.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")}}</span>
                <span class="chivalrous">{{order.nick_name}}</span>
                <span>预约成功</span>
            </div>
        </div>
        <div class="box"></div>
        <van-dialog v-model="show">
            <img class="grabSuccess" src="../assets/images/success.gif" alt v-if="buyStatus==0"/>
            <img src="../assets/images/fail.gif" alt v-else-if="buyStatus==1"/>
            <p class="grabTip">{{tips}}</p>
        </van-dialog>
        <!--<Tabbar class="title" title="抢单池" />-->
        <!--<van-cell-group>-->
        <!--<van-cell title="收件箱" is-link :to="{name:'email',query:{id:0}}" />-->
        <!--<van-cell title="发件箱" is-link :to="{name:'email',query:{id:1}}" />-->
        <!--<van-cell title="系统公告" is-link to="article" />-->
        <!--</van-cell-group>-->
        <!--<van-cell title="修改二级密码" is-link to="index" v-show="false" />-->
        <div class="mask_noOpen" style="position: fixed;top: 0;right: 0;bottom: 1.1rem;left: 0; z-index: 9999;" @click="$toast('暂未开放')">

        </div>
    </div>
</template>

<script>
    // import Tabbar from "@/components/tabbar";
    import {grabList, grabOrderSubmit, grabSubmit} from "@/api/grab";
    import {Toast} from "vant";

    export default {
        created() {
            this.getList();
        },
        data() {
            return {
                grabData: null,
                orderData: null,
                autoplay: false,
                loop: false,
                controls: false,
                buyStatus: 0,
                tips: "",
                show: false
            };
        },
        mounted() {
        },
        methods: {
            getList() {
                grabList().then(resp => {
                    this.grabData = resp.pets;
                    this.orderData = resp.user;
                });
            },
            // 预约
            grabOrder(id) {
                grabOrderSubmit(id).then(resp => {
                    this.getList();
                });
            },
            // 抢购
            grabHandle(id) {
                var video = document.getElementById("video");
                video.controls = false;
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
                grabSubmit(id).then(res => {
                    if (res.errcode == 0) {
                        this.show = true;
                        this.tips = res.msg;
                        this.buyStatus = res.errcode;
                        this.getList();
                        video.pause();
                    } else {
                        Toast(res.msg);
                        this.getList();
                        video.pause();
                        this.buyStatus = 1;
                        this.show = true;
                        this.tips = res.msg;
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .home {
        font-size: 14px;
        color: c1c1c1;

        [class*="van-hairline"]::after {
            border: 0;
        }

        width: 100%;
        //background-image: url("../assets/images/rob/background.png");
        min-height: 640px;

        .van-cell {
            color: #312f34;
            background: #d0d9d8;
            border-bottom: 1px solid #333;
        }

        .tips {
            color: #f7f7f7;
            font-size: 18px;
            text-align: center;
            margin: 16px auto;
        }

        .van-cell-group {
            width: 96%;
            margin: 30px auto;
            border-radius: 4px;
            background: transparent;
            border: 1px solid transparent;

            .van-cell:nth-child(1) {
                border-radius: 4px 4px 0 0;
                border: 1px solid transparent;
                border-bottom: 1px solid #333;
            }

            .van-cell:nth-child(3) {
                border-radius: 0 0 4px 4px;
                border: 1px solid transparent;
            }
        }
    }

    .van-nav-bar__title {
        max-width: 100%;
    }

    .van-nav-bar {
        //background-image: url("../assets/images/rob/background.png");
        border-bottom: 1px solid #333;
    }

    .Grab-single {
        .Grab-single-box {
            width: 87px;
            display: inline-block;
            height: 118px;
            margin: 5.995% 4% 0.75% 4%;
            //background-image: url("../assets/images/rob/box.png");
            background-size: 100%;

            .img-size {
                width: 64.5px;
                padding: 11.5px 11.5px 16px 11.5px;
                height: 59px;
            }

            .btn {
                width: 76px;
                height: 23px;
                margin: 0 5px 8px 5.5px;
                font-size: 14px;
                font-weight: 500;
                color: rgba(255, 255, 255, 1);
                background-color: #f79510;
                border: none;
                border-radius: 3px;
                box-shadow: 3px 3px 3px #c1c1c1;
            }

            .nopre {
                width: 76.5px;
                height: 23px;
                margin: 0 5px 8px 5.5px;
                font-size: 14px;
                font-weight: 500;
                color: rgba(255, 255, 255, 1);
                background-color: #888888;
                border: none;
                border-radius: 3px;
                box-shadow: 3px 3px 3px #c1c1c1;
            }

            .grab {
                width: 76.5px;
                height: 23px;
                margin: 0 5px 8px 5.5px;
                font-size: 14px;
                font-weight: 500;
                color: rgba(255, 255, 255, 1);
                background-color: #f79510;
                border: none;
                border-radius: 3px;
                box-shadow: 3px 3px 3px #c1c1c1;
            }
        }
    }

    .time {
        margin: 41.5px 44.5px 0 44px;
        width: 286.5px;
        text-align: center;
        font-size: 15px;
        color: #fff;
    }

    .subscribe {
        width: 284.5px;
        height: 160.5px;
        background: rgba(236, 226, 201, 1);
        opacity: 0.91;
        border-radius: 14px;
        margin: 18px 46.5px 0 44px;

        .subscribe-item {
            display: flex;
            align-items: center;
            margin: 0 25px 0 25px;
            border-bottom: 1px solid;
            padding: 10px 0;

            .phone {
                img {
                    width: 26px;
                    height: 26px;
                    margin-right: 8.5px;
                }
            }

            .chivalrous {
                padding: 0 10px;
            }
        }
    }

    .pt-11-5 {
        padding-top: 11.5px;
    }

    .pb-11-5 {
    }

    .box {
        height: 51px;
        width: 100%;
        margin-bottom: 50px;
    }

    .grabSuccess {
        width: 100%;
        text-align: center;
    }

    .grabTip {
        width: 100%;
        text-align: center;
        margin-bottom: 20px;
    }
</style>



// WEBPACK FOOTER //
// src/pages/conditon.vue
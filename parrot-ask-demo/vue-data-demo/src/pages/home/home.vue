<template>
    <div class="home">
        <div class="test">
            <header>
                <div></div>
                <div>黄金鸟</div>
                <div class="sign" @click="signIn()">
                    签到
                    <img src="../../assets/images/homepages/calendar.png"/>
                </div>
            </header>
            <div class="box1"></div>
            <van-swipe :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="item in arrSlider" :key="item.num">
                    <img class="swiper" :src="item.image" alt/>
                </van-swipe-item>
            </van-swipe>
            <div class="content">
                <div class="content-item" v-if="sevenDay ==0">
                    <img class="flat-patternmaking" src="../../assets/images/homepages/birds1.png" alt/>
                    <div class="message">
                        <div class="variety">黄金鸟</div>
                        <div class="sign">连续签到七天即可免费领取一只黄金鸟</div>
                        <div>
                            宠物价值：
                            <span>{{goldData.start_price}}</span>
                        </div>
                        <div>
                            合约天数：
                            <span>{{goldData.day}}天/{{goldData.bonus_rate*100}}%</span>
                        </div>

                        <div>
                            已经连续签到：
                            <span>{{signDay}}天</span>
                        </div>
                    </div>
                    <!-- <van-button class="freeBtn">免费领取</van-button> -->
                </div>
                <div class="content-item-breed" v-for="(item,index) in arr" :key="index">
                    <img class="pet" :src="item.image" alt/>
                    <div class="breed-message">
                        <div class="breed-message-name">{{item.name}}</div>
                        <div class="details mb-1">
                            <span>价值</span>
                            <span>{{item.start_price}}-{{item.end_price}}</span>
                        </div>
                        <div class="details mb-1">
                            <span>预约时间</span>
                            <span>{{item.start_time}}-{{item.end_time}}</span>
                        </div>
                        <div class="details mb-1">
                            <span>商品收益</span>
                            <span>{{item.day}}天/{{item.bonus_rate*100}}%</span>
                        </div>
                        <div class="details mb-1">
                            <span>预约/即抢羽毛</span>
                            <span>{{item.appoint}}/{{item.purchase}}</span>
                        </div>
                        <div class="details mb-1">
                            <span>可挖HKT</span>
                            <span>{{item.coin_hkt}}</span>
                        </div>
                        <div class="details mb-1">
                            <span>可挖PHD</span>
                            <span>{{item.coin_phd}}</span>
                        </div>
                        <!--                        <div class="details mb-1" v-if="item.countDown.isCountDown">-->
                        <!--                            &lt;!&ndash;抢购倒计时 &ndash;&gt;-->
                        <!--                            <span>抢购倒计时</span>-->
                        <!--                            <span>{{item.countDown.isCountDownText}}</span>-->
                        <!--                        </div>-->
                    </div>
                    <button
                        v-if="!item.countDown.isCountDown"
                        class="btn"
                        :style="((item.isappoint==1&&item.state==1)&&'background:#ccc')||(item.state==1&&'background:#D65435')||(item.state==2&&'background:#21A4FF')||(item.state==3&&'background:#FF3318')"
                        :disabled="(item.state==2&&true)||(item.state==4&&true)||(item.state==1&&item.isappoint==1&&true)"
                        @click="change(item)"
                    >{{item.desc}}
                    </button>

                    <button class="btn" v-if="item.countDown.isCountDown" style="color: red;font-weight: 500;">
                        倒计时{{item.countDown.isCountDownText}}秒
                    </button>
                </div>
            </div>
        </div>
        <van-dialog
            class="stateTipBox"
            v-model="show"
            :show-confirm-button="false"
            :close-on-click-overlay="true"
        >
            <div @click="closeStateDialog()">
                <img class="grabSuccess" src="../../assets/images/success.gif" alt v-if="isFinish && isSuccessBuy"/>
                <img src="../../assets/images/fail.gif" alt v-if="isFinish && isSuccessBuy == false"/>
                <img src="../../assets/images/fail.gif" alt v-if="isFinish == false"/>
                <p class=" grabTip">{{tips}}</p>
            </div>
        </van-dialog>
        <!-- 最新公告 -->
        <van-dialog v-model="noticeShow" :show-cancel-button="false">
            <p style="color:#333333;padding:20px; line-height:1.5"
               v-html="noticeData.content ? noticeData.content : ''"></p>
        </van-dialog>
        <audio id="video" style="display:none">
            <source :controls="controls" src="../../assets/images/bird.mp3" :hidden="true"/>
        </audio>
    </div>
</template>

<script>
    import {Toast} from "vant";
    import {
        petList,
        noticeList,
        appoint,
        addOrder,
        bannerList,
        signConfirm,
        signCurDay
    } from "@/api/home";
    import Tabbar from "@/components/tabbar";

    var _this;
    export default {
        components: {Tabbar},
        data() {
            return {
                arr1: [],
                arr: [],
                arrSlider: [],
                noticeData: {},
                noticeShow: false,
                resSeconds: "",
                tips: "",
                buyStatus: 0,
                countDown: "",
                autoplay: false,
                loop: false,
                controls: false,
                signDay: 0,
                sevenDay: 0,
                goldData: {},
                //点击购买之后的弹窗
                show: false,
                //购买等待倒计时是否结束
                isFinish: false,
                //购买是否成功
                isSuccessBuy: false,
                //购买倒计时的时间
                second: 60,
                //倒计时实例
                timer: null
            };
        },
        watch: {
            show() {
                if (this.show == false) {
                    clearInterval(this.timer)
                    this.timer = null
                }
            }
        },
        created() {
            _this = this;
            this.getList();
            bannerList().then(res => {
                this.arrSlider = res;
            });
            signCurDay().then(res => {
                this.signDay = res.day;
            });
            if (localStorage.getItem("once") == 1) {
                noticeList({page: 1, pagesize: 10000}).then(res => {
                    if (res.data.length) {
                        this.noticeData = res.data[0];
                    } else {
                        this.noticeData = {}
                    }
                    this.noticeShow = true;
                    localStorage.setItem("once", 2);
                });
            }
        },
        mounted() {
        },
        methods: {
            signIn() {
                signConfirm().then(resp => {
                    this.signDay = resp.day;
                    if (resp.day == 7) {
                        this.sevenDay = 1;
                    }
                });
            },
            //转换时间
            getS(item) {
                let H = item.split(":")[0] * 3600;
                let M = item.split(":")[1] * 60;
                let S = item.split(":")[2];
                return Number(H) + Number(M) + Number(S);
            },
            getList() {
                // // 清除之前存在的计时器
                // this.arr.forEach(cat => {
                //     if (cat.outerTimer) {
                //         clearInterval(cat.outerTimer);
                //     }
                // });
                petList().then(res => {
                    this.goldData = res.data.splice(0, 1)[0];
                    // console.log(this.goldData);
                    res.data.forEach(function (item, index) {
                        item.countDown = {
                            isCountDown: false,
                            isCountDownText: ''
                        }
                    })
                    this.arr = res.data.splice(0);
                    console.log(this.arr);
                    _this.arr.forEach(function (item, index) {
                        if (parseFloat(item.start_time_strtotime) - 90 < parseFloat(res.time) && parseFloat(res.time) < parseFloat(item.start_time_strtotime)) {
                            console.log('列表有倒计时');
                            var needCountDown = parseFloat(item.start_time_strtotime) - parseFloat(res.time)
                            var timer = setInterval(function () {
                                needCountDown--
                                if (needCountDown != 0) {
                                    item.countDown = {
                                        isCountDown: true,
                                        isCountDownText: needCountDown
                                    }
                                } else {
                                    item.countDown = {
                                        isCountDown: false,
                                        isCountDownText: needCountDown
                                    }
                                    _this.getList()
                                    clearInterval(timer)
                                }
                            }, 1000)
                        }
                    })

                    // let curSeconds = this.getS(res.time);
                    // res.data.forEach(item => {
                    //     item.resSeconds = this.getS(item.start_time);
                    //     item.time = item.resSeconds - curSeconds;
                    //     if (item.time >= 0) {
                    //         item.outerTimer = setInterval(() => {
                    //             if (item.time <= 60 && item.time > 0) {
                    //                 item.desc = "抢购倒计时";
                    //                 item.isappoint = 1; //倒计时前一分钟禁用预约
                    //                 // item.desc = "抢购倒计时:" + Number(item.time) + "s";
                    //                 this.countDown = "抢购倒计时:" + Number(item.time) + "s";
                    //             }
                    //             if (item.time == 0) {
                    //                 clearInterval(item.outerTimer);
                    //                 item.outerTimer = null;
                    //                 item.desc = "抢购";
                    //                 this.countDown = "";
                    //                 item.state = 3;
                    //             }
                    //             item.time--;
                    //         }, 1000);
                    //     }
                    // });
                });
            },
            change(item) {
                if (item.state == 3) {
                    var video = document.getElementById("video");
                    video.controls = false;
                    // if (video.paused) {
                    //     video.play();
                    // } else {
                    //     video.pause();
                    // }
                    /**
                     * 清除上一次倒计时
                     */
                    clearInterval(this.timer)
                    _this.timer = null
                    _this.second = 60
                    _this.show = true
                    _this.isFinish = false
                    _this.tips = '等待中'
                    _this.isSuccessBuy = false
                    /**
                     * 开启倒计时
                     */
                    _this.timer = setInterval(function () {
                        _this.second = _this.second - 1
                        if (_this.second == 0) {
                            clearInterval(_this.timer)
                            _this.timer = null
                            _this.isFinish = true
                            /**
                             * 倒计时结束后添加订单
                             */
                            addOrder({type: item.id})
                                .then(res => {
                                    console.log(res);
                                    if (res.errcode == 0) {
                                        /**
                                         * 添加订单成功
                                         */
                                        _this.isSuccessBuy = true
                                        _this.tips = res.msg;
                                        _this.getList();
                                        video.play();
                                        setTimeout(function () {
                                            video.pause();
                                        }, 5000)
                                    } else {
                                        /**
                                         * 添加订单失败
                                         */
                                        _this.isSuccessBuy = false
                                        _this.$toast(res.msg)
                                        _this.getList();
                                        _this.tips = res.msg;
                                        video.play();
                                        _this.show = false
                                        setTimeout(function () {
                                            video.pause();
                                        }, 5000)
                                    }
                                })
                                .catch(err => {
                                });
                        }
                    }, 1000)


                } else {
                    appoint({type: item.id}).then(res => {
                        Toast("预约成功");
                        this.getList();
                    });
                }
            },
            // getList() {
            //   petList().then(res => {
            //     this.arr = res.data;
            //     for (let i in res.data) {
            //       res.data[i].numCount = [];
            //       res.data[i].numCount.length = res.data[i].id;
            //     }
            //   });
            // },
            // change(item) {
            //   if (item.state == 3) {
            //     addOrder({ type: item.id }).then(res => {
            //       Toast("抢购成功");
            //       this.getList();
            //     });
            //   } else {
            //     appoint({ type: item.id }).then(res => {
            //       Toast("预约成功");
            //       this.getList();
            //     });
            //   }
            // },
            onClickLeft() {
                Toast("返回");
            },
            onClickRight() {
                Toast("按钮");
            },
            closeStateDialog() {
                this.show = false;
            }
        }
    };
</script>
<style lang="less" scoped>
    .home {
        font-size: 12px;
        color: white;
        min-height: 650px;
        /*background-image: url("../../assets/images/homepages/background.png");*/

        [class*="van-hairline"]::after {
            border: 0;
        }

        .van-swipe {
            width: 100%;
            height: 150px;
        }

        .bannerBg {
            height: 150px;
            position: relative;
            text-align: center;
            padding-top: 17px;
            color: #f7f7f7;
            font-size: 18px;

            p {
                position: absolute;
                z-index: 2;
                top: 8%;
                left: 50%;
                transform: translateX(-50%);
            }

            img {
                width: 100%;
                height: 156px;
                position: absolute;
                left: 0;
                top: 0;
                z-index: 1;
            }

            .van-swipe {
                width: 340px !important;
                position: absolute;
                top: 10px;
                left: 0;
                right: 0;
                z-index: 999;
                margin: 0 auto;
                width: 100%;
            }
        }

        .goods-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin: 0 2%;
            text-align: center;

            li {
                width: 49%;
                background: #fff;
                color: #333;
                margin-top: 10px;
                border-radius: 8px;

                .content-chunk {
                    text-align: left;
                    padding: 0 3px;
                }

                .pet-img {
                    text-align: center;

                    img {
                        width: 64px;
                        height: 49px;
                    }
                }

                .image {
                    width: 115px;
                    display: inline-block;
                }

                .button {
                    font-size: 16px;
                    width: 148px;
                    margin-top: 12px;
                    margin-bottom: 20px;
                    text-align: center;
                    line-height: 30px;
                    height: 30px;
                    background: #4b8c28;
                    border: none;
                    border-radius: 20px;
                    color: #fff;
                }

                .content-chunk {
                    margin-top: 25px;
                }

                div {
                    margin-top: 10px;
                }

                .top {
                    margin-top: 20px;
                    font-size: 16px;
                    color: #ebb205;
                    font-weight: 600;
                }
            }
        }

        .starIcon img {
            width: 9px;
            height: 9px;
        }

        .rightEl {
            font-weight: 600;
            float: right;
        }
    }

    header {
        position: fixed;
        background-image: url("../../assets/images/homepages/background.png");
        width: 100%;
        top: 0;
        z-index: 9999;
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 56px;
        border-bottom: 1px solid #aaa;
        font-size: 18px;
        color: #000000;
        padding-left: 20px;

        .sign {
            display: flex;
            align-items: center;
            font-size: 15px;

            img {
                width: 17.5px;
                height: 18.5px;
                margin-left: 8px;
            }
        }

        .box {
            margin-left: 10px;
            width: 49px;
            height: 18.5px;
        }
    }

    .box1 {
        height: 56px;
    }

    .box2 {
        height: 51px;
        margin-top: 15px;
    }

    .swiper {
        max-width: 100%;
    }

    .content {
        width: 345px;
        height: 141px;
        margin: auto;

        .content-item {
            display: flex;
            background: rgba(66, 66, 66, 1);
            font-size: 14.1px;
            opacity: 0.7;
            border-radius: 19px;
            margin-top: 10px;

            .flat-patternmaking {
                width: 119.5px;
                height: 107px;
                margin: 16px 9.5px 18px 7.5px;
            }

            .message {
                padding-bottom: 10px;
                line-height: 1.5;

                .variety {
                    margin: 15px 0 16.5px 6px;
                    width: 89px;
                    height: 16.5px;
                    font-size: 17px;
                    color: #f6b43a;
                }

                .sign {
                    width: 165px;
                    margin-bottom: 13px;
                    line-height: 1.3;
                }
            }
        }
    }

    .btn {
        width: 30px;
        height: 105px;
        margin: 18px 7.5px 18px 9px;
        background: rgba(167, 167, 167, 1);
        border-radius: 30px;
        border: none;
        font-size: 17px;
    }

    .freeBtn {
        width: 30px;
        height: 105px;
        margin: 18px 9px;
        background: rgba(167, 167, 167, 1);
        border-radius: 30px;
        border: none;
        font-size: 17px;
        line-height: 0.5rem;
    }

    .content-item-breed {
        display: flex;
        justify-content: space-between;
        width: 345px;
        height: 185px;
        margin: 9.5px auto 0 auto;
        background: rgba(66, 66, 66, 1);
        font-size: 11px;
        opacity: 0.7;
        border-radius: 19px;

        .pet {
            width: 119.5px;
            height: 119px;
            margin: 18px 7px 4px 11px;
        }

        .breed-message {
            .breed-message-name {
                width: 160px;
                height: 16px;
                color: #f6b43a;
                font-size: 17px;
                margin: 13px 0 12.5px 0;
            }

            .details {
                width: 160px;

                span:first-child {
                    margin: 0 10px 0 0;
                }
            }

            .mb-1 {
                margin-bottom: 9.5px;
            }
        }
    }

    .content-item-breed:last-child {
        margin-bottom: 100px;
    }

    .grabTip {
        width: 100%;
        text-align: center;
        margin: 15px 0;
        color: #ffffff;
    }

    .grabSuccess {
        width: 100%;
        text-align: center;
    }

    .stateTipBox {
        background-color: rgba(255, 255, 255, 0);
    }

    /deep/ .van-button--danger {
        width: 100%;
        color: #fff;
        background-color: #ff6d00;
    }
</style>



// WEBPACK FOOTER //
// src/pages/home/home.vue
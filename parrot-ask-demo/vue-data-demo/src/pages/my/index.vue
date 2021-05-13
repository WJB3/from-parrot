<template>
    <div class="home">
        <Tabbar title="个人中心"/>
        <div class="content">
            <div class="header">
                <div class="header-message">
                    <div class="header-user-name">
                        <span style="color:#fba318;">{{item.rank_name}}:</span>
                        <small>{{item.nick_name}}</small>
                    </div>
                    <img src="@/assets/images/me/set.png" width="25px" @click="go('setting')"/>
                    <div>
                        <span>ID/手机：{{item.phone}}</span>
                    </div>
                </div>
            </div>
            <div class="myTop">
                <div class="card">
                    <div style="display: flex;justify-content: space-around;">
                        <div class="a" @click="go('feed')">
                            <div>{{item.pet}}</div>
                            <div>羽毛</div>
                        </div>
                        <div class="a">
                            <div>{{item.hkt}}</div>
                            <div>HKT</div>
                        </div>
                        <div class="a">
                            <div>{{item.phd}}</div>
                            <div>PHD</div>
                        </div>
                    </div>
                    <div style="display: flex;justify-content: space-around;">
                        <div class="a">
                            <div>{{item.property}}</div>
                            <div>总资产</div>
                        </div>
                        <div class="a">
                            <div>{{item.add_income}}</div>
                            <div>累计收益</div>
                        </div>
                        <div class="a" @click="go('dynamic')">
                            <div>{{item.income}}</div>
                            <div>动态收益</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card" style="width:92%;">
                <div
                    style="display: flex;justify-content: space-between;width:100%;margin:0 auto"
                    class="my-item"
                >
                    <div class="a" @click="go('adopt-record')">
                        <img class="icon-size" src="../../assets/images/me/adopt.png" alt/>
                        <div>领养记录</div>
                    </div>
                    <div class="a" @click="go('tranform-record')">
                        <img class="icon-size" src="../../assets/images/me/shift.png" alt/>
                        <div>转让记录</div>
                    </div>
                    <div class="a" @click="go('appointment-record')">
                        <img class="icon-size" src="../../assets/images/me/subscribe.png" alt/>
                        <div>预约记录</div>
                    </div>
                </div>
            </div>

            <!-- 底部 -->
            <div class="cards" style="width:92%;">
                <div style="display: flex;justify-content: space-between;width:100%;" class="my-item">
                    <div class="a" @click="go('safe')">
                        <div class="imgWarp">
                            <img class="icon-size-1" src="../../assets/images/me/safety.png" alt/>
                        </div>
                        <div>安全中心</div>
                    </div>
                    <div class="a" @click="go('infoReal')">
                        <div class="imgWarp">
                            <img class="icon-size-2" src="../../assets/images/me/authentication.png" alt/>
                        </div>
                        <div>实名认证</div>
                    </div>
                    <div class="a" @click="go('receipt-manage')">
                        <div class="imgWarp">
                            <img class="icon-size-3" src="@/assets/images/me/proceeds.png"/>
                        </div>
                        <div>我的银行卡</div>
                    </div>
                </div>
                <div style="display: flex;justify-content: space-between;" class="my-item">
                    <div class="a" @click="go('teamDetail')">
                        <div class="imgWarp">
                            <img class="icon-size-4" src="@/assets/images/me/item.png"/>
                        </div>
                        <div>我的团队</div>
                    </div>
                    <div class="a" @click="go('popularize')">
                        <div class="imgWarp">
                            <img class="icon-size-5" src="@/assets/images/me/invite.png"/>
                        </div>
                        <div>邀请码</div>
                    </div>
                    <div class="a" @click="go('exchange')">
                        <div class="imgWarp">
                            <img class="icon-size-6" src="@/assets/images/me/conversion.png"/>
                        </div>
                        <div>兑换</div>
                    </div>
                </div>
                <!-- <div style="display: flex;justify-content: space-between;" class="my-item">
                  <div class="a" @click="go('billMange')">
                    <img src="@/assets/images/my/9.png" width="21px" />
                    <div>账单流水</div>
                  </div>
                </div>-->
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from "vue";
    import {userInfo, userAccount, totalComein} from "@/api/home";
    import axios from "axios";
    import Tabbar from "@/components/tabbar";

    export default {
        components: {Tabbar},
        created() {
            userAccount().then(res => {
                this.item = res;
            });
        },
        data() {
            return {
                item: {}
            };
        },
        mounted() {
        },
        methods: {
            go(res) {
                this.$router.push({name: res});
            }
        }
    };
</script>

<style lang="less" scoped>
    .home {
        .content {
            margin: 0 auto;

            .header {
                width: 92%;
                height: 50px;
                margin: 0 auto;
                color: #333;
                font-size: 14px;
                position: relative;

                .header-message {
                    margin: 0 5px;
                }

                img {
                    position: absolute;
                    top: 0;
                    right: 0;
                }

                div {
                    margin-top: 15px;
                }
            }
        }

        margin-bottom: 48px;
        font-size: 14px;
        color: white;

        [class*="van-hairline"]::after {
            border: 0;
        }

        width: 100%;
        min-height: 640px;

        .van-cell {
            width: 100%;
            background: transparent;
        }

        .submit {
            border: none;
            background: #fba318;
            display: block;
            border-radius: 4px;
            margin: 100px auto;
            width: 90%;
            height: 40px;
        }

        .card:nth-child(0) {
            margin-top: 32px;
        }

        .card {
            padding: 15px 0;

            .a {
                img {
                    width: 25px;
                    height: 24.5px;
                }

                // .icon-size-1 {
                //   width: 25px;
                //   height: 24.5px;
                // }

                // .icon-size-2 {
                //   width: 30px;
                //   height: 22px;
                // }

                // .icon-size-3 {
                //   width: 30px;
                //   height: 23px;
                // }
                // .icon-size-4 {
                //   width: 28px;
                //   height: 24px;
                // }
                // .icon-size-5 {
                //   width: 30px;
                //   height: 30px;
                // }
                // .icon-size-6 {
                //   width: 28.5px;
                //   height: 28.5px;
                // }
                div {
                    margin-top: 12px;

                    &:first-child {
                        color: #fba318;
                        font-size: 18px;
                    }
                }

                width: 100px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            background: #838383;
            margin: 15px auto;
            width: 100%;
            opacity: 0.6;
            font-size: 17px;
            color: #333;
            border-radius: 10.5px;
        }

        //底部
        .cards {
            padding: 15px 0;
            font-size: 17px;
            color: #333;

            .a {
                // .icon-size {
                //   width: 25px;
                //   height: 24.5px;
                // }
                div {
                    margin-top: 12px;

                    &:first-child {
                        color: #fba318;
                        font-size: 18px;
                    }
                }

                .icon-size-1 {
                    width: 25px;
                    height: 24.5px;
                }

                .icon-size-2 {
                    width: 30px;
                    height: 22px;
                }

                .icon-size-3 {
                    width: 30px;
                    height: 23px;
                }

                .icon-size-4 {
                    width: 28px;
                    height: 26px;
                }

                .icon-size-5 {
                    width: 26px;
                    height: 26px;
                }

                .icon-size-6 {
                    width: 26px;
                    height: 26px;
                }

                width: 100px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            margin: 15px auto;
            width: 100%;
            border-radius: 10.5px;
        }

        .my-item {
            background-size: 100% 100%;
            margin-bottom: 51px;
        }

        .myTop {
            .card {
                width: 92%;
                background: #838383;
                opacity: 0.6;
                border-radius: 10.5px;
                font-size: 17px;
                color: #333;
            }
        }

        // .imgWarp {
        //   height: 24px;

        //   img {
        //     display: inline;
        //     width: 26px;
        //     height: 30px;
        //     vertical-align: middle;
        //   }
        // }
    }

    .header-user-name {
        font-size: 18px;
    }
</style>



// WEBPACK FOOTER //
// src/pages/my/index.vue
<template>
    <div class="home">
        <van-nav-bar :title="statue?'添加':'编辑'" left-arrow @click-left="go()"></van-nav-bar>
        <div class="card">
            <van-cell-group>
                <van-field v-model="temp.name" label="客户姓名" placeholder="请输入客户姓名"/>
                <van-field v-model="temp.phone" label="手机号码" placeholder="请输入手机号码"/>
                <van-field v-model="temp.remarks" label="填写备注" placeholder="请输入填写备注"/>
                <van-field v-model="temp.visit_time" label="来访时间" placeholder="请输入来访时间"/>
                <div style="margin:0 15px;display:flex;width:91%;height:50px;line-height:50px;">
                    <div style="font-size:15px">选择分类：</div>
                    <div
                        style="margin-left:20px;font-size:15px"
                        @click="show=true;showFirst=false"
                    >{{showFirst?"请选择地址":category}}
                    </div>
                    <van-action-sheet
                        :close-on-click-overlay="false"
                        v-model="show"
                        :actions="option1"
                        @select="onSelect"
                    />
                </div>
            </van-cell-group>
        </div>
        <button class="button" @click="add()">确定</button>
    </div>
</template>

<script>
    import Vue from "vue";
    import axios from "axios";
    import {dealCustomer, initCustomer, newCustomerList} from "@/api/index";
    import {Card, Loading} from "vant";

    Vue.component(Card.name, Card);
    Vue.component(Loading.name, Loading);
    import {Waterfall} from "vant";

    export default {
        data() {
            return {
                category: '',
                showFirst: true,
                show: false,
                option1: [],
                statue: true,
                temp: {},
                arr: [1, 2, 3],
                slides: [1, 2, 3]
            };
        },
        mounted() {
        },
        created() {
            this.statue = this.$route.params.statue;
            if (!this.statue) {
                this.showFirst = false;
                initCustomer({id: this.$route.params.id}).then(res => {
                    this.temp = res.result.info;
                    res.result.categoryInfo.forEach(resp => {
                        if (resp.id == res.result.info.category_id) {
                            this.category = resp.cate_name;
                        }
                    })
                });
            }
            newCustomerList({category_id: 0, pageindex: 1, pagesize: 10000}).then(
                res => {
                    this.option1 = res.result.categoryArr;
                    this.option1.forEach(res => {
                        res.name = res.cate_name;
                        res.id = res.id;
                    });
                }
            );
        },
        methods: {
            onSelect(item) {
                this.category = item.name;
                this.temp.category_id = item.id;
                this.show = false;
            },
            add() {
                if (this.statue == false) {
                    dealCustomer({...this.temp, id: this.$route.params.id}).then(res => {
                        this.$router.push({
                            name: "client-detail",
                            params: {
                                id: this.$route.params.id
                            }
                        });
                    });
                } else {
                    dealCustomer({...this.temp, id: 0}).then(res => {
                        this.$router.push({name: "client"});
                    });
                }
            },
            go(res) {
                if (this.statue == true) {
                    this.$router.push({name: "client"});
                } else if (this.statue == false) {
                    this.$router.push({
                        name: "client-detail",
                        params: {
                            id: this.$route.params.id
                        }
                    });
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .home {
        .button {
            width: 76%;
            height: 0.7rem;
            background: #eba436;
            border-radius: 0.3rem;
            border: none;
            color: white;
            font-size: 14px;
            display: block;
            margin: 0 auto;
            margin-top: 0.5rem;
        }

        .card {
            margin: 20px auto;
            width: 90%;
            background: white;
            border-radius: 0.3rem;
            overflow: hidden;
        }

        .van-nav-bar {
            width: 100%;
        }

        font-size: 12.5px;

        [class*="van-hairline"]::after {
            border: 0;
        }

        .van-nav-bar {
            background: #eba436;
        }

        .van-nav-bar__title {
            color: #f8f8f8;
        }

        .van-nav-bar__text {
            color: #f8f8f8;
        }

        .van-nav-bar .van-icon {
            color: #f8f8f8;
        }

        .van-cell__title {
            margin-left: 0.7rem;
        }
    }
</style>



// WEBPACK FOOTER //
// src/pages/client/add.vue
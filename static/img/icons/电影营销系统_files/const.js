/**
 * @file   一些常量
 * @author zhangzhiqiang<zhangzhiqiang04@baidu.com>
 */

define(function (require) {

    var validStatusText = '有效';
    var invalidStatusText = '暂停';
    var planTotalBudgetLess = '计划总预算不足';
    var planDailyBudgetLess = '计划日预算不足';
    var actTotalBudgetLess = '活动总预算不足';
    var actDailyBudgetLess = '活动日预算不足';
    var planStop = '计划暂停';
    var actStop = '活动暂停';
    var startStatusText = '开启';
    var stopStatusText = '暂停';
    var abandonText = '已废弃';

    var constant = {
        LOCAL_BRAND_LIST_NAME: 'localBrandList',
        LOCAL_MOVIE_LIST_NAME: 'localMovieList',
        LOCAL_CITY_LIST_NAME: 'localCityList',
        LOCAL_NUOMI_CITY_LIST_NAME: 'localNuomiCityList',
        UNLIMIT_WORDS: '不限',
        LARGE_DIALOG_WIDTH: 1000,
        MIDDLE_DIALOG_WIDTH: 800,
        SMALL_DIALOG_WIDTH: 500,
        DIALOG_TOP: 100,
        // 金额不限时RD传的值
        UNLIMIT_MONEY_NUM: 21474836.47,

        // 票量不限时RD传的值
        UNLIMIT_TICKET_NUM: 2147483647,

        // 金额验证正则
        MONEY_REG: /^(([1-9]\d{0,8}(\.\d{1,2})?)|(0\.\d{1,2}))?$/,
        // 票量验证正则
        TICKET_REG: /^([1-9]\d{0,8})?$/,
        // 折扣验证正则
        RATIO_REG: /^((([1-9]\d?)?)|100)$/,
        // 优先级验证规则
        PRIORITY_REG: /^[1-9]\d{0,8}$/,

        // 手机号正则
        PHONE_REG: /^1[3|4|5|7|8][0-9]\d{4,8}$/,

        // 邮箱正则
        EMAIL_REG: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
        /* eslint-disable */
        // 广告位图片上传校验
        AD_PIC_REG: /((bs|map|imgsrc|(boscdn\.bpc)|([a-z]\.hiphotos)|(m\.dianying))\.baidu\.com)|(wa1\.baidu\-1img\.cn)|(S2\.nuomi\.bdimg\.com)|(timg01\.baidu\-img\.cn)|(gss0\.baidu\.com)/,

        // 广告位url域名限制
        AD_URL_REG: /^(((baihuo|http|ftp|https):\/\/)?([\w\-_]+(\.[\w\-_]+)*([\w\-\.,@?^=%&amp;:/~\+#!|]*[\w\-\@?^=%&amp;/~\+#!|])?)?)$|^(\d+)$/,

        // 短信内容链接限制
        PROMOTION_SMS_URL_REG: /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/,
        /* eslint-enable */

        servicesMap: {
            promotionsmslist: 'MERCHANT_MARKETING',
            mervouchernewlist: 'MERCHANT_MARKETING'
        },
        rules: {
            couponBindUserGroupRule: null,
            userGroupRule: null,
            channelRule: null,
            perUserAttendNumRule: null,
            movieWhiteRule: null,
            cinemaWhiteRule: null,
            sceneIdWhiteRule: null,
            showTimeWhiteRule: null,
            cinemaAndSceneBlackRule: null,
            payTypeRule: null,
            ipRule: null,
            antiCheatRule: null,
            versionRule: null,
            memberUserRule: null,
            hallWhiteRule: null,
            venue: null
        },
        rulesMap: {
            couponBindUserGroupRule: '领取用户群',
            userGroupRule: '用户群',
            channelRule: '渠道',
            minFlowRule: '小流量关联ID',
            perUserAttendNumRule: '单用户参与次数',
            movieWhiteRule: '影片白名单',
            movieBlackRule: '影片黑名单',
            cinemaWhiteRule: '影院白名单',
            sceneIdWhiteRule: '场次白名单',
            showTimeWhiteRule: '场次白名单',
            sceneWhiteRule: '场次白名单',
            cinemaAndSceneBlackRule: '影院及场次黑名单',
            payTypeRule: '支付方式',
            ipRule: 'IP段设置',
            antiCheatRule: '反作弊策略',
            versionRule: '场次类型',
            couponBindRule: '绑定限制',
            couponDeductRule: '订单抵扣条件',
            memberUserRule: '用户群',
            theaterIdWhiteRule: '影厅白名单',
            theaterIdBlackRule: '影厅黑名单',
            venue: '场馆白名单',
            memberCinemaRule: '会员影院'
        },
        showRulesMap: {
            showType: '选座/非选择',
            showCouponBindUserGroupRule: '用户群',
            channelRule: '渠道',
            showThirdFrom: '票品来源',
            category: '票品类目',
            showProduct: '票品白名单',
            venue: '场馆白名单',
            minFlowRule: '小流量关联ID',
            perUserAttendNumRule: '单用户参与次数',
            movieWhiteRule: '影片白名单',
            cinemaWhiteRule: '影院白名单',
            sceneIdWhiteRule: '场次白名单',
            showTimeWhiteRule: '场次白名单',
            sceneWhiteRule: '场次白名单',
            cinemaAndSceneBlackRule: '影院及场次黑名单',
            payTypeRule: '支付方式',
            ipRule: 'IP段设置',
            antiCheatRule: '反作弊策略',
            versionRule: '场次类型',
            couponBindRule: '绑定限制',
            couponDeductRule: '订单抵扣条件',
            memberUserRule: '用户群',
            theaterIdWhiteRule: '影厅白名单',
            theaterIdBlackRule: '影厅黑名单',
            priceIdWhiteRule: '票价白名单'
        },

        VALID_STATUS_TEXT: validStatusText,
        INVALID_STATUS_TEXT: invalidStatusText,
        PLAN_TOTAL_BUDGET_LESS: planTotalBudgetLess,
        ACT_TOTAL_BUDGET_LESS: actTotalBudgetLess,
        ACT_DAILY_BUDGET_LESS: actDailyBudgetLess,
        ACT_STOP: actStop,
        START_STATUS_TEXT: startStatusText,
        STOP_STATUS_TEXT: stopStatusText,
        ABANDON_STATUS_TEXT: abandonText,

        couponGlobalConfigTab: [
            {
                name: '自定义影院',
                className: 'globalconfig',
                url: '#/couponglobalconfig~parentpanel=voucher'
            },
            {
                name: '自定义影片',
                className: 'globalconfigmovie',
                url: '#/couponglobalconfigmovie~parentpanel=voucher'
            }
        ],
        actGlobalConfigTab: [
            {
                name: '自定义影院',
                className: 'globalconfig',
                url: '#/actglobalconfig~parentpanel=marketing'
            },
            {
                name: '自定义影片',
                className: 'globalconfigmovie',
                url: '#/actglobalconfigmovie~parentpanel=marketing'
            }
        ],
        planStatusData: [
            {
                name: '全部',
                value: '0'
            },
            {
                name: validStatusText,
                value: 1
            },
            {
                name: invalidStatusText,
                value: 2
            },
            {
                name: planDailyBudgetLess,
                value: 3
            },
            {
                name: planTotalBudgetLess,
                value: 4
            },
            {
                name: abandonText,
                value: 5
            }
        ],
        adPosStatusData: [
            {
                name: '全部',
                value: ''
            },
            {
                name: validStatusText,
                value: 'available'
            },
            {
                name: invalidStatusText,
                value: 'pause'
            }
        ],
        prizePlanStatusData: [
            {
                name: '全部',
                value: ''
            },
            {
                name: validStatusText,
                value: 'NORMAL'
            },
            {
                name: invalidStatusText,
                value: 'PAUSE'
            }
        ],
        prizeListStatusData: [
            {
                name: '全部',
                value: ''
            },
            {
                name: validStatusText,
                value: 'NORMAL'
            },
            {
                name: invalidStatusText,
                value: 'PAUSE'
            }
        ],
        adContentStatusData: [
            {
                name: '全部',
                value: ''
            },
            {
                name: '有效',
                value: '1'
            },
            {
                name: '暂停',
                value: '2'
            },
            {
                name: '运营位暂停',
                value: '3'
            },
            {
                name: '关联下线',
                value: '4'
            }
        ],
        adContentDisplayStatus: [
            {
                name: '全部',
                value: ''
            },
            {
                name: '展现',
                value: 'true'
            },
            {
                name: '不展现',
                value: 'false'
            }
        ],
        adContentTimeLabel: [
            {
                name: '全部',
                value: ''
            },
            {
                name: '未开始',
                value: '1'
            },
            {
                name: '进行中',
                value: '2'
            },
            {
                name: '已过期',
                value: '3'
            }
        ],
        adContentTmsStrategyType: [
            {
                name: '全部',
                value: ''
            },
            {
                name: '活动',
                value: '1'
            },
            {
                name: '预售',
                value: '2'
            },
            {
                name: '专题',
                value: '3'
            },
            {
                name: '无',
                value: '0'
            }
        ],
        adPosContentType: [
            {
                name: '全部',
                value: ''
            },
            {
                name: '图片',
                value: 'image'
            },
            {
                name: '文字',
                value: 'text'
            },
            {
                name: 'CMS',
                value: 'CMS'
            }
        ],
        adPosChannel: [
            {
                name: '全部',
                value: ''
            },
            {
                name: '糯米_NA',
                value: 'newnuomi_pc'
            },
            {
                name: '手百',
                value: 'wise'
            }
        ],
        actTimeTagData: [
            {
                name: '全部',
                value: '0'
            },
            {
                name: '未开始',
                value: 1
            },
            {
                name: '进行中',
                value: 2
            },
            {
                name: '已过期',
                value: 3
            }
        ],
        actStatusData: [
            {
                name: '全部',
                value: '0'
            },
            {
                name: validStatusText,
                value: 1
            },
            {
                name: invalidStatusText,
                value: 2
            },
            {
                name: planStop,
                value: 3
            },
            {
                name: planTotalBudgetLess,
                value: 4
            },
            {
                name: planDailyBudgetLess,
                value: 5
            },
            {
                name: actTotalBudgetLess,
                value: 6
            },
            {
                name: actDailyBudgetLess,
                value: 7
            },
            {
                name: abandonText,
                value: 8
            }
        ],
        couponBindUserGroupRule: [
            {
                name: '电影新糯米老',
                value: 'newMovieUser'
            },
            {
                name: '电影老',
                value: 'oldMovieUser'
            },
            {
                name: '电影新糯米新',
                value: 'newPlatformUser'
            }
        ],
        userGroupRule: [
            {
                name: '平台新用户(无团购+订座)',
                value: 'newPlatformUser'
            },
            {
                name: '电影新用户(无订座)',
                value: 'newMovieUser'
            },
            {
                name: '新增电影老用户(有订座)',
                value: 'oldMovieUser'
            }
        ],
        showCouponBindUserGroupRule: [
            {
                name: '演出新糯米老',
                value: 'newShowUser'
            },
            {
                name: '演出老',
                value: 'oldShowUser'
            },
            {
                name: '演出新糯米新',
                value: 'newPlatformUser'
            }
        ],
        showChannelRule: [
            {
                name: '糯米_NA',
                value: 'NUOMI_NA'
            },
            {
                name: 'WEBAPP',
                value: 'NUOMI_WEBAPP'
            },
            {
                name: '手百',
                value: 'WISE_LIGHTAPP'
            }
        ],
        memberCinemaRule: [
            {
                name: '权益卡影院',
                value: 'EQUITY_CARD',
                tip: '支持使用权益卡的影院（所有卡模板关联影院去除储值卡影院和下线会员卡的影院，注：包含卡停售影院）'
            },
            {
                name: '储值卡影院',
                value: 'STORED_CARD',
                tip: '支持使用储值卡的影院（所有卡模板关联影院去除权益卡影院和下线会员卡的影院，注：包含卡停售影院）'
            }
        ],
        payTypeRule: [
            {
                name: '支持代金券',
                value: 'voucher'
            },
            {
                name: '支持糯米红包',
                value: 'redEnvelopes'
            }
        ],
        versionRule: [
            {
                name: '2D',
                value: '2D'
            },
            {
                name: '3D',
                value: '3D'
            },
            {
                name: 'IMAX',
                value: 'IMAX'
            },
            {
                name: 'IMAX 3D',
                value: 'IMAX 3D'
            },
            {
                name: 'IMAX 4D',
                value: 'IMAX 4D'
            },
            {
                name: '4D',
                value: '4D'
            },
            {
                name: '中国巨幕',
                value: '中国巨幕'
            },
            {
                name: '中国巨幕 3D',
                value: '中国巨幕 3D'
            },
            {
                name: 'DMAX',
                value: 'DMAX'
            },
            {
                name: 'DMAX 3D',
                value: 'DMAX 3D'
            },
            {
                name: 'DMAX 2D',
                value: 'DMAX 2D'
            }
        ],
        minFlowRule: [
            {
                name: '0',
                value: '-1'
            },
            {
                name: '17',
                value: '17'
            },
            {
                name: '18',
                value: '18'
            },
            {
                name: '19',
                value: '19'
            },
            {
                name: '20',
                value: '20'
            },
            {
                name: '21',
                value: '21'
            }
        ],
        cinemaChainStatusData: [
            {
                name: '全部',
                value: '0'
            },
            {
                name: validStatusText,
                value: 1
            },
            {
                name: invalidStatusText,
                value: 2
            }
        ],
        usageList: [
            {
                name: '通用领券',
                value: 'GENERAL'
            },
            {
                name: '游戏领券',
                value: 'GAME'
            },
            {
                name: '合作方接口发券',
                value: 'COOPERATION'
            },
            {
                name: '分享领券',
                value: 'SHARE'
            },
            {
                name: '大转盘抽奖',
                value: 'LOTTERY'
            },
            {
                name: '自动发券',
                value: 'AUTO'
            }
        ],
        usageMerList: [
            {
                name: '通用领券',
                value: 'GENERAL'
            },
            {
                name: '游戏领券',
                value: 'GAME'
            },
            {
                name: '合作方接口发券',
                value: 'COOPERATION'
            },
            {
                name: '分享领券',
                value: 'SHARE'
            },
            {
                name: '大转盘抽奖',
                value: 'LOTTERY'
            },
            {
                name: '自动发券',
                value: 'AUTO'
            },
            {
                name: '用户领取',
                value: 'DRAW'
            }
        ],
        allType: [
            {
                name: '全部',
                value: ''
            },
            {
                name: '银行优惠栏配置',
                value: 'bank'
            },
            {
                name: '购票弹层限定配置',
                value: 'buyTicketActivity'
            },
            {
                name: '直播列表',
                value: 'liveList'
            },
            {
                name: '主题馆',
                value: 'themePavilion'
            },
            {
                name: '主题馆列表',
                value: 'themeList'
            },
            {
                name: '商城首页豆腐块左一',
                value: 'promotions1'
            },
            {
                name: '商城首页豆腐块右一',
                value: 'promotions2'
            },
            {
                name: '商城首页豆腐块右二',
                value: 'promotions3'
            },
            {
                name: '商城首页豆腐块下',
                value: 'promotions4'
            },
            {
                name: '热门推荐',
                value: 'hotRecommend'
            },
            {
                name: '玩具模型',
                value: 'toy'
            },
            {
                name: '数码周边',
                value: 'digital'
            },
            {
                name: '服饰配件',
                value: 'dress'
            },
            {
                name: '家居生活',
                value: 'house'
            },
            {
                name: '演出票代金券配置',
                value: 'showVoucher'
            },
            {
                name: '演出票豆腐块',
                value: 'showBlock'
            },
            {
                name: '下载浮层',
                value: 'downloadFloatingLayer'
            },
            {
                name: '首页推荐豆腐块',
                value: 'portalRecommend'
            },
            {
                name: '会员卡专享',
                value: 'memberActivity'
            }
        ],
        couponSource: [
            {
                name: '电影',
                value: 'MOVIE'
            },
            {
                name: '演出票',
                value: 'SHOW'
            },
            {
                name: '酒店',
                value: 'MAP'
            },
            {
                name: '酒店新',
                value: 'MAP_NEW'
            },
            {
                name: '糯米',
                value: 'NUOMI'
            },
            {
                name: '外卖',
                value: 'WAIMAI'
            },
            {
                name: '第三方',
                value: 'THIRD_PARTY'
            },
            {
                name: '卖品券',
                value: 'SNACK'
            }
        ],
        gradesData: [
            {
                name: '自然排序',
                value: 0
            },
            {
                name: '1',
                value: 1
            },
            {
                name: '2',
                value: 2
            },
            {
                name: '3',
                value: 3
            },
            {
                name: '4',
                value: 4
            },
            {
                name: '5',
                value: 5
            },
            {
                name: '6',
                value: 6
            },
            {
                name: '7',
                value: 7
            },
            {
                name: '8',
                value: 8
            },
            {
                name: '9',
                value: 9
            },
            {
                name: '10',
                value: 10
            },
            {
                name: '11',
                value: 11
            },
            {
                name: '12',
                value: 12
            },
            {
                name: '13',
                value: 13
            },
            {
                name: '14',
                value: 14
            },
            {
                name: '15',
                value: 15
            },
            {
                name: '16',
                value: 16
            },
            {
                name: '17',
                value: 17
            },
            {
                name: '18',
                value: 18
            },
            {
                name: '19',
                value: 19
            },
            {
                name: '20',
                value: 20
            }
        ],
        // sfrom WIKI 地址： http://wiki.baidu.com/pages/viewpage.action?pageId=73311982
        channelRule: [ // 运营位、营销统一使用
            {
                name: '糯米_NA',
                value: 'NUOMI_NA',
                isNa: true
            },
            {
                name: '糯米_WEBAPP',
                value: 'NUOMI_WEBAPP',
                lineBreak: true
            },
            {
                name: '手百_框外',
                value: 'WISE_WEBAPP'
            },
            {
                name: '手百_框内',
                value: 'WISE_LIGHTAPP'
            },
            {
                name: '手百_组件',
                value: 'WISE_ZJ_TABBAR',
                lineBreak: true,
                isNa: true
            },
            {
                name: '地图_组件',
                value: 'MAP_ZJ'
            },
            {
                name: '地图_NA',
                value: 'MAP_NA'
            },
            {
                name: '地图_WEBAPP',
                value: 'MAP_WEBAPP',
                lineBreak: true
            },
            {
                name: '钱包_WEBAPP',
                value: 'WALLET_WEBAPP',
                isNotAd: true
            },
            {
                name: '钱包_组件',
                value: 'WALLET_ZJ',
                lineBreak: true,
                isNotAd: true
            },
            {
                name: '度秘_NA',
                value: 'DUER_NA'
            },
            {
                name: '度秘_WEBAPP',
                value: 'DUER_WEBAPP'
            },
            {
                name: '小米_NA',
                value: 'XIAOMI_NA',
                isNotAd: true
            },
            {
                name: '生活服务资源团队_NA',
                value: 'XLIFE_NA'
            },
            {
                name: '线上监控(QA使用)',
                value: 'MONITOR_WEBAPP'
            },
            {
                name: '爱奇艺_NA',
                value: 'IQIYI_NA',
                lineBreak: true
            },
            // 暂时删除的部分
            // {
            //     name: '爱奇艺_WEBAPP',
            //     value: 'IQIYI_WEBAPP'
            // },
            // {
            //     name: '赶集_WEBAPP',
            //     value: 'GANJI_WEBAPP'
            // },
            // {
            //     name: '百姓网_NA',
            //     value: 'BAIXING_NA',
            //     lineBreak: true
            // },
            {
                name: '电影_NA',
                value: 'MOVIE_NA'
            },
            {
                name: '电影_PC',
                value: 'MOVIE_PC'
            },
            {
                name: '华为_NA',
                value: 'HUAWEI_NA',
                isNotAd: true
            },
            {
                name: 'OPPO_NA',
                value: 'OPPO_NA',
                isNotAd: true
            },
            {
                name: 'VIVO_NA',
                value: 'VIVO_NA',
                isNotAd: true
            },
            {
                name: '中兴_NA',
                value: 'ZTE_NA',
                isNotAd: true
            }
        ],
        OfficialAccountType: [
            {
                name: '全部',
                value: ''
            },
            {
                name: '团体',
                value: 2
            },
            {
                name: '明星',
                value: 3
            },
            {
                name: '糯米账号',
                value: 4
            }
        ],
        OfficialAccountType1: [
            {
                name: '团体',
                value: 2
            },
            {
                name: '明星',
                value: 3
            },
            {
                name: '糯米账号',
                value: 4
            }
        ],
        officialCommentTypeList: [
            {
                name: '影片内容专题',
                value: 1
            },
            {
                name: '内容集合',
                value: 2
            },
            {
                name: '观影活动',
                value: 3
            },
            {
                name: '线上活动',
                value: 4
            },
            {
                name: '线下活动',
                value: 5
            },
            {
                name: '新闻稿',
                value: 6
            }
        ],
        newsStatus: [
            {
                name: '全部',
                value: ''
            },
            {
                name: '上线',
                value: 'ONLINE'
            },
            {
                name: '下线',
                value: 'OFFLINE'
            },
            {
                name: '待审核',
                value: 'PENDING'
            },
            {
                name: '未通过',
                value: 'FAIL'
            }
        ],
        showThirdFrom: [ // 演出票票品来源
            {
                name: '自营',
                value: 'baidu'
            },
            {
                name: '永乐',
                value: 'yongle'
            },
            {
                name: '开心麻花',
                value: 'kxmh'
            }
        ],
        showType: [
            {
                name: '选座',
                value: 'CHOOSE_SEAT'
            },
            {
                name: '非选座',
                value: 'NONE_CHOOSE_SEAT'
            }
        ],
        category: [ // 演出票票品类目
            {
                name: '演唱会',
                value: 1
            },
            {
                name: '音乐会',
                value: 2
            },
            {
                name: '话剧舞台剧',
                value: 3
            },
            {
                name: '舞蹈芭蕾',
                value: 4
            },
            {
                name: '戏曲综艺',
                value: 5
            },
            {
                name: '体育赛事',
                value: 6
            },
            {
                name: '休闲娱乐',
                value: 7
            },
            {
                name: '周边商品',
                value: 8
            },
            {
                name: '儿童亲子',
                value: 9
            }
        ],
        circleType: [ // 圈子类型
            {
                name: '全部',
                value: ''
            },
            {
                name: '明星',
                value: '0'
            },
            {
                name: '电影',
                value: 1
            },
            {
                name: '官方',
                value: 2
            },
            {
                name: '演出',
                value: 3
            },
            {
                name: '女儿国',
                value: 4
            },
            {
                name: '电视剧',
                value: 5
            },
            {
                name: '综艺',
                value: 6
            }
        ],
        circleStatus: [ // 圈子状态
            {
                name: '全部',
                value: ''
            },
            {
                name: '上线',
                value: '0'
            },
            {
                name: '下线',
                value: 1
            }
        ],
        circlePriorityType: [
            {
                name: '热门',
                value: '0'
            },
            {
                name: '电影',
                value: 1
            },
            {
                name: '人物',
                value: 2
            },
            {
                name: '演出',
                value: 3
            }
        ],
        checkActStatus: [
            {
                name: '待审核',
                value: 'WAIT_CHECK'
            },
            {
                name: '审批通过',
                value: 'CHECKED'
            },
            {
                name: '已驳回',
                value: 'REJECT'
            },
            {
                name: '全部',
                value: 'ALL'
            }
        ],
        promotionSmsStatus: [ // 推广短信发送状态
            {
                name: '全部',
                value: 'ALL'
            },
            {
                name: '草稿',
                value: 'DRAFT'
            },
            {
                name: '待审核',
                value: 'WAIT_CHECK'
            },
            {
                name: '待发送',
                value: 'WAIT_SEND'
            },
            {
                name: '发送中',
                value: 'SENDING'
            },
            {
                name: '已发送',
                value: 'SENDED'
            },
            // {
            //     name: '发送失败',
            //     value: 'FAILED'
            // },
            {
                name: '已驳回',
                value: 'REJECT'
            }
        ],
        promotionSmsFilmType: [
            // {
            //     name: '全部',
            //     value: 'ALL'
            // },
            {
                name: '动作片',
                value: 'ACTION'
            },
            {
                name: '科幻片',
                value: 'SCI_FITION'
            },
            {
                name: '恐怖片',
                value: 'HORROR'
            },
            {
                name: '战争片',
                value: 'WAR'
            },
            {
                name: '悬疑片',
                value: 'SUSPENSE'
            },
            {
                name: '爱情片',
                value: 'ROMANTIC'
            },
            {
                name: '剧情片',
                value: 'STORY'
            }
        ],
        MERCHANT_PROMOTION_ACT_FIRSTTIME: 'localMerchantPromotionSmsFirsttime',
        // 商家券发放状态
        merchantCouponBatchBindStatus: [
            {
                name: '全部',
                value: 'ALL'
            },
            {
                name: '待配置',
                value: 'NORMAL'
            },
            {
                name: '生效中',
                value: 'ALLOW_BIND'
            },
            {
                name: '暂停中',
                value: 'PAUSE_BIND'
            },
            {
                name: '已结束',
                value: 'DISABLE'
            }
        ],
        commentScoreList: [
            {
                name: '',
                value: 0
            },
            {
                name: '1',
                value: 1
            },
            {
                name: '2',
                value: 2
            },
            {
                name: '3',
                value: 3
            },
            {
                name: '4',
                value: 4
            },
            {
                name: '5',
                value: 5
            },
            {
                name: '6',
                value: 6
            },
            {
                name: '7',
                value: 7
            },
            {
                name: '8',
                value: 8
            },
            {
                name: '9',
                value: 9
            },
            {
                name: '10',
                value: 10
            }
        ],
        brandData: [
            {
                name: '大地',
                value: 76
            },
            {
                name: '万达',
                value: 39
            },
            {
                name: '横店',
                value: 11
            },
            {
                name: '金逸',
                value: 9
            },
            {
                name: '17.5',
                value: 8
            },
            {
                name: '星美',
                value: 6
            },
            {
                name: '中影',
                value: 7
            },
            {
                name: '幸福',
                value: 27
            },
            {
                name: '保利',
                value: 19
            },
            {
                name: '沃美',
                value: 103
            },
            {
                name: 'CGV',
                value: 34
            },
            {
                name: '比高',
                value: 55
            },
            {
                name: '耀莱',
                value: 17
            },
            {
                name: '博纳',
                value: 10
            },
            {
                name: '嘉禾',
                value: 16
            },
            {
                name: '奥斯卡',
                value: 32
            },
            {
                name: '太平洋',
                value: 2
            },
            {
                name: '卢米埃',
                value: 44
            },
            {
                name: 'UME',
                value: 23
            }
        ]
    };

    return constant;
});


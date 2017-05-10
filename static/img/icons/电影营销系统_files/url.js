/**
 * @file   url对应表
 * @author zhangzhiqiang<zhangzhiqiang04@baidu.com>
 */

define(function () {
    return {

        // 导航栏信息
        GET_MENU: '/data/common/getMenu',
        GET_MENUE_MERCHANT: '/data/common/getMenuMerchant',
        // 特惠
        GET_CINEMA_CHAIN_LIST: '/data/tehui/getCinemaChainList',
        OPERATE_CINEMA_CHAIN: '/data/tehui/operateCinemaChain',
        UPLOAD_CINEMA_CHAIN_IMG: '/data/tehui/uploadCinemaChainImg',
        GET_CINEMA_LIST: 'data/tehui/getCinemaList',
        CHECK_REPEAT_PRI: '/data/tehui/checkRepeatPri',
        SAVE_CINEMA_CHAIN: '/data/tehui/saveCinemaChain',

        // 秒杀
        GET_SECKILL_LIST: '/data/seckill/getSeckillList',
        GET_SECKILL_DELETE: '/data/seckill/delete',
        GET_SECKILL_ENABLE: '/data/seckill/enable',
        GET_SECKILL_PAUSE: '/data/seckill/pause',
        GET_SECKILL_GETALLSTRATEGY: '/data/seckill/getAllStrategy',
        GET_SECKILL_LOAD: '/data/seckill/load',
        UPLOAD_MIAOSHA_IMG: '/upload/img/miaoShaImg',


        // 计划&活动
        GET_PLAN_LIST: '/data/plan/getPlanList',
        GET_ACTIVITY_LIST: '/data/activity/getActivityList',
        OPERATE_PLAN: '/data/plan/operatePlan',
        EDIT_PLAN: '/data/plan/editPlan',
        UPDATE_PLAN: '/data/plan/updatePlan',
        STICK_PLAN: '/data/plan/stickPlan', // 置顶
        // GET_PLAN: '/data/plan/getPlan',
        OPERATE_ACTIVITY: '/data/activity/operateActivity',
        SAVE_ACTIVITY_FRONTING: '/data/activity/saveActivityFronting',
        SAVE_ACTIVITY_TOTAL: '/data/activity/saveActivityTotal',
        SAVE_ACTIVITY_DAILY: '/data/activity/saveActivityDaily',
        SAVE_ACTIVITY_INFO: '/data/activity/saveActivityInfo',
        GET_PLANS_INFO: '/data/plan/getPlansInfo',
        CHECK_REPEAT_PRIORITY: '/data/activity/checkRepeatPriority',

        GET_RULES: '/data/rule/getRules',
        DEL_RULE: '/data/rule/delRule',
        GET_CUSTOM_IDS: 'data/rule/getCustomIds',
        GET_MOVIES: '/data/common/getMovies',
        SAVE_RULES: '/data/rule/saveRules',
        GET_MEMBER_USER_DATA: '/data/common/getMemberUserData', // 是营销通用会员卡数据
        GET_CITY_LIST: '/data/common/getCityList',
        GET_BRAND_LIST: '/data/common/getBrandList',
        GET_CINEMAS: '/data/common/getCinemaList',
        GET_CINEMAS_BY_IDS: '/data/common/getCinemaListByIds',
        GET_SCENE_LIST: '/data/common/getSceneList',
        GET_HALLS_BY_IDS: '/data/common/getHallList',
        // GET_SECKILL_LIST: 'data/miaosha/getSeckillList'
        //
        GET_COUPON_PLAN_LIST: '/data/couponPlan/getPlanList',
        EDIT_COUPON_PLAN: '/data/couponPlan/editPlan',
        OPERATE_COUPON_PLAN: '/data/couponPlan/operatePlan',
        GET_BATCH_LIST: '/data/couponBatch/getBatchList',
        OPERATE_BATCH: '/data/couponBatch/operateBatch',
        UPLOAD_DISPATCH_TO_FILE: '/data/couponBatch/uploadDispatchToFile',
        SAVE_BATCH_DISPATCH_RULE: '/data/couponBatch/saveBatchDispatchRule',
        GET_CODE_LIST: '/data/coupon/getCodeList',
        GET_COUPON_PLANS_INFO: '/data/couponPlan/getPlansInfo',
        SAVE_BATCH_INFO: '/data/couponBatch/saveBatchInfo',
        EXPORT_CODE: '/data/coupon/exportCode',
        PREVIEW_MESSAGE: '/data/couponBatch/previewMessage',
        STICK_COUPON_PLAN: '/data/couponPlan/stickPlan',

        // 运营位管理
        GET_AD_POS_LIST: '/data/tms/search',
        GET_AD_POS_INIT_LIST: '/data/tms/initQuery',
        GET_AD_CONTENT_LIST: '/data/tmsContent/search',
        GET_AD_CONTENT_EDIT_LIST: '/data/tmsContent/get',
        OPERATE_POS_DEL: '/data/tms/delete',
        OPERATE_POS_START: '/data/tms/enable',
        OPERATE_POS_PAUSE: '/data/tms/pause',
        EDIT_AD_POS: '/data/tms/add',
        OPERATE_CONTENT_DEL: '/data/tmsContent/delete',
        OPERATE_CONTENT_START: '/data/tmsContent/enable',
        OPERATE_CONTENT_PAUSE: '/data/tmsContent/pause',
        OPERATE_CONTENT_COPY: '/data/tmsContent/copy',
        GET_AD_CONTENT_INIT: '/data/tmsContent/initAdd',
        GET_AD_CONTENT_INIT_LIST: '/data/tmsContent/initQuery',
        EDIT_AD_CONTENT_ADD: '/data/tmsContent/add',
        SAVE_AD_CONTENT_NEW_PRIORITY: '/data/tmsContent/updatePriority',
        SAVE_AD_POS_NEW_PRIORITY: '/data/tms/updatePriority',
        GET_ACTIITY_BY_ID: ' /data/tmsContent/getActivityById',
        UPLOAD_AD_CONTENT_IMG: '/data/tmsContent/uploadImage',
        // UPLOAD_AD_CONTENT_BACKUP_IMG: '/data/tmsContent/uploadImage',
        GET_AD_CONTENT_URL: '/data/tmsContent/getEnhanceRedirectUrl',
        UPLOAD_AD_CONTENT: '/data/tmsContent/upload',
        GET_PIC_WITH_TIMG: '/data/tmsContent/getPicWithTimg',
        // GET_AD_POS_LIST: '/data/plan/getPlanList'

        // 评论管理
        GET_LONG_COMMENT_LIST: '/data/longComment/list',
        DEL_LONG_COMMENT: '/data/longComment/del',
        GET_LONG_COMMENT_DETAIL: '/data/longComment/detail',
        GET_LONG_COMMENT_AUTHOR_LIST: '/data/longComment/authorList',
        UPDATE_LONG_COMMENT_AUTHOR: '/data/longComment/authorUpdate',
        UPDATE_LONG_COMMENT: '/data/longComment/update',

        // 活动列表页
        GET_CMS_LIST: '/activity/find',
        GET_CMS_DELETE: '/activity/delete',
        GET_CMS_ENABLE: '/activity/enable',
        GET_CMS_PAUSE: '/activity/pause',
        GET_CMS_COPY: '/activity/clone',
        GET_CMS_SAVE: '/activity/save',

        // 代金券批次优惠前置
        GET_COUPON_FRONTING: '/data/couponBatch/getCouponFronting',
        SAVE_COUPON_FRONTING: '/data/couponBatch/saveCouponFronting',

        // 全局配置自定义列表
        GET_CUSTOM_LIST: '/data/custom/getCustomList',
        OPERATE_CUSTOM_LIST: '/data/custom/operateCustom',
        SAVE_CUSTOM_LIST: '/data/custom/saveCustom',

        // 物料配置
        GET_MATERIAL_LIST: '/data/materialTemplate/search',
        ADD_MATERIAL: '/data/materialTemplate/add',
        DEL_MATERIAL: '/data/materialTemplate/del',
        COPY_MATERIAL: '/data/materialTemplate/copy',
        GET_PRODUCTION_INFO: '/data/product/list',

        // 抽奖配置
        GET_LOTTERY_PLAN: '/data/lotteryActivity/getActivityList',
        OPERATE_LOTTERY_PLAN: '/data/lotteryActivity/operateActivity',
        EDIT_LOTTERY_PLAN: '/data/lotteryActivity/editActivity',
        GET_LOTTERY_INFO: '/data/lotteryActivity/getActivityInfo',
        GET_AWARD_LIST: '/data/award/getAwardList',
        OPERATE_AWARD_LIST: '/data/award/operateAward',
        EXPORT_WINNER_LIST: '/data/lotteryActivity/exportWinnerList',
        EDIT_AWARD: '/data/award/editAward',
        EDIT_AWARD_PRIORITY: '/data/award/editAwardPriority',

        // 查看日志
        CHECK_LOG: '/data/logger/getLoggerList',

        // 游戏配置
        GET_GAME_LIST: '/data/game/getGameList',
        OPERATE_GAME: '/data/game/operateGame',
        EDIT_GAME: '/data/game/editGame',

        // 公众号
        GET_OFFICIAL_ACCOUNT_LIST: '/data/officialAccount/list',
        EDIT_OFFICIAL_ACCOUNT_LIST: '/data/officialAccount/update',
        OPERATE_OFFICIAL_ACCOUNT: '/data/officialAccount/operation',
        MOVIE_ACTOR_LIST: '/data/movieActor/list',
        MOVIE_ACTOR_DETAIL: '/data/movieActor/detail',
        SEARCH_ACCOUNT_QUERY: '/data/account/query',

        // 公众影迹
        GET_OFFCIAL_COMMENT_LIST: '/data/officialComment/list',
        EDIT_OFFCIAL_COMMENT_LIST: '/data/officialComment/update',
        OPERATE_OFFICIAL_COMMENT_LIST: '/data/officialComment/operation',
        GET_OFFCIAL_COMMENT_APPLY: '/data/officialCommentReply/list',
        OPERATE_OFFICIAL_COMMENT_APPLY: '/data/officialCommentReply/operation',

        // 大礼包配置
        GET_GIFTPACKAGE_LIST: '/data/giftPackage/getGiftPackageList',
        OPERATE_GIFTPACKAGE: '/data/giftPackage/operateGiftPackage',
        EDIT_GIFTPACKAGE: '/data/giftPackage/editGiftPackage',
        GET_GIFTPACKAGE_INFO: '/data/giftPackage/getGiftPackageInfo',

        UPLOAD_AWARD_TO_FILE: '/data/award/uploadCouponFile',
        DOWNLOAD_AWARD_TO_FILE: '/data/award/getCouponFile?path=',

        // 糯米新闻管理
        GET_NUOMI_NEWS_LIST: '/data/news/list',
        // EDIT_NUOMI_NEWS: '/data/officialComment/update', // 目前不支持编辑
        OPERATE_NUOMI_NEWS: '/data/news/operation',
        SET_NEWS_RELEAVANCE: '/data/news/relevance',
        GET_THIRD_FROM_LIST: '/data/news/thirdFrom',
        // UPDATE_NEWS_PRIORITY: '/data/news/updatePriority', // 目前不支持优先级

        // 票品列表
        GET_SHOW_PRODUCT_LIST: '/data/common/getShowProducts',
        GET_VENUES: '/data/common/getVenues',
        GET_VENUES_BY_IDS: '/data/common/getVenuesByIds',
        GET_NUOMI_CITY_LIST: '/data/common/getNuomiCityList',

        // 饭圈列表
        GET_FAN_CIRCLE_LIST: '/data/fanCircle/list',
        EDIT_FAN_CIRCLE: '/data/fanCircle/update',
        OPERATE_FAN_CIRCLE_LIST: '/data/fanCircle/operation',

        // 帖子列表
        GET_POSTS_LIST: '/data/posts/list',
        OPERATE_POSTS_LIST: '/data/posts/operation',
        GET_POSTS_REPLY_LIST: '/data/postsReply/list',
        OPERATE_POSTS_REPLY: '/data/postsReply/operation',
        GET_POST_DETAIL: '/data/posts/detail',
        UPDATE_POST: '/data/posts/update',
        GIF_IMG_TEST: '/data/posts/imgCheckFix',

        // 智能营销活动
        GET_MERCHANT_PROMOTION_ACT_LIST: '/data/merchantActivity/getActivityList',
        OPERATE_MERCHANT_PROMOTION_ACT: '/data/merchantActivity/operateActivity',
        EDIT_MERCHANT_PROMOTION_ACT: '/data/merchantActivity/editActivity',
        GET_MERCHANT_PROMOTION_ACT_INFO_LIST: '/data/merchantActivity/getActivityInfo',
        CHECK_MERCHANT_PROMOTION_ACT_BUDGET: '/data/merchantActivity/checkBudget',
        GET_USER_FEATURE_MATCH_COUNT: '/data/userFeature/getMatchCount',
        // 推广短信
        GET_MERCHANT_PROMOTION_SMS_LIST: '/data/smsTemplate/getSmsTemplateList',
        OPERATE_MERCHANT_PROMOTION_SMS: '/data/smsTemplate/operateSmsTemplate',
        EDIT_MERCHANT_PROMOTION_SMS: '/data/smsTemplate/editSmsTemplate',
        CHECK_MERCHANT_PROMOTION_SMS_BUDGET: '/data/smsTemplate/checkBudget',
        // 生成短链接
        GET_SHORT_LINK: '/data/common/getShortLink',
        // 查询用户账户下的影院
        GET_USER_CINEMA_LIST: 'data/common/getUserCinemaList',
        // 商家审核列表
        GET_MECHANT_SERVICE_LIST: '/data/user/getServiceList',
        APPLY_MECHANT_SERVICE: '/data/user/applyService',
        GET_CINEMA_ACTIVATE_STATUS: '/data/user/getCinemaActivateStatus',
        GET_MECHANT_CHECK_ACT_LIST: '/data/smsTemplate/getSmsTemplateList4Check',
        OPERATE_MECHANT_CHECK_ACT_LIST: '/data/smsTemplate/checkSmsTemplate',
        GET_USER_MOVIES: '/data/common/getUserMovies',
        GET_USER_CINEMAS: '/data/common/getUserCinemaList',
        GET_USER_MEMBER_DATA: '/data/common/getUserMemberData', // 是商家通用会员卡数据

        GET_MECHANT_COUPON_BATCH_LIST: '/data/merchantCouponBatch/getBatchList',
        OPERATE_MERCHANT_COUPON_BATCH: '/data/merchantCouponBatch/operateBatch',
        EVALUATE_MERCHANT_COUPON_BATCH: '/data/merchantCouponBatch/evaluation',
        SAVE_MERCHANT_BATCH_INFO: '/data/merchantCouponBatch/saveBatchInfo'
    };
});


/**
 * @file 整个项目path-action配置都放在这个文件里，统一管理
 * @author zhangzhiqiang<zhangzhiqiang04@baidu.com>
 */

define(function (require) {
    // action配置数组，约定目录结构使用驼峰式命名，url使用全小写命名，Action文件命名为Action.js
    // 添加一个普通action直接建好目录和文件，在actionArr数组中添加目录名就OK
    var actionArr = [
        'marketing/actPlan', 'marketing/actUnit', 'marketing/addActPlan', 'marketing/minFlowRuleEdit',
        'marketing/editPlan', 'marketing/editActivityFronting', 'marketing/editActivityTotal',
        'marketing/editActivityDaily', 'marketing/checkPriority', 'marketing/editAct', 'marketing/editActRules',
        'marketing/userGroupRuleEdit', 'marketing/channelRuleEdit', 'marketing/perUserAttendNumRuleEdit',
        'marketing/movieWhiteRuleEdit', 'marketing/ipRuleEdit', 'marketing/payTypeRuleEdit', 'marketing/editCustomList',
        'marketing/cinemaWhiteRuleEdit', 'marketing/sceneWhiteRuleEdit', 'marketing/cinemaAndSceneBlackRuleEdit',
        'marketing/versionRuleEdit', 'marketing/editCustomList', 'marketing/couponBindUserGroupRuleEdit',
        'marketing/loggerList', 'marketing/theaterRuleEdit',

        'voucher/couponPlanList', 'voucher/editCouponPlan', 'voucher/batchList', 'voucher/memberCinemaRuleEdit',
        'voucher/codeList', 'voucher/editDispatchRule', 'voucher/editBatch', 'voucher/editBatchRules',
        'voucher/couponDeductRuleEdit', 'voucher/couponBindRuleEdit', 'miaosha',
        'vouchershow/showCouponPlanList', 'vouchershow/showBatchList', 'vouchershow/editShowCouponPlan',
        'vouchershow/editShowBatch', 'vouchershow/showCodeList', 'vouchershow/editShowBatchRules',
        'vouchershow/showTypeEdit', 'vouchershow/showCouponBindUserGroupRuleEdit', 'vouchershow/showThirdFromEdit',
        'vouchershow/categoryEdit', 'vouchershow/showProductEdit', 'voucher/editBatchFronting',
        'vouchershow/editShowDispatchRule', 'vouchershow/venueWhiteRuleEdit', 'vouchershow/priceIdWhiteRuleEdit',

        'tehui/cinemaChainList', 'tehui/editCinemaChain', 'tehui/editCinema', 'tehui/checkPri',

        'adpos/adPosList', 'adpos/adContentList', 'adpos/editAdPos', 'adpos/editAdContent', 'adpos/cityRuleEdit',
        'adpos/editAdCms', 'adpos/adCmsList', 'adpos/channelEdit',

        'cms/activityList',

        'comment/shortComment', 'comment/publicNumList',
        'comment/editPublicNum', 'comment/publicTopicList', 'comment/editPublicTopic', 'comment/choosePublicNum',
        'comment/longComment', 'comment/editLongComment', 'comment/previewLongComment', 'comment/movieStills',
        'comment/actorManage', 'comment/actorDetail', 'comment/nuomiNews', 'comment/editNuomiNews',
        'comment/newsRelateSet', 'comment/authorManage', 'comment/editAuthor', 'comment/topicReplyManage',
        'comment/authorManage', 'comment/editAuthor', 'comment/circleList', 'comment/editCircle', 'comment/editPost',
        'comment/postsList', 'comment/postsReplyManage', 'comment/previewPost', 'comment/chooseCircle',

        'tools/prizePlan', 'tools/prizeList', 'tools/editPrizePlan', 'tools/editPrize', 'tools/gamePlan',
        'tools/editGamePlan', 'tools/gameList', 'tools/editGamePrize', 'tools/giftpackagePlan', 'tools/giftpackageList',
        'tools/editGiftpackagePlan', 'tools/editGiftpackagePrize',

        'merchanthome/homeIndex', 'merchanthome/applyOpenConfirm', 'merchantcheck/checkActList',
        'merchantcheck/checkRejectConfirm',

        'merchantPromotion/promotionActList', 'merchantPromotion/editPromotionAct',
        'merchantPromotion/promotionSmsList', 'merchantPromotion/editPromotionSms', 'merchantPromotion/checkCinemaList',

        'merchantvoucher/merCouponPlanList', 'merchantvoucher/editMerCouponPlan', 'merchantvoucher/merBatchList',
        'merchantvoucher/merCodeList', 'merchantvoucher/editMerDispatchRule', 'merchantvoucher/editMerBatch',
        'merchantvoucher/editMerBatchRules', 'merchantvoucher/editMerBatchFronting',
        'merchantvoucher/merCouponDeductRuleEdit', 'merchantvoucher/merCouponBindRuleEdit',

        'merchantVoucherNew/merVoucherNewList', 'merchantVoucherNew/editMerVoucherNew',
        'merchantVoucherNew/editMerVoucherAccurate', 'merchantVoucherNew/showInstruction',
        'merchantVoucherNew/evaluateBatch', 'merchantVoucherNew/createMerVoucherNew',
        'merchantVoucherNew/cinemaMerRuleEdit'
    ];

    var actionLen = actionArr.length;
    var res = [];
    while (actionLen--) {
        var item = {};
        var pathArr = actionArr[actionLen].split('/');
        var path = pathArr[pathArr.length - 1];
        item.path = '/' + path.toLowerCase();
        item.type = actionArr[actionLen] + '/Action';
        res.push(item);
    }
    var otherAction = [
        {
            path: '/cinemasblackruleedit',
            type: 'marketing/cinemaWhiteRuleEdit/Action'
        },
        {
            path: '/scenesblackruleedit',
            type: 'marketing/sceneWhiteRuleEdit/Action'
        },
        {
            path: '/couponglobalconfig',
            type: 'marketing/globalConfig/Action',
            args: {
                parentpanel: 'voucher' // 区分代金券和活动
            }
        },
        {
            path: '/actglobalconfig',
            type: 'marketing/globalConfig/Action',
            args: {
                parentpanel: 'marketing'
            }
        },
        {
            path: '/couponglobalconfigmovie',
            type: 'marketing/globalConfigMovie/Action',
            args: {
                parentpanel: 'voucher' // 区分代金券和活动
            }
        },
        {
            path: '/actglobalconfigmovie',
            type: 'marketing/globalConfigMovie/Action',
            args: {
                parentpanel: 'marketing'
            }
        },
        {
            path: '/movieblackruleedit',
            type: 'marketing/movieWhiteRuleEdit/Action'
        }
    ];
    res = res.concat(otherAction);
    return res;
});

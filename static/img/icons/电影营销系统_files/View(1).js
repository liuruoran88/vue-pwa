/**
 * @file   新建/编辑新商家券 View
 * @author liuruoran<liuruoran@baidu.com>
 */

define(function (require) {

    require('er/tpl!./tpl.html');
    require('date/lhgcalendar');
    var UIView = require('ef/UIView');
    var util = require('er/util');
    var locator = require('er/locator');
    var URL = require('er/URL');
    var commonUtil = require('common/util');
    var CONST = require('common/const');
    var Dialog = require('esui/Dialog');
    var INPUT_WIDTH = 200;
    var valid = true;
    var initDone = false;
    // var moment = require('moment');
    // var MONEY_REG = /^(([1-9]\d{0,7}(\.\d{1,2})?)|(0\.\d{1,2}))?$/;
    // var cinemaShortLink = null; // 影院短链接
    // var validUrlFlag = false; // 短信内容是否包含链接标志
    // var exceedMaxSizeFlag = false; // 短信内容是否超长标志
    // var SMS_SECTION_SIZE = 62; // 短信分段长度
    // var SMS_MAX_SIZE = 320; // 短信最大长度

    /**
     * constructor
     *
     * @class
     */
    function View() {
        UIView.apply(this, arguments);
    }

    View.prototype.template = 'edit_mer_voucher_new';

    View.prototype.uiProperties = {
        editBatchInfo: {
            submitButton: 'submitBtn',
            autoValidate: true
        },
        name: {
            required: true,
            width: INPUT_WIDTH,
            value: '@data.name',
            placeholder: '最多输入10个字符',
            pattern: /^.*$/,
            readOnly: '@preview',
            patternErrorMessage: '应最短1个字符，最长10个字符'
        },
        ticketTypeLimit: {
            value: '@data.ticketTypeLimit',
            disabled: '@preview'
        },
        ticketTypeLimitTip: {
            title: '',
            layerWidth: 300,
            content: '例如：面值为5元的优惠券，按票优惠券最多2张票享优惠，当顾客购买3张票时，则前2张票可享减5元，第3张票不享受优惠。'
        },
        priceType: {
            value: '@data.priceType',
            disabled: '@preview'
        },
        priceTypeTip: {
            title: '',
            content: '按票优惠：每张票立减X元；<br>按订单优惠：每笔订单立减X元；'
        },
        budgetType: {
            value: '@data.budgetType',
            disabled: '@preview'
        },
        budgetTypeTip: {
            title: '',
            layerWidth: 400,
            content: '按预算金额：如果您希望通过预算控制发券数量，请选此项；<br>按投放数量：如果您希望按发券数量发放优惠券，请选此项；'
        },
        budgetValue: {
            width: INPUT_WIDTH,
            value: '@data.budgetValue',
            placeholder: '最多输入7位个整数',
            pattern: /^[1-9][0-9]{0,6}$/,
            patternErrorMessage: '应输入0~999,999,9之间的整数',
            readOnly: '@preview'
        },
        budgetCount: {
            width: 80
        },
        budgetAmount: {
            width: 80
        },
        priceAmount: {
            width: INPUT_WIDTH,
            value: '@data.priceAmount',
            placeholder: '最多输入2位整数',
            pattern: /^[1-9][0-9]?$/,
            patternErrorMessage: '应大于0且不超过99的数字',
            readOnly: '@preview'
        },
        maxBindCount: {
            value: '@data.maxBindCount',
            placeholder: '最多输入2位整数',
            pattern: /^[1-9][0-9]?$/,
            patternErrorMessage: '请输入1~99之间的整数',
            readOnly: '@preview'
        },
        useTimeType: {
            value: '@data.useTimeType',
            disabled: '@preview'
        },
        useStartTime: {
            value: '@data.useStartTime',
            required: true,
            disabled: true,
            width: 176
        },
        useEndTime: {
            value: '@data.useEndTime',
            required: true,
            disabled: '@preview',
            width: 176
        },
        afterBindDay: {
            value: '@data.afterBindDay',
            placeholder: '最多输入2位整数',
            pattern: /^[1-9][0-9]?$/,
            width: 120,
            patternErrorMessage: '请输入1~99之间的整数',
            readOnly: '@preview'
        },
        memberUserType: {
            value: '@data.memberUserType',
            disabled: '@memberReadOnly'
        },
        cinemaType: {
            value: '@data.cinemaType',
            disabled: '@cinemaReadOnly'
        },
        movieType: {
            value: '@data.movieType',
            disabled: '@movieReadOnly'
        },
        // content: {
        //     required: true
        // },
        // filterMonth: {
        //     width: 15,
        //     orientation: 'vertical',
        //     datasource: [{
        //         name: 3,
        //         value: 3
        //     }]
        // },
        startSendTime: {
            required: true,
            value: '@data.startSendTime'
        },
        lowerBound: {
            value: '@data.lowerBound',
            placeholder: '可不填，最多输入3位整数',
            pattern: /^([1-9][0-9]{0,2})?$/,
            patternErrorMessage: '请输入0~999之间的整数',
            readOnly: '@preview'
        },
        versionType: {
            value: '@data.versionType',
            disabled: true
        },
        sceneType: {
            value: '@data.sceneType',
            disabled: true
        },
        orderTypeLimit: {
            value: '@data.orderTypeLimit',
            disabled: '@preview'
        },
        minValue: {
            value: '@data.minValue',
            width: 80,
            readOnly: '@preview'

        },
        bindStartTime: {
            value: '@data.bindStartTime',
            disabled: '@preview'
        },
        bindEndTime: {
            value: '@data.bindEndTime',
            disabled: '@preview'
        },
        advance: {
            value: '@data.advance',
            disabled: '@preview'
        },
        payMode: {
            value: '@data.payMode',
            disabled: '@preview'
        }
    };

    View.prototype.uiEvents = {
        submitBtn: {
            click: function (e) {
                var view = this;
                view.saveBatch(function (id) {
                    // alert('成功');
                    locator.redirect('/mervouchernewlist');
                });
            }
        },
        saveAndSubmitBtn: {
            click: function () {
                var view = this;
                var model = view.model;
                Dialog.confirm({
                    content: '优惠券投放后，您可以去优惠券管理页查看',
                    title: '提示',
                    raw: 1,
                    width: CONST.SMALL_DIALOG_WIDTH,
                    top: CONST.DIALOG_TOP,
                    onok: function () {
                        // var editPromotionSmsForm = view.get('editPromotionSms');
                        // if (editPromotionSmsForm.validate()) {
                        view.saveBatch(function (id) {
                            model.operateBatch({ids: [id], cmd: 3}, function (data) {
                                if (data.data && data.data.failList && data.data.failList.length) {
                                    var errorMsg = 'ID为 ' + data.data.failList.join('，') + ' 的批次提交失败';
                                    Dialog.alert({
                                        content: errorMsg,
                                        title: '错误提示',
                                        width: CONST.SMALL_DIALOG_WIDTH,
                                        top: CONST.DIALOG_TOP
                                    });
                                    return;
                                }
                                // alert('成功');
                                locator.redirect('/mervouchernewlist');
                            });
                        });
                        // }
                    }
                });
            }
        },
        priceType: {
            change: function (e) {
                var view = this;
                var priceType = view.get('priceType').getValue();
                var $ticketTypeWrapper = $('.ticket-type-wrapper');
                var $orderTypeWrapper = $('.order-type-wrapper');
                var minValue = view.get('minValue');
                var lowerBound = view.get('lowerBound');
                var $frontShow = $('.frontend-show');
                var $piaoFront = $frontShow.find('.danpiao');
                var $danFront = $frontShow.find('.zhengdan');

                view.countVoucherAmount();

                if (priceType === 'TICKET_REDUCE') {
                    $('.price-type-value-tip').html('每张票减');
                    $ticketTypeWrapper.show();
                    $orderTypeWrapper.hide();
                    minValue.disable();
                    lowerBound.enable();
                    $danFront.hide();
                    $piaoFront.show();


                }
                else {
                    $('.price-type-value-tip').html('每单立减');
                    $ticketTypeWrapper.hide();
                    $orderTypeWrapper.show();
                    minValue.enable();
                    lowerBound.disable();
                    $danFront.show();
                    $piaoFront.hide();
                }

            }
        },
        budgetType: {
            change: function (e) {
                var view = this;
                var budgetType = view.get('budgetType').getValue();
                var $budgetValue = $('.budget-value');
                var $budgetCount = $('.budget-count');
                var $budgetAmount = $('.budget-amount');
                var $rollBackWrapper = $('.roll-back-wrapper').find('.ui-boxgroup-radio').eq(2);
                var $rollBackDes = $('.roll-back-des');
                var budgetValue = view.get('budgetValue');
                var budgetCount = view.get('budgetCount');
                var budgetAmount = view.get('budgetAmount');
                var priceAmount = view.get('priceAmount');
                if (initDone) {
                    budgetValue.setValue('');
                    priceAmount.setValue('');
                }


                if (budgetType === 'COUNT') {
                    $rollBackWrapper.hide();
                    $rollBackDes.hide();
                    $budgetCount.hide();
                    $budgetAmount.show();
                    budgetAmount.enable();
                    budgetCount.disable();

                    $budgetValue.find('.control-label').html('投放数量：');
                    $budgetValue.find('.budget-value-unit').html('张');
                    $budgetValue.find('.budget-value-help-tip').html('优惠券被领完后，将停止发放');
                    budgetValue.setProperties({
                        placeholder: '最多输入5位整数',
                        maxLength: 5,
                        pattern: /^[1-9][0-9]{0,4}$/,
                        patternErrorMessage: '应输入1~999,99之间的整数'
                    });


                }
                else if (budgetType === 'AMOUNT') {
                    $rollBackWrapper.show();
                    $rollBackDes.show();
                    $budgetCount.show();
                    $budgetAmount.hide();
                    budgetAmount.disable();
                    budgetCount.enable();

                    $budgetValue.find('.control-label').html('投放预算：');
                    $budgetValue.find('.budget-value-unit').html('元');
                    $budgetValue.find('.budget-value-help-tip')
                        .html('结算时，系统将按照优惠券<span class="red">实际</span>使用数量从结算对账单中扣除');
                    budgetValue.setProperties({
                        placeholder: '最多输入7位整数',
                        maxLength: 7,
                        pattern: /^[1-9][0-9]{0,6}$/,
                        patternErrorMessage: '应输入1~999,999,9之间的整数'
                    });
                }

                view.countVoucherAmount();

            }
        },
        budgetValue: {
            input: function (e) {
                var view = this;
                view.countVoucherAmount();

            }
        },
        priceAmount: {
            input: function (e) {
                var view = this;
                view.countVoucherAmount();

            }
        },
        ticketTypeLimit: {
            change: function (e) {
                var view = this;
                view.countVoucherAmount();

            }
        },
        useTimeType: {
            change: function (e) {
                var view = this;
                var value = e.target.getValue();
                // var useStartTime = view.get('useStartTime');
                var useEndTime = view.get('useEndTime');
                var afterBindDay = view.get('afterBindDay');
                // var setAfterBindDay = $('.setAfterBindDay');
                // var setUseRange = $('.setUseRange');
                var ifReadOnly = view.model.get('preview');
                if (value === 'NO_LIMIT') {
                    // useStartTime.disable();
                    useEndTime.disable();
                    afterBindDay.disable();
                    afterBindDay.setValue('');
                }
                else if (value === 'RANGE') {
                    afterBindDay.disable();
                    afterBindDay.setValue('');
                    if (!ifReadOnly) {
                        // useStartTime.enable();
                        useEndTime.enable();
                    }
                }
                else if (value === 'ROLL_BACK') {
                    afterBindDay.disable();
                    afterBindDay.setValue('');
                    // useStartTime.disable();
                    useEndTime.disable();
                }
                else {
                    if (!ifReadOnly) {
                        afterBindDay.enable();
                        // useStartTime.disable();
                        useEndTime.disable();
                    }
                }
            }
        },
        memberUserType: {
            change: function (e) {
                var value = e.target.getValue();
                var view = this;
                var model = view.model;
                var $memberSetAll = $('.member-set').find('.ui-boxgroup-wrapper span');

                if (value === 'ALL') {
                    $('.member-count').html('0').closest('.set-count').hide();

                    var data = model.get('data');
                    data.memberUserValues = [];
                    model.set('data', data);
                    model.set('memberUserValues', []);
                    $('.member-count').html('0');
                    $memberSetAll.removeClass('choose');
                    $memberSetAll.eq(0).addClass('choose');
                }
                else if (value === 'CUSTOM') {
                    $('.member-count').closest('.set-count').show();
                    $memberSetAll.removeClass('choose');
                    $memberSetAll.eq(1).addClass('choose');
                }
            }
        },
        movieType: {
            change: function (e) {
                var value = e.target.getValue();
                var view = this;
                var model = view.model;
                var $movieSetAll = $('.movie-set').find('.ui-boxgroup-wrapper span');

                if (value === 'ALL') {

                    $('.movie-count').html('0').closest('.set-count').hide();
                    var data = model.get('data');
                    data.movieIds = '';
                    model.set('data', data);
                    model.set('movieValues', '');

                    $('.movie-count').html('0');
                    $movieSetAll.removeClass('choose');
                    $movieSetAll.eq(0).addClass('choose');
                }
                else if (value === 'WHITE') {
                    $('.movie-count').closest('.set-count').show();
                    $movieSetAll.removeClass('choose');
                    $movieSetAll.eq(1).addClass('choose');
                    // view.chooseMoviePop('movieWhiteRule');
                }
                else if (value === 'BLACK') {
                    $('.movie-count').closest('.set-count').show();
                    $movieSetAll.removeClass('choose');
                    $movieSetAll.eq(2).addClass('choose');
                    // view.chooseMoviePop('movieWhiteRule');
                }
            }
        },
        cinemaType: {
            change: function (e) {
                var value = e.target.getValue();
                var view = this;
                var model = view.model;
                var $cinemaSetAll = $('.cinema-set').find('.ui-boxgroup-wrapper span');

                if (value === 'ALL') {
                    $('.cinema-count').html('0').closest('.set-count').hide();
                    var data = model.get('data');
                    data.cinemaWhiteInfos = [];
                    model.set('cinemaListData', []);
                    model.set('cinemaIds', []);


                    $('.cinema-count').html('0');
                    $cinemaSetAll.removeClass('choose');
                    $cinemaSetAll.eq(0).addClass('choose');
                }
                else if (value === 'WHITE') {
                    $('.cinema-count').closest('.set-count').show();
                    $cinemaSetAll.removeClass('choose');
                    $cinemaSetAll.eq(1).addClass('choose');
                    // view.chooseMoviePop('movieWhiteRule');
                }
                else if (value === 'BLACK') {
                    $('.cinema-count').closest('.set-count').show();
                    $cinemaSetAll.removeClass('choose');
                    $cinemaSetAll.eq(2).addClass('choose');
                    // view.chooseMoviePop('movieWhiteRule');
                }
            }
        },
        versionType: {
            change: function (e) {
                var value = e.target.getValue();
                // var view = this;
                // var model = view.model;
                var $versionSetAll = $('.version-set').find('.ui-boxgroup-wrapper span');

                if (value === 'ALL') {
                    $versionSetAll.removeClass('choose');
                    $versionSetAll.eq(0).addClass('choose');
                }
                else if (value === 'TWO_DIM') {
                    $versionSetAll.removeClass('choose');
                    $versionSetAll.eq(1).addClass('choose');
                    // view.chooseMoviePop('movieWhiteRule');
                }
                else if (value === 'TWO_THREE_DIM') {
                    $versionSetAll.removeClass('choose');
                    $versionSetAll.eq(2).addClass('choose');
                    // view.chooseMoviePop('movieWhiteRule');
                }
            }
        },
        sceneType: {
            change: function (e) {
                var value = e.target.getValue();
                // var view = this;
                // var model = view.model;
                var $sceneSetAll = $('.scene-set').find('.ui-boxgroup-wrapper span');

                if (value === 'ALL') {
                    $sceneSetAll.removeClass('choose');
                    $sceneSetAll.eq(0).addClass('choose');
                }
                else if (value === 'PRIME_TIME') {
                    $sceneSetAll.removeClass('choose');
                    $sceneSetAll.eq(1).addClass('choose');
                    // view.chooseMoviePop('movieWhiteRule');
                }
                else if (value === 'NORMAL_TIME') {
                    $sceneSetAll.removeClass('choose');
                    $sceneSetAll.eq(2).addClass('choose');
                    // view.chooseMoviePop('movieWhiteRule');
                }
            }
        },
        orderTypeLimit: {
            change: function (e) {
                var value = e.target.getValue();
                var minValue = this.get('minValue');

                if (value.indexOf('1') >= 0) {
                    minValue.enable();
                }
                else {
                    minValue.disable();
                    minValue.setValue('');
                }
            }
        },
        advance: {
            change: function (e) {
                var value = e.target.getValue();
                var $moreLimitsWrapper = $('.more-limits-wrapper');
                if (value === '1') {
                    $moreLimitsWrapper.show();
                }
                else {
                    $moreLimitsWrapper.hide();
                }

            }
        },
        content: {
            input: function (e) {
                this.updatePreview();
            }
        },
        bindStartTime: {
            focus: function () {
                $('.bind-time-msg').html('');
            }
        },
        bindEndTime: {
            focus: function () {
                $('.bind-time-msg').html('');
            }
        },
        cancelBtn: {
            click: function () {
                var cancelUrl = 'mervouchernewlist';
                var queryObj = URL.parseQuery(commonUtil.getHashParam().replace('~', '')) || {};
                delete queryObj.id;
                locator.redirect('/' + cancelUrl + '~' + URL.serialize(queryObj));
            }
        }
    };

    /**
     * 编辑限制条件——统一入口（影片、影院）
     *
     * @param  {string} relateType 编辑类型
     */
    View.prototype.choosePop = function (relateType) {
        var view = this;
        var model = view.model;
        var data = model.get('data') || {};
        var dialogWidth;
        var title;
        var ruleData;
        var extraData;
        var actionCallback;
        var id = model.get('id');

        switch (relateType) {
            case 'userGroupRule':
                title = '会员限制';
                ruleData = {
                    userGroupRule: {
                        contents: []
                    },
                    memberUserRule: {
                        contents: model.get('memberUserValues') || []
                    }
                };
                dialogWidth = CONST.SMALL_DIALOG_WIDTH;
                extraData = {
                    id: id,
                    type: 'MERCHANT_COUPON',
                    readOnly: model.get('preview')
                };
                actionCallback = function (memberCount, memberIds) {
                    $('.member-count').html(memberCount);
                    model.set('memberUserValues', memberIds.split(','));
                };
                break;
            case 'movieWhiteRule':
                title = '影片限制';
                ruleData = model.get('movieValues') || data.movieValues;
                ruleData = ruleData ? ruleData.join(',') : '';
                dialogWidth = CONST.LARGE_DIALOG_WIDTH;
                extraData = {
                    id: id,
                    type: 'MERCHANT_COUPON',
                    readOnly: model.get('preview')
                };
                actionCallback = function (movieCount, movieIds) {
                    $('.movie-count').html(movieCount);
                    model.set('movieValues', movieIds);
                };
                break;
            case 'cinemaMerRule':
                title = '影院限制';
                ruleData = model.get('cinemaValues') || data.cinemaValues;
                dialogWidth = CONST.LARGE_DIALOG_WIDTH;
                extraData = {
                    id: id,
                    type: 'MERCHANT_COUPON',
                    readOnly: model.get('preview')
                };
                actionCallback = function (cinemaCount, cinemaIds, cinemaListData) {
                    $('.cinema-count').html(cinemaCount);
                    model.set('cinemaIds', cinemaIds);
                    model.set('cinemaValues', cinemaListData);
                };
                break;
            default:
                dialogWidth = CONST.LARGE_DIALOG_WIDTH;
                break;
        }

        view.popActionDialog({
            title: title,
            url: '/' + relateType.toLowerCase() + 'edit',
            width: dialogWidth,
            top: CONST.DIALOG_TOP,
            actionOptions: {
                dataFrom: 'merchantVoucher',
                ruleData: ruleData,
                extraData: extraData,
                actionCallback: actionCallback
            }
        });
    };

    /**
     * 计算优惠张数、金额
     * （按金额，X张数 = 预算 /（面值 * Y），Y= { 按票优惠时：1，2，3； 按订单优惠时：1 } ）
     * （按张数，X元 = （面值 * Y * 数量），Y= { 按票优惠时：1，2，3； 按订单优惠时：1 } ）
     */
    View.prototype.countVoucherAmount = function () {
        var view = this;
        var budgetType = view.get('budgetType').getValue();
        var budgetValue = view.get('budgetValue').getValue();
        var priceAmount = view.get('priceAmount').getValue();
        var budgetCount = view.get('budgetCount');
        var budgetAmount = view.get('budgetAmount');

        if (!budgetValue || !priceAmount) {
            budgetCount.setValue('');
            budgetAmount.setValue('');
        }
        else {
            var $payMax = $('.pay-max-tip');
            var priceType = view.get('priceType').getValue();
            var times = 1;
            if (priceType === 'TICKET_REDUCE') {
                times = view.get('ticketTypeLimit').getValue() || 2;
            }
            var countVoucherAmount = '';

            if (budgetType === 'COUNT') {
                try {
                    countVoucherAmount = parseInt((budgetValue * priceAmount * times), 10);
                    budgetAmount.setValue(countVoucherAmount);
                    $payMax.html(countVoucherAmount);
                }
                catch (e) {
                    budgetAmount.setValue('');
                }

            }
            else if (budgetType === 'AMOUNT') {
                try {
                    $payMax.html(budgetValue);
                    countVoucherAmount = parseInt((budgetValue * 100) / (priceAmount * 100 * times), 10);
                    budgetCount.setValue(countVoucherAmount);
                }
                catch (e) {
                    budgetCount.setValue('');
                }
            }
        }

    };

/* eslint-disable */
    /**
     * 保存商家券数据
     *
     * @param {Function} successCallback 保存成功的回调函数，传入id
     */
    View.prototype.saveBatch = function (successCallback) {
        var view = this;
        var model = view.model;
        var editBatchInfoForm = view.get('editBatchInfo');
        valid = editBatchInfoForm.validate();
        var sendData = view.get('editBatchInfo').getData();
        // 预算转成分
        // sendData.amount = Number(sendData.amount) * 100;
        // 兼容日期格式，替换连字符
        // sendData.startSendTime = new Date($('.startSendTime').val().replace(/-/g, '/')).getTime() || 0;

        // 预算超支，包含链接，内容超长不能提交
        // if (checkBudgetFlag || validUrlFlag || exceedMaxSizeFlag) {
        // if (validUrlFlag || exceedMaxSizeFlag) {
        //     return;
        // }

        // sendData.cinemas = cinemaIds;
        // 短信内容
        // sendData.content = $('.sms-preview-container textarea').html().replace(/\【百度糯米\】/, '');

        // 删除无用字段
        // delete sendData.newCustomerType;
        // delete sendData.frequency;

        // 绑定有效期校验
        var bindStartTime = $('.bindStartTime').val();
        var bindEndTime = $('.bindEndTime').val();

        if (!bindStartTime || !bindEndTime) {
            $('.bind-time-msg').html('不能为空');
            valid = false;
        }

        if (!commonUtil.timeValidate(bindStartTime, bindEndTime)) {
            $('.bind-time-msg').html('结束时间须大于开始时间');
            valid = false;
        }

        // 使用有效期校验
        var useTimeType = view.get('useTimeType').getValue();
        var useStartTime = $('.useStartTime').val();
        var useEndTime = $('.useEndTime').val();
        if (useTimeType === 'RANGE') {
            if (!commonUtil.timeValidate(useStartTime, useEndTime)) {
                $('.use-time-msg').html('结束时间须大于开始时间');
                valid = false;
            }
        }
        sendData.useStartTime = useStartTime;


        if (valid) {
            $('.form-err-tip').addClass('hide');
        }
        else {
            $('.form-err-tip').removeClass('hide');
            return;
        }

        sendData.priceValue = JSON.stringify({
            reduceAmount: sendData.priceAmount * 100,
            memberReduceAmount: sendData.priceAmount * 100,
            price: sendData.priceAmount * 100,
            count: sendData.ticketTypeLimit || 2,
            lowerBound: (sendData.lowerBound  || '') * 100
        });
        sendData.deductConstraint = {
            minTicket: '',
            minTotalPrice: (sendData.minValue || '') * 100
        };

        if (sendData.orderTypeLimit.indexOf('2') >= 0) {
            sendData.deductConstraint.minTicket = 2;
        }
        sendData.cinemaType = sendData.cinemaType ? sendData.cinemaType : 'ALL';
        sendData.movieType = sendData.movieType ? sendData.movieType : 'ALL';
        sendData.memberUserType = sendData.memberUserType ? sendData.memberUserType : 'ALL';
        sendData.memberUserValues = model.get('memberUserValues') || [];
        sendData.movieValues = model.get('movieValues') || [];
        sendData.cinemaValues = model.get('cinemaIds') || [];
        sendData.advance = sendData.advance ? sendData.advance : 0;
        sendData.versionType = 'ALL';
        sendData.sceneType = 'ALL';

        if (sendData.cinemaType !== 'ALL'
            && !sendData.cinemaValues.length
        ) {
            Dialog.alert({
                title: '提示',
                content: '影院限制不选全部，至少配置一个影院',
                width: CONST.SMALL_DIALOG_WIDTH
            });
            return;
        }

        if (sendData.movieType !== 'ALL'
            && !sendData.movieValues.length
        ) {
            Dialog.alert({
                title: '提示',
                content: '影片限制不选全部，至少配置一个影片',
                width: CONST.SMALL_DIALOG_WIDTH
            });
            return;
        }


        delete sendData.priceAmount;
        delete sendData.ticketTypeLimit;
        delete sendData.lowerBound;
        delete sendData.minValue;
        delete sendData.minTicket;

        delete sendData.priceAmount;


        model.saveBatchInfo(sendData, function (data) {
            if (data && data.data && data.data.id) {
                successCallback && successCallback(data.data.id);
            }
            else {
                Dialog.alert({
                    title: '提示',
                    content: data && data.data && data.data.message || '保存批次失败',
                    width: CONST.SMALL_DIALOG_WIDTH
                });
            }
        }, function (data) {
            Dialog.alert({
                title: '提示',
                content: '保存批次失败',
                width: CONST.SMALL_DIALOG_WIDTH
            });
        });
    };
/* eslint-enable */

    /**
     * 更新短信预览内容
     *
     */
    // View.prototype.updatePreview = function () {
    //     var me = this;
    //     var $preview = $('.sms-preview-container textarea'); // 预览容器
    //     var $inputMsg = $('.sms-input-msg');
    //     var $smsInputNum = $('.smsInputNum'); // 输入提示
    //     var $smsRemainNum = $('.smsRemainNum'); // 剩余提示
    //     var $smsSectionNum = $('.smsSectionNum'); // 短信分成几部分发送

    //     var previewContent = me.get('content').getValue() || '';
    //     var brandName = me.model.get('brandName') || '';
    //     var inputLength = 0;

    //     // 校验内容，不能包含链接
    //     if (CONST.PROMOTION_SMS_URL_REG.test(previewContent)) {
    //         $preview.html('内容中包含链接，请修改');
    //         $inputMsg.hide();
    //         validUrlFlag = true;
    //         return;
    //     }
    //     validUrlFlag = false;
    //     $inputMsg.show();
    //     // 添加影院短链接
    //     if (cinemaShortLink) {
    //         previewContent += ' 优惠购票：' + cinemaShortLink;
    //     }
    //     // 添加退订内容
    //     previewContent = '【百度糯米】' + brandName + '提醒您：' + previewContent + ' 回TD退订';
    //     // 更新输入提示
    //     inputLength = previewContent.length;
    //     $smsInputNum.text(inputLength);
    //     var remainNum = SMS_MAX_SIZE - inputLength;
    //     if (remainNum < 0) { // 超过最大输入长度
    //         exceedMaxSizeFlag = true;
    //         $preview.html('内容超长，请修改');
    //         $inputMsg.hide();
    //         return;
    //     }
    //     exceedMaxSizeFlag = false;
    //     $inputMsg.show();
    //     $smsRemainNum.text(remainNum);
    //     $smsSectionNum.text(Math.ceil(inputLength / SMS_SECTION_SIZE));
    //     $preview.html(previewContent);
    // };

    /**
     * 根据brandName 查询短链接
     *
     * @param {string} brandName 院线名称
     */
    // View.prototype.getCinemaShortLink = function (brandName) {
    //     var me = this;
    //     if (!cinemaShortLink) {
    //         if (!brandName) {
    //             Dialog.alert({
    //                 title: '提示',
    //                 content: '还未选择影院，无法生成链接',
    //                 width: CONST.SMALL_DIALOG_WIDTH
    //             });
    //         }
    //         else {
    //             // 查询短链接
    //             me.model.fetchCinemaShortLink(function (data) {
    //                 if (data.status === 0 && data.data && data.data.result) {
    //                     // 去除协议头减少长度
    //                     cinemaShortLink = data.data.result.trim().replace(/^https?:\/\//, '');
    //                     me.updatePreview();
    //                 }
    //             });
    //         }
    //         return;
    //     }
    // };

    // View.prototype.initSmsContent = function () {
    //     var view = this;
    //     var model = view.model;
    //     var previewSmsContent = model.get('data').content || '';
    //     $('.sms-preview-container textarea').html(previewSmsContent);
    //     var reg = /^(?:.*?提醒您：)(.*?)(?=(?:优惠购票：(dwz\.cn\/\S*))?\s+回TD退订)/g;
    //     var matches = reg.exec(previewSmsContent);
    //     if (matches) {
    //         view.get('content').setValue(matches[1]);
    //         cinemaShortLink = matches[2];
    //     }
    //     view.updatePreview();
    // };

    View.prototype.initBindEvents = function () {
        var view = this;

        view.get('priceType').fire('change');
        view.get('budgetType').fire('change');
        view.get('advance').fire('change');
        view.get('movieType').fire('change');
        view.get('cinemaType').fire('change');
        view.get('sceneType').fire('change');
        view.get('versionType').fire('change');
        view.get('memberUserType').fire('change');
        view.get('orderTypeLimit').fire('change');


        $('.preview-choose').on('click', function (e) {
            var $target = $(e.target);

            if ($target.hasClass('preview-cinema')) {
                view.choosePop('cinemaMerRule');

            }
            else if ($target.hasClass('preview-movie')) {
                view.choosePop('movieWhiteRule');
            }
            else if ($target.hasClass('preview-member')) {
                view.choosePop('userGroupRule');
            }
        });




        $('.member-set').on('click', 'input', function (e) {
            var $target = $(e.target);
            var value = $target.val();
            if (value === 'ALL') {

            }
            else if (value === 'CUSTOM') {
                view.choosePop('userGroupRule');
            }
        });

        $('.movie-set').on('click', 'input', function (e) {
            var $target = $(e.target);
            var value = $target.val();
            if (value === 'ALL') {

            }
            else if (value === 'WHITE') {
                view.choosePop('movieWhiteRule');
            }
            else if (value === 'BLACK') {
                view.choosePop('movieWhiteRule');
            }
        });

        $('.cinema-set').on('click', 'input', function (e) {
            var $target = $(e.target);
            var value = $target.val();
            if (value === 'ALL') {

            }
            else if (value === 'WHITE') {
                view.choosePop('cinemaMerRule');
            }
            else if (value === 'BLACK') {
                view.choosePop('cinemaMerRule');
            }
        });

        $('.bindStartTime').calendar({
            format: 'yyyy-MM-dd HH:mm',
            minDate: '%y-%M-%d',
            defaultValue: '%y-%M-%d 00:00'
        });
        // $('.useStartTime').calendar({
        //     format: 'yyyy-MM-dd HH:mm',
        //     minDate: '%y-%M-%d',
        //     defaultValue: dateNow
        // });

        $('.bindEndTime,.useEndTime').calendar({
            format: 'yyyy-MM-dd HH:mm',
            minDate: '%y-%M-%d',
            defaultValue: '%y-%M-%d 00:00'
        });

        $('.form-horizontal').on('click', function (e) {
            var target = e.target;
            var $target = $(e.target);
            if ($target.hasClass('Wdate')) {
                var index = $('.Wdate').index(target);
                index = index > 1 ? 1 : 0;
                $('.time-err-msg').eq(index).html('');
            }
        });
    };

    View.prototype.initSet = function () {
        var view = this;
        var model = view.model;
        var data = model.get('data');
        view.get('useTimeType').fire('change');

        if (data.cinemaType !== 'ALL') {
            if (model.get('cinemaIds')) {
                $('.cinema-count').html(model.get('cinemaIds').length);
            }
        }
        if (data.movieType !== 'ALL') {
            if (data.movieValues) {
                $('.movie-count').html(data.movieValues.length);
            }
        }
        if (data.memberUserType !== 'ALL') {
            if (data.memberUserValues) {
                $('.member-count').html(data.memberUserValues.length);
            }
        }
    };

    View.prototype.enterDocument = function () {
        var view = this;
        UIView.prototype.enterDocument.apply(view, arguments);
        initDone = false;


        view.initBindEvents();
        view.initSet();

        // view.initSmsContent();

        // if (view.model.get('preview')) {
        //     $('#inputTextHolder').attr({
        //         readOnly: ''
        //     });
        // }

        // 初始化之后，切换按钮才要清空一些值，用来做判断
        initDone = true;
    };

    util.inherits(View, UIView);

    return View;
});

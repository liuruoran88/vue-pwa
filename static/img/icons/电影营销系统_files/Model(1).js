/**
 * @file 新建/编辑新商家券 Model
 * @author liuruoran<liuruoran@baidu.com>
 */

define(function (require) {

    var UIModel = require('ef/UIModel');
    var util = require('er/util');
    var url = require('common/url');
    var moment = require('moment');
    // var datasource = require('er/datasource');
    var ajax = require('er/ajax');
    var lib = require('esui/lib');
    var CINEMA_URL_TPL = 'https://mdianying.baidu.com/info/cinema/nearby'
        + '?tabIndex=0&brandId=${brandId}&brandName=${brandName}';

    /**
     * constructor
     *
     * @class
     */
    function Model() {
        UIModel.apply(this, arguments);
        var me = this;
        var id = me.get('id');
        if (id) {
            me.datasource = {
                data: function () {
                    return ajax.post(url.GET_MECHANT_COUPON_BATCH_LIST, {
                        id: id,
                        pageSize: 1,
                        pageNo: 0
                    }, true);
                },
                cinemaList: function () {
                    return ajax.post(url.GET_USER_CINEMAS, {
                        id: id,
                        cityIds: '',
                        type: 'MERCHANT_COUPON'
                    }, true);
                },
                movieList: function () {
                    return ajax.post(url.GET_USER_MOVIES, {
                        id: id,
                        cityIds: '',
                        type: 'MERCHANT_COUPON'
                    }, true);
                },
                memberDataList: function () {
                    return ajax.post(url.GET_USER_MEMBER_DATA, {
                        id: id,
                        cityIds: '',
                        type: 'MERCHANT_COUPON'
                    }, true);
                }
            };
        }
        else {
            me.datasource = {
                data: function () {
                    return {
                        data: {
                            listData: [{}]
                        }
                    };
                },
                cinemaList: function () {
                    return ajax.post(url.GET_USER_CINEMAS, {
                        id: id,
                        cityIds: '',
                        type: 'MERCHANT_COUPON'
                    }, true);
                },
                movieList: function () {
                    return ajax.post(url.GET_USER_MOVIES, {
                        id: id,
                        cityIds: '',
                        type: 'MERCHANT_COUPON'
                    }, true);
                },
                memberDataList: function () {
                    return ajax.post(url.GET_USER_MEMBER_DATA, {
                        id: id,
                        cityIds: '',
                        type: 'MERCHANT_COUPON'
                    }, true);
                }
            };
        }

    }

    Model.prototype.prepare = function () {
        var me = this;
        var data = me.get('data').data.listData[0];
        me.processEditData(data);

        var cinemaList = me.get('cinemaList').data.listData;
        if (cinemaList && cinemaList.length <= 1) {
            me.set('cinemaReadOnly', true);
        }
        var movieList = me.get('movieList').data;
        if (movieList && movieList.length <= 1) {
            me.set('movieReadOnly', true);
        }

        var memberDataList = me.get('memberDataList').data;
        if (memberDataList && memberDataList.length <= 1) {
            me.set('memberReadOnly', true);
        }

        me.set('data', data);
    };

    Model.prototype.processEditData = function () {
        var me = this;
        var data = me.get('data').data.listData[0];
        var dateNow = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm');

        var isPreview = !(!data.id || data.dispatchStatus === 1);
        data.priceType = data.priceType ? data.priceType : 'TICKET_REDUCE';
        data.budgetType = data.budgetType ? data.budgetType : 'AMOUNT';
        data.advance = data.advance ? data.advance + '' : '';
        data.versionType = 'ALL';
        data.sceneType = 'ALL';
        data.movieType = data.movieType ? data.movieType : 'ALL';
        data.cinemaType = data.cinemaType ? data.cinemaType : 'ALL';
        data.memberUserType = data.memberUserType ? data.memberUserType : 'ALL';
        data.useTimeType = !data.useTimeType ? 'RANGE' : '' + data.useTimeType;
        data.useStartTime = !data.useStartTime ? dateNow : '' + data.useStartTime;

        // 按票or 按订单  包装的一些参数拆出来
        var priceValue = JSON.parse(data.priceValue || '{}');
        var deductConstraint = data.deductConstraint || {};
        data.ticketTypeLimit = priceValue.count ?  priceValue.count + '' : '2';
        data.lowerBound = priceValue.lowerBound ? priceValue.lowerBound / 100 : '';
        if (data.priceType === 'FIX') {
            data.priceAmount = priceValue.price ? priceValue.price / 100 : '';
        }
        else if (data.priceType === 'TICKET_REDUCE') {
            data.priceAmount = priceValue.reduceAmount ? priceValue.reduceAmount / 100 : '';
        }

        data.orderTypeLimit = deductConstraint.minTotalPrice ?  '1' : '';
        data.minValue = deductConstraint.minTotalPrice ? deductConstraint.minTotalPrice / 100 : '';
        if (deductConstraint.minTicket) {
            data.orderTypeLimit = [data.orderTypeLimit, deductConstraint.minTicket].join(',');
        }

        var cinemaIds = [];
        var cinemaValues = data.cinemaValues || [];
        var cinemalength = cinemaValues.length;
        var i = 0;
        while (i < cinemalength) {
            cinemaIds.push(cinemaValues[i].cinemaId);
            i++;
        }

        me.fill({
            data: data,
            preview: isPreview,
            cinemaReadOnly: isPreview,
            movieReadOnly: isPreview,
            memberReadOnly: isPreview,
            cinemaValues: data.cinemaValues || [],
            cinemaIds: cinemaIds,
            memberUserValues: data.memberUserValues || [],
            movieValues: data.movieValues || []
        });

    };

    Model.prototype.saveBatchInfo = function (data, callback, failCallback) {
        var me = this;
        var id = me.get('id');

        if (id) {
            util.mix(data, {id: id});
        }

        ajax.post(url.SAVE_MERCHANT_BATCH_INFO, data, true).then(function (data) {
            callback && callback(data);
        }, function (data) {
            failCallback && failCallback(data);
        });
    };

    Model.prototype.operateBatch = function (data, callback) {
        ajax.post(url.OPERATE_MERCHANT_COUPON_BATCH, data, true).then(function (data) {
            callback && callback(data);
        });
    };

    Model.prototype.fetchCinemaShortLink = function (callback) {
        var me = this;
        var originUrl = lib.format(CINEMA_URL_TPL, {
            brandId: me.get('brandId'),
            brandName: encodeURIComponent(me.get('brandName'))
        });
        ajax.post(url.GET_SHORT_LINK, {link: originUrl}, true).then(function (data) {
            callback && callback(data);
        });
    };

    // Model.prototype.checkBudget = function (data, callback) {
    //     ajax.post(url.CHECK_MERCHANT_PROMOTION_SMS_BUDGET, data, true).then(function (data) {
    //         callback && callback(data);
    //     });
    // };

    Model.prototype.submitSms = function (data, callback) {
        ajax.post(url.OPERATE_MERCHANT_PROMOTION_SMS, data, true).then(function (data) {
            callback && callback(data);
        });
    };

    util.inherits(Model, UIModel);

    return Model;
});

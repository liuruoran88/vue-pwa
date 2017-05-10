/**
 * @file 封装底层ajax请求的业务层post请求
 * @author wuhuiyao
 */
define(function (require, exports) {

    var Deferred = require('er/Deferred');
    var Observable = require('er/Observable');
    var ajax = require('er/ajax');
    var util = require('common/util');
    var Dialog = require('esui/Dialog');
    var loading = require('common/ui/loading');
    /**
     * 默认ajax请求超时时间
     *
     * @type {number}
     */
    var TIMEOUT = 30000;

    /**
     * 缓存的ajax请求的数据
     *
     * @type {Object}
     * @private
     */
    /* eslint-disable */
    var _cachePool = {};
    /* eslint-enable */
    /**
     * 获取 post 请求参数
     *
     * @param {string} url 请求地址
     * @param {Object} params 请求参数
     * @param {Object=} options 其它附加选项信息，可选
     * @param {Object=} options.query 要追加的查询参数，可选
     * @return {Object}
     * @inner
     */

    function getPostParams(url, params, options) {
        options = options || {};
        params = params ? util.clone(params) : {};

        // csrf token from cookie
        var token = util.getCookieByName('__cas__st__266');
        params.token = token;

        // 转下格式
        // params = { params: params };

        // url.indexOf('?') === -1 ? (url += '?') : (url += '&');
        // url += 'castk=LTE%3D';

        // 追加附加的查询参数
        var query = options.query || {};
        for (var k in query) {
            if (query.hasOwnProperty(k)) {
                url += ('&' + encodeURIComponent(k)
                    + '=' + encodeURIComponent(query[k]));
            }
        }

        return {
            method: 'POST',
            url: url,
            data: params,
            timeout: TIMEOUT
        };
    }

    /**
     * 处理响应数据
     *
     * @param {string} url 请求url
     * @param {Deferred} deferred
     * @param {string} response 请求返回的数据
     * @param {boolean=} cache 是否缓存响应数据，可选，默认false
     * @inner
     */

    function processResponse(url, deferred, response, cache) {
        try {
            var data = JSON.parse(response);

            if (!data) {
                throw 'response data is not validated: ' + response;
            }
            // 如果后端抛错可以在这里输出
            if (parseInt(data.status, 10) === -2) {
                location.href = data.data + '&u=' + encodeURIComponent(location.href);
                return;
            }
            if (data.statusInfo && data.statusInfo.errorDesc) {
                Dialog.alert({
                    title: '错误',
                    content: data.statusInfo.errorDesc,
                    width: 500
                }, true);

                deferred.reject(data);
                // return
            }
            // 增加是否返回成功的状态信息，减少各种status === 0判断逻辑，代码可读性也更好
            // NOTICE: 后端response信息，不能包含isSuccess字段
            data.isSuccess = data.status === 0;


            // 对返回的一些全局处理，如重定向等。
            commonHander(data);

            /**
             * 解析返回的数据成功触发的事件
             *
             * @event success
             * @param {Object} e 事件参数对象
             * @param {Object} e.url 请求url
             * @param {Object} e.data 响应成功的数据对象
             */
            exports.fire('success', {url: url, data: data});

            if (cache) {
                _cachePool[url] = response;
            }

            deferred.resolve(data);
        }
        catch (ex) {

            var param = {url: url, error: ex};

            /**
             * 请求数据失败触发的事件
             *
             * @event fail
             * @param {Object} e 事件参数对象
             * @param {Object} e.url 请求url
             */
            exports.fire('fail', param);

            deferred.reject(param);
        }
    }

    /**
     *   对返回的统一处理，如重定向
    */

    function commonHander(response) {

        if (response.status === 300) {
            response.location && (window.location = response.location);
        }

    }


    /**
     * 发送一个JSONP请求
     *
     * @param {string} url 请求的URL
     * @param {Object=} params 附加的查询参数，可选
     * @return {Prmoise}
     */
    exports.jsonp = function (url, params) {
        var deferred = new Deferred();
        var fakeReq = deferred.promise;

        /**
         * 发送请求触发事件
         *
         * @event send
         * @param {Object} e 事件参数对象
         * @param {string} e.url 请求url
         */
        exports.fire('send', {url: url});

        $.ajax({
            url: url,
            dataType: 'jsonp',
            data: util.clone(params || {}),
            timeout: TIMEOUT,
            jsonp: 'callback',
            success: function (data) {

                /**
                 * 请求数据成功触发的事件
                 *
                 * @event success
                 * @param {Object} e 事件参数对象
                 * @param {Object} e.url 请求url
                 * @param {Object} e.data 响应成功的数据对象
                 */
                exports.fire('success', {url: url, data: data, jsonp: true});

                deferred.resolve(data);
            },
            error: function (jqXHR, txtStatus, error) {

                var param = {url: url, error: error};

                /**
                 * 请求数据失败触发的事件
                 *
                 * @event fail
                 * @param {Object} e 事件参数对象
                 * @param {Object} e.url 请求url
                 */
                exports.fire('fail', param);

                deferred.reject({txtStatus: txtStatus, error: error});
            }
        });

        return fakeReq;
    };

    /**
     * 请求数据，若options.cache为true，如果有的话，会默认返回上次缓存的数据，如果没有，
     * 会请求数据，并对返回的数据进行缓存；若为false，则不管是否有缓存，重新发送请求。
     *
     * @param {string} url 请求的url
     * @param {?Object} params 请求参数
     * @param {Object=} options 其它附加选项信息，可选
     * @param {Object=} options.query 要追加到url的查询参数，可选
     * @param {boolean=} options.cache 是否缓存异步请求返回的数据或者是否使用缓存的数据，
     *                   可选，默认不缓存
     * @return {Promise}
     */
    exports.request = function (url, params, options) {

        loading.show();
        options = util.clone(options || {});

        // 获取缓存选项参数，并删除，其并不是作为请求参数一部分
        var cache = options.cache;
        delete options.cache;

        var postParams = getPostParams(url, params, options);
        url = postParams.url;
        var deferred = new Deferred();

        if (cache && _cachePool[url]) {

            // 如果使用缓存并有缓存数据直接以缓存数据响应
            processResponse(url, deferred, _cachePool[url]);
        }
        else {

            /**
             * 发送ajax请求触发事件
             *
             * @event send
             * @param {Object} e 事件参数对象
             * @param {string} e.url 请求url
             */
            exports.fire('send', {url: url});

            // 否则，发送ajax请求
            var fakeReq = ajax.request(postParams);

            deferred.abort = fakeReq.abort;
            fakeReq.then(

                // 成功响应处理
                function (response) {

                    // 请求被abort可能会触发该方法
                    loading.hide();
                    processResponse(url, deferred, response, cache);
                },

                // 响应失败处理
                function (fakeXhr) {
                    loading.hide();
                    var param = {url: url};
                    var content = '系统正在维护中...请稍候再试';

                    if (fakeXhr) {
                        var status = fakeXhr.status;
                        param.status = status;
                        param.error = fakeXhr.error;
                        param.timeout = status === 408;
                        param.abort = !param.timeout
                            && (fakeXhr.readyState !== 4 || status === 0);
                        if (fakeXhr.status === 404) {
                            content = 'sorry，请求出错了...请稍候再试';
                        }
                    }

                    /**
                     * 请求数据失败触发的事件
                     *
                     * @event fail
                     * @param {Object} e 事件参数对象
                     * @param {string} e.url 请求url
                     * @param {number} e.status 响应状态码
                     * @param {boolean} e.timeout 是否超时
                     * @param {boolean} e.abort 是否请求被中断
                     * @param {Object|string} e.error 错误对象、信息
                     */

                    Dialog.alert({
                        title: '提示',
                        content: content,
                        width: 600
                    });
                    exports.fire('fail', param);

                    deferred.reject(param);
                }
            );
        }

        var promise = deferred.promise;
        promise.abort = deferred.abort || $.noop;
        return promise;
    };

    Observable.enable(exports);
});

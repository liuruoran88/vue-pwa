/**
 * ER (Enterprise RIA)
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file ajax相关方法
 * @author otakustay
 */
define(
    function (require) {
        var Deferred = require('./Deferred');
        var Dialog = require('esui/Dialog');
        var commonUtil = require('common/util');
        // 总计时器： 5.5h
        var timer;
        // 循环计时器： 20分钟
        var timerPost20;

        /**
         * 生成XMLHttpRequest请求的最终URL
         *
         * @param {string} url 请求的目标URL
         * @param {Object=} data 需要添加的参数
         */
        function resolveURL(url, data) {
            var URL = require('./URL');
            var query = URL.serialize(data);
            if (query) {
                var delimiter = (url.indexOf('?') >= 0 ? '&' : '?');
                return url + delimiter + query;
            }
            else {
                return url;
            }
        }

        /**
         * ajax模块
         */
        var ajax = {};
        require('./Observable').enable(ajax);

        /**
         * 每次请求流程的勾子，包含以下属性：
         *
         * - `beforeExecute`：在执行逻辑以前
         *     - `{Object} options`：请求时的参数
         * - `beforeCreate`：在创建`XMLHttpRequest`前
         *     - `{Object} options`：请求时的参数外加默认参数融合后的对象
         *     - `{Deferred} request`：控制请求的`Deferred`对象
         *     - 返回**true**表示请求已经处理，ajax模块将不再进行后续的逻辑
         * - `beforeSend`：链接打开但没发送数据
         *     - `{FakeXHR} xhr`：伪造的`XMLHttpRequest`对象
         *     - `{Object} options`：请求时的参数外加默认参数融合后的对象
         * - `afterReceive`：在收到返回后
         *     - `{FakeXHR} xhr`：伪造的`XMLHttpRequest`对象
         *     - `{Object} options`：请求时的参数外加默认参数融合后的对象
         * - `afterParse`：在按数据类型处理完响应后
         *     - `{*} data`：返回的数据
         *     - `{FakeXHR} xhr`：伪造的`XMLHttpRequest`对象
         *     - `{Object} options`：请求时的参数外加默认参数融合后的对象
         *     - 返回值将被作为最终触发回调时的数据
         *
         * @type {Object}
         * @public
         */
        ajax.hooks = {};

        ajax.hooks.serializeArray = function (prefix, array) {
            var encodedKey = prefix ? encodeURIComponent(prefix) : '';
            var encoded = [];
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                encoded[i] = ajax.hooks.serializeData('', item);
            }
            return encodedKey
                ? encodedKey + '=' + encoded.join(',')
                : encoded.join(',');
        };

        ajax.hooks.serializeData = function (prefix, data) {
            if (arguments.length === 1) {
                data = prefix;
                prefix = '';
            }

            if (data == null) {
                data = '';
            }
            var getKey = ajax.hooks.serializeData.getKey;
            var encodedKey = prefix ? encodeURIComponent(prefix) : '';

            var type = Object.prototype.toString.call(data);
            switch (type) {
                case '[object Array]':
                    return ajax.hooks.serializeArray(prefix, data);
                case '[object Object]':
                    var result = [];
                    for (var name in data) {
                        var propertyKey = getKey(name, prefix);
                        var propertyValue =
                            ajax.hooks.serializeData(propertyKey, data[name]);
                        result.push(propertyValue);
                    }
                    return result.join('&');
                default:
                    return encodedKey
                        ? encodedKey + '=' + encodeURIComponent(data)
                        : encodeURIComponent(data);
            }
        };

        ajax.hooks.serializeData.getKey = function (propertyName, parentKey) {
            return parentKey ? parentKey + '.' + propertyName : propertyName;
        };

        ajax.config = {
            cache: false
        };

        /**
         * 发起XMLHttpRequest请求
         *
         * @param {Object} options 相关配置
         * @param {string} options.url 请求的地址
         * @param {string=} options.method 请求的类型
         * @param {Object=} options.data 请求的数据
         * @param {string=} options.dataType 返回数据的类型，
         * 可以为**json**或**text**，默认为**responseText**
         * @param {number=} options.timeout 超时时间
         * @param {boolean=} options.cache 决定是否允许缓存
         * @return {FakeXHR} 一个`FakeXHR`对象，
         * 该对象有Promise的所有方法，以及`XMLHTTPRequest`对象的相应方法
         */
        ajax.request = function (options) {
            if (typeof ajax.hooks.beforeExecute === 'function') {
                ajax.hooks.beforeExecute(options);
            }

            var assert = require('./assert');
            assert.hasProperty(options, url, 'url property is required');

            var defaults = {
                method: 'POST',
                data: {},
                cache: true
            };
            var util = require('./util');
            options = util.mix(defaults, options);
            this.timerPost20();
            if (!options.data) {
                options.data = {};
            }
            options.data.castk = commonUtil.getCastk();

            var requesting = new Deferred();

            if (typeof ajax.hooks.beforeCreate === 'function') {
                var canceled = ajax.hooks.beforeCreate(options, requesting);
                if (canceled === true) {
                    var fakeXHR = requesting.promise;
                    fakeXHR.abort = function () {};
                    fakeXHR.setRequestHeader = function () {};
                    return fakeXHR;
                }
            }

            var xhr = window.XMLHttpRequest
                ? new XMLHttpRequest()
                : new ActiveXObject('Microsoft.XMLHTTP');

            var fakeXHR = requesting.promise;
            var xhrWrapper = {
                abort: function () {
                    xhr.abort();
                    fakeXHR.readyState = xhr.readyState;
                    fakeXHR.responseText = '';
                    fakeXHR.responseXML = '';
                    requesting.reject(fakeXHR);
                },
                setRequestHeader: function (name, value) {
                    xhr.setRequestHeader(name, value);
                }
            };
            util.mix(fakeXHR, xhrWrapper);

            fakeXHR.then(
                function () {
                    /**
                     * 任意一个XMLHttpRequest请求失败时触发
                     *
                     * @event done
                     * @param {Object} e 事件对象
                     * @param {FakeXHR} e.xhr 请求使用的`FakeXHR`对象
                     */
                    ajax.fire('done', { xhr: fakeXHR });
                },
                function () {
                    /**
                     * 任意一个XMLHttpRequest请求失败时触发
                     *
                     * @event fail
                     * @param {Object} e 事件对象
                     * @param {FakeXHR} e.xhr 请求使用的`FakeXHR`对象
                     */
                    ajax.fire('fail', { xhr: fakeXHR });
                }
            );

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    var status = xhr.status;
                    // `file://`协议下状态码始终为0
                    if (status === 0) {
                        status = 200;
                    }
                    // IE9会把204状态码变成1223
                    else if (status === 1223) {
                        status = 204;
                    }

                    fakeXHR.status = fakeXHR.status || status;
                    fakeXHR.readyState = xhr.readyState;
                    fakeXHR.responseText = xhr.responseText;
                    fakeXHR.responseXML = xhr.responseXML;

                    if (typeof ajax.hooks.afterReceive === 'function') {
                        ajax.hooks.afterReceive(fakeXHR, options);
                    }

                    // 如果请求不成功，也就不用再分解数据了，直接丢回去就好
                    if (status < 200 || (status >= 300 && status !== 304)) {
                        requesting.reject(fakeXHR);
                        return;
                    }

                    var data = xhr.responseText;
                    if (options.dataType === 'json') {
                        try {
                            data = util.parseJSON(data);
                        }
                        catch (ex) {
                            // 服务器返回的数据不符合JSON格式，认为请求失败
                            fakeXHR.error = ex;
                            requesting.reject(fakeXHR);
                            return;
                        }
                    }

                    if (typeof ajax.hooks.afterParse === 'function') {
                        try {
                            data =
                                ajax.hooks.afterParse(data, fakeXHR, options);
                        }
                        catch (ex) {
                            fakeXHR.error = ex;
                            requesting.reject(fakeXHR);
                            return;
                        }
                    }

                    // 数据处理成功后，进行回调
                    requesting.resolve(data);
                }
            };

            var method = options.method.toUpperCase();
            var data = {};
            if (method === 'GET') {
                util.mix(data, options.data);
            }
            if (options.cache === false) {
                data['_'] = +new Date();
            }
            var url = resolveURL(options.url, data);

            xhr.open(method, url, true);

            if (typeof ajax.hooks.beforeSend === 'function') {
                ajax.hooks.beforeSend(fakeXHR, options);
            }

            if (method === 'GET') {
                xhr.send();
            }
            else {
                var contentType =
                    options.contentType || 'application/x-www-form-urlencoded';
                xhr.setRequestHeader('Content-type', contentType);
                xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
                var query = ajax.hooks.serializeData(
                    options.data, contentType, fakeXHR);
                xhr.send(query);
            }

            if (options.timeout > 0) {
                var tick = setTimeout(
                    function () {
                        fakeXHR.status = 408; // HTTP 408: Request Timeout
                        fakeXHR.abort();
                    },
                    options.timeout
                );
                fakeXHR.ensure(function () { clearTimeout(tick); });
            }

            return fakeXHR;
        };

        /**
         * 发起一个GET请求
         *
         * @param {string} url 请求的地址
         * @param {Object=} data 请求的数据
         * @param {boolean=} cache 决定是否允许缓存
         * @return {Object} 一个`FakeXHR`对象，
         * 该对象有Promise的所有方法，以及一个`abort`方法
         */
        ajax.get = function (url, data, cache) {
            var options = {
                method: 'GET',
                url: url,
                data: data,
                cache: cache || ajax.config.cache
            };
            return ajax.request(options);
        };

        /**
         * 发起一个GET请求并获取JSON数据
         *
         * @param {string} url 请求的地址
         * @param {Object=} data 请求的数据
         * @param {boolean=} cache 决定是否允许缓存
         * @return {Object} 一个`FakeXHR`对象，
         * 该对象有Promise的所有方法，以及一个`abort`方法
         */
        ajax.getJSON = function (url, data, cache) {
            var options = {
                method: 'GET',
                url: url,
                data: data,
                dataType: 'json',
                cache: cache || ajax.config.cache
            };
            return ajax.request(options);
        };


        /**
         * 发起一个POST请求
         *
         * @param {string} url 请求的地址
         * @param {Object=} data 请求的数据
         * @param {string=} dataType 指定w响应的数据格式，可为**text**或**json**
         * @return {Object} 一个`FakeXHR`对象，
         * 该对象有Promise的所有方法，以及一个`abort`方法
         */
        ajax.post = function (url, data, dataType) {
            var options = {
                method: 'POST',
                url: url,
                data: JSON.stringify(data),
                dataType: dataType || 'json',
                contentType: 'application/json'
            };
            return ajax.request(options);
        };

        /**
         * 发送一个日志请求，该请求只负责发出，不负责保证送达，且不支持回调函数
         *
         * @param {string} url 发送的目标URL
         * @param {Object=} data 额外添加的参数
         */
        ajax.log = function (url, data) {
            var img = new Image();
            var pool = window.ER_LOG_POOL || (window.ER_LOG_POOL = {});
            var id = +new Date();
            pool[id] = img;

            img.onload = img.onerror = img.onabort = function () {
                // 如果这个img很不幸正好加载了一个存在的资源，又是个gif动画，
                // 则在gif动画播放过程中，img会多次触发onload，因此一定要清空
                img.onload = img.onerror = img.onabort = null;

                pool[id] = null;

                // 下面这句非常重要，
                // new Image创建的是DOM，
                // DOM的事件中形成闭包环引用DOM是典型的内存泄露，
                // 因此这里一定要置为null
                img = null;
            };

            // 一定要在注册了事件之后再设置src，
            // 不然如果图片是读缓存的话，会错过事件处理，
            // 最后，对于url最好是添加客户端时间来防止缓存，
            // 同时服务器也配合一下传递`Cache-Control: no-cache;`
            img.src = resolveURL(url, data);
        };

        /**
         * 20分钟自动发送一个后端请求，避免30分钟自动跳转登陆页面，PM要求延长至6h
         * 原本的跳转限制在uc账号上，后端不易修改，前端做个兼容
         *
         */
        ajax.timerPost20 = function () {
            // 当页面有新请求时，清除原计时器
            clearTimeout(timer);
            timer = '';
            // 并新开一个计时器, 当5.5h（19800000ms）页面没动的话，就清除原有的自动向后端请求的操作
            // 这样再过30分钟不操作的话，UC限制会让其重新登录
            timer = setTimeout(function () {
                if (timerPost20) {
                    clearInterval(timerPost20);
                    timerPost20 = '';
                }
            }, 19800000);

            // 每隔20分钟循环请求的操作，跳过uc账号30分钟的校验，请求接口写死，不用做任何处理
            if (!timerPost20) {
                timerPost20 = setInterval(function () {
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: '/data/common/getMenu'
                    });
                }, 1200000);
            }
        };

        /**
         * 发起一个POST请求（营销平台重定义post）
         *
         * @param {string} url 请求的地址
         * @param {Object=} data 请求的数据
         * @param {boolean} isJsonData 是否使用发送json数据格式
         * @param {boolean} hideErrorDialog 是否隐藏出错时的对话框
         * @return {Object} promise 对象
         */
        ajax.post = function (url, data, isJsonData, hideErrorDialog) {
            var dfd = new Deferred();
            data = data || {};
            data.castk = commonUtil.getCastk();
            var sendData = isJsonData ? JSON.stringify(data) : data;
            var options = {
                type: 'POST',
                data: sendData,
                dataType: 'json',
                url: url
            };
            if (isJsonData) {
                options.contentType = 'application/json';
            }
            this.timerPost20();
            var promise = $.ajax(options);
            promise.then(function (data) {
                if (parseInt(data.status, 10) === -2) {
                    if (parent && parent.hideParentHeader) {
                        try {
                            window.parent.hideParentHeader();
                            var href = location.href;
                            if (location.href.indexOf('?') !== -1) {
                                href = href.replace(/\?/, '?loginsus=1&');
                            }
                            else {
                                href = href + '?loginsus=1';
                            }
                            location.href = data.data + '&u=' + encodeURIComponent(href);
                        }
                        catch (e) {}
                    }
                    else {
                        location.href = data.data + '&u=' + encodeURIComponent(location.href);
                    }
                }
                else if (parseInt(data.status, 10) !== 0) {
                    if (!hideErrorDialog) {
                        Dialog.alert({
                            content: (data.statusInfo && data.statusInfo.errorDesc) || '系统出了点故障！<br>请刷新重试',
                            raw: true,
                            width: 500
                        });
                    }
                    dfd.reject(data);
                }
                else {
                    dfd.resolve(data);
                }
            }, function () {
                if (!hideErrorDialog) {
                    Dialog.alert({
                        content: '系统出了点故障！<br>请刷新重试',
                        raw: true,
                        width: 500
                    });
                }
                dfd.reject(data);
            });

            return dfd.promise;
        };

        return ajax;
    }
);
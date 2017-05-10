/**
 * @file   工具方法
 * @author zhujialu
 */

/* eslint-disable */

define(function (require, module, exports) {

    var URL = require('er/URL');
    var locator = require('er/locator');
    var lib = require('esui/lib');
    var Dialog = require('esui/Dialog');

    var moment = require('moment');
    var CONST = require('common/const');
    var CryptoJS = require('./util/md5');
    var localStorage = require('./util/localstorage');

    /**
     * 中文转unicode
     *
     * @param {string} data 待转的中文
     * @return {string} 转好的字符串
     */
    function toUnicode (data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            var num = parseInt(data[i].charCodeAt(0),10).toString(16);
            var numAdd0 = 4 - num.length;
            for (var j = 0; j < numAdd0; j++) {
                num = '0' + num;
            }
            str += "\\u" + num;
        }
        return str;
        // return escape(data).replace(/%(u[0-9A-F]{4})|(%[0-9A-F]{2})/gm, function($0, $1, $2) {
        //     return $1 && '\\' + $1.toLowerCase() || unescape($2);
        // });
    }

    /**
     * unicode转中文
     *
     * @param {string} data 待转的unicode
     * @return {string} 转好的中文
     */
    function toChinese (data) {
        return unescape(data.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1'));
    }


    /**
     * 遍历字符串的每个字符
     *
     * @param {string} string
     * @param {Function} callback 每次遍历的回调, 传入当前已遍历字符长度
     */
    function loopString(str, callback) {

        var size = 0;

        for (var i = 0, len = str.length; i < len; i++) {
            var target = str.charAt(i);
            var length = (getCharUTF8Length(target) + 1) / 2;

            size += length;

            if (callback(size, i + 1) === false) {
                break;
            }
        }
    }

    function sign(opts) {
        opts = opts || {};

        var res = {};
        res.result = CryptoJS.MD5(opts.source + '3e25960a79dbc69b674cd4ec67a72c62').toString();

        opts.callback(res);
    }

    function getRequestParams(api, data, callback) {
        data = data || {};

        var params = {};
        params.api = api;
        params.data = JSON.stringify(data);
        params.timestamp = Date.now();
        params.channel = 'nuomi'; // 判断请求来源(糯米NA, 为了转化城市code)
        params.client = 'na'; // 客户端
        params.version = '110';

        sign({
            source: params.timestamp + params.data,
            customerId: 1, // 这个数字不能改 http://wiki.baidu.com/display/baidunuomiwise/BNJS.http
            callback: function (res) {
                params.sign = res.result;

                callback(params);
            }
        });
    }

    /**
     * 计算字符的 utf-8 长度
     *
     * @param {string} x 字符
     * @return {number}
     */
    function getCharUTF8Length(x) {

        var code = x.charCodeAt(0);

        if ((code & ~0x7F) === 0) {
            return 1;
        }

        if ((code & ~0x07FF) === 0) {
            return 2;
        }

        if ((code & ~0xFFFF) === 0) {
            return 3;
        }

        return 4;
    }

    exports = {

        /**
         * 深度克隆
         *
         * @param {*} source
         * @returns {*}
         */
        clone: function (source) {
            var target = $.isArray(source) ? [] : {};
            return $.extend(true, target, source);
        },

        /**
         * 富文本去除'\u2028'
         *
         * @param {*} source
         * @returns {*}
         */
        unicodeDelSpace: function (content) {
            // 富文本加粗没用，所以这里也统一出来下，增加样式
            content = content.replace(/\<strong\>/g, '<strong style="font-weight:bold;">');
            content = content.replace(/\<b\>/g, '<b style="font-weight:bold;">');
            var content = toUnicode(content);
            content = content.replace(/\\u202(8|9)/g, '');
            return toChinese(content);
        },

        /**
         * 格式化给定的数：每三位增加逗号
         *
         * @param {number} num 要格式化的数字
         */
        formatNumWithCommas: function (num) {
            var str = String(num);
            var segments = str.split('.');
            var regex = /(\d+)(\d{3})/g;

            while (regex.test(segments[0])) {
                segments[0] = segments[0].replace(regex, '$1' + ',' + '$2');
            }

            return segments.join('.');
        },

        /**
         * array 转成 object
         * 通常 array 数组项会有个 id key，如 plan_id
         * 此函数把这个 key 提取出来，转成 id -> item 的 map
         *
         * @param {Array} array
         * @param {string} idKey
         * @return {Object}
         */
        array2Object: function (array, idKey) {
            var ret = { };
            $.each(array, function (index, item) {
                ret[item[idKey]] = item;
            });
            return ret;
        },

        /**
         * 查找给定数据源满足给定key的value的记录的索引，如果没找到，返回-1
         *
         * @param {Array.<Object>} source 数据源
         * @param {string|function(item, idx):boolean} key 要查找的key或者自定义的查询函数
         * @param {*} value 要查找的key需要满足的value
         * @returns {number} 如果找不到，返回-1
         * @example
         *      var ds = [{ id: 1, name: 'tom' }, { id: 2, name: 'john' } ];
         *      inArr(ds, 'id', 1); // 结果为 0
         */
        inArr: function (source, key, value) {
            var isCompareFunc = $.isFunction(key);
            for (var i = 0, len = source.length; i < len; i++) {
                if (isCompareFunc) {
                    if (key(source[i], i)) {
                        return i;
                    }
                }
                else if (source[i][key] === value) {
                    return i;
                }
            }

            return -1;
        },

        /**
         * 查找给定数据源满足给定key的value的记录，如果没找到，返回null
         *
         * @param {Array.<Object>} source 数据源
         * @param {string} key 要查找的key
         * @param {*} value 要查找的key需要满足的value
         * @return {?Object}
         * @example
         *      var ds = [{ id: 1, name: 'tom' }, { id: 2, name: 'john' } ];
         *      find(ds, 'id', 1); // 结果为 { id: 1, name: 'tom' }
         */
        find: function (source, key, value) {
            var idx = exports.inArr(source, key, value);
            return idx === -1 ? null : source[idx];
        },

        /**
         * 拷贝指定源对象的特定属性，返回新的对象，注意这里是浅拷贝。
         * 可以指定要拷贝的属性名拷贝后的新的属性名。
         * 如果传入的源对象是个数组，则要拷贝的属性名要应用到该数组的每个元素上，最后返回一个新
         * 的数组。
         *
         * @param {Object|Array} sourceObj 要拷贝的源对象或数组
         * @param {Array|string|Object} attrNames 要拷贝的属性，可以指定多个，传入
         *        数组，如果要为拷贝的属性指定新的属性名，通过k-v对象方式传入,key为源对象的属
         *        性名，value为拷贝后要赋予的新属性名, 如果跟原来一样，可以直接设为空串。
         * @return {Object}
         * @example
         *      <code>
         *          // sourceObj是一个普通对象
         *          copy({a: 3, b: 5}, 'a') // result: {a: 3}
         *          copy({a: 3, b: 5}, ['a', 'b']) // result: {a: 3, b: 5}
         *          copy({a: 3, b: 5}, {a: '', b: 'c'}) // result: {a: 3, c: 5}
         *
         *          // sourceObj是一个数组
         *          var sourceArr = [
         *              {
         *                  a: 3,
         *                  b: 5
         *              },
         *              {
         *                  a: 4,
         *                  b: 6
         *              }
         *          ];
         *          copy(sourceArr, 'a') // result: [{ a: 3 }, { a: 4 }]
         *          // attrNames其它参数返回结果参考上面例子
         *      </code>
         */
        copy: function (sourceObj, attrNames) {
            var sourceArr = sourceObj;
            if (!$.isArray(sourceObj)) {
                sourceArr = [sourceObj];
            }

            var isArr = $.isArray(attrNames);
            if (!isArr && typeof attrNames !== 'object') {
                attrNames = [attrNames];
                isArr = true;
            }

            var target = [];
            for (var i = 0, len = sourceArr.length; i < len; i++) {
                var value = {};
                var sourceItem = sourceArr[i];
                for (var k in attrNames) {
                    var name = isArr ? attrNames[k] : k;
                    var newAttrName = attrNames[k] === '' ? k : attrNames[k];
                    value[newAttrName] = sourceItem[name];
                }
                target[i] = value;

            }

            return $.isArray(sourceObj) ? target : target[0];
        },

        /**
         * 获取指定行指定的列的数据
         *
         * @param {?Array|number} rowIdxs 要获取的行索引或数组，未指定将返回所有行
         * @param {string} fieldName 要获取的域名(列)
         * @param {Array.<Object>} ds 数据源，数组项为普通的object对象
         * @return {Array}
         * @example
         *      <code>
         *          var ds = [
         *              { bid: 2.3, name: 'abc' },
         *              { bid: 3.4, name: 'efg' },
         *              { bid: 5.6, name: 'rty' }
         *          ];
         *
         *          // 指定行
         *          getColumnData([0, 2], 'bid', ds);
         *          // result: [2.3, 5.6]
         *
         *          // 未指定行
         *          getRowData(null, 'bid', ds)
         *          // result: [2.3, 3.4, 5.6]
         *      </code>
         */
        getColumnData: function (rowIdxs, fieldName, ds) {
            if (rowIdxs) {
                $.isArray(rowIdxs) || (rowIdxs = [rowIdxs]);
            }
            else {
                rowIdxs = [];
                for (var j = ds.length; j--;) {
                    rowIdxs[j] = j;
                }
            }

            var data = [];
            for (var i = rowIdxs.length; i--;) {
                var row = rowIdxs[i];
                var rowData = ds[row][fieldName];
                data[i] = rowData;
            }

            return data;
        },

        /**
         * 获取指定分页的数据
         *
         * @param {number} pageNo 要获取的分页
         * @param {number} pageSize 分页大小
         * @param {Array} data 数据源
         * @return {Array}
         */
        getPageData: function (pageNo, pageSize, data) {
            var startIdx = (pageNo - 1) * pageSize;
            var endIdx = startIdx + pageSize;
            endIdx > data.length && (endIdx = data.length);

            var pageData = [];
            for (var i = startIdx; i < endIdx; i++) {
                pageData.push(data[i]);
            }

            return pageData;
        },

        /**
         * 跳转到指定的URL
         *
         * @param {?URL} url 要跳转的目标URL
         * @param {Object=} queryParam 要附加的查询参数，可选
         */
        redirectURL: function (url, queryParam) {
            var currQuery = url ? url.getQuery() : {};

            // 重写当前URl查询参数
            var query = $.extend(currQuery, queryParam || {});

            // 重定向新的URL
            var path = url ? url.getPath() : '/';
            locator.redirect(URL.withQuery(path, query));
        },

        /**
         * 获取营销工具下的tab
         *
         * @return {Object} tabs tabs
         */
        getToolsTabsOne: function () {
            var tabs;

            if(CONST.prizeplan){
                tabs = CONST.prizeplan.tabsOne;
            }
            else if (CONST.gameplan) {
                tabs = CONST.gameplan.tabsOne;
            }
            else if (CONST.giftpackageplan) {
                tabs = CONST.giftpackageplan.tabsOne;
            }

            return tabs;
        },

        /**
         * 本系统会大量用到事件通信，为了避免写重复的代码
         * 这里提供一个模版方法
         *
         * @param {Object} target 需要发事件的对象
         */
        fireEvent: function (target) {
            return function (e) {
                target.fire(e);
            };
        },

        /**
         * 获得字符串长度（双字节占两个长度）
         *
         * @param {string} str
         * @return {number}
         */
        getStringLength: function (str) {

            if (str === '') {
                return 0;
            }

            var ret;

            loopString(str, function (cnLen, len) {
                ret = cnLen;
            });

            return ret;
        },

        /**
         * 获得截断后的字符串
         *
         * @param {string} str 需要截断的字符串
         * @param {number} len 截断的字符长度, 中文算两个字符
         * @param {string|boolean} 结尾字符, 不传则用 ...，如果不想加后缀，传false
         * @return {string}
         */
        truncate: function (str, len, suffix) {

            if (str == null) {
                return '';
            }

            str = String(str);
            len = parseInt(len, 10);

            if (suffix !== false && !suffix) {
                suffix = '...';
            }
            else {
                suffix = '';
            }

            var ret;

            loopString(str, function (cnLen, enLen) {
                ret = str.substr(0, enLen);

                if (cnLen > len) {
                    ret += suffix;
                    return false;
                }
            });

            return ret;
        },

        /**
         * 检查是否存在部分修改失败的情况
         *
         * @param  {Object} response 后端的响应
         * @param  {string} hint     提示话术
         * @return {string | ''}     返回空则不用提示，否则需要提示
         */
        checkResponsePortion: function (response, hint) {

            var parameters = response.statusInfo.parameters;

            if (parameters
                && parameters.failed_names
                && parameters.failed_names.length > 0
            ) {
                var len = parameters.failed_names.length;
                var first = parameters.failed_names[0];

                return hint + first + (len > 1 ? ' 等' : '');
            }

            return '';

        },

        /**
         * 用于校验后端返回的值是否是空的值：以下几种情况都认为是空的值
         * null, undefined, 'null', ''
         *
         * @param {*} value 要check的值
         * @return {boolean}
         */
        isEmptyValue: function (value) {
            return (null === value || typeof value == 'undefined'
                || '' === value || 'null' === value);
        },

        /**
         * 将数字转成百分数，保留小数点后两位
         *
         * @param {number} value 要转成百分数的值
         * @return {string} 带上百分号的数值
         */
        numToPercent: function (value) {
            if (this.isEmptyValue(value)) {
                return '-';
            }

            return Number(value * 100).toFixed(2) + '%';
        },

        /**
         * 获取给定对象的属性值
         *
         * @param {Object} obj 给定的对象
         * @param {string} attr 要查询的属性名，支持'a.b'形式来进行深度查询
         * @return {*}
         * @example
         *     objValue({ a: 3 }, 'a') // 输出3
         *     objValue({ a: { b: 3 } }, 'a.b') // 输出3
         */
        objValue: function (obj, attr) {
            var attrArr = attr.split('.');
            var value = obj;

            for (var i = 0, len = attrArr.length; i < len; i++) {
                value = value[attrArr[i]];
            }

            return value;
        },

        /**
         * 获取最近一年的时间区间
         *
         * @return {{begin: Date, end: Date}}
         */
        getRecentOneYearRange: function () {

            // 允许选择的的时间范围为最近一年以内，不允许跨度超过1年
            return {
                begin: moment().subtract('years', 1).startOf('day').toDate(),
                end: moment().endOf('day').toDate() // 必须设成当天23:59:59否则日历
                // 控件就选择不了本月
            };
        },

        /**
         * 如果复写了某些方法，必须确保调用了原型的同名方法
         * 如果不调用原型方法，esui 的生命周期没法管理
         *
         * @param {Function} parent 构造函数
         * @param {Object} sub 扩展的子类
         * @param {string|Array} 复写的方法名称
         */
        overrideSafe: function (parent, sub, methods) {
            if (!$.isArray(methods)) {
                methods = [ methods ];
            }

            $.each(methods, function (index, methodName) {

                var overrideMethod = sub[methodName];
                if (overrideMethod) {
                    sub[methodName] = function () {
                        var parentMethod = parent.prototype[methodName];
                        parentMethod && parentMethod.apply(this, arguments);
                        overrideMethod.apply(this, arguments);
                    };
                }
            });
        },

        /**
         * 检查IPv4的ip子部分值的有效性
         *
         * @param {string} value 要验证的值
         * @param {boolean=} allowStar 是否允许'*'任意字符，可选，默认false
         * @return {boolean}
         * @example
         *      checkIPPartValue(233);       // output => true
         *      checkIPPartValue('*');       // output => false
         *      checkIPPartValue('*', true); // output => true
         */
        checkIPPartValue: function (value, allowStar) {
            value = String(value);
            if (allowStar && value === '*') {
                return true;
            }

            if (value.length >= 2 && value.charAt(0) === '0') {
                return false;
            }

            if (/^\d+$/.test(value)) {
                var num = parseInt(value, 10);
                return (num >= 0 && num <= 255);
            }

            return false;
        },

        /**
         * 将一个对象转成URL GET字符串
         *
         * @param {object} obj
         * @return {string}
         */
        objToURLParamStr: function (obj) {
            var arrTemp = [];
            for (var i in obj) {
                arrTemp.push( i + '=' + obj[i]);
            }
            return arrTemp.join('&');
        },


        getCookieByName: function (name) {
            var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
            if(arr != null) return unescape(arr[2]); return null;
        },

        /**
         * 取得hash段~符号后面的参数
         */
        getHashParam: function () {
            var hash = location.hash;
            var index = hash.indexOf('~');
            var hashParam = index !== -1 ? hash.slice(hash.indexOf('~')) : '';
            return hashParam;
        },

        getTableInputTpl: function(variable) {
            // var tpl = ['<input type="text" disabled class="table-input ', variable ,'" value="${', variable , '}">',
            //     '<i class="operate-icon icon-pencil" title="编辑"></i>',
            //     '</i><i class="operate-icon icon-ok" title="保存"></i>'].join('');
            // return tpl;
            return '${' + variable + '}';        //一期暂不支持快捷编辑的小铅笔
        },

        getInputTpl: function (variable) {
            var tpl = ['<input type="text" disabled  data-row-index="${row}" maxlength="9" class="table-input ', variable ,'" value="${', variable , '}">',
                '<i class="operate-icon icon-pencil" title="编辑"></i>'].join('');
            return tpl;
        },

        dataToMap: function (data) {
            var map = {};
            if (data) {
                var len = data.length;
                while (len--) {
                    map[data[len].value] = data[len].name;
                }
            }
            return map;
        },

        timeValidate: function (start, end, allowEqual) {
            if (!start || !end) {
                return true;
            }
            if (allowEqual) {
                return moment(end).isSame(moment(start)) || moment(end).isAfter(moment(start));
            }
            return moment(end).isAfter(moment(start));
        },

        handleUnlimitData: function (data, text) {
            var res = (data === CONST.UNLIMIT_MONEY_NUM
                || data === CONST.UNLIMIT_TICKET_NUM || !data || data === -1)
                ? (text || '') : data;

            return res;
        },

        /**
         * 校验数组中各项的大小区间是否有重叠，有相等算重叠
         * @param  {Array} data   数据数组
         * @param  {string} minKey 最小值key
         * @param  {string} maxKey 最大值key
         * @param  {string} type   要比较的数据的类型(时间或金额普通数字)
         * @param  {string} format 时间format
         * @return {boolean}
         */
        overlapValid: function (data, minKey, maxKey, type, format) {
            if (!data || !data.length) {
                return true;
            }
            var isTime = type === 'time';
            var len = data.length;
            var aMin;
            var aMax;
            var bMin;
            var bMax;
            for (var i = 0; i < len; i++) {
                for (var j = i + 1; j < len; j++) {
                    aMin = isTime ? moment(data[i][minKey], format).valueOf() : data[i][minKey];
                    aMax = isTime ? moment(data[i][maxKey], format).valueOf() : data[i][maxKey];
                    bMin = isTime ? moment(data[j][minKey], format).valueOf() : data[j][minKey];
                    bMax = isTime ? moment(data[j][maxKey], format).valueOf() : data[j][maxKey];
                    if (!aMin || !aMax || !bMin || !bMax) {
                        continue;
                    }
                    if ((aMax >= bMax && aMin <= bMax)
                        || (aMax >= bMin && aMin <= bMin)
                        || (aMax <= bMax && aMin >= bMin)
                        || (aMax >= bMax && aMin <= bMin)) {
                        return false;
                    }
                }
            }
            return true;
        },

        /**
         * 编辑代金券计划
         *
         * @param  {number} source 来源0：电影券，1：演出券
         * @param  {number} planId 计划ID
         */
        editCouponPlan: function (source, planId) {
            var view = this;
            var title = planId ? '编辑计划' : '新建计划';
            view.popActionDialog({
                title: title,
                url: '/editcouponplan',
                width: CONST.MIDDLE_DIALOG_WIDTH,
                top: CONST.DIALOG_TOP,
                actionOptions: {
                    planId: planId,
                    source: source,
                    actionCallback: function (data) {
                        view.fire('reload');
                    }
                }
            });
        },

        editShowCouponPlan: function (planId) {
            var view = this;
            var title = planId ? '编辑计划' : '新建计划';
            view.popActionDialog({
                title: title,
                url: '/editshowcouponplan',
                width: CONST.MIDDLE_DIALOG_WIDTH,
                top: CONST.DIALOG_TOP,
                actionOptions: {
                    planId: planId,
                    actionCallback: function (data) {
                        view.fire('reload');
                    }
                }
            });
        },

        /**
         * 编辑代金券计划
         *
         * @param  {number} source 来源0：电影券，1：演出券
         * @param  {number} planId 计划ID
         */
        editMerCouponPlan: function (source, planId) {
            var view = this;
            var title = planId ? '编辑计划' : '新建计划';
            view.popActionDialog({
                title: title,
                url: '/editmercouponplan',
                width: CONST.MIDDLE_DIALOG_WIDTH,
                top: CONST.DIALOG_TOP,
                actionOptions: {
                    planId: planId,
                    source: source,
                    actionCallback: function (data) {
                        view.fire('reload');
                    }
                }
            });
        },

        setRangeCalendarValue: function (id) {
            var date = this.get(id);
            var dateValue = this.model.get(id);
            if (dateValue) {
                dateValue = dateValue.match(/\d{4}-\d{2}-\d{2}/g);
                date.setRawValue({
                    begin: new Date(dateValue[0]),
                    end: new Date(dateValue[1])
                });
            }
            else {
                date.setRawValue({
                    begin: new Date(2015, 2, 1),
                    end: new Date(2020, 0, 1)
                });
            }
        },

        setRangeCalendarThreeDays: function () {
            var endDay = new Date().getTime();
            var startDay = endDay - 3 * 24 * 60 * 60 * 1000;
            var date = moment(startDay).format('YYYY-MM-DD')
                + '至' + moment(endDay).format('YYYY-MM-DD');
            return date || '2015-02-01至2020-01-01';
        },

        couponTabSwitch: function (e) {
            var activeIndex = e.target.activeIndex;
            if (activeIndex === 0) {
                locator.redirect('/couponplanlist');
            }
            else if (activeIndex === 1) {
                locator.redirect('/batchlist');
            }
            else if (activeIndex === 2) {
                locator.redirect('/codelist');
            }
        },

        adTabSwitch: function (e) {
            var activeIndex = e.target.activeIndex;
            if (activeIndex === 0) {
                locator.redirect('/adposlist');
            }
            else if (activeIndex === 1) {
                locator.redirect('/adcontentlist');
            }
        },

        marketingTabSwitch: function (e) {
            var activeIndex = e.target.activeIndex;
            if (activeIndex === 0) {
                locator.redirect('/actplan');
            }
            else if (activeIndex === 1) {
                locator.redirect('/actunit');
            }
        },

        /**
         * 获取元素距离浏览器顶部距离
         * @param  {HTMLElement} ele DOM元素
         * @return {number}     距离
         */
        getOffsetTop: function(ele) {
            if (!ele) {
                return '';
            }
            var y = ele.offsetTop;
            while (ele = ele.offsetParent) {
                y += ele.offsetTop;
            }
            return y;
        },

        makeArr: function (length, multi) {
            multi = multi ? multi : 1;
            var arr = [];
            while (length--) {
                var res = length * multi;
                if (res < 10) {
                    arr.unshift('' + 0 + res);
                }
                else {
                    arr.unshift('' + res);
                }
            }
            return arr;
        },

        /**
         * 比较开始和结束时间
         * @param  {string} startHourStr
         * @param  {string} startMinuteStr
         * @param  {string} endHourStr
         * @param  {string} endMinuteStr
         * @return {boolean}
         */
        compareTime: function (startHourStr, startMinuteStr, endHourStr, endMinuteStr) {
            var startHour = parseInt(startHourStr, 10);
            var startMinute = parseInt(startMinuteStr, 10);
            var endHour = parseInt(endHourStr, 10);
            var endMinute = parseInt(endMinuteStr, 10);
            if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
                return false;
            }
            return true;
        },

        /**
         * 获取castk参数
         * @return {string} castk值
         */
        getCastk: function () {
            var search = location.search;
            var castk = '';
            if (search.indexOf('castk') !== -1) {
                castk = /castk=(\w+)/.exec(location.search)[1];
            }
            return castk;
        },

        formatLongCommentDetail: function (str) {
            // 行首行末的空格、换行，去掉
            str = str.replace(/(^\s*\r*\n*)|(\s*\r*\n*$)/g, '');
            // </p><p>之间的空格、换行，去掉
            str = str.replace(/<\/p>\s*\r*\n*<p>/g, '</p><p>');
            // 排除以上两种可能的 \r\n进行替换，保留
            str = str.replace(/\r|\n/g, '<br>');
            return str;
        },

        /**
         * 请求应用中心的数据，用法同na的page.post
         *
         * @param {number} api api Number 查看na的config来指定接口
         * @param {Object=} data 数据
         * @param {Object} opts 额外参数
         */
        getMovieappData: function (api, data, opts) {
            var dfd = new $.Deferred();
            opts = opts || {};

            var requestUrl = '/na/app/dispatcher?mockup=0';

            var url = opts.url || requestUrl;

            // 由于BNJS.http.sign方法是异步的，所以做成异步
            getRequestParams(api, data, function (params) {
                var body = JSON.stringify(params);
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: body,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: function (data) {
                        if (typeof data === 'string') {
                            data = JSON.parse(data);
                        }
                        dfd.resolve(data);
                    },
                    error: function (xhr, errType, err) {
                        dfd.reject(err);
                    },
                });
            });

            return dfd;
        },

        dealAuthorInfo: function (data) {
            var phone = data.phone || '暂无';
            var email = data.email || '暂无';
            var userName = data.userName || '暂无';
            data.name = [data.authorId, data.authorName, phone, email, userName].join('   ');
            data.value = data.authorId;
        },

        /**
         * 列表中铅笔点击编辑，失去焦点保存的处理方法
         *
         * @param  {JQElement} iconEle 被点击的元素
         * @param  {Function} blurCallback 该元素失去焦点时的回调，回调中参数opt分别为
         *      inputEle -> 正在编辑的输入框元素
         *      oldVal -> 输入框中编辑前的值
         *      newVal -> 输入框中编辑后的值
         * 是正在被编辑的输入框中编辑前的值 第二个参数是编辑后的值
         */
        editInput: function (options) {
            var iconEle = options.iconEle;
            var reg = options.reg || CONST.PRIORITY_REG;
            var blurCallback = options.blurCallback;

            var inputEle = iconEle.siblings('.table-input');
            var oldVal = inputEle.val();
            inputEle.removeAttr('disabled');
            inputEle.addClass('input-border');
            inputEle.select();
            iconEle.addClass('hide');
            iconEle.siblings('.icon-ok').show();

            inputEle.on('blur', function () {
                inputEle.off('blur');
                iconEle.removeClass('hide');
                inputEle.attr('disabled', 'disabled');
                inputEle.removeClass('input-border');
                var newVal = inputEle.val();
                if (!reg.test(newVal)) {
                    Dialog.alert({
                        width: CONST.SMALL_DIALOG_WIDTH,
                        top: CONST.DIALOG_TOP,
                        content: '格式不对，请重新填写！'
                    });
                    inputEle.val(oldVal);
                    return;
                }

                // 检测到未修改，不做任何动作
                if (oldVal === newVal) {
                    return;
                }
                var opt = {
                    inputEle: inputEle,
                    newVal: newVal,
                    oldVal: oldVal
                };
                blurCallback && blurCallback(opt);
            });

        },

        /**
         * 判断本地存储的数据是否依然有效（一些不常更新的数据默认存在本地3天，3天后过期，重新获取数据）
         *
         * @param  {string}  localName 本地存储的字段名
         * @param  {number}  days     数据存储有效天数，默认为3
         * @return {Boolean}          是否有效的布尔值
         */
        isValidLocalData: function (localName, days) {
            var localValue = localStorage.getData(localName);
            if (!localValue) {
                return;
            }

            days = days || 3;
            var now = Date.now();
            if (now - localValue.saveTime > days * 86400000) {
                return;
            }
            return localValue;
        },

        /**
         * 把数据存储到本地
         *
         * @param  {string}  localName 本地存储的字段名
         * @param {Object} data 不常更新或是否更新对使用影响不是特别大的数据
         */
        setLocalData: function (localName, data) {
            data.saveTime = Date.now();
            localStorage.addData(localName, data);
        },

        /**
         * 取得时间字符串对应的时间戳 考虑兼容性将-替换成/
         *
         * @param  {string} timeStr 时间字符串
         * @return {number} timestamp
         */
        getTimestamp: function (timeStr) {
            return new Date(timeStr.replace(/-/g, '/')).getTime() || 1;
        },

        /**
         * 将数字金额转成大写
         *
         * @param  {number} n 数字金额
         * @return {string} 大写金额
         */
        digitUppercase: function(n) {
            var fraction = ['角', '分'];
            var digit = [
                '零', '壹', '贰', '叁', '肆',
                '伍', '陆', '柒', '捌', '玖'
            ];
            var unit = [
                ['元', '万', '亿'],
                ['', '拾', '佰', '仟']
            ];
            var head = n < 0 ? '欠' : '';
            n = Math.abs(n);
            var s = '';
            for (var i = 0; i < fraction.length; i++) {
                s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10]
                    + fraction[i]).replace(/零./, '');
            }
            s = s || '整';
            n = Math.floor(n);
            for (var i = 0; i < unit[0].length && n > 0; i++) {
                var p = '';
                for (var j = 0; j < unit[1].length && n > 0; j++) {
                    p = digit[n % 10] + unit[1][j] + p;
                    n = Math.floor(n / 10);
                }
                s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
            }
            return head + s.replace(/(零.)*零元/, '元')
                .replace(/(零.)+/g, '零')
                .replace(/^整$/, '零元整');
        }

    };

    return exports;
    /*eslint-enable*/
});



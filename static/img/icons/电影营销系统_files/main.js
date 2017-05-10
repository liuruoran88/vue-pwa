/**
 * @file 入口模块, 负责加载资源与整个系统的启动
 * @author zhangzhiqiang<zhangzhiqiang04@baidu.com>
 */

define(function (require) {

    require('require-res');
    // 异步加载业务代码：确保上面库文件都ready才能执行业务代码: 由于上述对er/esui等基础框架库
    // 进行侵入式修改，所以必须这么做
    var er = require('er');
    var Action = require('er/Action');
    var url = require('common/url');
    var CONST = require('common/const');
    var ajax = require('er/ajax');
    var nav = require('nav');
    var locator = require('er/locator');
    var title = '百度糯米电影|营销平台';

    document.domain = 'baidu.com';


    ajax.post(url.GET_MENU).then(function (data) {
        nav.initNavTab(data.data);
        init();
        // 如果是默认不带任何action，则打开导航中第一个
        if (!/\w/.test(location.hash)
        || location.search.indexOf('merchant') !== -1
        || location.search.indexOf('marketing') !== -1
        ) {
            // 根据B端导航subid来区分一级tab的跳转
            if (top.location && top.location.search.indexOf('subid=227') !== -1
                || location.search.indexOf('merchant') !== -1
            ) {
                CONST.DEFAULT_HASH = CONST.DEFAULT_HASH_MERCHANT;
                title = '百度糯米电影|商家营销';
            }
            else if (top.location && top.location.search.indexOf('&subid=81') !== -1
                || location.search.indexOf('marketing') !== -1
            ) {
                CONST.DEFAULT_HASH = CONST.DEFAULT_HASH_MARKETING;
                title = '百度糯米电影|营销平台';
            }
            else if (!CONST.DEFAULT_HASH) {
                CONST.DEFAULT_HASH = CONST.DEFAULT_HASH_MERCHANT || CONST.DEFAULT_HASH_MARKETING || '';
            }

            locator.redirect(CONST.DEFAULT_HASH);

        }

        // 由于oscar模板问题，需要手动修改页面标题
        if (parent && parent.showParentHeader && parent.document) {
            var ioscarTitle = title.split('|')[1];
            parent.document.title = ioscarTitle;
            document.title = ioscarTitle;
        }
        else if (parent && parent.document) {
            parent.document.title = title;
            document.title = title;
        }
    });


    /**
     * 框架入口初始化工作
     */
    function init() {

        // 为了在被嵌入iframe后使用top的内容，设置同域，与奥斯卡约定同时设置为baidu.com
        // if (window !== top) {
        // document.domain = 'baidu.com';
        // }

        // 处理用户名显示
        var userName = '<a href="http://oscar.baidu.com/moviemis/login/">请登录</a>';
        // var realUserName = '';
        var search = decodeURIComponent(location.search);
        // 如果是嵌入ioscar商家的部分,则隐藏头部
        if (search.indexOf('loginsus') !== -1) {
            if (parent && parent.showParentHeader) {
                try {
                    window.parent.showParentHeader();
                    $('#header').addClass('hide');
                    $('#wrapper').css('padding-top', '0');
                }
                catch (e) {}
            }
        }
        else if (search.indexOf('hideHead') !== -1) {
            $('#header').addClass('hide');
            $('#wrapper').css('padding-top', '0');
        }
        else {
            $('#header').removeClass('hide');
            $('#wrapper').css('padding-top', '65px');
        }

        if (search.indexOf('userName') !== -1) {
            var regRes = /userName=([^&]+)&?/.exec(search);
            if (regRes && regRes.length > 0) {
                userName = regRes[1];
                userName = $('<div>').text(userName).html();
            }
        }
        $('.username').html(userName);
        // 注册所有 action
        var configList = require('actionConf');
        Action.registerAction(configList);
        er.start();
        bindEvents();
        // 写cookie，用于记录用户姓名
        // var cookieStr = 'CMS_UNAME=' + realUserName;
        // cookieStr += '; domain=baidu.com';
        // cookieStr += '; path=/';
        // cookieStr += '; expires=' + new Date(Date.now() + 10 * 86400 * 1000).toGMTString();
        // document.cookie = cookieStr;
        // 在oscar解决写uc cookie域问题之前，尝试删除错误域的cookie
        // document.cookie = '__cas__id__=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=baidu.com;path=/;';
        // document.cookie = '__cas__st__=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=baidu.com;path=/;';
    }

    function bindEvents() {
        var $backtopBtn = $('.backtop-wrapper');
        $backtopBtn.on('click', function () {
            window.scrollTo(0, 0);
        });
        $(window).on('scroll', function () {
            if ((document.body.scrollTop || document.documentElement.scrollTop) > 300) {
                $backtopBtn.show();
            }
            else {
                $backtopBtn.hide();
            }
        }).trigger('scroll');

        // $('#main').on('mouseover', '.ui-table-row', function (e) {
        //     $(this).find('.operate-icon').css('display', 'inline');
        // }).on('mouseout', '.ui-table-row', function () {
        //     $(this).find('.operate-icon').css('display', 'none');
        // });
    }

});

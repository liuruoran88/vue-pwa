/**
 * @file 导航栏操作
 * @author zhangzhiqiang<zhangzhiqiang04@baidu.com>
 */

define(function (require, exports) {
    var lib = require('esui/lib');
    var locator = require('er/locator');
    var CONST = require('common/const');
    var ajax = require('er/ajax');
    var url = require('common/url');
    // var helper = require('esui/controlHelper');
    var UIView = require('ef/UIView');
    // var navConf = require('navConf');

    var isThirdNav = 0;
    var marketingNav = ['#/actplan', '#/actunit', '#/editact', '#/editactrules', '#/actglobalconfig',
        '#/actglobalconfigmovie'];
    var couponNav = [
        '#/couponplanlist', '#/batchlist', '#/codelist', '#/editbatch', '#/editbatchrules',
        '#/couponglobalconfig', '#/couponglobalconfigmovie'
    ];
    var showCouponNav = [
        '#/showcouponplanlist', '#/showbatchlist', '#/showcodelist', '#/editshowbatch', '#/editshowbatchrules'
    ];
    var adPosNav = ['#/adposlist', '#/adcontentlist', '#/editadpos', '#/editadcontent', '#/adcmslist', '#/editadcms'];
    var commentNav = [
        '#/shortcomment', '#/editlongcomment', '#/longcomment', '#/authormanage', '#/publicnumlist', '#/editpublicnum',
        '#/publictopiclist', '#/editpublictopic', '#/topicreplymanage', '#/editpublictopic', '#/nuominews',
        '#/editnuominews', '#/circlelist', '#/editcircle',
        '#/postslist', '#/editpost', '#/postsreplymanage'
    ];
    var toolsNav = [
        '#/prizeplan',
        '#/prizelist',
        '#/editprizeplan',
        '#/gameplan',
        '#/gamelist',
        '#/editgameprize',
        '#/giftpackageplan',
        '#/giftpackagelist',
        '#/editgiftpackageprize'
    ];

    var merchantHomeNav = ['#/homeindex'];
    var merchantPromotionNav = ['#/promotionsmslist', '#/editpromotionsms']; // 智能推广
    var merchantCouponNav = [
        '#/mercouponplanlist', '#/merbatchlist', '#/mercodelist', '#/editmerbatch', '#/editmerbatchrules',
        '#/couponglobalconfig', '#/couponglobalconfigmovie'
    ];
    var merchantVoucherNewNav = [
        '#/mervouchernewlist', '#/editmervouchernew', '#/editmervoucheraccurate'
    ];
    var merchantCheckNav = ['#/checkactlist'];

    var navMap = {
        '#/actplan': marketingNav,
        '#/couponplanlist': couponNav,
        '#/showcouponplanlist': showCouponNav,
        '#/adposlist': adPosNav,
        '#/longcomment': commentNav,
        '#/prizeplan': toolsNav,
        '#/gameplan': toolsNav,
        '#/giftpackageplan': toolsNav,
        '#/homeindex': merchantHomeNav,
        '#/promotionsmslist': merchantPromotionNav,
        '#/mercouponplanlist': merchantCouponNav,
        '#/checkactlist': merchantCheckNav,
        '#/mervouchernewlist': merchantVoucherNewNav
    };

    var subNavMap = {};

    var mainNavTabTpl = '<li><a href="${url}" class="${className}">${name}</a></li>';
    var mainNavTabWithSubTpl = '<li><a class="main-nav-with-sublist ${className}" data-href="${url}">${name}</a></li>';
    var subNavTabTpl = [
        '<li class="nav-item nav-title-item sub-nav-item">',
        '<span data-href="${url}" class="nav-text nav-tab ${className}">${name}</span>',
        '${arrowIcon}',
        '${thirdNavList}',
        '</li>'
    ].join('');

    var thirdNavTabTpl = [
        '<li class="third-nav-item third-nav-title-item ${className}">',
        '<span class="list-style-type"></span>',
        // '${arrowIcon}',
        '<span data-href="${url}" class="third-nav-text third-nav-tab">${name}</span>',
        '</li>'
    ].join('');

    var subArrowIconTpl = '<span class="arrow-content arrow-content-bold sub-nav-arrow arrow-content-up">'
        + '<em></em><i></i></span>';
    // var subNavTabTpl = [
    //     '<li class="nav-item">',
    //     '<span data-href="${url}" class="nav-text nav-tab sub-nav-tab">${text}</span>',
    //     '</li>'
    // ].join('');

    // var mainNavHtml = '';
    // var subNavHtml = '';

    function getSubNavHash(hash) {
        if (hash.lastIndexOf('?') > -1) {
            hash = hash.substring(0, hash.lastIndexOf('?'));
        }
        var navList;
        if (navMap.hasOwnProperty(hash)) {
            navList = navMap[hash];
            if (navList.indexOf(hash) > -1) {
                return hash;
            }
        }
        else {
            for (var key in navMap) {
                if (navMap.hasOwnProperty(key)) {
                    navList = navMap[key];
                    if (navList.indexOf(hash) > -1) {
                        return key;
                    }
                }
            }
        }
    }

    function getSubNav(hash) {
        for (var key in subNavMap) {
            if (subNavMap.hasOwnProperty(key)) {
                var navObj = subNavMap[key];
                if (navObj.hashArray.indexOf(hash) > -1) {
                    return navObj;
                }
            }
        }
    }

    function bindEvents() {

        // document.domain = location.hostname;
        // var currentSubNav;
        // var thirdNav = $('.third-nav');
        locator.on('redirect', function () {
            var currentHash = window.location.hash;
            if (top.location) {
                // document.cookie = 'hash=' + currentHash + '; domain=baidu.com';
                // 让奥斯卡记录下当前路径，刷新保持页面状态
                top.name = currentHash;
            }
            var pos = currentHash.indexOf('~');
            currentHash = pos > -1 ? currentHash.slice(0, pos) : currentHash;
            if (/#\/($|~)/.test(currentHash)) {
                // 根据B端导航id来区分一级tab的跳转
                // if (window.location && window.location.search.indexOf('&subid=227') !== -1) {
                //     CONST.DEFAULT_HASH = '/homeindex';
                // }

                currentHash = CONST.DEFAULT_HASH;
            }

            var navList = $('.nav-tab');
            var $subNav = $('.sub-nav');
            navList.removeClass('active');
            $subNav.find('.third-nav-item').removeClass('active');
            var subNavHash = getSubNavHash(currentHash); // 二级菜单hash
            var subNavClass = subNavHash ? subNavHash.replace('#/', '.') : '';
            var thirdClass = currentHash.replace('#/', '.');

            if (!isThirdNav) {
                // var subNavHash = getSubNavHash(currentHash); // 二级菜单hash
                if (subNavHash) {
                    var subNavObj = getSubNav(subNavHash);
                    // var subNavClass = subNavHash.replace('#/', '.'); // 对应的样式类名
                    // var thirdClass = currentHash.replace('#/', '.'); // 对应的样式类名
                    // 重新显示二级菜单和logo
                    $('.sub-nav > ul').remove();
                    checkSubnav(subNavObj, function () {
                        $subNav.prepend(subNavObj.html);
                        $subNav.find('.sub-nav-item .nav-tab' + subNavClass).addClass('active');
                        $subNav.find('.third-nav-item' + thirdClass).addClass('active');
                        // $subNav.find('.title').html(subNavObj.name);
                    });
                }
            }
            else {
                $subNav.find('.sub-nav-item .nav-tab' + subNavClass).addClass('active');
                $subNav.find('.third-nav-item' + thirdClass).addClass('active');
            }

            isThirdNav = 0;
        });
        $('.sub-nav').on('click', '.nav-item .nav-tab,.third-nav-item', function (e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            isThirdNav = $(target).parents('li').hasClass('third-nav-item');
            var href = target.getAttribute('data-href') || '';

            // 商家二级tab会做权限的处理
            var tabClass = href.replace(/^\#\//, '');
            var servicesMapName = CONST.servicesMap[tabClass];
            // var servicesMapName = 'MERCHANT_MARKETING';
            if (servicesMapName) {
                if (!CONST.servicesOpenList) {
                    ajax.post(url.GET_MECHANT_SERVICE_LIST, {}, true).then(function (data) {
                        if (data && data.data && data.data.services && data.data.services.length) {
                            CONST.servicesOpenList = data.data.services;
                        }
                    });
                    // applyOpenService();
                    applyOpenService(servicesMapName, href);
                }
                else if (CONST.servicesOpenList
                    && CONST.servicesOpenList.indexOf(servicesMapName) === -1
                ) {
                    // applyOpenService();
                    applyOpenService(servicesMapName, href);
                }
                else {
                    href && locator.redirect(href);
                }

            }
            else {
                if (href) {
                    href && locator.redirect(href);
                    // if ($(target).parent().hasClass('nav-title-item')) {
                    //     thirdNav.slideUp('fast');
                    //     $('.sub-nav ul ul').css('display', 'none');
                    // }
                }
                // else {
                //     var subNavList = $(target.nextSibling);
                //     $('.sub-nav ul ul').css('display', 'none');
                //     if (subNavList.css('display') === 'none') {
                //         thirdNav.slideDown('fast');
                //         subNavList.slideDown('fast');
                        // $(target).siblings('.arrow-icon')
                        //     .removeClass('icon-chevron-right')
                        //     .addClass('icon-chevron-down');
                //     }
                //     else {
                //         subNavList.slideUp('fast');
                        // $(target).siblings('.arrow-icon')
                        // .removeClass('icon-chevron-down')
                        // .addClass('icon-chevron-right');
                //     }
                // }
            }
            window.scrollTo(0, 0);
        });
        $('.oscar-nav a').on('click', function () {
            var $this = $(this);
            if (this.href) {
                top.location.href = this.href;
            }
            else {
                // 营销的一级菜单跳转
                locator.redirect($this.data('href'));
            }
            $this.parents('.nav').find('a').removeClass('active');
            $this.addClass('active');
            window.scrollTo(0, 0);
            // $(window).scrollTop(-1);

        });

        $('#wrapper .sub-nav').on('click', '.sub-nav-arrow', function () {
            var $this = $(this);
            $this.siblings('ul').toggleClass('hide');
            $this.toggleClass('arrow-content-up');
        });

        $('#wrapper .sub-nav').hover(function () {
            $('body').css('overflow', 'hidden');
        }, function () {
            $('body').css('overflow', 'auto');
        });

        $('#wrapper #main').hover(function () {
            $('body').css('overflow', 'auto');
        });

        $('#wrapper').on('click', '.slide-nav-btn', function (e) {
            var $this = $(this);
            var $mainWrapper = $('#wrapper');
            $mainWrapper.find('#main').toggleClass('broaden');
            $mainWrapper.find('.sub-nav').toggleClass('foldup');
            $this.find('.slide-nav-icon').toggleClass('slide-nav-icon-right').toggleClass('slide-nav-icon-left');
            $('#main').trigger('click');
        });

    }

    // function generatSubNnavTabTpl(navData, level, mainNavType) {
    //     var tpl = mainNavType ? '<ul class="' + mainNavType + '">' : '<ul>';
    //     level = level || 1;
    //     for (var i = 0, navLen = navData.length; i < navLen; i++) {
    //         var item = navData[i];
    //         item.url && urlList.push(item.url);
    //         item.url = item.url ? item.url : '';
    //         if (item.hasOwnProperty('subNavList')) {
    //             level++;
    //             item.subNavList = generatSubNnavTabTpl(item.subNavList, level);
    //             level--;
    //         }
    //         if (level === 1) {
    //             if (item.subNavList) {
    //                 item.arrowIcon = '<i class="icon-chevron-down arrow-icon"></i>';
    //                 item.navTabClass = 'nav-text';
    //             }
    //             else {
    //                 item.navTabClass = 'nav-text nav-tab';
    //             }
    //             tpl += lib.format(subNavTitleTabTpl, item);
    //         }
    //         else {
    //             tpl += lib.format(subNavTabTpl, item);
    //         }
    //     }
    //     tpl += '</ul>';
    //     return tpl;
    // }

    // function createNav() {
    //     var conf = navConf.navConfData;
    //     mainNavHtml += '<ul>';
    //     $.each(conf, function (index, item) {
    //         if (item.hasOwnProperty('subNavConf')) {
    //             subNavHtml += generatSubNnavTabTpl(item.subNavConf, 1, item.mainNavType);
    //         }
    //         mainNavHtml += lib.format(mainNavTabTpl, item);
    //     });
    //     mainNavHtml += '</ul>';
    // }


    var subNavHtml;
    var realUrl = '';

    function createFourthNav(fourthList, url, number) {
        $.each(fourthList, function (index, tabItem) {
            var tabUrl = tabItem.url.slice(tabItem.url.lastIndexOf('/') + 1);
            if (number === 0 && index === 0) {
                realUrl = tabUrl;
            }
            var tabObj = {
                name: tabItem.name,
                url: '#/' + tabUrl,
                className: tabUrl
            };
            CONST[url].tabsTwo.push(tabObj);
        });
    }

    function createThirdNav(thirdList, url) {
        var thirdNavHtml = '<ul>';
        $.each(thirdList, function (index, tabItem) {
            var tabUrl = tabItem.url.slice(tabItem.url.lastIndexOf('/') + 1);
            if (index === 0) {
                realUrl = tabUrl;
            }
            var tabObj = {
                name: tabItem.name,
                url: '#/' + tabUrl,
                className: tabUrl
            };

            tabItem.url = '#/' + tabUrl;
            tabItem.className = tabUrl;
            CONST[url].tabsOne.push(tabObj);

            var fourthList = tabItem.subList;
            if (fourthList) {
                CONST[tabUrl] = CONST[tabUrl] || {};
                CONST[tabUrl].tabsTwo = [];
                createFourthNav(fourthList, tabUrl, index);
            }

            thirdNavHtml += lib.format(thirdNavTabTpl, tabItem);
        });
        thirdNavHtml += '</ul>';

        return thirdNavHtml;


    }

    function createSubNav(item) {
        var subList = item.subList;
        var subNavName = '#' + item.url.substring(item.url.lastIndexOf('/'));
        var subNavObj = {
            name: item.name,
            hashArray: [],
            thirdNavList: '',
            arrowIcon: '',
            html: ''
        };
        subNavHtml = '<ul>';
        $.each(subList, function (index, subItem) {
            var url = subItem.url;
            url = url.slice(url.lastIndexOf('/') + 1);
            subItem.className = url;
            var thirdList = subItem.subList;
            if (thirdList) {
                CONST[url] = {};
                CONST[url].tabsOne = [];
                subItem.thirdNavList = createThirdNav(thirdList, url);
                subItem.url = '#/' + realUrl;
                subItem.arrowIcon = subArrowIconTpl;
            }
            else {
                subItem.url = '#/' + url;
            }
            subNavObj.hashArray.push(subItem.url);
            if (subItem.hashArrayExtra) {
                subNavObj.hashArray = subNavObj.hashArray.concat(subItem.hashArrayExtra);
            }
            subNavHtml += lib.format(subNavTabTpl, subItem);
        });
        subNavHtml += '</ul>';
        subNavObj.html = subNavHtml;
        subNavMap[subNavName] = subNavObj;
    }

    /**
     * 导航栏的html结构

     * @param  {Object} data 请求到的导航栏数据
     * @return {Object} 一级和二级菜单的html结构
     */

    function createNav(data) {
        var mainNavHtml = '';
        var hideNavHTml = '';
        var hasSetDefaultHash = false;
        var length = data.length;
        $.each(data, function (index, item) {
            if (item.subList && item.subList.length) {
                // 修正顶层导航
                var firstSubNavUrl = item.subList[0].url;
                item.url = firstSubNavUrl.substring(firstSubNavUrl.lastIndexOf('/'));
                item.className = '';
                createSubNav(item);
                if (item.name === '商家营销') {
                    hasSetDefaultHash = true;
                    CONST.DEFAULT_HASH_MERCHANT = item.url;
                    item.className = 'merchant';
                }
                else if (item.name === '新营销平台') {
                    hasSetDefaultHash = true;
                    CONST.DEFAULT_HASH_MARKETING = item.url;
                    item.className = 'marketing';
                }
                else if (!hasSetDefaultHash) {
                    hasSetDefaultHash = true;
                    CONST.DEFAULT_HASH = item.url;
                }

                // 把自己的tab放在第一层，避免隐藏在列表
                // if (item.name !== '新营销平台' || item.name !== '商家营销') {
                //     mainNavHtml = lib.format(mainNavTabWithSubTpl, item) + mainNavHtml;
                // }
                // else
                if (index > 4) {
                    hideNavHTml += lib.format(mainNavTabWithSubTpl, item);
                }
                else {
                    mainNavHtml += lib.format(mainNavTabWithSubTpl, item);
                }

            }
            else {
                item.url = 'http://oscar.baidu.com' + item.url;
                if (index > 4) {
                    hideNavHTml += lib.format(mainNavTabTpl, item);
                }
                else {
                    mainNavHtml += lib.format(mainNavTabTpl, item);
                }
            }
        });

        if (length > 4) {
            mainNavHtml = mainNavHtml
                + '<div class="more">'
                    + '<span class="more-tab-circle"></span>'
                    + '<span class="more-tab-circle"></span>'
                    + '<span class="more-tab-circle"></span>'
                    + '<div class="arrow-content arrow-content-shim arrow-content-up"><em></em><i></i></div>'
                    + '<div class="hide-nav-list">'
                        + hideNavHTml
                    + '</div>'
                + '</div>';

        }

        return mainNavHtml;
    }

    function renderNavTab(data) {
        var mainNavHtml = createNav(data);
        $('.nav').html(mainNavHtml);
        $('.sub-nav').append(subNavHtml);
        // 商家营销权限控制问题
        // 智能推广
        $('.nav-text.promotionactlist').parents('.nav-item').addClass('hide');
    }

    exports.initNavTab = function (data) {
        data = buildData(data, '');
        renderNavTab(data);
        bindEvents();
        checkSubnav();
    };

    // function checkSubnav(subNavObj, cb) {
    //     if (subNavObj && subNavObj.name.indexOf('商家营销') > -1) {
    //         // 判断是否开通权限服务
    //         ajax.post(url.GET_MECHANT_SERVICE_LIST, {}, true).then(function (data) {
    //             cb && cb();
    //             var $navItem = $('.nav-text.promotionactlist').parents('.nav-item');
    //             if (data && data.data && data.data.services && data.data.services.length
    //                 && data.data.services.indexOf('MERCHANT_MARKETING') !== -1) {
    //                 // 智能推广
    //                 $navItem.removeClass('hide');
    //             }
    //             else {
    //                 $navItem.addClass('hide');
    //             }
    //         });
    //     }
    //     else {
    //         cb && cb();
    //     }
    // }

    function checkSubnav(subNavObj, cb) {
        if (subNavObj && (subNavObj.name.indexOf('商户营销') > -1 || subNavObj.name.indexOf('商家营销') > -1)) {
            $('#header .merchant').addClass('active');
            $('#header .marketing').removeClass('active');
            // 判断是否开通权限服务
            ajax.post(url.GET_MECHANT_SERVICE_LIST, {}, true).then(function (data) {
                if (data && data.data && data.data.services && data.data.services.length) {
                    CONST.servicesOpenList = data.data.services;
                }
                cb && cb();
            });
        }
        else {
            $('#header .merchant').removeClass('active');
            $('#header .marketing').addClass('active');
            cb && cb();
        }
    }

    function applyOpenService(servicesMapName, href) {
        var view = new UIView();
        view.popActionDialog({
            title: '申请协议阅读',
            url: '/applyopenconfirm',
            width: CONST.MIDDLE_DIALOG_WIDTH,
            top: 10,
            actionOptions: {
                // merchantName: view.model.get('merchantName'),
                actionCallback: function () {
                    // $('.nav-text.promotionactlist').parents('.nav-item').removeClass('hide');
                    locator.redirect(href, 1);
                }
            }
        });
        // Dialog.confirm({
        //     content: '很抱歉，您暂未开通此功能，是否要开通',
        //     title: '提示',
        //     okText: '开通',
        //     cancelText: '取消',
        //     raw: 1,
        //     width: CONST.SMALL_DIALOG_WIDTH,
        //     top: CONST.DIALOG_TOP,
        //     onok: function () {
        //         // 判断是否开通权限服务
        //         ajax.post(url.APPLY_MECHANT_SERVICE, {name: servicesMapName}, true).then(function (data) {
        //             if (data && data.data && data.data.result) {
        //                 CONST.servicesOpenList.push(servicesMapName);
        //                 href && locator.redirect(href);
        //             }
        //             else {
        //                 Dialog.alert({
        //                     title: '提示',
        //                     content: '申请开通失败，请稍后重试',
        //                     width: CONST.SMALL_DIALOG_WIDTH
        //                 });

        //             }
        //         });
        //     }
        // });
    }

    function buildData(data, tools) { // 后端不支持四级菜单，才做的合并处理,tools是营销工具的对象
        var len = data.length;
        tools = tools || '';
        for (var i = 0; i < len; i++) {
            if ((data[i].name === '新营销平台'
                || data[i].name === '商户营销'
                || data[i].name === '商家营销')
                && data[i].subList && data[i].subList.length) {
                buildData(data[i].subList, tools);
            }

            if (data[i].url.indexOf('prize/prizeplan') !== -1 // 放到营销工具下的tab都要在这里加一下条件哈！
                || data[i].url.indexOf('game/gameplan') !== -1
                || data[i].url.indexOf('giftpackage/giftpackageplan') !== -1) {
                if (!tools) {
                    tools = {
                        name: '营销工具',
                        url: data[i].url,
                        hashArrayExtra: ['#/prizeplan', '#/gameplan', '#/giftpackageplan'],
                        subList: []
                    };
                }

                tools.subList.push(data[i]);
                data.splice(i, 1);
                i = i - 1;
                len = len - 1;
            }

        }

        if (tools) {
            data.push(tools);
        }

        return data;
    }

    return exports;
});

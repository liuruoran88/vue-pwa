/**
 *
 * @file 目标顾客表单
 * @author panyuqi (panyuqi@baidu.com)
 */
/* eslint-disable no-var */
/* eslint-disable fecs-valid-constructor */
/* eslint-disable no-loop-func */
define(
    function (require) {
        require('esui/BoxGroup');
        require('esui/Select');
        var esui = require('esui');
        var lib = require('esui/lib');
        var helper = require('esui/controlHelper');
        var Control = require('esui/Control');
        var ui = require('esui/main');

        /**
         * 控件类
         *
         * @constructor
         * @param {Object} options 初始化参数
         */
        function TargetCustomerForm(options) {
            Control.apply(this, arguments);
        }

        TargetCustomerForm.defaultProperties = {
            // 是否只读
            readOnly: false,
            // 月份替换符号
            monthReplacer: '<%%>',
            // 当前选中的tab
            selectedTabIdx: 0,
            // 当前选中的值列表
            selectedValues: {
                activenessFeatures: []
            },
            // 禁止选择的值列表
            disabledValues: {},
            // 隐藏选择的值列表
            hiddenValues: {},
            // tab数据
            tabs: [
                {
                    name: 'activenessFeatures',
                    text: '按活跃度',
                    idx: 0,
                    list: [
                        {
                            name: '路过潜在顾客',
                            value: 'PASS_POTENTIAL',
                            tag: '精准营销',
                            tip: '对近<%%>路过影院的潜在新顾客投放优惠券，可以拉来附近商圈的新顾客，提高品牌知名度和曝光度',
                            months: [3, 6, 9, 12],
                            selectedMonth: 3
                        },
                        {
                            name: '进店潜在顾客',
                            value: 'ARRIVAL_POTENTIAL',
                            tag: '精准营销',
                            tip: '对近<%%>进入影院但未购票的新顾客投放优惠券，可以拉来有观影意向的新顾客',
                            months: [3, 6, 9, 12],
                            selectedMonth: 3
                        },
                        {
                            name: '线上潜在顾客',
                            value: 'POTENTIAL',
                            tip: '对近<%%>浏览过影院页面但未成功支付的潜在新顾客投放短信，培养顾客观影习惯',
                            months: [3, 6, 9, 12],
                            selectedMonth: 3
                        },
                        {
                            name: '低频观影',
                            value: 'SWING',
                            tip: '对近<%%>购票不超过2次的老顾客投放短信，可以拉来低频观影或偶尔去附近影院观影的顾客',
                            months: [3, 6, 9, 12],
                            selectedMonth: 3
                        },
                        {
                            name: '高频观影',
                            value: 'ACTIVE',
                            tip: '对近<%%>购票不低于3次的老顾客投放优惠券，可以固化其观影习惯，提高品牌忠诚度',
                            months: [3, 6, 9, 12],
                            selectedMonth: 3
                        },
                        {
                            name: '流失顾客',
                            value: 'LOST',
                            tip: '对之前下过单但近<%%>未下单的老顾客投放短信，可以召回已流失的顾客再次到影院观影',
                            months: [3, 6, 9, 12],
                            selectedMonth: 3
                        }
                    ]
                },
                {
                    name: 'filmTypeFeature',
                    text: '按观影类型',
                    idx: 1,
                    isMerged: true,
                    featureListKey: 'filmTypes',
                    months: [3, 6, 9, 12],
                    selectedMonth: 3,
                    tip: '对近<%%>的顾客投放',
                    list: [
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
                    ]
                },
                {
                    name: 'memberCardFeatures',
                    text: '按会员卡',
                    idx: 2,
                    list: [
                        {
                            name: '非会员老顾客',
                            value: 'NONE',
                            tip: '对近<%%>未开会员卡的购票顾客投放优惠券，固化观影习惯，提高开卡率',
                            months: [3, 6, 9, 12],
                            selectedMonth: 3
                        },
                        {
                            name: '有效期较长',
                            value: 'LONG_EXPIRE',
                            tip: '对有效期超过2周的会员卡顾客投放优惠券，提高品牌忠诚度，促进订单转化'
                        },
                        {
                            name: '即将到期',
                            value: 'SHORT_EXPIRE',
                            tip: '对有效期不足2周的会员卡顾客投放优惠券，提升其再次续卡量'
                        },
                        {
                            name: '卡已失效',
                            value: 'INVALID',
                            tip: '对近<%%>内过期的会员卡顾客下发优惠券，促使其重新开卡',
                            months: [3, 6, 9, 12],
                            selectedMonth: 3
                        }
                    ]
                }
            ]
        };

        // 每个tab下特性列表中列表项的模板
        var featureTpl = [
            '<label title="${title}" class="feature-item ${wrapperClass}">',
                '<input type="${type}" name="${name}" id="${id}"'
                    + ' title="${title}" value="${value}"${checked} />',
                '<span class="feature-label">${title}${tag}</span>',
                '<span class="feature-tip">${tip}</span>',
            '</label>'
        ].join('');

        TargetCustomerForm.prototype = {
            /**
             * 控件类型
             *
             * @type {string}
             */
            type: 'TargetCustomerForm',

            /**
             * 初始化参数
             *
             * @param {Object=} options 构造函数传入的参数
             * @override
             * @protected
             */
            initOptions: function (options) {
                var properties = {};
                $.extend(true, properties, TargetCustomerForm.defaultProperties);
                $.extend(true, properties, options);
                this.setProperties(properties);
            },

            /**
             * 过滤掉禁止展示的选项
             *
             */
            filterHiddenValues: function () {
                var me = this;
                for (var tabName in me.hiddenValues) {
                    if (me.hiddenValues.hasOwnProperty(tabName)) {
                        var hiddenValues = me.hiddenValues[tabName];
                        var tab = me.findTabByTabName(tabName);
                        tab.list = tab.list.filter(function (listItem) {
                            return hiddenValues.indexOf(listItem.value) === -1;
                        });
                    }
                }
            },

            /**
             * 根据tab名称查找对应tab
             *
             * @param {string} tabName tab名称
             * @return {Object} tab对象
             */
            findTabByTabName: function (tabName) {
                return this.tabs.filter(function (tab) {
                    return tab.name === tabName;
                })[0];
            },

            /**
             * 生成每条特性拥有的月份select
             *
             * @param {Object} feature 特性对象
             * @param {number} tabIdx tab序号
             * @param {number} featureIdx 特性序号
             * @return {string} 月份html
             */
            generateSelectHtml: function (feature, tabIdx, featureIdx) {
                // var disabledHtml = this.readOnly ? ' disabled' : '';
                // 先暂时禁止所有月份选择
                var disabledHtml = ' disabled';
                var monthSelectTpl = '<select class="feature-month-select" data-tab-idx="'
                    + tabIdx + '" data-feature-idx="' + featureIdx + '"' + disabledHtml + '>';
                monthSelectTpl += feature.months.reduce(function (prev, cur) {
                    var selectedHtml = '';
                    if (cur === feature.selectedMonth) {
                        selectedHtml = 'selected="selected"';
                    }
                    return prev + lib.format('<option value="${month}" ' + selectedHtml + '>${month}个月</option>', {
                        month: cur
                    });
                }, '') + '</select>';
                return monthSelectTpl;
            },

            /**
             * 初始化DOM结构
             *
             * @protected
             */
            initStructure: function () {
                var me = this;
                // 去掉禁止展示的选项
                me.filterHiddenValues();
                // 设置tab下boxgroup初始值
                var selectedRawValue = [];
                for (var tabName in me.selectedValues) {
                    if (me.selectedValues.hasOwnProperty(tabName)) {
                        var tab = me.findTabByTabName(tabName);
                        var selectedFeatures = me.selectedValues[tabName];
                        // 例如影片类型，月份是合并过的
                        if (!selectedFeatures) {
                            continue;
                        }
                        if (tab.isMerged) {
                            var featureList = selectedFeatures[tab.featureListKey];
                            if (featureList && featureList.length) {
                                // 设置选中tabidx
                                me.selectedTabIdx = tab.idx;
                                tab.selectedMonth = selectedFeatures.month;
                                selectedRawValue = featureList;
                            }
                        }
                        else {
                            if (selectedFeatures && selectedFeatures.length > 0) {
                                // 设置选中tabidx
                                me.selectedTabIdx = tab.idx;
                                selectedRawValue = selectedFeatures.map(function (v) {
                                    // 顺便设置选中的月份
                                    var currentTabListItem = tab.list.filter(function (f) {
                                        return f.value === v.type;
                                    })[0];
                                    if (currentTabListItem) {
                                        currentTabListItem.selectedMonth = v.month;
                                    }
                                    return v.type;
                                });
                            }
                        }
                    }
                }
                // 插入顶层tab
                me.tab = esui.create('BoxGroup', {
                    id: helper.getId(me),
                    name: me.name,
                    disabled: me.readOnly,
                    rawValue: [me.selectedTabIdx],
                    datasource: me.tabs.map(function (tab, idx) {
                        return {
                            title: tab.text,
                            value: idx
                        };
                    })
                });
                me.tab.appendTo(me.main);
                // 点击切换tab
                me.tab.on('change', function () {
                    me.switchTab(Number(this.getValue()));
                });
                // 保存所有tab
                me.featureTabs = [];
                // 保存所有boxGroup
                me.featureGroups = [];
                // 依次创建每个tab中的boxGroup
                me.tabs.forEach(function (tab, tabIdx) {
                    var $featureTab = $('<div class="feature-tab"></div>');
                    if (tab.isMerged) {
                        var selectedHtml = tab.tip.replace(me.monthReplacer, me.generateSelectHtml(tab, tabIdx, 0));
                        $featureTab.append($(
                            '<div>' + selectedHtml + '</div>'
                        ));
                    }
                    var featureGroup = esui.create('BoxGroup', {
                        id: helper.getId(me, tab.name),
                        name: me.name + tab.name,
                        boxType: 'checkbox',
                        disabled: me.readOnly,
                        template: featureTpl,
                        datasource: tab.list.map(function (feature, idx) {
                            // 生成月份select
                            var monthSelectTpl = '';
                            if (!tab.isMerged && feature.months && feature.months.length) {
                                monthSelectTpl = me.generateSelectHtml(feature, tabIdx, idx);
                            }
                            // 每条特性描述
                            var tipTpl = feature.tip
                                && feature.tip.replace(me.monthReplacer, monthSelectTpl);
                            // 右上角标签
                            var tagTpl = feature.tag
                                ? lib.format('<span class="feature-tag">${tag}</span>', {tag: feature.tag})
                                : '';
                            return {
                                title: feature.name,
                                value: feature.value,
                                extraParams: {
                                    tag: tagTpl,
                                    tip: tipTpl
                                }
                            };
                        })
                    });
                    // 选择选项触发change事件
                    featureGroup.on('change', function () {
                        me.fire('change');
                    });
                    featureGroup.appendTo($featureTab[0]);
                    $featureTab.appendTo(me.main);
                    // 隐藏tab
                    $featureTab.hide();
                    me.featureGroups.push(featureGroup);
                    me.featureTabs.push($featureTab);
                });
                // 首次切换
                me.switchTab(me.selectedTabIdx);
                // 设置tab中选中的特性
                me.featureGroups[me.selectedTabIdx].setRawValue(selectedRawValue);
                // 绑定月份选择
                $('.feature-month-select').on('change', function (e) {
                    var tabIdx = Number($(this).data('tab-idx'));
                    var selectedMonth = Number($(this).val());
                    var tab = me.tabs[tabIdx];
                    if (tab.isMerged) {
                        tab.selectedMonth = selectedMonth;
                    }
                    else {
                        var featureIdx = $(this).data('feature-idx');
                        tab.list[featureIdx].selectedMonth = selectedMonth;
                    }
                    me.fire('change');
                });
                // 禁止选择
                me.disableFeatures();
            },

            /**
             * 切换tab
             *
             * @param {number} idx tab序号
             */
            switchTab: function (idx) {
                var me = this;
                me.featureTabs[me.selectedTabIdx].hide();
                me.featureGroups[me.selectedTabIdx].setRawValue([]);
                me.featureTabs[idx].show();
                me.selectedTabIdx = idx;
            },

            /**
             * 返回当前选中的数据
             *
             * @return {Object} 返回数据对象，没有选择任何值则返回null
             */
            getSelectedValues: function () {
                var ret = {};
                var types = this.featureGroups[this.selectedTabIdx].getRawValue();
                if (types.length) {
                    var tab = this.tabs[this.selectedTabIdx];
                    if (tab.isMerged) {
                        ret[tab.name] = {
                            month: tab.selectedMonth
                        };
                        ret[tab.name][tab.featureListKey] = types || [];
                    }
                    else {
                        ret[tab.name] = types
                        && types.map(function (type) {
                            var featureObj = {type: type};
                            var selectedFeature = tab.list.filter(function (feature) {
                                return feature.value === type;
                            })[0];
                            if (selectedFeature && selectedFeature.selectedMonth) {
                                featureObj.month = selectedFeature.selectedMonth;
                            }
                            return featureObj;
                        })
                        || [];
                    }
                    return ret;
                }
                return null;
            },

            /**
             * 禁止选择特性
             *
             */
            disableFeatures: function () {
                for (var tabName in this.disabledValues) {
                    if (this.disabledValues.hasOwnProperty(tabName)) {
                        var tab = this.findTabByTabName(tabName);
                        if (tab) {
                            var featureBoxGroup = this.featureGroups[tab.idx];
                            var $featureItems = $(featureBoxGroup.main).find('.feature-item');
                            var disabledValues = this.disabledValues[tabName];
                            var featureValueMap = tab.list.map(function (f) {
                                return f.value;
                            });
                            disabledValues.forEach(function (featureVal) {
                                var idx = featureValueMap.indexOf(featureVal);
                                if (idx > -1) {
                                    // 禁止掉input和select
                                    $featureItems.eq(idx).find('input, select').attr({
                                        disabled: 'disabled',
                                        readOnly: 'readOnly'
                                    });
                                }
                            });
                        }
                    }
                }
            },

            /**
             * 创建控件主元素
             *
             * @param {Object=} options 构造函数传入的参数
             * @return {HTMLElement}
             * @override
             */
            createMain: function (options) {
                return document.createElement('div');
            },

            dispose: function () {
                if (helper.isInStage(this, 'DISPOSED')) {
                    return;
                }
                Control.prototype.dispose.apply(this, arguments);
            }
        };

        lib.inherits(TargetCustomerForm, Control);
        ui.register(TargetCustomerForm);

        return TargetCustomerForm;
    }
);

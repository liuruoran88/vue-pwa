/**
 * @file 加载基础框架及首屏用到的部分esui组件
 * @author zhangzhiqiang<zhangzhiqiang04@baidu.com>
 */

define(function (require) {
    // require('underscore.string');
    // require('json2');
    // require('store');

    require('er');

    require('er/util');
    require('er/tpl');
    require('er/datasource');
    require('er/controller');
    require('er/ajax');
    require('er/Observable');
    require('er/Deferred');
    require('er/URL');

    require('er/Action');
    require('er/Model');
    require('er/View');

    require('esui');
    require('esui/lib');
    require('esui/Extension');
    // require('esui/Tree');
    require('esui/Tab');
    // require('esui/Crumb');
    var RangeCalendar = require('esui/RangeCalendar');
    require('esui/Table');
    require('esui/Pager');
    require('esui/Form');
    require('esui/Button');
    // require('esui/TextLine');
    require('esui/Tip');
    require('esui/BoxGroup');
    // require('esui/CommandMenu');
    require('esui/Validity');
    require('esui/validator/RequiredRule');
    require('esui/validator/PatternRule');
    require('esui/validator/MaxRule');
    require('esui/validator/MinRule');
    require('esui/validator/MaxLengthRule');

    require('ef/UIView');
    require('ef/ActionPanel');

    // 扩展一下：这里require模块尽量不要依赖除了dep和common/util以外的模块，且模块代码比较稳定
    // 这样客户端才能充分利用入口模块的缓存，避免出现被合并到common/util的模块失效导致重复请求
    require('common/extension/er');
    require('common/extension/esui');
    require('common/ui/validator/MaxCNLengthRule');
    require('common/ui/AutogrowTextBox');
    require('common/ui/TargetCustomerForm');
    // require('common/ui/SubUIView');

    // 业务需要，重写RangeCalendar的getRawValue方法
    var moment = require('moment');
    var DATE_FORMATE = 'YYYY-MM-DD';
    function formatRangeCalendar(rangeObj) {
        return moment(rangeObj.begin).format(DATE_FORMATE) + '至' + moment(rangeObj.end).format(DATE_FORMATE);
    }
    RangeCalendar.prototype.getRawValueCopy = RangeCalendar.prototype.getRawValue;
    // 重写getRawValue方法，符合格式要求
    RangeCalendar.prototype.getRawValue = function () {
        return formatRangeCalendar(this.getRawValueCopy());
    };
});

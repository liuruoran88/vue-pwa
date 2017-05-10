/**
 * ESUI (Enterprise UI)
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 字段(中英文混合)最大长度验证规则
 * @author peilonghui
 */

define(
    function(require) {

        var util = require('common/util');

        var Rule = require('esui/validator/Rule');
        var ValidityState = require('esui/validator/ValidityState');

        function MaxCNLengthRule() {
            Rule.apply(this, arguments);
        }

        MaxCNLengthRule.prototype.type = 'maxCNLength';

        MaxCNLengthRule.prototype.errorMessage = 
            '${title}不能超过${maxCNLength}个字符';

        MaxCNLengthRule.prototype.check = function (value, control) {
            return new ValidityState(
                util.getStringLength(value) <= this.getLimitCondition(control),
                this.getErrorMessage(control)
            );
        };

        require('esui/lib').inherits(MaxCNLengthRule, Rule);
        require('esui/main').registerRule(MaxCNLengthRule, 100);

        return MaxCNLengthRule;
    }
);
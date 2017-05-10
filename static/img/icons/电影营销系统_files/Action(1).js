/**
 * @file   新建/编辑新商家券 Action
 * @author liuruoran<liuruoran@baidu.com>
 */

define(function (require) {

    var ERAction = require('er/Action');
    var util = require('er/util');

    /**
     * constructor
     *
     * @class
     */
    function Action() {
        ERAction.apply(this, arguments);
    }

    Action.prototype.modelType = require('./Model');

    Action.prototype.viewType = require('./View');

    Action.prototype.initBehavior = function () {
        ERAction.prototype.initBehavior.apply(this, arguments);
        var action = this;
        var view = action.view;
        view.on('cancel', function () {
            action.fire('handlefinish');
        });
    };

    util.inherits(Action, ERAction);

    return Action;

});

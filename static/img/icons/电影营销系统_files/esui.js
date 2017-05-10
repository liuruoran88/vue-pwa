/**
 * @file 定制 esui
 * @author zhujialu
 */

define(function (require) {

    var TextBox = require('esui/TextBox');
    var Validity = require('esui/Validity');
    var ValidityValidator = require('esui/validator/Validity');

    // var Uploader = require('common/ui/Uploader');

    TextBox.defaultProperties.height = 19;

    /**
     * 显示验证错误信息
     *
     * @param {string} message 错误信息
     * @param {string=} state 状态
     */
    Validity.prototype.showValidityMessage = function (message, state) {
        var validityValidator = new ValidityValidator();
        validityValidator.setCustomMessage(message);
        validityValidator.setCustomValidState(state || 'invalid');
        this.set('validity', validityValidator);
    };

    TextBox.prototype.onfocus = function (e) {
        var inputCtrl = e.target;

        var label = inputCtrl.getValidityLabel();
        if (label) {
            label.hide();
            $(inputCtrl.main)
                .removeClass('ui-textbox-validity-invalid')
                .removeClass('state-validity-invalid');
        }
    };

    // Uploader.defaultProperties.isSuccess = function (response) {
    //     return response.status === 0;
    // };
    // Uploader.defaultProperties.getErrorMessage = function (response) {
    //     if (response.status === 1) {
    //         if (response.desc != null) {
    //             return response.desc;
    //         }
    //         return response.statusInfo.errorDesc;
    //     }
    // };

});

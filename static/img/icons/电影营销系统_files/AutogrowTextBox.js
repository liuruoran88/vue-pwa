/**
 * @file input和textarea自动伸展
 * @author panyuqi
 */
define(function (require) {
    var lib = require('esui/lib');
    var main = require('esui/main');
    var TextBox = require('esui/TextBox');
    var Extension = require('esui/Extension');

    /**
     * input/textarea伸展
     *
     * @constructor
     * @param {Object} options 参数对象
     * @param {number} options.minWidth input最小宽度
     * @param {number} options.maxWidth input最大宽度
     * @param {number} options.minHeight textarea最小高度
     * @param {number} options.maxHeight textarea最大高度
     */
    function AutogrowTextBox(options) {
        lib.extend(this, this.defaultOptions, options);
        Extension.apply(this, arguments);
    }

    AutogrowTextBox.prototype = {
        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'AutogrowTextBox',
        /**
         * 默认属性
         *
         */
        defaultOptions: {
            minWidth: 200,
            maxWidth: 300
        },

        /**
         * 激活扩展
         *
         * @public
         */
        activate: function () {
            if (!(this.target instanceof TextBox)) {
                return;
            }
            var me = this;
            var setInitialStyle = false; // 样式初始化标志
            var $ele; // input/textarea$对象

            // 区分input还是textarea
            var inputType = this.target.mode === 'textarea' ?
                this.target.mode : 'input';

            var $mirror = $('<div class="autogrow-textarea-mirror"></div>');
            $mirror.css('display', 'none');
            $(this.target.main).parent().append($mirror);

            // 监听按键事件，由于此时子控件还没有渲染，只能在事件响应函数中取得元素
            this.target.on('input', function (e) {
                if (!$ele) {
                    var input = lib.g(e.target.inputId);
                    $ele = $(input);
                }
                if (!setInitialStyle) {
                    $mirror.css('padding-left', $ele.css('padding-left'))
                        .css('padding-right', $ele.css('padding-right'))
                        .css('padding-top', $ele.css('padding-top'))
                        .css('padding-bottom', $ele.css('padding-bottom'))
                        .css('font-family', $ele.css('font-family'))
                        .css('font-size', $ele.css('font-size'))
                        .css('line-height', $ele.css('line-height'));
                    if (inputType === 'input') {
                        $mirror.css('height', $ele.css('height'))
                            .css('white-space', 'nowrap');
                        $ele.css('minWidth', parseFloat(me.minWidth))
                            .css('maxWidth', parseFloat(me.maxWidth));
                    } else {
                        $mirror.css('width', $ele.css('width'))
                            .css('word-wrap', 'break-word')
                            .css('white-space', 'normal');
                        $ele.css('minHeight', parseFloat(me.minHeight))
                            .css('maxHeight', parseFloat(me.maxHeight));
                    }
                    setInitialStyle = true;
                }

                // 替换html字符
                var inputContent = $ele.val()
                    .replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');

                if (inputType === 'input') {
                    $mirror.html(inputContent);

                    if ($ele.width() !== $mirror.width()) {
                        $ele.width($mirror.width());
                    }
                } else {
                    // 替换换行符 默认显示一行的高度
                    $mirror.html(inputContent.replace(/\n/g, '<br />') + '<br/>');

                    if ($ele.height() !== $mirror.height()) {
                        $ele.height($mirror.height());
                    }
                }
            });

            Extension.prototype.activate.apply(this, arguments);
        },

        inactivate: function () {
            this.target.un('input');

            Extension.prototype.inactivate.apply(this, arguments);
        }
    };

    lib.inherits(AutogrowTextBox, Extension);
    main.registerExtension(AutogrowTextBox);

    return AutogrowTextBox;

});

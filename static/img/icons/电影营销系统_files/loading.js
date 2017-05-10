/**
 * @file loading.js 请求等待遮罩
 *
 * @author zhangzhiqiang(zhangzhiqiang04@baidu.com)
 */

define(function (require) {

    // var mask = {
    //     id: 'mask',
    //     getMaskElement: function () {
    //         var ele = document.getElementById(this.id);
    //         if (!ele) {
    //             ele = document.createElement('div');
    //             ele.id = this.id;
    //             ele.className = 'ui-mask';
    //             document.body.appendChild(ele);
    //         }
    //         return ele;
    //     },

    //     show: function () {
    //         var ele = this.getMaskElement();
    //         ele.style.display = 'block';
    //     },

    //     hide: function () {
    //         var ele = this.getMaskElement();
    //         $(ele).fadeOut('fast');
    //     }
    // };

    var loading = {
        count: 0,
        id: 'loading',

        getLoadingElement: function () {
            var ele = document.getElementById(this.id);
            if (!ele) {
                ele = document.createElement('div');
                ele.id = this.id;
                ele.className = 'ui-loading';
                ele.innerHTML = [
                    '<div class="loading">',
                        '<div class="loading-inner">',
                            '<div class="loading-text">正在读取数据，请稍候...</div>',
                        '</div>',
                    '</div>'
                ].join('');

                document.body.appendChild(ele);
            }
            return ele;
        },

        show: function () {
            var ele = this.getLoadingElement();
            // mask.show();
            ele.style.display = 'block';
            this.count++;
        },

        hide: function () {
            var ele = this.getLoadingElement();
            if (this.count) {
                this.count--;
            }

            if (this.count === 0) {
                $(ele).fadeOut('fast');
                // mask.hide();
            }
        }

    };

    return loading;

});

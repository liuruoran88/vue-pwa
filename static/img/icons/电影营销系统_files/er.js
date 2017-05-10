/**
 * @file 扩展ER。ER 自身保持精简，可根据项目灵活扩展，而且这种扩展也是非常必要的
 * @author zhujialu
 */

define(function (require) {

    var controller = require('er/controller');
    var ajax = require('er/ajax');

    var Action = require('er/Action');
    var Model = require('er/Model');
    var View = require('er/View');
    var UIView = require('ef/UIView');

    var util = require('common/util');
    var erUtil = require('er/util');

    var locator = require('er/locator');

    var indexURL = '/';

    // 已注册的 action
    var actionMap = { };

    Action.derive = function (extension) {

        /**
         * 扩展的 Action 基类
         *
         * @constructor
         */
        function SubAction() {
            var action = this;

            // model 加载完成后
            // 把当前 action 的子 action 信息加到 model 上
            // 方便模版使用 @actionURL.subAction
            this.on('modelloaded', function () {

                if (!action.model) {
                    action.model = { };
                }

                var model = action.model;
                var subActions = action.getSubActions();

                if (typeof model.set === 'function') {
                    model.set('actionURL', subActions);
                }
                else {
                    erUtil.mix(model, {actionURL: subActions});
                }
            });

            Action.apply(this, arguments);
        }

        util.overrideSafe(Action, extension, ['leave']);

        /**
         * 获得子 actions
         *
         * @return {Object} name -> path 的对象
         */
        SubAction.prototype.getSubActions = function () {
            if (!this.context || !this.context.url) {
                return null;
            }

            var path = this.context.url.getPath();
            return getSubActions(path);
        };

        erUtil.mix(SubAction.prototype, extension);
        erUtil.inherits(SubAction, Action);

        return SubAction;
    };

    UIView.derive = function (extension) {

        /**
         * 扩展的 View 基类
         *
         * @constructor
         */
        function SubView() {
            UIView.apply(this, arguments);
        }

        /**
         * 根据给定的选择器，查询当前视图上下文的DOM元素
         *
         * @param {string} selector jquery选择器
         * @return {Object|Array}
         */
        SubView.prototype.$ = function (selector) {
            return this.container ? $('#' + this.container + ' ' + selector) : [];
        };

        /**
         * 为UIView增加初始化选项信息，该方法在{@link SubUIView}实现里会被自动调用
         * 如果使用的是传统ER：Action-View-Model，可以无视该方法。。
         *
         * ER View设计，必须通过改原型，才能动态修改其传入的选项信息。。,构造函数不支持，比如
         * 要重置View的容器（同一视图可能同时存在于不同上下文容器）等等。。
         *
         * 此外，对UIView进行扩展支持modelType配置动态创建数据模型实例，使得UIView能从
         * Action剥离出来
         *
         * 对于Model如果包含init方法，会自动执行，对于不包含异步数据请求，可以在init里进行初始
         * 化，同时将load置为null，可以避免异步执行
         *
         * @param {Object} options 要初始化的选项信息
         * @param {Object=} options.context 要初始化数据模型的初始上下文信息，可选
         * @public
         */
        SubView.prototype.init = function (options) {
            options = $.extend(true, {}, options || {});

            // 删除用于初始化数据模型的context参数
            var context = options.context;
            delete options.context;

            $.extend(this, options);

            var model = this.model;
            if (model && !$.isFunction(model.get)) {
                this.model = model = new Model(model);
            }

            /**
             * 对UIView进行扩展支持modelType配置动态创建
             * 数据模型实例，使得UIView能从Action剥离出来
             *
             * @property {Function} modelType
             */
            if ($.isFunction(this.modelType) && !model) {
                var ModelType = this.modelType;
                this.model = model = new ModelType();
            }

            model && context && model.fill(context, {silent: true});

            // 初始化model
            if (model && $.isFunction(model.init)) {
                model.init();
            }
        };

        /**
         * 判断当前视图是否已经退出（销毁），由于当前很多异步请求，可能返回时候视图退出了，
         * 为了避免出错通常要做一些容错处理，可通过该接口判断视图是否已经退出（销毁）
         *
         * @return {boolean}
         */
        SubView.prototype.isQuit = function () {
            return !this.viewContext;
        };

        /**
         * @override
         */
        SubView.prototype.dispose = function () {

            /**
             * 触发视图离开事件，视图里可以通过onbeforeleave方法里实现dispose前的清理工作
             * 注意不要在dispose方法里完成！！！由于当前会先调用父类dispose，再执行
             * 子类的dispose方法，但这时候整个视图已经销毁掉了，如果在里面做一些上下
             * 文访问会报错！！！
             *
             * @event beforeleave
             */
            this.fire('beforeleave');
            UIView.prototype.dispose.apply(this, arguments);
        };

        util.overrideSafe(UIView, extension, ['init', 'enterDocument', 'bindEvents', 'dispose']);

        erUtil.mix(SubView.prototype, extension);
        erUtil.inherits(SubView, UIView);

        return SubView;
    };


    Model.derive = function (extension) {

        // 把 datasource 放在实例，而不是原型中
        var datasource = extension.datasource;
        if (datasource) {
            delete extension.datasource;
        }

        /**
         * 扩展的 Model 基类
         *
         * @constructor
         */
        function SubModel() {
            Model.apply(this, arguments);
            this.datasource = datasource;
        }

        erUtil.mix(SubModel.prototype, extension);
        erUtil.inherits(SubModel, Model);

        return SubModel;
    };

    /**
     * 注册子 action
     *
     * @param {Object} actions 子 action 配置
     */
    Action.registerAction = function (actions) {

        // 先给根（首页）设个值
        indexURL = indexURL.substr(1);
        actionMap[indexURL] = { };

        $.each(actions, function (index, config) {

            var segments = config.path.split('/');
            // 因为 path 以 / 开头，所以 segments[0] 是空字符串
            segments.shift();

            // 判断是否为首页
            // 比如首页是 /, 第二级是 /header
            // 这两个东西结构上看不出有父子关系
            // 所以最好分开处理
            //
            // 首页只有一个元素
            if (segments.length !== 1 || segments[0] !== indexURL) {
                var parentAction = actionMap[indexURL];

                $.each(segments, function (i, item) {

                    if (parentAction[item] == null) {
                        parentAction[item] = { };
                    }
                    parentAction = parentAction[item];

                });
            }
            controller.registerAction(config);

        });

    };

    /**
     * 获得 path 下面的所有子 action path
     *
     * @param {string} path 如 /header
     * @return {Object} 返回 子 action 的 path
     *                  如 { userInfo: '/header/userInfo' }
     */
    function getSubActions(path) {
        var segments = path.split('/');
        segments.shift();

        var isIndex = path === indexURL;
        var target = actionMap[indexURL.substr(1)];
        var pathPrefix = [];

        if (!isIndex) {
            $.each(segments, function (i, item) {
                pathPrefix.push(item);
                target = target[item];
            });
        }

        pathPrefix = '/' + pathPrefix.join('/') + (isIndex ? '' : '/');

        var ret = { };
        for (var key in target) {
            if (target.hasOwnProperty(key)) {
                ret[key] = pathPrefix + key;
            }
        }
        return ret;
    }

    /**
     * 序列化请求参数
     *
     * @param {Object} data 请求参数对象
     * @return {string}
     */
    ajax.hooks.serializeData = function (data) {
        return $.param(data);
    };

    var renderView = View.prototype.render;
    View.prototype.render = function () {
        this.fire('render');
        renderView.apply(this, arguments);
    };

    // 调用reload方法时附带的参数对象
    locator.reloadParams = {
        scrollTop: function () { // y轴滚动距离，ListFormView中使用，刷新后滚动到之前记录的位置
            return $(window).scrollTop();
        }
    };


    // 在吞错问题没解决之前，先这么救急
    require('er/events').on('error',
        /* eslint-disable */
        function (error) {
            var console = window.console;
            if (console && console.error) {
                console.error(error.error.stack);
            }
        }
    );

});

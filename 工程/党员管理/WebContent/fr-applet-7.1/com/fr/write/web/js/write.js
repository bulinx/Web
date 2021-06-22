/*
 * Copyright (c) 2001-2014,FineReport Inc, All Rights Reserved.
 */

/**
 * 生成填报页面的所有控件，绑定事件，提供参数联动等。
 * @class FR.Write
 * @extends FR.OB
 */
FR.Write = FR.extend(FR.OB, /**@class FR.Write*/{
    _init: function () {
        //b:初始化只初始widget
        FR.Write.superclass._init.apply(this, arguments);

        /**
         * @property {Map} location_widgets 位置和控件组成的键值对集合
         */
        this.location_widgets = {};
        this.name_widgets = {};

        var self = this;
        var selector = this.options.selector || 'td[widget]';
        if (typeof selector == "string") {
            $(selector, this.options.renderEl).each(function (idx, dom) {
                if ($.data($(dom),"__initialized__") !== true) {
                    self.addWidget($(dom));
                }
            })
        }
    },

    /**
     * Widget管理对象
     */
    WidgetMgr: {
        DependenceMgr: {
            //被依赖location -> 依赖location数组，A2,A3控件依赖A1控件，则dependenceMap["A1"]->["A2","A3"]
            _dependenceRelationMap: {},
            //location -> boolean,保存有依赖属性的控件有没有初始化
            _dependenceInitedMap: {},
            //需要马上添加依赖关系的。主要是带widget属性的如单选按钮组。
            _shouldInitAtOnce : [],
            /**
             * 添加依赖关系
             * @param location 被依赖的控件位置
             * @param dependenceLocation 带依赖属性控件的位置
             */
            addDependenceRelation: function (location, dependenceLocation) {
                if (typeof location === "string") {
                    location = location.toUpperCase();
                }
                var dependenceRelation = this._dependenceRelationMap[location];
                if (!dependenceRelation) {
                    dependenceRelation = [];
                    this._dependenceRelationMap[location] = dependenceRelation;
                }
                dependenceRelation.push(dependenceLocation);

            },
            /**
             * 获取依赖关系
             * @param location 被依赖的控件位置
             * @returns {*} 返回带依赖属性控件的位置数组
             */
            getDependenceRelation:function(location){
                if (typeof location === "string") {
                    location = location.toUpperCase();
                }
                return this._dependenceRelationMap[location];
            },
            /**
             * 标识已经初始化
             * @param location 带依赖属性控件的位置
             */
            setInited:function(location){
                this._dependenceInitedMap[location]=true;
            },
            /**
             * 判断是否初始化
             * @param location 带依赖属性控件的位置
             * @returns {boolean} 是否初始化
             */
            isInited:function(location){
                return !FR.isNull(this._dependenceInitedMap[location]);
            },

            /**
             * 添加要初始化依赖关系的控件
             * @param location 控件
             */
            addWidgetShouldInitDependence:function(location){
                this._shouldInitAtOnce[this._shouldInitAtOnce.length] = location;
            },

            /**
             * 获取要初始化依赖关系的控件
             * @returns {*}
             */
            getWidgetShouldInitDependence:function(){
                return this._shouldInitAtOnce;
            }

        }
    },
    /**
     * 将控件注册到控件位置集合(location_widgets)和控件名集合(name_widgets)中去
     * @param {FR.Widget} editor 要注册的控件
     */
    addEditor: function (editor) {
        if (editor.options.location) {
            this.location_widgets[editor.options.location] = editor;
        }
        if (editor.options.widgetName) {
            this.pushNameWidget(editor.options.widgetName, editor);
        }
    },

    /**
     * 单元格初始化控件，绑定事件并标记已初始化。
     * @param $dom {$} 单元格DOM元素
     */
    addWidget: function ($dom) {
        // richie:标记一下这个dom节点上的控件已经初始化
        $.data($dom, "__initialized__", true);
        this.addLocationWidget($dom, FR.jsonDecode($dom.attr('widget')));
    },

    addWriteWidget: function ($dom) {
        this.addLocationWidgetWithoutWriteEvent($dom, FR.jsonDecode($dom.attr('editor')));
    },

    /**
     * 单元格初始化控件。只在指定DOM里生成控件，不绑定事件。
     * @param {jQuery} $dom 单元格DOM元素
     * @param {JSON} editorConfig 控件配置属性
     */
    addLocationWidgetWithoutWriteEvent: function ($dom, editorConfig) {
        editorConfig.width = $dom.attr("widgetWidth");
        editorConfig.height = $dom.attr("widgetHeight");
        $.extend(editorConfig, {
            write: this
        });
        var $editor = $("<div/>").appendTo($dom);
        editorConfig.renderEl = $editor;
        if (editorConfig['jspath']) {
            var arr = editorConfig['jspath'].split(";");
            $.each(arr, function (i, item) {
                FR.$import(item, "js");
            });
        }
        if (editorConfig['csspath']) {
            var arr = editorConfig['csspath'].split(";");
            $.each(arr, function (i, item) {
                FR.$import(item, "css");
            });
        }
        editorConfig.border = $dom.border();

        var editorEl = FR.createWidget(editorConfig);

        this.addEditor(editorEl);
    },

    /**
     * 单元格初始化控件并绑定事件
     * @param {jQuery} $dom 单元格DOM元素
     * @param {JSON} editorConfig 控件的配置属性
     */
    addLocationWidget: function ($dom, editorConfig) {
        this.addLocationWidgetWithoutWriteEvent($dom, editorConfig);

        if (editorConfig.location) {
            this.widgetOnWriteEvent(this.location_widgets[editorConfig.location]);
        }
    },

    /**
     * 将控件添加进控件名集合中
     * @param {String} widgetName 控件名
     * @param {FR.Widget} widget 控件
     */
    pushNameWidget: function (widgetName, widget) {
        var name = widgetName.toUpperCase().perfectStart("$");
        if (!this.name_widgets[name]) {
            this.name_widgets[name] = widget;
        } else {
            if (FR.isArray(this.name_widgets[name])) {
                for (var i=0; i<this.name_widgets[name].length; i++) {
                    if (this.name_widgets[name][i].options.widgetUrl == widget.options.widgetUrl) {
                        return;
                    }
                }
                this.name_widgets[name].push(widget);
            } else {
                if (this.name_widgets[name].options.widgetUrl != widget.options.widgetUrl) {
                    this.name_widgets[name] = [this.name_widgets[name], widget];
                }
            }
        }
    },

    /**
     * 为控件绑定事件
     * @param {FR.Widget} widget 控件对象
     */
    widgetOnWriteEvent: function (widget) {
        widget.on(FR.Events.BEFORESTATECHANGE, function () {
            if (this.isEnabled()) {
                if (!_g(this.options.sessionID).curLGP.stopCellEditing()) {
                    return false;
                }
            }
        });
        widget.on(FR.Events.STATECHANGE, function () {
            // 不管校验成功与否，都应该执行fireCellValueChange，不然generateReportXML的值会与实际值不一致
            _g(this.options.sessionID).curLGP.fireCellValueChange(_g(this.options.sessionID).curLGP.getWidgetCell(this), this.getValue());
            if (!this.isValidate()) {
                FR.Msg.toast(this.getErrorMessage());
                return false;
            }
        });
    },
    /**
     * 处理联动的方法
     * @param variable {*} 联动参数
     * @returns {*}
     */
    resolveVariable: function (variable) {
        if ($.isFunction(this.options.resolveVariable)) {
            return this.options.resolveVariable(variable);
        }
    },

    /**
     * 根据单元格位置获取单元格中的控件
     * @param {String} location 单元格的位置，如C2，A7
     * @param {FR.Widget[]} widgets 控件集合，该参数不必要
     * @returns {FR.Widget} 控件
     */
    getWidgetByCell: function (location,widgets) {
        if (!this.location_widgets || !location) {
            return null;
        }
        return this.location_widgets[location] || this._findLocationWidget(location,widgets);
    },

    /**
     * 根据控件名字获取控件
     * @param {String} name 要获取的控件所具有的控件名
     * @returns {FR.Widget} 控件
     */
    getWidgetByName: function (name) {
        if (!name) {
            return null;
        }
        name = ((name.indexOf("$") !== 0) ? '$' + name : name).toUpperCase();
        // 必须先从已有的开始找 构建两次就不是同一个了对象了
        return (FR.isArray(this.name_widgets[name]) ? (this.name_widgets[name])[0] : this.name_widgets[name])
            || this._findNameWidget(name);
    },

    /**
     * 根据控件名获取具有同一名字的控件数组的集合
     * @param {String} name 要获取的控件所具有的控件名
     * @returns {FR.Widget[]} 控件数组
     */
    getWidgetsByName: function (name) {
        if (!name) {
            return;
        }
        name = ((name.indexOf("$") !== 0) ? '$' + name : name).toUpperCase();
        // 必须先从已有的开始找 构建两次就不是同一个了对象了
        return this.name_widgets[name] || this._findNameWidget(name, true);
    },

    _findTDByLocation: function(location){
        return $('td[id^='+location+'-]', this.options.renderEl);
    },

    /**
     * 在所给控件集合中找到指定单元格位置的控件
     * @param {String} location 单元格的位置
     * @param {Array} widgetsSrc 控件集合
     * @returns {FR.Widget} 返回找到的控件
     * @private
     */
    _findLocationWidget: function (location ,widgetsSrc) {
        var widgets;
        if(widgetsSrc!==undefined){
             widgets=widgetsSrc;
        }else{
            if(!FR.isValidCellStr(location)){
                return null;
            }
            widgets = this._findTDByLocation(location);
         }
        for (var i = 0, len = widgets.length; i < len; i++) {
            var config = FR.jsonDecode($(widgets[i]).attr('editor'));
            if (config.location == location) {
                $.extend(config, {
                    write: this,
                    //b:太别扭了，以后会widget直接resize即可
                    //获取offsetWidth会导致reflow,在这里初始化的一般都会resize，暂时去掉，看看有什么问题
                    width: widgets[i].offsetWidth + _g().curLGP.getewadjst(),
                    height: widgets[i].offsetHeight + _g().curLGP.getehadjst()
                });
                if (config.type == 'multifile') {
                    $.extend(config, {
                        tdCell: this.lgp.writePane.curLGP._get$TDCell(location)
                    });
                }
                this.addEditor(FR.createWidget(config));
                this._initDependenceRelationWidgetByKey(config.location);
                this._initDependenceRelationWidgetByKey(config.widgetName);
                return this.location_widgets[location];
            }
        }
    },

    /**
     * 初始化依赖控件
     * @param key DependenceMgr中relationMap中的键，可以是控件位置或者控件名称
     * @private
     */
    _initDependenceRelationWidgetByKey:function(key){
        if(!key){
            return;
        }
        var dependenceRelation = this.WidgetMgr.DependenceMgr.getDependenceRelation(key);
        this._initDependenceRelationWidget(dependenceRelation);
    },
    /**
     * 初始化依赖控件
     * @param dependenceRelation 依赖控件的位置数组
     * @private
     */
    _initDependenceRelationWidget: function (dependenceRelation) {
        if (dependenceRelation) {
            for (var i = 0; i < dependenceRelation.length; i++) {
                var location = dependenceRelation[i];
                if (this.WidgetMgr.DependenceMgr.isInited(location)) {
                    continue;
                }
                this.WidgetMgr.DependenceMgr.setInited(location);
                var widget = this.getWidgetByCell(location);
                if (widget == null) {
                    continue;
                }
                if (widget.options.dependenceMap) {
                    $.each(widget.options.dependenceMap, this._initCellValueChange, [this, widget]);
                } else if (FR.isArray(widget.options.dependence)) {
                    $.each(widget.options.dependence, this._initCellValueChange, [this, widget]);
                }
            }
        }
    },
    _initCellValueChange: function (fr_write,cur_widget) {
        var item = this;
        var self=fr_write.lgp;
        if (!cur_widget) {
            return;
        }
        var idOrName = item.startWith("$") ? item.substring(1) : item;
        var depId = idOrName + "-" + self.idx + "-" + self.tableID;
        var depWidget = fr_write.getWidgetByCell(idOrName) || fr_write.getWidgetByName(idOrName);
        if (depWidget) {
            depWidget.on(FR.Events.AFTEREDIT, function () {
                self.resetCellValue(this);
                this.reset();
                if (!this.couldUsedAsEditor()) {
                    this.element.show();
                }
            }.createDelegate(cur_widget));
        }
        ;
        self.on(FR.Events.CELLVALUECHANGE, function (cell, value) {
            // richer:由于这里采用的是WLGP的事件来进行联动的，所以要避免死循环
            var cellWidget = FR.jsonDecode(cell.attr("editor") || cell.attr("wdiget"));
            if ((cell.attr("id") == depId) || (cellWidget.widgetName ? (cellWidget.widgetName.toUpperCase() == idOrName.toUpperCase()) : false)) {
                self.resetCellValue(this);
                this.reset();
                if (!this.couldUsedAsEditor()) {
                    this.element.show();
                }
                return false;
            }
        }.createDelegate(cur_widget));
    },

    /**
     * 把带有editor属性的控件config缓存起来
     * @private
     */
    _cacheEditorConfig: function () {
        this.editorConfig = [];
        var widgets = $('td[editor]', this.options.renderEl);
        for (var i = 0, len = widgets.length; i < len; i++) {
            var config = FR.jsonDecode($(widgets[i]).attr('editor'));
            // 删除行的就去掉
            if ($(widgets[i]).hasClass("del")) {
                continue;
            }
            this.editorConfig[i] = config;
        }
    },

    _findNameWidget: function (name, multi) {
         if(!this.editorConfig){
             this._cacheEditorConfig();
         }
         //var widgets = $('td[editor]', this.options.renderEl);
         for (var i = 0, len = this.editorConfig.length; i < len; i++) {
             var config = this.editorConfig[i];
             if (config.widgetName) {
                 var tempName = ((config.widgetName.indexOf("$") !== 0) ? '$' + config.widgetName : config.widgetName).toUpperCase();
                 if (tempName == name) {
                     $.extend(config, {
                         write: this
                         //b:太别扭了，以后会widget直接resize即可
 //                        width: widgets[i].offsetWidth + _g().curLGP.getewadjst(),
 //                        height: widgets[i].offsetHeight + _g().curLGP.getehadjst()
                     });
                     this.addEditor(FR.createWidget(config));
                     this._initDependenceRelationWidgetByKey(config.location);
                     this._initDependenceRelationWidgetByKey(config.widgetName);
                     if (!multi) {
                         return this.name_widgets[name];
                     }
                 }
             }
         }
         return this.name_widgets[name];
     },

    // after append or delete row
    // 数据量大的时候影响效率 改成增删行只改变对应行中的控件比较合适
    refreshWidget: function() {

    }
});
$.shortcut("fr_write", FR.Write);

/**
 * 填报控件的接口，为填报中使用的控件添加公共的函数，按钮、复选框之类的即时显示的控件不需要继承此类
 * @class FR.WriteEditor
 * @extends FR.BaseEditor
 */
FR.WriteEditor = FR.extend(FR.BaseEditor, /**@class FR.WriteEditor*/{
    _defaultConfig: function () {
        return $.extend(FR.WriteEditor.superclass._defaultConfig.apply(), {
            usedAsEditor: true
        });
    },

    _init: function () {
        FR.WriteEditor.superclass._init.apply(this, arguments);
    },

    /**
     * 从dom中复制部分样式给编辑器以保证编辑器样式和格子样式的一致性
     * @param dom 要复制样式的dom
     */
    cssFrom: function (dom) {
        if (!this.editComp) {
            return;
        }
        var $dom = $(dom);

        var $comp = this.editComp;

        //wei:这里不知道为什么要remove掉原先的class，导致控件开始自定义的样式填报时无效。
        $comp.addClass($dom.attr("class"));
        //$comp.removeClass().addClass($dom.attr("class"));
        // alex:复制$dom的部分style
        $.each(['fontFamily', 'fontVariant', 'fontStyle', 'fontWeight', 'fontSize',
            'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'backgroundColor'], function (idx, el) {
            $comp.css(el, $dom.css(el));
        })
        if ((/transparent|rgba\(0, 0, 0, 0\)/).test($comp.css('backgroundColor'))) {
            $comp.css('backgroundColor', 'white')
        }
    },

    /**
     * 判断控件所在的格子是否被编辑过
     * @returns {boolean}  编辑过则返回true，否则返回false
     */
    isDirty: function () {
        return this.isWriteDataChanged();
    },

    /**
     * 让原值和新值进行比较，判断该控件是否进行了值的改动
     * @returns {boolean}  如果值改动了返回true，否则返回false
     */
    isWriteDataChanged: function () {
        return this.options.oldValue == null || !FR.equals(this.options.oldValue, this.getValue());
    },

    /**
     * 设置控件的值并保存原值以做比较
     * @param value 新值
     * @param shouldFireEvent 是否需要触发控件的编辑后等事件
     * @returns {*}
     */
    setValue4Write: function (value, shouldFireEvent) {
        this.options.oldValue = value;
        return this.setValue(value, shouldFireEvent);
    },

    /**
     * 开始编辑
     */
    startEditing: function () {
    },

    /**
     * 结束编辑
     */
    stopEditing: function () {
    },

    /**
     * 重置控件的值，用于填报联动
     */
    reset: function () {
        this.setValue("");
    }
});
$.shortcut("writeEditor", FR.WriteEditor);

/**
 * 给填报使用的控件增加FR.WriteEditor所具有的函数，类似于继承接口
 */
(function () {
    var writeEditor = [FR.EditCompBaseEditor, FR.MultiFileEditor];
    var ex_extend = function (target, superclass) {
        if (target.superclass != superclass.superclass) {
            throw new Error("different supper class");
        }
        var prototype = superclass.prototype;
        target.superclass = prototype;
        for (var name in prototype) {
            if (!target.prototype[name]) {
                target.prototype[name] = prototype[name];
            }
        }
    };
    for (var i = 0, len = writeEditor.length; i < len; i++) {
        ex_extend(writeEditor[i], FR.WriteEditor);
    }
}());

/**
 * @class FR.WritePane
 */
$.extend(FR.WritePane.prototype, /**@class FR.WritePane*/ function () {
    var P = {
        isLoadingPage: -1,
        selectMethod: 'editable', //可选值all, editable表示所有格子都可选中或仅editable格子才能使用
        selectedIndex: -1, // alex:当前选中的WLGP的序号
        gotoFirstPage: function () {
            this.curLGP.gotoFirstPage();
        },
        gotoPreviousPage: function () {
            this.curLGP.gotoPreviousPage();
        },
        gotoNextPage: function () {
            this.curLGP.gotoNextPage();
        },
        gotoLastPage: function () {
            this.curLGP.gotoLastPage();
        },
        /*
         * alex:初始化ContentPane
         */
        initContentPane: function () {
            //alex:加载write.css
            FR.$defaultImport('/com/fr/write/web/css/write.css', 'css');
            if (this.options["writeCss"]) {
                $.each(this.options["writeCss"], function (i, item) {
                    FR.$import(item, 'css');
                });
            }
            var tabPane = this.$contentPane.data("TabPane");
            var self = this;
            if (tabPane) {//james：TabPane
                tabPane.on(FR.Events.TABCHANGESTART, function () {
                    if (self.curLGP) {
                        self.stopEditing();
                        if ($('div.verify-error-info:visible', FR.$view_container).length > 0) {
                            $('div.verify-error-info:visible', FR.$view_container).hide();
                        }
                    }
                });
                //james：给TabPane绑定tabchange事件
                tabPane.on(FR.Events.TABCHANGE, function (tabPane, tabIndex) {
                    self.selectedIndex = tabIndex;
                    self.fireEvent(FR.Events.TABCHANGE, tabPane, tabIndex);
                });
                //james：给当前的FormPane绑定tabchange事件，这个是真正的执行tabchange的内容
                this.on(FR.Events.TABCHANGE, function (tabPane, tabIndex) {
                    if (self.delay) {
                        return;
                    }

                    self.selectedIndex = tabIndex;
                    var lgp = self.lgps[tabIndex];
                    if (lgp.loaded === false) {
                        lgp.loadLGPPane();
                    } else {
                        // Carl：这个怎么能不变
                        self.curLGP = lgp;
                        self.curLGP._selectFirstTD();
                        self.curLGP.onfocus();
                        if (!lgp.frozenModified && $('.frozen-center', lgp.$container).length > 0) {
                            if (lgp.$sheet_container.parent().isVisible()) {
                                FR.layoutFrozen(lgp.$sheet_container, lgp.$sheet_container.offset().top);
                                lgp.frozenModified = true;
                            }
                        }
                    }

//                    self.selectedIndex = lgp.idx;
                    // 填报分页,把目标sheet的页码信息传递给writePane,fire(afterload)为了更新工具栏的页码
                    if (self.options["cutpage"] == 'v' || self.options["cutpage"] == 'w') {
                        self.currentPageIndex = lgp.currentPageIndex;
                        self.reportTotalPage = lgp.reportTotalPage;
                        self.fireEvent(FR.Events.AFTERLOAD);
                    }
                });

                var tabs = tabPane.options.tabs;//james：获取tabs的个数
                this.lgps = [];
                for (var i = 0, count = tabs.length; i < count; i++) {
                    this.lgps[i] = new FR.WLGP({idx: i, $container: $(tabs[i].content), writePane: this, selectMethod: this.selectMethod});
                }
            } else {
                this.lgps = [new FR.WLGP({idx: 0, $container: this.$contentPane, writePane: this, selectMethod: this.selectMethod})];
            }

            if (this.options['selectedColor']) {
                var color = '.test{background-color:' + this.options['selectedColor'] + '!important}';
                $('<style type="text/css">' + color + '</style>').appendTo('head');
            }

            // 初始化粘贴功能
            $("body").append("<div style='position:absolute;left:-1000px;top:-1000px;'><textarea id='cpTextArea' onkeyup='this.blur()'></textarea></div>");

            /**
             * 页面转向时提示,不支持opera
             */
            window.onbeforeunload = this.beforeUnloadCheck.createDelegate(this);

            // 防止backspace跳转.
            $(document)[($.browser.mozilla || $.browser.opera)
                ? 'keypress'
                : 'keydown'](function (e) {
                self.banBackSpace(e);
            });

        },

        banBackSpace: function (e) {
            if (e.keyCode === 8) {
                var t = e.target;
                t = t.type || t.getAttribute('type');
                if (t != "password" && t != "text" && t != "textarea") {
                    e.stopEvent();
                }
            }
        },

        /*
         * 开始加载ContentPane
         */
        loadContentPane: function (reloadOthers) {

            FR.MobileTools.showSubmit();

            var tabPane = this.$contentPane.data("TabPane");
            if (tabPane) {
                tabPane.visible();
            }

            if (this.lgps == null || this.lgps.length === 0) {
                return;
            }

            // 是否需要重新加载当前sheet以外的sheet
            if (reloadOthers !== false) {
                $.each(this.lgps, function (idx, lgp) {
                    lgp.loaded = false;
                });
            }
            if (this.curLGP == null) {
//                this.curLGP = this.lgps[0];
//                this.selectedIndex = 0;
                // 如果页面还没开始加载 切换到第二个sheet 再点查询按钮加载页面 需要load第二个sheet
                if (this.selectedIndex > 0) {
                    this.curLGP = this.lgps[this.selectedIndex];
                } else {
                    this.curLGP = this.lgps[0];
                    this.selectedIndex = 0;
                }
            }
            this.delay = false;
            this.curLGP.loadLGPPane();
            //b:加载完成后,尝试
            if (this.$contentPane.data("TabPane")) {
                this.fireEvent(FR.Events.SCROLLCHANGE, this.$contentPane.data("TabPane"), 0);
            }
        },

        // carl:单sheet的reload  fec:reload后需要一开始select的格子
        reloadCurLGPPane: function (fec) {
            if (this.lgps == null || this.lgps.length === 0) {
                return;
            }
            if (this.curLGP == null) {
                return;
            }
            this.curLGP.loaded = false;
            if (fec) {
                this.curLGP.$fec = fec;
            }
            this.curLGP.loadLGPPane();
        },

        // 当前sheet重新计算
        reCalCurLGPPane: function() {
            if (this.lgps == null || this.lgps.length === 0 || this.curLGP == null) {
                return;
            }
            var self = this;
            // 可能在控件编辑结束事件中执行 延时一下等待dirty状态
            setTimeout(function() {
                // 有没保存的数据的话要先保存下 这个是同步的
                if (self.curLGP.dirtyCell && self.curLGP.dirtyCell.length > 0) {
                    var ce = self.curLGP.dirtyCell[0];
                    self.writeDirtyAndRemoteCal(self.curLGP.idx, FR.id2ColumnRow(ce.id), ce);
                }

                FR.ajax({
                    url: FR.servletURL,
                    type: 'POST',
                    async: true,
                    data: {
                        op: "fr_write",
                        cmd: "refresh_w_data",
                        reportIndex: self.curLGP.idx,
                        sessionID: self.currentSessionID
                    },
                    complete: function(res, status) {
                        if (status == 'success') {
                            var ces = FR.jsonDecode(res.responseText);
                            if (ces.success) {
                                var value;
                                ces = ces.array;
                                $.each(ces, function (idx, item) {
                                    value = item.cv;
                                    if (typeof value == 'object') {
                                        if (value.date_milliseconds) {
                                            value = new Date(value.date_milliseconds);
                                        }
                                    }
                                    if (!FR.equals(self.curLGP.getCellValue(item.col, item.row), value)) {
                                        self.curLGP.setCellValue(item.col, item.row, value);
                                    }
                                });
                            }
                        }
                    }
                })
            }, 100);
        },

        refreshAllSheets:function () {
            var self = this;
            FR.ajax({
                url:FR.servletURL + '?op=fr_dialog&cmd=parameters_d&sessionID=' + this.currentSessionID + "&_random=" + (Math.random() * 10000),
                type:"POST",
                data:{
                    __parameters__:this.parameterEl ? this.parameterEl.collectionValue() : ""
                },
                complete:function () {
                    $.each(self.lgps, function (idx, lgp) {
                        lgp.loaded = false;
                    });
                    self.curLGP.loadLGPPane();
                }
            });
        },

        /**
         * 获取单元格的值
         * @param {json} o
         * {<br/>
         *     reportIndex:rpIdx,   // sheet序号<br/>
         *     columnIndex:colIdx,  // 格子所在的列序号<br/>
         *     rowIndex:rowIdx      // 格子所在的行序号<br/>
         * }
         * @returns {*}
         */
        getCellValue: function (o) {
            var config = {};
            // 兼容老的参数
            if (arguments.length === 2) {
                config.columnIndex = arguments[0];
                config.rowIndex = arguments[1];
                config.reportIndex = this.selectedIndex;
            } else if (arguments.length === 3) {
                config.reportIndex = arguments[0];
                config.columnIndex = arguments[1];
                config.rowIndex = arguments[2];
            } else {
                config = o;
            }
            if (this.lgps[config.reportIndex]) {
                return this.lgps[config.reportIndex].getCellValue(config.columnIndex, config.rowIndex);
            }
        },

        /**
         * 根据名字获取单个控件，如果有相同名字的控件，只取最后一个
         * @param name 控件的名字
         * @returns {FR.Widget} 指定名字的控件
         */
        getWidgetByName: function (name) {
            return this.curLGP.write.getWidgetByName(name);
        },

        /**
         * 根据单元格编号获取控件
         * @param cell  控件所在的单元格的编号
         * @returns {FR.Widget}   执行格子中的控件
         */
        getWidgetByCell: function (cell) {
            return this.curLGP.write.getWidgetByCell(cell);
        },

        /**
         * 根据名字获取控件
         * @param name  要获取的控件的名字
         * @returns {Array} 所有具有指定名字的控件组成的数组
         */
        getWidgetsByName: function (name) {
            return this.curLGP.write.getWidgetsByName(name);
        },

        /**
         * o {
         *     reportIndex:rpIdx, //sheet序号
         *     columnIndex:colIdx,//格子所在的列序号
         *     rowIndex:rowIdx,   //格子所在的行序号
         *     value:cv           //要给格子赋的值
         * }
         */
        setCellValue: function (o) {
            var config = {};
            //为了兼容以前的多参数写法
            if (arguments.length === 3) {
                config.columnIndex = arguments[0];
                config.rowIndex = arguments[1];
                config.value = arguments[2];
                config.reportIndex = this.selectedIndex;
            } else if (arguments.length === 4) {
                config.reportIndex = arguments[0];
                config.columnIndex = arguments[1];
                config.rowIndex = arguments[2];
                config.value = arguments[3];
            } else {
                config = o;
            }
            var lp = this.lgps[config.reportIndex];
            if (lp) {
                if (lp.loaded === false) {
                    lp.loadLGPPane(false);
                }
                lp.setCellValue(config.columnIndex, config.rowIndex, config.value);
                lp.fireCellValueChange(lp.getTDCell(config.columnIndex, config.rowIndex), config.value);
            }
        },

        /**
         * 停止编辑当前单元格
         */
        stopEditing: function () {
            if (this.curLGP) {
                this.curLGP.stopCellEditing();
            }
        },

        /**
         * 校验并提交修改数据,该函数在服务器端写死了调用
         * @param isAllSheet
         * @param successFn
         * @returns {boolean}  提交成功返回true，否则返回false
         */
        verifyAndWriteReport: function (isAllSheet, submitButton, successFn, failFn) {
            if (this.fireEvent(FR.Events.BVW, this) === false) {
                return false;
            }

            //wei : 让提交按钮不可用
            if (submitButton) {
                submitButton.disable();
            }
            var o = {
                overlay_immediately: true,
                text: FR.i18nText("Calculating") + "...."
            };
            FR.showLoadingDialog(o);
            var self = this;
            this.preventNoVerifier = true;
            var verify = function () {
                self._doVerify(
                    self.writeReport.createDelegate(self, [(isAllSheet ? null : self.selectedIndex), submitButton, successFn, failFn]),
                    function (resultJSON) {
                        self.popup_error(resultJSON, submitButton);
                        submitButton && submitButton.enable();
                    },
                    isAllSheet ? null : self.selectedIndex, (arguments[1] ? arguments[1] : undefined));
            }
            // shoc:延迟10ms执行，防止大数据量填报时候浏览器卡死阻塞设置提交控件disable的执行，客户bug26782
            setTimeout(verify, 10);
        },

        /**
         * @Deprecated 名字太差,不再推荐使用
         * 使用请参见 {@link writeReportIgnoreVerify}
         */
        writeAndVerifyReport: function (isAllSheet) {
            this.writeReportIgnoreVerify(isAllSheet);
        },

        /**
         * 忽略校验出错信息，直接提交
         * 提交按钮勾选校验失败仍然提交执行的方法
         * 705前是只提交当前sheet 改为提交全部sheet 48285
         */
        writeReportIgnoreVerify: function (isAllSheet) {
            if (this.fireEvent(FR.Events.BVW, this) === false) {
                return false;
            }
            var self = this;
            var idx = isAllSheet ? null : this.selectedIndex;
            var successFn = this.writeReport.createDelegate(this, [idx]);
            this._doVerify(successFn, function (resultJSON) {
                successFn();
                self.popup_error(resultJSON);
            }, idx);
        },

        // carl:后台计算
        // TODO
        writeDirtyAndRemoteCal: function (idx, location, tdCell) {
            if (location == null || tdCell == null) {
                return;
            }

            var o = {
                overlay_immediately: true,
                text: FR.i18nText("Calculating") + "...."
            };
            FR.showLoadingDialog(o);

            var self = this;
            var fn = function (res, status) {
                if (status == 'success') {
                    var ces = FR.jsonDecode(res.responseText);
                    // 拿到后改所有的格子的值
                    if (ces.error) {
                        FR.hideLoadingDialog();
                        FR.Msg.alert(FR.i18nText("Failed"), ces.error, function () {
                            self.reloadCurLGPPane(location)
                        });
                    } else if (ces.success) {
                        var value;
                        var pv;
                        var hy;
                        ces = ces.array;
                        $.each(ces, function (idx, item) {
                            value = item.cv;
                            pv = item.pv;
                            hy = item.hy;
                            if (typeof value == 'object') {
                                if (value.date_milliseconds) {
                                    value = new Date(value.date_milliseconds);
                                }
                            }
                            if (typeof pv == 'object') {
                                if (pv.date_milliseconds) {
                                    pv = new Date(value.date_milliseconds);
                                }
                            }
                            self.lgps[item.idx].setCellValue(item.col, item.row, value, pv, hy);
                        });
                    } else {
                        FR.hideLoadingDialog();
                        FR.Msg.alert(FR.i18nText("Failed"), res.responseText, function () {
                            self.reloadCurLGPPane(location)
                        });
                    }
                } else {
                    FR.hideLoadingDialog();
                    FR.Msg.alert(FR.i18nText("Failed"), FR.i18nText("Abnormal_Communication") , function () {
                        self.reloadCurLGPPane(location)
                    });
                }
            };

            var loads = [];
            for (var i = 0; i < this.lgps.length; i++) {
                if (this.lgps[i].loaded !== false) {
                    loads.push(i);
                }
            }

            FR.ajax({
                url: FR.servletURL,
                type: 'POST',
                async: false,
                data: {
                    op: "fr_write",
                    cmd: "cal_write_cell",
                    editcol: location.col,
                    editrow: location.row,
                    editReportIndex: idx,
                    sessionID: this.currentSessionID,
                    reportXML: this.generateReportXML(false),
                    loadidxs: loads
                },
                complete: (fn).createSequence(FR.hideLoadingDialog)
            });
        },

        writeReport: function (reportIndex, submitButton, successFn, failFn) {
            if (this.fireEvent(FR.Events.BW, this) === false) {
                return false;
            }
            var self = this;
            var params = {op: "fr_write", cmd: "submit_w_report"};
            if (reportIndex != null) {
                params = $.extend(params, {reportIndex: reportIndex});
            }
            if (this.extraParas) {
                params = $.extend(params, this.extraParas);
            }
            doSave.call(this, {params: params, fn: function (res, status) {
                var submitInfo, builtinFail;
                var json_array = FR.jsonDecode(res.responseText);
                if (json_array.length > 0) {
                    $.each(json_array, function (idx, item) {
                        if (item.fr_submitinfo) {
                            submitInfo = item.fr_submitinfo;
                        }
                        if (item.builtinFail != null) {
                            builtinFail = item.builtinFail;
                        }
                    });
                }
                if (submitButton) {
                    // bug26782
                    setTimeout(function () {
                        submitButton.enable();
                    }, 10);
                }
                if (self.fireEvent(FR.Events.AVW, self, submitInfo) === false) {
                    return;
                }
                if (self.fireEvent(FR.Events.AW, submitInfo) === false) {
                    return;
                }
                var success = submitInfo.success;
                if (success !== true && success !== false) {
                    if (!self.preventNoWriter) {
                        // carl:这里表示没有填报属性设置，提示用户即可
                        FR.Msg.toast(FR.i18nText("Report") + FR.i18nText("Report-Write_Attributes_Msg"));
                    } else {
                        successFn && successFn();
                        delete self.preventNoWriter;
                    }
                } else if (success === true) {
                    FR.Msg.toast(FR.i18nText("Successfully"));
                    self.fireEvent(FR.Events.WS);
                    if ($.isFunction(successFn)) {
                        successFn();
                    }
                } else if (success === false) {
                    FR.Msg.toast(builtinFail ? FR.i18nText("Failed") : submitInfo.failinfo);
                    self.fireEvent(FR.Events.WF);
                    if ($.isFunction(failFn)) {
                        failFn();
                    }
                }
            }});
        },
        /*
         * fn是保存之后的callback
         */
        saveReport: function (fn) {
            doSave.call(this, {fn: fn || function (res) {
                FR.Msg.toast(res.responseText);
            }})
        },

        verifyReport: function () {
            var verifyButton = this.verifyButton = arguments[0];
            if (verifyButton) {
                verifyButton.disable();
            }
            var self = this;
            var $blankMsg = this._doVerify(function () {
                FR.Msg.toast(FR.i18nText("Verify-Verify_Success"));
                verifyButton && verifyButton.enable();
            }, function (resultJSON) {
                self.popup_error(resultJSON, verifyButton)
                verifyButton && verifyButton.enable();
            }, null);
        },

        //b:为了避免创建dom而用了这么个方法，和widget的isvalidate代码重复要考虑特殊控件的特殊属性，ugly
        //hiram 优化了一下实现
        validateWidgets: function (resultJSON) {
            var widgets = [];
            if (arguments[1] === true) {
                //wei:保存下curLGP，避免后面loadLGPPane后发生变化
                var currentLGP = this.curLGP;
                for (var i = 0; i < this.lgps.length; i++) {
                    //wei:想校验所有sheet，那么校验前必须先加载一次
                    if (this.lgps[i].loaded === false) {
                        //wei:因为bug2960改为ajax异步，但是多sheet加载时需要ajax同步，所以传递参数false表示是否异步
                        this.lgps[i].loadLGPPane(false);
                    }
                    var lgpWidgets = $('td[editor],td[widget]', this.lgps[i].$sheet_container);
                    $.each(lgpWidgets, function (idx, item) {
                        widgets = widgets.concat(item);
                    })
                }
                this.curLGP = currentLGP;
            } else {
                widgets = $('td[editor],td[widget]', this.curLGP.$sheet_container);
            }
            for (var i = 0, len = widgets.length; i < len; i++) {
                if ($(widgets[i]).hasClass("del")) {
                    continue;
                }
                var widget = FR.jsonDecode($(widgets[i]).attr('widget') || $(widgets[i]).attr('editor'));
                var location = widget.location;

                var value = $(widgets[i]).attr('cv');
                if (!value || value == "null") {
                    value = "";
                } else {
                    if (value.startWith('"') && value.endWith('"')) {
                        value = value.substring(1, $(widgets[i]).attr('cv').length - 1);
                    }
                }
                if (widget.allowBlank === false && value === "") {
                    var errorMsg = widget.errorMsg || FR.i18nText("NOT_NULL_Des");
                    resultJSON.push({message: errorMsg, columnrows: [location], reportIndex: widgets[i].id.split('-')[1]});
                    continue;
                } else if (widget.allowBlank !== false && value === "") {
                    continue;
                }
                if(widget.allowBlank !== false && value === ""){
                    continue;
                }
                if (widget.regex) {
                    if (typeof widget.regex == 'string') {//String的时候，构造一个RegExp出来
                        var regex = new RegExp(widget.regex);
                    }
                    if (!regex.test(value)) {
                        var errorMsg = widget.errorMsg || FR.i18nText("Error_Input_Value");
                        resultJSON.push({message: errorMsg, columnrows: [location], reportIndex: widgets[i].id.split('-')[1]});
                        continue;
                    }
                }
                if (widget.type == "number") {
                    var num = value, errorMsg = '', verify = true;
                    if (value != '' && isNaN(num)) {
                        var errorMsg = widget.errorMsg || FR.i18nText("Err-The_value_must_be_number");
                        resultJSON.push({message: errorMsg, columnrows: [location], reportIndex: widgets[i].id.split('-')[1]});
                        continue;
                    }
                    num = isNaN(num) ? '' : num;
                    var numString = '' + num;
                    if (numString.indexOf(".") > 0) {
                        if (widget.allowDecimals === false) {
                            errorMsg = widget.errorMsg || FR.i18nText("Err-The_value_must_be_integer");
                            resultJSON.push({message: errorMsg, columnrows: [location], reportIndex: widgets[i].id.split('-')[1]});
                            continue;
                        } else if (widget.allowDecimals !== false) {
                            // 判断小数位数 去掉负号
                            if (numString.startWith('-')) {
                                numString = numString.substring(1);
                            }
                            // shoc:科学计数法处理下
                            if (numString.indexOf('E') !== -1) {
                                var es = parseInt(numString.substring(numString.lastIndexOf('E') + 1, numString.length));
                                if (numString.indexOf('E') - 1 - numString.indexOf(".") <= widget.maxDecLength + es) {
                                    continue;
                                }
                            }
                            else {
                                if (numString.length - numString.indexOf(".") <= widget.maxDecLength + 1) {
                                    continue;
                                }
                            }
                            errorMsg = widget.errorMsg || FR.i18nText("DecimalNumber_Out");
                            resultJSON.push({message: errorMsg, columnrows: [location], reportIndex: widgets[i].id.split('-')[1]});
                            continue;
                        }

                    }
                    if (widget.allowNegative === false && num < 0) {
                        errorMsg = widget.errorMsg || FR.i18nText("Err-The_value_cannot_be_negative");
                        resultJSON.push({message: errorMsg, columnrows: [location], reportIndex: widgets[i].id.split('-')[1]});
                        continue;
                    }
                    if (widget.minValue != null && num < widget.minValue) {
                        errorMsg = widget.errorMsg || FR.i18nText("Err-The_number_is_less_than_the_minimum_value") + widget.minValue;
                        resultJSON.push({message: errorMsg, columnrows: [location], reportIndex: widgets[i].id.split('-')[1]});
                        continue;
                    }
                    if (widget.maxValue != null && num > widget.maxValue) {
                        errorMsg = widget.errorMsg || FR.i18nText("Err-The_number_is_larger_than_the_maximum_value") + widget.maxValue;
                        resultJSON.push({message: errorMsg, columnrows: [location], reportIndex: widgets[i].id.split('-')[1]});
                        continue;
                    }
                }
            }
        },

        _doVerify: function (successFn, failureFn, reportIndex) {//私有方法
            // 要先stop editing
            this.stopEditing();
            // shoc:verify前先移除全部  bug28182
            this.remove_error(reportIndex);

            var resultJSON = [];

            var self = this;
            var params = {op: "fr_write", cmd: "write_verify"};
            // richer:是否需要调用Widget的invalidate()方法来进行校验？
            // james：先校验整个报表中是不是有不允许为空，但没有cv值的格子
            if (reportIndex != null) {
                this.validateWidgets(resultJSON);
                params = $.extend(params, {reportIndex: reportIndex});
            } else {
                this.validateWidgets(resultJSON, true);
            }

            //TODOJ 这里要经过一个verify过程，没有校验也要经过，不是很好，可是不知道怎么判断需要使用数据校验判断，想到了再加上
            doSave.call(this, {params: params, fn: function (res, status) {
                var verifyInfo = {};
                if (status == 'success') {
                    var json_array = FR.jsonDecode(res.responseText);
                    if (json_array.length > 0) {
                        $.each(json_array, function (idx, item) {
                            // 下面这个push的reportIndex全都是当前sheet的 不对 放在后台添加
                            //item.reportIndex = self.curLGP.idx;
                            if (item.fr_verifyinfo) {
                                verifyInfo = item.fr_verifyinfo;
                            } else {
                                resultJSON.push(item);
                            }
                        });
                    }
                }
                if (self.fireEvent(FR.Events.AV, verifyInfo) === false) {
                    if (self.verifyButton) {
                        self.verifyButton.enable();
                    }
                    return;
                }
                if (resultJSON.length > 0) {
                    $.isFunction(failureFn) && failureFn(resultJSON);
                } else {
                    if (verifyInfo.success === true || self.preventNoVerifier === true) {
                        $('div.verify-error-container', FR.$view_container).remove();
                        $('div.verify-error-number').remove();
                        $.isFunction(successFn) && successFn();
                    } else {
                        // 没有设置校验属性 或者 找不到自定义类的情况
                        // 填报时候带的校验不显示这个东西 只有单纯的数据校验才显示
                        FR.Msg.toast(verifyInfo.info);
                        self.verifyButton && self.verifyButton.enable();
                    }
                }
                delete self.preventNoVerifier;
            }});
        },

        pdfPrint: function (isPopup) {
            if (this.fireEvent(FR.Events.BPDFPRINT) === false) {
                return;
            }
            ;
            if ($.browser.msie) {
                this.saveReport(FR.doPDFPrint.createCallback(this.currentSessionID), isPopup);
            } else {
                // james：pdfPrint需要用format=pdfPrint，服务器才能识别为是打印状态啊
                window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=pdf&isPDFPrint=true&extype=ori";
            }
            //wei : 不能在这里触发打印结束时间，ajax异步执行。
        },
        flashPrint: function () {
            this.saveReport(FR.doFlashPrint.createCallback(this.currentSessionID));
        },
        appletPrint: function () {
            this.saveReport(FR.doAppletPrint.createCallback(this.currentSessionID));
        },
        exportReportToPDF: function (extype) {
            if (this.fireEvent(FR.Events.BTOPDF) === false) {
                return;
            }
            var self = this;
            this.saveReport(function () {
                window.location = FR.servletURL + "?op=export&sessionID=" + self.currentSessionID + "&format=pdf&fr_embedded=true&extype=" + extype;
            });
            this.fireEvent(FR.Events.ATOPDF);
        },
        exportReportToExcel: function (extype) {
            if (this.fireEvent(FR.Events.BTOEXCEL) === false) {
                return;
            }
            var self = this;
            this.saveReport(function () {
                window.location = FR.servletURL + "?op=export&sessionID=" + self.currentSessionID + "&format=excel&extype=" + extype;
                self.fireEvent(FR.Events.ATOEXCEL);
            });

        },
        exportReportToWord: function () {
            if (this.fireEvent(FR.Events.BTOWORD) === false) {
                return;
            }
            var self = this;
            this.saveReport(function () {
                window.location = FR.servletURL + "?op=export&sessionID=" + self.currentSessionID + "&format=word";
                self.fireEvent(FR.Events.ATOWORD);
            });

        },
        exportReportToImage: function (extype) {
            if (this.fireEvent(FR.Events.BTOIMAGE) === false) {
                return;
            }
            window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=image&extype=" + extype;
            this.fireEvent(FR.Events.ATOIMAGE);
        },
        exportReportToHtml: function() {
            if (this.fireEvent(FR.Events.BTOHTML) === false) {
                return;
            }
            var self = this;
            this.saveReport(function () {
                window.location = FR.servletURL + "?op=export&sessionID=" + self.currentSessionID + "&format=html";
                self.fireEvent(FR.Events.ATOHTML);
            });
        },
        exportReportToWriteOfflineHtml: function() {
            var self = this;
            if($.browser.msie && parseInt($.browser.version) > 8 || /trident/.test(navigator.userAgent.toLowerCase()) && $.browser.version == '11.0'){
                FR.Msg.alert(FR.i18nText("Tooltips"),FR.i18nText("Offline_Html_Error"),function(){self.exportReportToOffineHtml();});
            }else{
                self.exportReportToOffineHtml();
            }
        },
        exportReportToOffineHtml:function(){
            if (this.fireEvent(FR.Events.BTOHTML) === false) {
                return;
            }
            var self = this;
            this.saveReport(function () {
                window.location = FR.servletURL + "?op=export&sessionID=" + self.currentSessionID + "&format=write_html";
                self.fireEvent(FR.Events.ATOHTML);
            });
        },
        printReportServer: function () {
            if (this.fireEvent(FR.Events.BSEVERPRINT) === false) {
                return;
            }
            this.saveReport(FR.showIframeDialog.createCallback({
                title: FR.i18nText("ReportServerP-Print[Server]"),
                width: 540,
                height: 380,
                url: FR.servletURL + "?op=fr_dialog&cmd=read_print_server_dialog&sessionID=" + this.currentSessionID + "&pn=0"
            }));
            this.fireEvent(FR.Events.ASERVERPRINT);
        },
        SetPrinterOffset: function () {
            FR.showIframeDialog({
                title: FR.i18nText("SetPrinterOffset"),
                width: 420,
                height: 300,
                url: FR.servletURL + "?op=printer_offset&cmd=pt_open&sessionID=" + this.currentSessionID
            });
        },
        emailReport: function () {
            if (this.fireEvent(FR.Events.BEMAIL) === false) {
                return;
            }
            var self = this;
            this.saveReport(FR.showEmailDialog.createCallback({
                sessionID : this.currentSessionID,
                onFinish : function() {
                    self.fireEvent(FR.Events.AEMAIL);
                }
            }));
        },

        downloadByAddress: function(attachUrl) {
            FR.ajax({
                url: attachUrl,
                complete: function(res, status) {
                    if (status == 'success') {
                        var u = FR.jsonDecode(res.responseText);
                        if (u != null && u.url) {
                            window.open(u.url);
                        }
                    }
                }
            });
        },

        /*
         * alex:生成XML,只写Dirty的格子的值
         */
        generateReportXML: function (saveData) {
            var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
            xml += "<WorkBook>";
            xml += ("<Version>6.5</Version>");//marks:

            //alex:iterate all reports
            var centerPanelCount = this.lgps.length;
            for (var i = 0; i < centerPanelCount; i++) {
                var $table = this.lgps[i].$table;
                if ($table == null || $table.length === 0) {
                    continue;
                }

                xml += "<Report class=\"com.fr.report.WorkSheet\" name=\"" + i + "\">";
                xml += "<CellElementList>";

                $.each(this.lgps[i].dirtyCell, function (idx, tdCell) {
                    var $tdCell = $(tdCell);
                    //alex:取出需要edit的内容
                    if ($tdCell.attr('cv') != null) {//marks:是否为空
                        var columnRow = FR.id2ColumnRow($tdCell.attr("id"))

                        xml += "<C c=\"" + columnRow.col + "\" r=\""
                            + columnRow.row + "\">";
                        xml += writeCellValue(tdCell);
                        xml += "</C>";
                    }
                });

                this.lgps[i].dirtyCell = [];

                if (saveData) {
                    // alex:查找cv不为null且status是D(isDirty)的TD,//marks:在ie下cv=0返回为false，所以cv是否为空调整到下面处理
                    $('td.dirty', $table).each(function (idx, tdCell) {
                        //marks:去cv值，看他是否为 null
                        var $tdCell = $(tdCell);

                        $tdCell.removeClass('dirty');
                    });
                }

                xml += "</CellElementList>";
                xml += "</Report>";
            }

            xml += "</WorkBook>";

            return xml;
            /*
             * alex:做一下小结,想不起当初为什么要替换+为%2B了
             * 但BUG0003106显示,如果公式中有+,做了%2B替换后,在后台原来的10+20就变成10%2B20了,就无法解析这个公式了
             */
//            return xml.replace(/\+/g, "%2B");   //TODO alex:想不起来当初为什么要做替换了
            //TODOJ james:是不是因为公式中有+，只是猜测……
        },

        // alex:frozen
        frozen: function (column, row) {
            this.curLGP.frozen(column, row);
        },

        // carl:离开页面时，假如有dirty数据，提示用户是否离开
        beforeUnloadCheck: function () {
            this.stopEditing();
            if (this.isDirtyPage()) {
                if (this.options.unloadCheck !== false) {
                    return FR.i18nText("Unload_Check_Msg") + "!";
                }
            }
        },
        isDirtyPage: function() {
            var centerPanelCount = this.lgps.length;
            for (var i = 0; i < centerPanelCount; i++) {
                var $table = this.lgps[i].$table;
                if ($table == null || $table.length === 0) {
                    continue;
                }
                if ($('td.dirty', $table).length > 0) {
                    return true;
                }
            }
            return false;
        },
        importExcel: function () {
            FR.showUploadDialog($.extend({
                title: FR.i18nText("Import-Excel_Import"),
                autoUpload: true
            }, this.importExcelOptions()));
        },
        initExcelButton: function (button) {
            //wei : 为了点击按钮就能弹出文件选择框，在按钮的位置放置了一个透明的文件上传控件。
            var importExcelButton = $(button.$table);
            importExcelButton.one("mouseover", function () {
                if ($("#importexcelform").length > 0) {
                    var $uploadForm = $("#importexcelform");
                    var input = $("input", $uploadForm);
                } else {
                    var $uploadForm = $('<form enctype="multipart/form-data" id="importexcelform"></form>').appendTo("body");
                    //导入excel的button的width为auto，input的宽度设为button在浏览器中解析出来的宽度
                    var input = $('<input type="file" name="file" style="height:23px; cursor : pointer" size="2"/>').appendTo($uploadForm);
                    input.css("width",importExcelButton.width());
                }
                input.mouseover(
                    function () {
                        importExcelButton.mouseover();
                    }).mouseout(
                    function () {
                        importExcelButton.mouseout();
                    }).mousedown(
                    function () {
                        importExcelButton.mousedown();
                    }).mouseup(
                    function () {
                        importExcelButton.mouseup();
                    }).change(function () {
                        if(!button.isEnabled()){
                            return;
                        }
                        _g().importExcelData()
                    }).click(function (e) {
                        if(!button.isEnabled()){
                            e.stopEvent();
                        }
                        if (contentPane.delay) {
                            e.stopEvent();
                        }
                        //neil:多次导入同一个excel值不变的bug 21287
                        this.value = "";
                    });
                input.css({top: importExcelButton.offset().top,
                    left: importExcelButton.offset().left,
                    position: 'absolute',
                    'z-index': 9999,
                    'opacity': 0
                });
            });
        },
        importExcelOptions: function () {
            var self = this;
            return {
                url: FR.servletURL + "?sessionID=" + this.currentSessionID
                    + "&op=fr_write&cmd=imp_w_excel_data",
                callback: function (res, status) {
                    if (status == 'success') {
                        var str = res.responseText;
                        if ("success" == str) {
                            this.loadContentPane();
                            if ($.browser.msie) {
                                //neil:为什么要这么蛋疼呢, 因为file这货在ie里面是readonly的, 不能随意改变值, replace掉
                                var $uploadForm = $("#importexcelform");
                                var input = $("input", $uploadForm);
                                input.replaceWith(input.clone(true));
                            }
                        } else if ("wrong" == str) {
                            FR.Msg.toast(FR.i18nText("Import_Failed"));
                        } else if (str && str.indexOf("Error:") > -1) {
                            FR.Msg.toast(str);
                        } else if ("typewrong" == str) {
                            FR.Msg.toast(FR.i18nText("Should_select_an_Excel_file"));
                        }
                    } else {
                        FR.Msg.toast(FR.i18nText("HJS-Send_Failed"));
                    }
                }.createDelegate(this),
                beforeAction: function() {
                    self.fireEvent(FR.Events.BIMEXCEL);
                },
                afterAction: function() {
                    self.fireEvent(FR.Events.AIMEXCEL);
                }
            };

        },
        // carl: op=write import excel data
        importExcelData: function () {
            FR.autoSubmit(this.importExcelOptions(), $("#importexcelform"));
        },

        // Carl： ctrl + v 复制数据
        pasteCells: function () {
            var lastSelectedTDCell = this.curLGP.currentTDCell;
            if (lastSelectedTDCell == null) {
                return;
            }

            var location = FR.id2Location(lastSelectedTDCell.id);
            if (location == null) {
                return;
            }

            var value = $("#cpTextArea").val();
            if (value == null || value == '') {
                return;
            }

            this.stopEditing();
            // alex:在处理#5346时,在chrome里面测试,发现从Excel里面拷贝过来的,前后都加一个回车符,如果不trim掉,Paste就会错位,往下移一行
//            var rows = $.trim(value).split("\n");
            // bug42177 复制的格子中前面带有空白格 trim了就没了 用chrome试了下
            // 当excel格式是设置的数字格式 后面可能会多一个换行符
            if (value.startWith('\n')) {
                value = value.substring(1, value.length);
            }
            if (value.endWith('\n')) {
                value = value.substring(0, value.length-1);
            }
            /*
             * wei : 像google docs里的电子表格一样处理复制过来的excel数据
             * 如果是一个格子中有换行的数据，比如(a\nb)复制过来的到的value值会被加上引号("a\nb")，所以碰到被引号引起来的
             * 数据全当做在一个格子中处理；这样有一个缺陷：上下2个格子内容分别为'"a'和'b"'时，复制过去，会在一个格子里，并且没有引号
             * 但因为情况较少，折中做法，不作考虑
             */
            var flag = false, rows=[],start=0;
            for(var i=0;i<value.length;i++){
                var ch = value.charAt(i);
                if(ch == '"'){
                    flag=!flag;
                }else if(ch=='\n'&&!flag){
                    rows.push(value.substring(start,i).replaceAll('""','\n\r').replaceAll('"','').replaceAll('\n\r','"'));
                    start = i+1;
                }
            }
            if(start < value.length){
                rows.push(value.substring(start, i).replaceAll('""','\n\r').replaceAll('"','').replaceAll('\n\r','"'));
            }

            var needChangeValue = function (cell, cev, editorO) {
                return cell != null &&
                    cell.attr("editor") != null
                    && cev != null
                    && cev.length > 0
                    && !editorO.disabled
                    && editorO.editable !== false;
            };
            var firstCell = this.curLGP._get$TDCell(location.col, location.row);
            var firstWidget = contentPane.getWidgetByCell(FR.jsonDecode(firstCell.attr("editor")).location);
            var firstOri = firstWidget.getValue();
            for (var i = 0; i < rows.length; i++) {
                var cols = rows[i].split("\t");
                for (var j = 0; j < cols.length; j++) {
                    var cell = this.curLGP._get$TDCell(location.col + j, location.row + i);
                    //wei : 如果控件的属性disabled为true或者directEdit为false，那么Ctrl+V操作不应该改变其值。
                    var editorO = FR.jsonDecode(cell.attr("editor"));
                    var widget = contentPane.getWidgetByCell(editorO.location);
                    var cev = cols[j];
                    if (needChangeValue(cell, cev, editorO)) {
                        // TODO carl:想在这儿弄校验，但似乎逻辑上怎么搞都不妥当，暂时不做，跟导入excel数据一样，让用户最后提交再校验好了。~_~
                        if (typeof cev == "string" && cev.startWith("=")) {
                            this.curLGP.fireCellValueChange(cell, null, cev);
                            this.curLGP.displayTDCell(cell, "");
                        } else {
                            if (editorO.type === 'number') {
                                // 如果是数字控件，则将复制的值转化成数字
                                // 考虑带千位符逗号的情况,去掉
                                if (cev) {
                                    cev = $.trim(cev);
                                    cev = cev.replaceAll(",", "");
                                }
                                // parseFloat会把"4.00"变成4  "4.0400"变成4.04
                                if (cev.indexOf('.') !== -1) {
                                    cev = cev.replace(/[0]+$/,'');
                                    if (cev.endWith('.')) {
                                        cev = cev.substring(0, cev.length-1);
                                    }
                                } else if (cev.match(/^[0]+$/)) {
                                    cev = '0';
                                } else {
                                    cev = cev.replace(/^[0]+/,'');
                                }
                                var ori = cev;
                                cev = parseFloat(cev, 10);
                                // 粘贴10%、22sdf 这种数据，清除掉，前后有空格的保留
                                // ie9之前的版本不支持string的trim方法
                                if (cev && cev.toString() != $.trim(ori)) {
                                    cev = null;
                                }
                                if (isNaN(cev)) {
                                    cev = null;
                                }
                            }
                            this.curLGP.fireCellValueChange(cell, cev);
                            this.curLGP.displayTDCell(cell, cev);
                            // 客户bug35401 粘贴触发控件的编辑后事件
                            widget.fireEvent(FR.Events.AFTEREDIT);
                        }
                    }
                }
            }
            if (rows.length === 1) {
                cols = rows[0].split("\t");
                if (cols.length === 1) {
                    if (this.curLGP.cellEditing == null) {
                        this.curLGP.editTDCell(null);
                        // ctrl+v第一个控件进入编辑状态 editTDCell里会设置控件oldValue、
                        // 正常编辑的话oldValue设置为编辑前的值 而粘贴的话已经是编辑过的值
                        firstWidget.options.oldValue = firstOri;
                    }
                }
            }
        },

        fireCurrentWidgetEvent: function(event) {
            var lastSelectedTDCell = this.curLGP.currentTDCell;
            if (lastSelectedTDCell == null) {
                return;
            }
            var location = FR.id2Location(lastSelectedTDCell.id);
            if (location == null) {
                return;
            }
            var cell = this.curLGP._get$TDCell(location.col, location.row);
            var editorO = FR.jsonDecode(cell.attr("editor"));
            var widget = contentPane.getWidgetByCell(editorO.location);
            widget.fireEvent(event);
        },

        //wei : 提供给用户使用的删除行/添加行的方法。
        deleteRows: function () {
            this.deleteReportRC.apply(this, arguments);
        },

        appendRows: function () {
            this.appendReportRC.apply(this, arguments);
        },

        /**
         * 提供个接口实现单击就能进入编辑
         */
        setEditOnClick: function(editOnClick) {
            this.editOnClick = editOnClick;
        },

        /**
         * 提供个接口实现按键切换格子立即进入编辑
         * @param editOnMove
         */
        setEditOnMove: function(editOnMove) {
            this.editOnMove = editOnMove;
        },

        /**
         * 编辑结束事件是否需要控件值改变才触发
         * @param fireOnChange
         */
        setFireStopEditOnChange: function(fireOnChange) {
            this.fireStopEditOnChange = fireOnChange;
        },

        //hiram : 用来同步前端与后台的数据，用于局部刷新
        refreshData: function () {
            var self = this;
            doSave.call(this, {
                params: {
                    op: "fr_write",
                    cmd: "read_w_content",
                    startRow:$("tr[tridx]:first",_g().options.renderEl).attr("tridx"),
                    endRow:$("tr[tridx]:last",_g().options.renderEl).attr("tridx"),
                    reportIndex: arguments[0],
                    __cutpage__ : self.options.cutpage,
                    pn : self.currentPageIndex
                },
                fn: function (res, status) {
                    var $html = $(res.responseText);
                    var $tds = $("td[id]", $html);
                    this._refreshData($tds);
                }.createDelegate(this)
            })
        },
        _refreshData: function ($tds) {
            var $tds2 = $('td[id]', _g().options.renderEl);
            //    alert($tds2.length+"   "+$tds.length);
            $tds2.each(function (index, td) {
                var $td = $(td);
                if (!$td.attr("widget")) {
                    if($td.attr("editor") && FR.jsonDecode($td.attr("editor")).type == 'multifile'){
                        return;
                    }
                    if (td == null || $tds[index] == null) {
                        return;
                    }
                    td.style["background-color"] = $tds[index].style["background-color"];
                    if (td.innerHTML != $tds[index].innerHTML) {
                        td.innerHTML = $tds[index].innerHTML;
                    }
                    $td.attr("class",$($tds[index]).attr("class"));
                    if ($td.attr("cv") != $($tds[index]).attr("cv")) {
                        $td.attr("cv", $td.attr("cv"));
                    }
                }
            });
        },

        remove_error: function(reportIndex) {
            var tabPane = this.$contentPane.data('TabPane');
            if (reportIndex == null || reportIndex == undefined) {
                $(".verify-error-img").remove();
                $(".verify-error-info").remove();
                if(tabPane){
                    for(var i=0;i<tabPane.tabBtns.length;i++){
                        tabPane.tabBtns[i].setValidState(true);
                    }
                }
            } else {
                $(".verify-error-img", contentPane.lgps[reportIndex].$table).remove();
                $(".verify-error-info", contentPane.lgps[reportIndex].$table).remove();
                if(tabPane){
                    tabPane.tabBtns[reportIndex].setValidState(true);
                }
            }
        },

        popup_error: function(json_array) {
            if (json_array == null || !(FR.isArray(json_array))) {
                return '';
            }
            $('div.verify-error-container', FR.$view_container).remove();
            var $divContainer = $('<div/>').addClass('verify-error-container');
            var $errorMsgDiv = $('<div/>').addClass('verify-error-messages').appendTo($divContainer);
            var $tableWrapper = $('<div/>').addClass('verify-table-wrapper').appendTo($errorMsgDiv);
            var $table = $("<table cellspacing='0' cellpadding='0'>").addClass('verify-table').css('width', 200).appendTo($tableWrapper);
            var $tbody = $("<tbody>").appendTo($table);
            $divContainer.append($('<s/>').addClass('verify-error-s').append($('<i/>').addClass('verify-error-i')));
            var error_tabs = [];
            var tabPane = this.$contentPane.data('TabPane');
            $.each(json_array, function (idx, item) {
                //wei:记录下有错tab的下标
                if (item.reportIndex != error_tabs[error_tabs.length - 1]) {
                    error_tabs.push(item.reportIndex);
                }
                var position = '';
                function makeErrorMsg(index) {
                    var iitem = json_array[index];
                    $.each(iitem.columnrows, function (idx, item2) {
                        position += item2 + ' ';
                        var $errorCell = _g().lgps[parseInt(item.reportIndex)]._get$TDCell(item2);
                        // 设置自动调整或者冻结，格子的结构与正常的不同
                        var $errorImgHolder = $(".fx", $errorCell).length === 0 ? $errorCell : $("td", $(".fx", $errorCell));
                        if (($('.verify-error-img', $errorCell).length === 0)) {
                            var $errorMsgImg = $('<img border="0"/>').addClass('verify-error-img')
                                .appendTo($errorImgHolder).attr('title', item.message)
                                .attr('src', FR.servletURL + '?op=resource&resource=/com/fr/web/images/warning.png');
                        }
                    });
                }
                if (tabPane > 0) {
                    tabPane.tabBtns[parseInt(item.reportIndex)].setValidState(false);
                }
                makeErrorMsg(idx);
                // 如果出错的格子都没有在当前页，那么点击的时候要翻页
                var targetPage = contentPane.currentPageIndex;
                if (item.pages) {
                    if ($.inArray(contentPane.currentPageIndex, item.pages) === -1) {
                        targetPage = item.pages[0];
                    }
                }
                var $td = $('<td/>').css('cursor', 'pointer').text(item.message).hover(
                    function () {
                        $(this).addClass("verify-item-over");
                    },
                    function () {
                        $(this).removeClass("verify-item-over");
                    }).attr('title', 'Sheet' + (parseInt(item.reportIndex) + 1) + '-' + position + ':' + item.message)
                    .attr('id', item.columnrows.toString() + '-' + item.reportIndex)
                    .addClass('verify-item-idx' + item.reportIndex)
                    .click(function () {
                        if (targetPage != contentPane.currentPageIndex) {
                            contentPane.gotoPage(targetPage, false);
                            for (var i=0; i<json_array.length; i++) {
                                makeErrorMsg(i);
                            }
                        }
                        var columnrows = item.columnrows;
                        if (this.idx == undefined || this.idx >= columnrows.length) {
                            this.idx = 0;
                        }
                        var tdCell = _g().lgps[parseInt(item.reportIndex)]._get$TDCell(columnrows[this.idx]);
                        if ($('div.verify-error-info', FR.$view_container).length > 0) {
                            $('div.verify-error-info', FR.$view_container).remove();
                        }
                        if (tabPane != null) {
                            tabPane.selectTabAt(parseInt(item.reportIndex));
                        }
                        var errorInfo = $('<div/>').addClass('verify-error-info').html(item.message).appendTo(FR.$view_container);
                        errorInfo.css({top: tdCell.offset().top - 10, left: tdCell.offset().left + tdCell.width() + 4});
                        _g().lgps[parseInt(item.reportIndex)].selectTDCell(tdCell[0]);
                        this.idx++;
                    });
                $tbody.append($("<tr" + (idx % 2 === 0 ? " class='verify-row-alt'" : "") + "></tr>").append($td));
            });

            //Sean: 时间复杂度O(1)
            if(tabPane){
                for(var i=0;i<tabPane.tabBtns.length;i++){
                    if(error_tabs.length>0 && parseInt(error_tabs[0]) === i){
                        tabPane.tabBtns[i].setValidState(false);
                        error_tabs.shift(0);
                    }else{
                        tabPane.tabBtns[i].setValidState(true);
                    }
                }
            }
            if (arguments[1]) {
                var button = arguments[1];
                var buttonElement = $('button', button.$table);
                if (buttonElement.hasClass('x-emb-verify')) {
                    buttonElement.text('');
                    var verifyDiv = $('<div style="float:left;">' + FR.i18nText("Verify-Data_Verify") + '</div>');
                    var errorNumDiv = $('<div/>').text(json_array.length).addClass('verify-error-number');
                    buttonElement.append(verifyDiv).append(errorNumDiv);
                }
            }
            var collapseDiv = $('<div/>').addClass('verify-collapse').appendTo($errorMsgDiv)
                .click(
                function () {
                    if ($('div.verify-error-container:visible', FR.$view_container).length > 0) {
                        $('div.verify-error-container:visible', FR.$view_container).animate({
                            height: 'toggle'
                        }, 'fast');
                    }
                }).attr('title', FR.i18nText("Click_To_Shrink_Panel"));
            if (!FR.$view_container) {
                FR.$view_container = $("<div class='view-container'/>").appendTo('body');
            }
            if (button) {
                $divContainer.css('left', (button.element.offset().left - 40 < 0) ? 0 : button.element.offset().left - 40);
            }
            FR.$view_container.append($divContainer);

            if ($.browser.msie && ($.browser.version < '8.0') && $tableWrapper[0].scrollHeight > 250) {
                $tableWrapper.height(250);
            }
        }

    }

    // Append & Delete
    $.each(['append', 'delete', 'undelete'], function (idx, it) {
        /*
         * appendReportRow appendReportColumn deleteReportRow deleteReportColumn
         */
        P[it + 'ReportRow'] = function () {
            // james:执行事件 beforeappend/delete
            if (this.fireEvent('before' + it) === false) {
                return;
            }

            this.stopEditing();
            // 插入新行前注销点击事件
            this.curLGP.unfocus();

            var location = FR.id2Location(arguments[0]);
            if (location == null) {
                return;
            }
            var tableId = this.curLGP.tableID;
            doSave.call(this, {
                params: {
                    op: "fr_write",
                    cmd: it + "_w_data", // append_w_data || delete_w_data || undelete_w_data
                    crow: location.row,
                    ccolumn: location.col,
                    reportIndex: arguments[1],
                    __cutpage__ : this.options.cutpage,
                    pn : this.currentPageIndex,
                    beforePoint: false,
                    tableId: tableId,
                    count: arguments[2]
                },
                fn: function (res) {
                    var text = res.responseText;
                    var reObject = FR.jsonDecode(text);
                    if (reObject.exception) {
                        FR.Msg.toast(reObject.exception);
                    } else {
                        //hiram_write 局部刷新处理
                        if (reObject.isReload === "false") {
                            if (reObject.cmd == "appendRow") {
                                var $table = $(reObject.insertRow);
                                var $trs = $("tr[tridx]", $table);
                                this.curLGP.appendRow(reObject.startIndex, $trs, reObject.mergeCells);
                                this.curLGP.$fec = reObject.fec;
                                this.curLGP._selectFirstTD();
                                //Sean：重新获取下焦点，否则如果点击插入(删除)行按钮后，焦点会转到按钮控件上去，keydown会失效
                                this.curLGP.onfocus();
                                //hiram 刷新数据，延时一点,让插入的行先显示出来再刷新
                                setTimeout(function () {
                                    _g().refreshData(_g().curLGP.idx)
                                }, 10);
                            } else if (reObject.cmd == "deleteRow") {
                                this.curLGP.deleteRow(reObject.startIndex, reObject.len, reObject.mergeCells);
                                this.curLGP.onfocus();
                                if (!this.curLGP.isSelectable(this.curLGP.currentTDCell) && $(this.curLGP.currentTDCell).attr('id')) {
                                    var cr = FR.id2ColumnRow($(this.curLGP.currentTDCell).attr('id'));
                                    if (cr.row > 0) {
                                        var pCell = this.curLGP.getTDCell(cr.col, cr.row-1);
                                        if (this.curLGP.isSelectable(pCell)) {
                                            this.curLGP.$fec = {col:cr.col, row:cr.row-1};
                                        }
                                    }
                                    this.curLGP._selectFirstTD();
                                }
                                setTimeout(function () {
                                    _g().refreshData(_g().curLGP.idx)
                                }, 10);
                            }
                        } else {
                            this.reloadCurLGPPane(reObject.fec);
                        }
                        var arr = reObject.refreshSheetList;
                        if (arr && $.isArray(arr) && arr.length > 0) {
                            for (var i=0; i<arr.length; i++) {
                                var idx = parseInt(arr[i]);
                                if (idx != _g().curLGP.idx) {
                                    _g().lgps[idx].loaded = false;
                                }
                            }
                        }
                    }
                    // james：afterappend/delete事件
                    this.fireEvent('after' + it);
                    refreshWidgets();
                }.createDelegate(this)
            })
        };
        P[it + 'ReportColumn'] = function () {
            P[it + 'ReportRow'].apply(this, arguments);
        }
    });

    $.each(['append', 'delete'], function (idx, it) {
        /*
         * appendReportRC deleteReportRC
         */
        P[it + 'ReportRC'] = function () {
            // arguments: count(append)1
            if (this.fireEvent('before' + it) === false) {
                return;
            }
            this.stopEditing();
            var crows = [];
            var ccols = [];
            var currentIdx = this.curLGP.idx;
            var tableId = this.curLGP.tableID;
            var cmd = "";
            if (it == "append") {
                cmd = "append_rc_data"
            } else {
                cmd = "delete_rc_data"
            }
            var reqConfig = {
                params: {
                    op: "fr_write",
                    cmd: cmd,
                    reportIndex: currentIdx,
                    __cutpage__ : this.options.cutpage,
                    pn : this.currentPageIndex,
                    beforePoint: false,
                    tableId: tableId,
                    count: arguments[0]
                },
                fn: function (res) {
                    var text = res.responseText;
                    var reObject = FR.jsonDecode(text);
                    if (reObject.exception) {
                        FR.Msg.toast(reObject.exception);
                    } else {
                        this.reloadCurLGPPane(reObject.fec);
                    }
                    // james：afterappend/delete事件
                    this.fireEvent('after' + it);
                    refreshWidgets();
                }.createDelegate(this)
            };
            var targetCells = arguments[1];
            //wei : count参数只是针对添加行时才有意义，所以应该支持deleteReportRC(targetCells)的写法。
            if (!targetCells && it == 'delete') {
                targetCells = arguments[0];
            }
            if (!targetCells) {
                targetCells = $(this.curLGP.currentTDCell).attr("id");
            }
            if ($.isArray(targetCells)) {
                for (var c = 0, len = targetCells.length; c < len; c++) {
                    var loc = FR.id2Location(targetCells[c]);
                    crows.push(loc.row);
                    ccols.push(loc.col);
                }
            } else {
                var location = targetCells ? FR.id2Location(targetCells) : null;
                if (location == null) {
                    FR.Msg.toast(FR.i18nText("Invalid_Cell"));
                    return;
                }
                crows.push(location.row);
                ccols.push(location.col);
            }
            reqConfig.params.crows = crows.join(",");
            reqConfig.params.ccols = ccols.join(",");

            doSave.call(this, reqConfig);
        }
    });

    /************************************************************************************************
     * 下面是一些私有的方法
     *************************************************************************************************/

    function refreshWidgets() {
        setTimeout(function() {
            contentPane.curLGP.write.refreshWidget();
        }, 1000)
    }

    function writeObject(value) {
        var xmlString = "";
        if (value == null) {
            return xmlString;
        }

        value = FR.jsonDecode(value);

        var xtype = "S", xcontent = null;
        if (typeof value == 'number') {
            xcontent = value;
            if (/\./.test("" + value)) {
                xtype = "D";
                // carl:因为sqltype中暂时没有BigInteger，所以都是BigDecimal吧
            } else if (("" + value).length >= 10) {
                xtype = "BigDecimal";
            } else {
                xtype = "I";
            }
        }
        // alex:因为是保存在attr里面的,所以日期型和Attachment的value用{}形式来表示
        else if (typeof value == 'object') {
            if (value.date_milliseconds != null) {
                xtype = "Date";
                xcontent = value.date_milliseconds;
            } else if (value.attach_id != null) {
                xtype = "Attachment";
                xcontent = value.attach_id;
            } else if ($.isArray(value) && value.length > 0 && value[0].attach_id) {
                xtype = "Attachments";
                xcontent = "";
                for (var i = 0; i < value.length; i++) {
                    if (i !== 0) {
                        xcontent += ",";
                    }
                    xcontent += value[i].attach_id;
                }
            } else if ($.isArray(value)) {
                xcontent = FR.jsonEncode(value);
            } else if ($.isEmptyObject(value)) {
                xcontent = "";
            }
        } else if (typeof value == 'boolean') {
            xtype = "B";
        } else if (typeof value == 'string') {
            if (value.encryption === true) {
                xtype = "Encrypt";
                xcontent = FR.encrypt(value);
            } else {
                value = FR.jsonEncode(value);
                value = value.substring(1, value.length - 1);
            }
        }

        value = FR.encodePrecentPlus(value);

        if (xcontent == null) {
            xcontent = "" + value;
        }

        //cjkEncode the value to avoid the disorder value
        //Attention!!! the "<![CDATA[]]>" is also be cjkEncoded
        return "<O t=\"" + xtype + "\">" +
            "<![CDATA[" + FR.htmlSpaceDecode(("" + xcontent).replace(/\n/ig, "\\\nn")) + "]]>" +
            "</O>";
    }

    /**
     * write Value of tdCell
     */
    function writeCellValue(tdCell) {
        var $td = $(tdCell);
        var formula = $td.attr("fm");
        var value = $td.attr('cv');
        if (formula != null) {
//            return "<O t=\"RFormula\"><Attributes>" + FR.cjkEncode("<![CDATA[" + FR.htmlSpaceDecode(("" + formula).replace(/\n/ig, "\\\nn")) + "]]>")
//                + "</Attributes>" + writeObject(value)
//                + "</O>";
            return "<O t=\"RFormula\"><Attributes>" + "<![CDATA[" + FR.htmlSpaceDecode(("" + formula).replace(/\n/ig, "\\\nn")) + "]]>"
                + "</Attributes>" + writeObject(value)
                + "</O>";
        }

        return writeObject(value);
    }

    /*
     * 为什么取名字呢doSave呢,因为ajax传输的参数里带有reportXML,服务器端必然会保存一下
     * options {
     * 		params:此次ajax传输需要的参数
     * 		fn:此次ajax传输的callback
     * }
     *
     * doSave中用ajax的同步传输,不用异步传输
     */
    function doSave(options) {
        // carl:这里的同步ajax会和ui.dialog.js中遮盖层create时的setTimeout方法冲突，导致bug0002671
        // 暂时没有好的解决办法，或者重写ui.dialog的遮盖。这里用一个变量来判断是否延迟遮盖，详细情况见bug0002671陈述
        this.stopEditing();

        FR.ajax({
            url: FR.servletURL,
            type: 'POST',
            async: false,
            data: $.extend({
                op: "fr_write",
                cmd: "save_w_content",
                sessionID: this.currentSessionID,
                reportXML: this.generateReportXML(true),
                cutPage: this.options.cutpage
            }, options.params), // 默认op为"write_saveContent",纯粹保存一下数据
            complete: (options.fn || FR.emptyFn).createSequence(FR.hideLoadingDialog) // alex:关掉loadingDialog的对话框
        });
    }

    return P;
}());

/*
 * alex:FormLoGicalPane
 */
FR.WLGP = function (config) {
    config = config || {};
    this.initialConfig = config;
    $.extend(this, config);

    this.loaded = false;
}

/**
 * 填报的逻辑页面
 * @class FR.WLGP
 * @extends FR.OB
 */
FR.extend(FR.WLGP, FR.OB, /**@class FR.WLGP*/function () {
    //default IE
    var tadjst = -1, ladjst = -1, wadjst = 3, hadjst = 3, etadjst = 1, eladjst = 1, ewadjst = -1, ehadjst = +2;
    if ($.browser.mozilla || $.browser.opera) {//firefox or opera
        tadjst = -2, ladjst = -2, wadjst = -3, hadjst = -3, etadjst = 0, eladjst = 0, ewadjst = -1, ehadjst = +1;
    } else if ($.browser.safari || $.browser.chrome) {//for safari and chrome
        tadjst = -1, ladjst = -1, wadjst = -3, hadjst = -3, etadjst = 1, eladjst = 1, ewadjst = +1, ehadjst = +3;
    }
    var UP = 1, DOWN = 2, LEFT = 3, RIGHT = 4, EE =FR.keyCode;// KeyCode的缩写
    var oldSelectedCell;

    function isCell(dom) {
        var $dom = $(dom);
        return $dom.is('td') && $dom.attr('id') && $dom.attr('id').match(/^[A-Z]+\d+-\d+-\d+$/);
    }

    return {
        getehadjst: function () {
            return ehadjst;
        },

        getewadjst: function () {
            return ewadjst;
        },
        // 冻结的时候是relative的 内部的不要再做偏移
        getSCOffsetLeft: function () {
            return this.isFrozen() ? 1 : this.$sheet_container[0].offsetLeft;
        },
        getSCOffsetTop: function () {
            return this.isFrozen() ? 1 : this.$sheet_container[0].offsetTop;
        },
        isFrozen: function() {
            return $('.frozen-table', this.$sheet_container).length > 0;
        },
        /**
         * $container, content actually be added, which is a jQuery Object, the contentPane or the selected tab of the TabPane
         */
        $container: null,
        /**
         * writePane:FR.WritePane this lgp belongs to
         */
        writePane: null,
        /*
         * idx in writePane
         */
        idx: 0,

        keyevent: null,

        __moving__: false, // 是否正在移动中...
        currentPageIndex: 0,

        gotoFirstPage: function () {
            this.gotoPage(1);
        },
        gotoPreviousPage: function () {
            if (this.currentPageIndex <= 1) {
                return;
            }
            this.gotoPage(this.currentPageIndex - 1);
        },
        gotoNextPage: function () {
            this.gotoPage(this.currentPageIndex + 1);
        },
        gotoLastPage: function () {
            this.gotoPage(this.reportTotalPage);
        },
        gotoPage: function (page, async) {
            var cutPage = this.writePane.options.cutpage;
            if (page != null) {
                this.writePane.stopEditing();
            }
            //shoc:  __cutpage__:v 按行分页
            if (cutPage == "v" || cutPage == 'w') {
                // 没有page参数,说明是刚加载时候
                if (page == undefined || page == null || this.reportTotalPage == undefined) {
                    this.currentPageIndex = 1;
                    page = 1;
                }
                else {
                    //有效的页码，传递
                    if (typeof page == 'number' && page > 0 && page <= this.reportTotalPage) {
                        this.currentPageIndex = page;
                        if (this.dirtyCell.length > 0) {
                            this.saveCurrentPage();
                        }
                    }
                    //无效的页码，提示
                    else {
                        FR.Msg.toast("Invalid Page Number");
                        return;
                    }
                }
            }

            this.$container.__load__({
                url: FR.servletURL,
                timeout: 600000,
                // richer：随便加一个随机参数，避免缓存影响
                params: {op: "fr_write", cmd: "read_w_content",
                    sessionID: this.writePane.currentSessionID,
                    reportIndex: this.idx,
                    browserWidth: document.body.clientWidth,
                    iid: Math.random(), async: arguments[1], __cutpage__: cutPage, pn: page},
                callback: function (el, success, res, options) {
                    if (success) {
                        this.initLGPComponent();
                    } else {
                        //如果不成功的话,也要把报错信息写在页面里
                        this.$container.html(res.responseText);
                    }
                    this.writePane.curLGP = this;
                    // alex:设置this.$container为当前的formPane.ContentContainer
                    this.writePane.$currentContentContainer = this.$container;
                    this.writePane.isLoadingPage = -1;
                    delete this.loaded;

                    //fire formPane的afterload事件,并把this作为参数传过去
                    this.writePane.fireEvent(FR.Events.AFTERLOAD, this);

                    /*
                     * alex:应该在afterload之后再选中单元格
                     * 因为客户可能会在afterload事件上添加监听,监听当cellselect时要做些事情
                     */
                    if (success) {
                        //重新加载后，还是清空原先的好点，否则不仅浪费操作还容易出问题
                        this.currentTDCell = null;
                        this.editorEl = null;
                        this.cellEditing = null;
                        this._selectFirstTD();
                    }

                    if (FR.isMobileApp() && !FR.isMobileAppNoZoom()) {
                        $(".sheet-container", this.$container).css({
                            width:$(".sheet-container", this.$container).children().width(),
                            height:$(".x-table", this.$container).height()
                        });

                        //new iScroll(this.$container[0]);
                        var contentContainer = $('.content-container');
                        contentContainer.css('position', 'relative');

                        var $sheetContainer = $(".sheet-container", this.$container);
                        contentContainer.width($sheetContainer.width());
                        contentContainer.height($sheetContainer.height());
                        contentContainer.css('overflow', 'hidden');
                    } else if (FR.isMobileBrowser() && !FR.isMobileBrowserNoZoom()) {
			        	FR.MobileTools.largeWidth($('.x-table', this.$container).width());
			        }

                }.createDelegate(this)
            });
        },
        /*
         * 加载Panel的内容
         */
        loadLGPPane: function () {
            var self = this;
            if (this.writePane.isLoadingPage == this.idx) {
                return;
            }

            this.dirtyCell = [];

            this.writePane.fireEvent(FR.Events.STARTLOAD);
            this.writePane.isLoadingPage = this.idx;

            // alex:下面强制设置innerHTML为空字符串,jQuery.html()方法会调用empty(),很费时间
            // 客户嫌刷新幅度过大，屏了吧
//	    	this.$container[0].innerHTML = "";
            this.gotoPage(_g().currentPageIndex, arguments[0]);
            // 加载完给writePane也加个gotoPage方法,和分页预览统一,给工具栏的页码输入框使用
            this.writePane.gotoPage = function (index, anysc) {
                self.writePane.lgps[self.writePane.selectedIndex].gotoPage(index, anysc);
            }
        },

        /*
         * 初始化LGPComponent
         */
        initLGPComponent: function () {
            this.$sheet_container = $('.sheet-container', this.$container);
            // richer:有冻结才把做layout
            if (this.isFrozen()) {
                // 这个sheet是可见的才做Layout 不可见的时候取到的尺寸都是0
                if (this.$sheet_container.parent().isVisible()) {
                    FR.layoutFrozen(this.$sheet_container, this.$sheet_container.offset().top);
                    this.frozenModified = true;
                }
                //wei : bug5374
                this.$container.css({
                    overflow: 'hidden'
                });
            }
            var self = this;
            //Sean: this.$glance是选中可编辑单元格时出现在单元格右上角指示单元格可编辑的小图标的DOM和属性。
            this.$glance = {};
            this.$glance.top = $('.gltop', this.$container);
            this.$glance.left = $('.glleft', this.$container);
            this.$glance.bottom = $('.glbottom', this.$container);
            this.$glance.right = $('.glright', this.$container);
            this.$glance.img = $('<div/>').appendTo(this.$container)
                .addClass("glance-editor-img").attr("title", FR.i18nText("Edit")).click(
                function (e) {
                    var tdCell = self.$glance.tdCell;
                    if (tdCell) {
                        self.removeGlanceEditor(e);
                        // selectTDCell顺利执行完才editTDCell,bug31946
                        if (self.selectTDCell(tdCell) !== false) {
                            self.editTDCell(tdCell);
                        }
                    }
                }).hide();

            //hiram_write 把$glance的top,left等加入到一个div里
            var oldParent = this.$glance.top.parent();
            this.$glance.div = $('<div id="glanceDiv" style="position:absolute;top:0px;left:0px"><div>');
            this.$glance.div.append(this.$glance.top);
            this.$glance.div.append(this.$glance.left);
            this.$glance.div.append(this.$glance.bottom);
            this.$glance.div.append(this.$glance.right);
            this.$glance.div.append(this.$glance.img);
            //$glance.img是跟随glanceDiv显示隐藏了，初始时会显示在左上角，设为-999px隐藏起来
            this.$glance.img.css("top", "-999px");
            this.$glance.img.show();
            this.$glance.top.show();
            this.$glance.left.show();
            this.$glance.bottom.show();
            this.$glance.right.show();
            this.$glance.div.appendTo(oldParent);
            //当从水印div中移出时要remove水印
            this.$glance.div.children().mouseleave(function (e) {
                self.removeGlanceEditor(e);
            });
            //end
            this.$editor = $('.x-editor', this.$container);
            this.$editor.mouseover(function () {
                self.$editor.addClass('glance-editor-focus');
            }).mouseout(function () {
                    self.$editor.removeClass('glance-editor-focus');
                });

            // 保存联动使用到但还没生成的控件所在ID对应的联动的控件
            this.depEditors = {};
            this.$scrollable = this.$container; // 设置滚动对象为$container
            this.$table = $('.x-table', this.$container);
            // denny: 报表tableID, 用来标识单元格的唯一性。
            this.tableID = this.$table.attr("id");
            this.write = this.$sheet_container.asComponent({type: "fr_write",
                selector: 'td[widget]',
                resolveVariable: function (variable) {
                    // alex:执行getCellValue("B2")
                    return self.getCellValue(variable);
                }
            });
            this.write.lgp=this;
            //wei : 处理水印和鼠标移上去显示控件  + 初始化联动
            var widgets = $('td[editor],td[widget]', this.$sheet_container);
            this._addGlanceEventAndCalculateDependence(widgets);
            var arr=this.write.WidgetMgr.DependenceMgr.getWidgetShouldInitDependence();
            for(var i=arr.length - 1; i >= 0; i--) {
                self.write._initDependenceRelationWidgetByKey(arr[i]);
            }
            //Sean: this.$fD是选中可编辑单元格时出现的边框线。
            this.$fD = {};
            this.$fD.ftop = $('#fDtop', this.$container);
            this.$fD.fleft = $('#fDleft', this.$container);
            this.$fD.fbottom = $('#fDbottom', this.$container);
            this.$fD.fright = $('#fDright', this.$container);
            this.$fD.fdot = $('<div/>');

            this.table_width = this.$table.find("colgroup:eq(0)").children().length;
            this.table_height = this.$table.find('tbody:eq(0)').children().length;

            // 为$sheet加事件
            // alex:单击选中的某个格子进入编辑状态,原来是用mousedown事件,$editorComponent.focus不了
            this.$sheet_container.click(function (e) {
                var src = e.target;
                var secell;
                // 可能点了格子内部的什么，默认选出来

                if (!isCell(src)) {
                    var $td = $(src).parents('td:eq(0)')
                    if ($td.length > 0 && isCell($td[0])) {
                        secell = $td[0];
                    }
                } else {
                    secell = src;
                }
                // 假如已经选中了，就进入编辑
                if (secell) {
                    if (self.currentTDCell && $(self.currentTDCell).attr("id") == $(secell).attr("id")) {
                        self.editTDCell();
                    } else if ($(secell).attr('widget') || self.writePane.editOnClick) {
                        self.selectTDCell(secell);
                        self.editTDCell();
                    } else {
                        self.selectTDCell(secell);
                    }
                }
            }).dblclick(function (e) {
                    var src = e.target;
                    if (isCell(src)) {
                        if ($.browser.msie) {
                            if (self.currentTDCell && $(self.currentTDCell).attr("id") == $(src).attr("id")) {
                                self.editTDCell(src);
                            } else {
                                self.selectTDCell(src);
                                self.editTDCell(src);
                            }
                        } else {
                            self.editTDCell(src);
                        }
                    }
                });

            this.$sheet_container.css("display", "");
            // 对onfocus的激活处理
            //b:mousedown来判断不是很好。。居然有combobox的判断
            $(document).mousedown(function (e) {
                self[FR.isAncestor(self.$sheet_container[0], e.target)
                    || (FR.$view_container && FR.isAncestor(
                    FR.$view_container[0], e.target))
                    ? 'onfocus'
                    : 'unfocus']();
            });

            // carl:觉得不是太好的处理，获得焦点时注册事件，失去焦点时移除事件
            this.keyevent = {scope: this, fn: this._onKeyDown};
            this.onfocus();
        },

        //_glanceEvent
        _addGlanceEventAndCalculateDependence: function (widgets) {
            var self = this;
            for (var idx = 0, len = widgets.length; idx < len; idx++) {
                var widget = widgets[idx];

                if (!FR.isMobileApp()) {
                    $(widget).mouseenter(function (e) {
                        var src = e.currentTarget;
                        if (!isCell(src)) {
                            return;
                        } else {
                            var isEditor = $(src).attr('editor');
                            if (isEditor) {
                                self.glanceTDCell(src);
                            }
                        }
                    }).mouseleave(function (e) {
                            self.removeGlanceEditor(e);
                        });

                }


                // richer:获取联动的关联格子
                var shouldInit = false;
                var attrJson = $(widget).attr('editor');
                if (!attrJson) {
                    attrJson = $(widget).attr('widget');
                    shouldInit = true;
                }
                var attr = null;
                if (shouldInit) {
                    attr = FR.jsonDecode(attrJson);
                    self.write.WidgetMgr.DependenceMgr.addWidgetShouldInitDependence(attr.location);
                    self.write.WidgetMgr.DependenceMgr.addWidgetShouldInitDependence(attr.widgetName);
                }

                if (!$(widget).attr('hasWatermark') && !$(widget).attr('hasDependece') && !$(widget).attr('hasAttachment')) {
                    continue;
                }

                if(!attr){
                    attr = FR.jsonDecode(attrJson);
                }
                if (!(!attr.watermark || attr.value || attr.value === 0)) {
                    FR.$defaultImport('/com/fr/web/core/js/jquery.watermark.js', 'js');
                    $(widget).text(attr.watermark).css({
                        'color': $(widget).getwatermarkcolor()
                    });
                    $(widget).addClass('watermarkCell');
                }
                if (attr.type == "multifile") {
                    var cv = $(widget).attr('cv');
                    cv && (cv = FR.jsonDecode(cv));
                    if (($.isArray(cv) && cv.length > 0) || (cv && cv.attach_id && (cv = [cv]))) {
                        this.previewAttachment($(widget), attr.maxlength === 1 && cv[0].attach_type == "image" ? cv[0] : cv);
                    }
                }

                if (attr.dependenceMap || attr.dependence) {
                    var location = attr.location;
                    var finalDependence = {}
                    if (attr.dependenceMap) {
                        finalDependence = attr.dependenceMap;
                    } else if (FR.isArray(attr.dependence)) {
                        finalDependence = attr.dependence;
                    }
                    $.each(finalDependence, function (key, item) {
                        var idOrName = item.startWith("$") ? item.substring(1) : item;
                        self.write.WidgetMgr.DependenceMgr.addDependenceRelation(idOrName, location);
                    });

                }
            }
        },

        //hiram 隐藏glance
        _hideGlance: function () {

            if (!this.$glance.oldTdCell) {
                this.$glance.oldTdCell = this.$glance.tdCell;
            } else {
                if (this.$glance.oldTdCell == this.$glance.tdCell) {
                    return;
                } else {
                    this.$glance.oldTdCell = this.$glance.tdCell;
                }
            }
            this.$glance.div.hide();
            this.$glance.tdCell = null;
        },
        _showGlance: function (tdCell) {
            var $tdCell = $(tdCell);
            var top = $tdCell.parent()[0].offsetTop;
            var bounds = this.getTDCellBounds(tdCell);
            var left = $(".fr-fileupload-download-all", tdCell).length > 0 ? 18 : 0;
            this.$glance.img.css({
                top: bounds.top + etadjst - 2,
                left: bounds.left + eladjst - 20 + bounds.width - left
            });
            this.$glance.top.css({top: bounds.top, left: bounds.left, width: bounds.width - 2});
            this.$glance.left.css({top: bounds.top + 1, left: bounds.left, height: bounds.height - 4});
            this.$glance.bottom.css({top: bounds.top + bounds.height - 3, left: bounds.left, width: bounds.width - 2});
            this.$glance.right.css({top: bounds.top + 1, left: bounds.left + bounds.width - 3, height: bounds.height - 4});
            this.$glance.div.show();
        },
        // 选中第一个可选的格子
        _selectFirstTD: function () {
            var fecTD;
            // carl:看看有没有设定的需要首先选的格子
            if (this.$fec) {
                fecTD = this.getTDCell(this.$fec);
                if (this.isSelectable(fecTD)) {
                    this.selectTDCell(fecTD);
                } else {
                    fecTD = null;
                }
            }
            // alex:选中第一个可选中的格子
            if (!fecTD) {
                $('td.fh', this.$table).each((function (idx, td) {
                    if (this.isSelectable(td)) {
                        this.selectTDCell(td);
                        return false;
                    }
                }).createDelegate(this));
            }
        },

        //hiram 下面的都是插入行局部刷新的
        appendRow: function (insertIndex, $trs, mergeCells) {
            var helper = FR.WLGP.RowHelper;
            this._down_location_widgets(insertIndex, $trs.length, helper);
            this._down_tr_id(insertIndex, $trs.length, helper);
            this._down_td_id(insertIndex, $trs.length, helper);
            this._update_widgetAttr(insertIndex, $trs.length, helper);
            this._clipTrs($trs, mergeCells);


            var widgets = $('td[widget]', $trs);
            var editors = $('td[editor]', $trs);
            this._addGlanceEventAndCalculateDependence(editors);
            widgets.each(function (idx, dom) {
                if (dom.hasInit !== true) {
                    _g().curLGP.write.addWidget($(dom));
                }
            });
            // 填报分页的话上一行可能在上一页这时候需要用下一行
            var pre = $("tr[tridx='" + (insertIndex - 1) + "']", this.$container);
            if (pre.length > 0) {
                pre.after($trs);
            } else {
                $("tr[tridx='" + (insertIndex + 1) + "']", this.$container).before($trs);
            }

            this.table_height&&this.table_height ++;
            this._changeSpan4Array(mergeCells, $trs.length);
        },

        deleteRow: function (start, len, mergeCells) {
            $("tr[tridx]", this.write.options.renderEl).each(function (index, tr) {
                var $tr = $(tr);
                var tridx = $tr.attr("tridx");
                if (tridx >= start && tridx < start + len) {
                    $tr.height("0px");
                    $tr.css("display", "none");
                }
            });
            if(this.table_height&&--this.table_height<0){
                this.table_height = 0;
            }
            this._changeSpan4Array(mergeCells, -len);
        },

        //有时后台传过来的trs还会有空白单元格，这应该是合并单元格占的位，把这部分去掉
        _clipTrs: function ($trs, mergeCells) {
            if (typeof mergeCells === "undefined") {
                return
            }
            ;
            for (var i = 0; i < mergeCells.length; i++) {
                var colName = FR.digit2Letter(mergeCells[i].col + 1);
                //conName为A,B..,去掉某列所有单元格
//                $('#' + colName + "-" + this.idx + "-" + this.tableID).remove();
                $("td[id^='" + colName + "']", $trs).remove();
            }
        },
        //改变指定的单元格rowspan
        _changeSpan: function ($td, len) {
            if (typeof $td.attr("rowspan") !== "undefined") {
                var rowspan = parseInt($td.attr("rowspan"));
                $td.attr("rowspan", rowspan + len);
            } else {
                $td.attr("rowspan", 1 + len);
            }
        },
        //{"sessionID":"23856","location":"A4","widgetUrl":"/WebReport/ReportServer?op=widget&location={\"column\":0,\"row\":3,\"reportIndex\":0}&sessionID=23856","regex":"","invisible":false,"value":"name3","needSubmit":true,"type":"text","reportIndex":0,"disabled":false,"render":true}
        //tds [{col:1, row:2}, {col:6, row:2}]
        _changeSpan4Array: function (tds, len) {
            for (var i = 0; i < tds.length; i++) {
                var cellName = FR.columnRow2CellStr(tds[i]);
                this._changeSpan($("#" + cellName + "-" + this.idx + "-" + this.tableID), len);
            }
        },
        //把write.location_widgets中的widgets往下移，start开始移动的行，len长度
        _down_location_widgets: function (start, len, helper) {
            //cellStr2ColumnRow (name)   // "A3"->{col, row}
            var olds = this.write.location_widgets;
            var news = {};
            for (var location in olds) {
                if (helper.compare4CellStr(location, start) < 0) {
                    news[location] = olds[location];
                } else {
                    var newLocation = helper.add4CellStr(location, len);
                    news[newLocation] = olds[location];
                    var newWidget=news[newLocation];
                    newWidget.options.location = newLocation;
                    newWidget.options.widgetUrl = this._replaceWidgetURLStr(newWidget.options.widgetUrl, FR.cellStr2ColumnRow(newLocation));
                    if(newWidget.options.data){
                        this._updateUrlInWidgetData(newWidget.options.data, newWidget.options.widgetUrl);
                    }
                }
            }
            this.write.location_widgets = news;
        },

        _updateUrlInWidgetData: function(data,url){
            if (data.options.dataReader) {
                this._updateOptionsUrl(data.options.dataReader, url)
            }
            if (data.options.dataSource) {
                this._updateOptionsUrl(data.options.dataSource, url)
            }
        },

        _updateOptionsUrl: function (o, url) {
            if(o.options && o.options.url) {
                o.options.url=url;
            }
        },

        _down_tr_id: function (start, len, helper) {
            //r-2-0
            $("tr[tridx]", this.write.options.renderEl).each(function (index, dom) {
                var $dom = $(dom);
                var tridx = $dom.attr("tridx");
                if ($dom.attr("tridx") >= start) {
                    tridx = len + parseInt(tridx);
                    $dom.attr("tridx", "" + tridx);
                    dom.id = helper.add4TrId(dom.id, len);
                }
            });
        },
        _down_td_id: function (start, len, helper) {
            var lgp = this;//,lgp.write.options.renderEl
            $("td[id]", lgp.write.options.renderEl).each(function (index, dom) {
                var $dom = $(dom);
                var cr = FR.id2ColumnRow(dom.id);
                if (cr.row >= start) {
                    cr.row += len;
                    $dom.attr("row", cr.row);
                    dom.id = FR.columnRow2CellStr(cr) + "-" + lgp.idx + "-" + lgp.tableID;
                }
            });
        },
        //更新单元格的widget和editor属性里的location
        _update_widgetAttr: function (start, len, helper) {
            var lgp = this;

            $("td[editor],td[widget]", lgp.write.options.renderEl).each(function (index, dom) {
                var $dom = $(dom);
                var cr = FR.id2ColumnRow(dom.id);
                if (cr.row >= start) {
                    if (typeof($dom.attr("editor")) == "undefined") {
                        var editor = $dom.attr('widget');
                        var newEditor = lgp._replaceEditorStr(editor, cr);
                        $dom.attr("widget", newEditor);
                    } else {
                        var editor = $dom.attr('editor');
                        var newEditor = lgp._replaceEditorStr(editor, cr);
                        $dom.attr("editor", newEditor);
                    }
                }
            });
        },
        _replaceWidgetURLStr: function(urlStr,cr) {
            var newUrlStr = urlStr.replace(/\"column\":[0-9]{1,3},\"row\":[0-9]{1,3}/, "\"column\":" + cr.col + ",\"row\":" + cr.row);
            return newUrlStr;
        },

        _replaceEditorStr: function (editorStr, cr) {
            //{\"column\":1,\"row\":2,\"reportIndex\":0}
            var newEditor = editorStr.replace(/\\\"column\\\":[0-9]{1,3},\\\"row\\\":[0-9]{1,3}/, "\\\"column\\\":" + cr.col + ",\\\"row\\\":" + cr.row).replace(/"location":"[A-Z]{1,3}[0-9]{1,3}/, '"location":"' + FR.columnRow2CellStr(cr));
            return newEditor;
        },
        //hiram 插入行方法End


        onfocus: function () {
            FR.Keys.reg(this.keyevent)
        },

        unfocus: function () {
            FR.Keys.unreg(this.keyevent)
        },

        getCellValue: function (columnIndex, rowIndex) {
            return FR.getCellValue(this._get$TDCell(columnIndex, rowIndex));
        },

        setCellValue: function (columnIndex, rowIndex, cv, presentValue, hyperlink) {
            if (arguments.length === 2) {
                cv = arguments[1];
                rowIndex = null;
            }
            var $tdCell = this._get$TDCell(columnIndex, rowIndex);
            var $tr = $tdCell.parent();
            var oriHeight = $tr.isVisible() ? $tr.height() : 0;
            FR.setCellValue($tdCell, cv);
            var editorO = $tdCell.attr('editor') || $tdCell.attr('widget');
            if (editorO) {
                //设置单元格值后还需要设置控件值。如果控件已经初始化了，调到其setValue方法，否则改变下editorO.value属性
                editorO = FR.jsonDecode(editorO);
                if (this.write.location_widgets && this.write.location_widgets[editorO.location]) {
                    this.write.location_widgets[editorO.location].setValue(cv);
                } else {
                    editorO.value = cv;
                    if ($tdCell.attr('editor')) {
                        $tdCell.attr('editor', FR.jsonEncode(editorO));
                    } else {
                        $tdCell.attr('widget', FR.jsonEncode(editorO));
                    }
                }
            }
            $tdCell.addClass("dirty");
            if (hyperlink) {
                $("span", $tdCell).attr("onclick", hyperlink);
            }
            this.displayTDCell($tdCell, cv, presentValue);
            FR.modifyRowHeightAfterContentChange($tr, oriHeight);
        },

        showAsWidget: function ($tdCell) {
            return $tdCell.attr('widget') != null;
        },

        /*
         * alex:取得第i列的列宽
         */
        getColumnWidth: function (i) {
            if (i >= 0 && i < this.table_width) {
                // alex:原来是上面注释掉的那种写法,但在opera & safari里面会返回0,而不是实际的width
                return parseInt(this.$table.find("colgroup:eq(0)").children(":eq(" + i + ")").css('width'))
            }
            return 0;
        },

        /*
         * alex:取得第i行的行高
         */
        getRowHeight: function (i) {
            if (i >= 0 && i < this.table_height) {
                return this.$table.find("tbody:eq(0)").children().eq(i).height()
            }
            return 0;
        },

        /*
         * 键盘事件
         */
        _onKeyDown: function (e) {
            var k = e.keyCode;
            var curCell, editor, tmpWidget;
            curCell = this.writePane.curLGP.currentTDCell;
            if (curCell != null && $(curCell).attr('editor') != null) {
                editor = FR.jsonDecode($(curCell).attr('editor'));
                tmpWidget = contentPane.getWidgetByCell(editor.location);
            }
            // delete 和 paste 需要判断控件 控件不可用或不可见的时候阻止掉
            if ((k == EE.DELETE || k == EE.BACKSPACE) || (e.ctrlKey && k === 86)) {
                if (tmpWidget && tmpWidget.options) {
                    // 控件可用并且可见的才能delete paste
                    if (!(tmpWidget.options.disabled === false && tmpWidget.options.invisible === false)) {
                        return;
                    }
                }
            }

            // p: delete.
            if (k == EE.DELETE || k == EE.BACKSPACE) {
                if (this.writePane.curLGP.cellEditing == null) {
                    if (tmpWidget != null && FR.getCellValue($(curCell)) !== "") {
                        // 控件可用并且可见的才能delete
                        if ((!tmpWidget.options) || (tmpWidget.options.disabled === false && tmpWidget.options.invisible === false)) {
                            // 改变td的显示值
                            this.writePane.curLGP.displayTDCell(curCell, "");
                            // 改变tdCell的值cv
                            this.writePane.curLGP.fireCellValueChange(curCell, "", null);
                            // 改变控件的值 editComp置空
                            tmpWidget.editComp && tmpWidget.editComp.val("");
                            tmpWidget.reset();
                            // reset()中包含有afteredit事件
                            tmpWidget.fireEvent(FR.Events.STOPEDIT);
                        }
                    }
                }
            }
            // ctrl + v
            else if (e.ctrlKey && k === 86) {
                var el;
                if ($.browser.msie) {
                    el = e.srcElement;
                } else {
                    el = e.target;
                }
                var tag = el.tagName;
                //alert(tag);
                // carl：事件会冒泡上来，假如是输入框之类的ctrl+v，就不理睬
                if (tag != "INPUT" && tag != "TEXTAREA") {
                    var cp = $("#cpTextArea");
                    cp.focus();
                    cp.select();
                    setTimeout(function () {
                        _g().pasteCells();
                    }, 50);
                } else {
                    setTimeout(function () {
                       _g().fireCurrentWidgetEvent(FR.Events.AFTEREDIT);
                    }, 50);
                }
            }
            // 按a-zA-Z0-9开始编辑(alex:在keydown事件里,好像a和A都是65,在keypress事件且在ie中a好像是97),[96~105]是右边的小键盘按出来的
            else if (k == EE.SPACE || k >= 48 && k <= 57 || k >= 65 && k <= 90 || k >= 96 && k <= 105 || k === 109 || k === 189 ||
                e.shiftKey && k === 187 || k === 107) {
                if (this.writePane.curLGP.cellEditing == null) {
                    this.writePane.curLGP.editTDCell(null);
                    // alex:如果是按空格键,仅仅是开始编辑,不要把空格写到编辑器里面
                    if (k == EE.SPACE) {
                        e.stopEvent();
                    }
                }
            } else {
                var direction = 0;

                if (this.writeShortCuts == undefined) {
                    this.writeShortCuts = !this.getWriteShortCuts();
                }

                // richer:tab键左移
                if (e.shiftKey && k == EE.TAB) {
                    direction = this.writeShortCuts ? LEFT : UP;
                    // shift + enter键上移
                } else if (e.shiftKey && k == EE.ENTER) {
                    direction = this.writeShortCuts ? UP : LEFT;
                    // tab键右移
                } else if (!e.shiftKey && k == EE.TAB) {
                    direction = this.writeShortCuts ? RIGHT : DOWN;
                    // enter键下移
                } else if (!e.ctrlKey && k == EE.ENTER) {
                    direction = this.writeShortCuts ? DOWN : RIGHT;
                    // left键左移
                } else if (!e.ctrlKey && k == EE.LEFT) {
                    if (this.cellEditing != null) {
                        return;
                    }
                    direction = LEFT;
                    // right键右移
                } else if (!e.ctrlKey && k == EE.RIGHT) {
                    if (this.cellEditing != null) {
                        return;
                    }
                    direction = RIGHT;
                    // up键上移
                } else if (!e.ctrlKey && k == EE.UP) {
                    direction = UP;
                    // down键下移
                } else if (!e.ctrlKey && k == EE.DOWN) {
                    direction = DOWN;
                }

                if (direction === 0) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();
                this.writePane.curLGP.moveTDCell(direction);
            }
        },

        getWriteShortCuts: function () {
            var writeShortCuts;
            FR.ajax({
                url: FR.servletURL,
                data: {
                    op: 'fr_write',
                    cmd: "write_shortcuts",
                    sessionID: this.writePane.currentSessionID
                },
                async: false,
                complete: function (res, status) {
                    if (status == 'success') {
                        writeShortCuts = res.responseText == 'true'
                    }
                }
            });

            return writeShortCuts;
        },

        /*
         * 单元格值改变后
         */
        fireCellValueChange: function (tdCell, cv, fm) {

            if (tdCell == null) {
                return;
            }

            var $tdCell = $(tdCell);
            FR.setCellValue($tdCell, cv);

            var cal = false;
            if (fm == null) {
                if ($tdCell.attr('fm') != null) {
                    cal = true;
                }
                $tdCell.removeAttr("fm");
            } else {
                $tdCell.attr('fm', fm);
                cal = true;
            }
            $(tdCell).addClass('dirty');

            this.dirtyCell.push(tdCell);
            if (cal || $tdCell.attr("frs") != null) {
                this.writePane.writeDirtyAndRemoteCal(this.idx, FR.id2ColumnRow($tdCell.attr("id")), cv, fm);
            }
            // richer:通知单元格改变,用于联动
            this.fireEvent(FR.Events.CELLVALUECHANGE, $(tdCell), cv);
        },

        /**
         * 填报翻页时候保存当前页面内容
         */
        saveCurrentPage: function () {
            if (this.dirtyCell && this.dirtyCell.length > 0) {
                var $tmpCell = $(this.dirtyCell[0]);
                this.writePane.writeDirtyAndRemoteCal(this.idx, FR.id2ColumnRow($tmpCell.attr("id")), $tmpCell.text());
            }
        },

        /*
         * 把一个TD变成ColumnRowString
         */
        cut2ColumnRowString: function (td) {
            if (td == null) {
                return null;
            }

            var iid = $(td).attr("id");
            return iid.substring(0, iid.length - ('-' + this.idx).length - ('-' + this.tableID).length)
        },

        /*
         * 选中一片tdCell,暂时主要用于公式解析A1:C3这样的东西
         */
        getRangeTDCells: function (fc, fr, tc, tr) {
            var cells = [];
            for (var r = fr; r <= tr; r++) {
                for (var c = fc; c <= tc; c++) {
                    var tdCell = this.getTDCell(c, r);
                    if (tdCell) {
                        cells[cells.length] = tdCell;
                    }
                }
            }
            return cells
        },

        /*
         * 该dom tdCell是否可被选中
         */
        isSelectable: function (tdCell) {
            // richer:如果直接显示编辑器了，就不再需要编辑框了
            var text = $(tdCell).attr("editor");
            if (!text) {
                return false;
            }
            if (FR.jsonDecode(text).showOnLoad) {
                return false;
            }

            if (tdCell == null) {
                return false;
            }
            var $tdCell = $(tdCell);
            //Sean:isVisible的方法只能判断当前元素的display，如果tr隐藏的话，td判断出来还是可见的，所以这个方法不可取，改用下面的方法
            //if (!$tdCell.isVisible()) {
            if(!$tdCell.is(':visible')){
                return false;
            }
            return this.selectMethod == 'all'
                || $tdCell.attr('editor') != null
                || $tdCell.attr('ap') != null;
        },

        /*
         * 选中dom tdCell,也就是加个黑边框,并把tdCell确保在屏幕的显示范围内
         */
        selectTDCell: function (tdCell) {
            // richer:如果填报格子有校验属性的话,校验不通过时直接返回,焦点依然在当前这个格子里
            if (this.stopCellEditing() === false) {
                return false;
            }

            var self = this;
            this.currentTDCell = tdCell;
            $(oldSelectedCell).parent().children().removeClass("test");
            oldSelectedCell = tdCell;
            $(this.currentTDCell).parent().children().addClass("test");
            //alex:注意,这里是fire writePane.event,不是this.event
            this.writePane.fireEvent("cellselect", this.currentTDCell);

            if (this.isSelectable(tdCell)) {
                this.dealWithBorder(tdCell);
                if (this.$glance.tdCell == tdCell) {
                    this.$glance.div.hide();
                }
            }

            // alex:让$scrollable滚动
            // bug50146 要注意冻结的情况
            var scroll = this.$scrollable;
            if (this.isFrozen()) {
                $.each(["center", "north", "west", "corner"] , function(idx, item) {
                    var part = $(".frozen-" + item, self.$sheet_container);
                    if ($(tdCell).isChildAndSelfOf(part)) {
                        scroll = part;
                        return false;
                    }
                });
            }
            $(this.currentTDCell).__scroll2View__(scroll);
        },

        getTDCellBounds: function (tdCell) {
            // 取到tr,safari、chrome中td的top计算比较乱，但是tr的还是比较一致的
            var $tr = $(tdCell).parent();
            var top = $tr[0].offsetTop;
            var w = tdCell.offsetWidth;
            if ($.browser.msie && parseInt($.browser.version) === 8) {
                if (!$(tdCell).is(':visible')) {
                    w = 0;
                }
            }
            return {
                top: top + this.getSCOffsetTop() + tadjst,
                left: tdCell.offsetLeft + this.getSCOffsetLeft() + ladjst,
                width: w + wadjst + ($.browser.msie ? 0 : 6),
                height: tdCell.offsetHeight + hadjst
                    + +($.browser.msie ? 0 : 6)
            };
        },

        dealWithBorder: function (tdCell) {
            var bounds = this.getTDCellBounds(tdCell);
            // carl:5个。。
            this.$fD.ftop.css({top: bounds.top, left: bounds.left, width: bounds.width - 2});
            this.$fD.fleft.css({top: bounds.top + 1, left: bounds.left, height: bounds.height - 4});
            this.$fD.fbottom.css({top: bounds.top + bounds.height - 3, left: bounds.left, width: bounds.width - 2});
            this.$fD.fright.css({top: bounds.top + 1, left: bounds.left + bounds.width - 3, height: bounds.height - 4});
            this.$fD.fdot.css({top: bounds.top + bounds.height - 5, left: bounds.left + bounds.width - 5});
            this.$fD.tdCell = tdCell;
            // 要让fD的offsetParent与currentTDCell.offsetParent相同
            var $current_offset_c = $(this.currentTDCell).parents(".offset-c:eq(0)");
            if (!FR.equals(this.$fD.ftop.parents(".offset-c:eq(0)"), $current_offset_c)) {
                // carl:简单弄了，一次弄进去，不一个个判断了
                $current_offset_c.append(this.$fD.ftop);
                $current_offset_c.append(this.$fD.fleft);
                $current_offset_c.append(this.$fD.fbottom);
                $current_offset_c.append(this.$fD.fright);
                $current_offset_c.append(this.$fD.fdot);
            }
        },

        removeGlanceEditor: function (e) {
            //hiram_write 当移出时在glanceDiv中或在其他可编辑单元格中(大多数情况)，就不隐藏了(其他单元格会重绘水印)，减少页面重绘次数
            var $relatedTarget = $(e.relatedTarget);
            if ($relatedTarget.hasClass("glance-editor-img") || $relatedTarget.attr('editor') != null) {
                return
            }
//            if  (arget.parent().attr("id") == "glanceDiv" || $relatedTarget.attr('editor') != null) {
//                return
//            }
//            ;
            this._hideGlance();
        },

        glanceTDCell: function (tdCell) {
            var self = this;
            if (!tdCell) {
                tdCell = this.currentTDCell;
            }
            if (!isCell(tdCell) || (this.cellEditing && tdCell == this.cellEditing)) {
                return;
            }
            var $tdCell = $(tdCell);
            var editorO = $tdCell.attr('editor');
            if (editorO == null) {
                return;
            }

            editorO = FR.jsonDecode(editorO);
            // 状态保证能及时改变，所以不能取原始的信息
            var tmpWidget = contentPane.getWidgetByCell(editorO.location);
            if (tmpWidget === null || tmpWidget.options.disabled === true || tmpWidget.options.invisible === true) {
                return;
            }
            // 取到tr,safari、chrome中td的top计算比较乱，但是tr的还是比较一致的


//            this.$glance.img.show().appendTo($tdCell);
            this.$glance.tdCell = tdCell;

            if (tdCell == this.$fD.tdCell) {
//            	this._hideGlance();
                this.$glance.div.hide();
                return;
            }
            //hiram_wirte  重构显示glance
            //mylable2
//            this.$glance.top.css({top:bounds.top, left:bounds.left, width:bounds.width - 2}).show();
//            this.$glance.left.css({top:bounds.top + 1, left:bounds.left, height:bounds.height - 4}).show();
//            this.$glance.bottom.css({top:bounds.top + bounds.height - 3, left:bounds.left, width:bounds.width - 2}).show();
//            this.$glance.right.css({top:bounds.top + 1, left:bounds.left + bounds.width - 3, height:bounds.height - 4}).show();
            this._showGlance(tdCell);
            //end

            // 要让fD的offsetParent与currentTDCell.offsetParent相同
            var $current_offset_c = $(tdCell).parents(".offset-c:eq(0)");
            if (!FR.equals(this.$glance.top.parents(".offset-c:eq(0)"), $current_offset_c)) {
                // carl:简单弄了，一次弄进去，不一个个判断了
//                $current_offset_c.append(this.$glance.top);
//                $current_offset_c.append(this.$glance.left);
//                $current_offset_c.append(this.$glance.bottom);
//                $current_offset_c.append(this.$glance.right);
//                $current_offset_c.append(this.$glance.dot);
                $current_offset_c.append(this.$glance.div);
            }
        },

        /*
         * 编辑dom tdCell
         */
        editTDCell: function (tdCell) {
            //wei:去掉校验出错信息
            if ($('div.verify-error-info', FR.$view_container).length > 0) {
                $('div.verify-error-info', FR.$view_container).remove();
            }
            if (!tdCell) {
                tdCell = this.currentTDCell;
            }
            //alex:must be TD; check out if the cell in editing; check out directEdit
            if (!isCell(tdCell) || (this.cellEditing && tdCell == this.cellEditing)) {
                return;
            }
            var $tdCell = $(tdCell);
            var editorO = $tdCell.attr('editor') || $tdCell.attr('widget');
            if (editorO == null) {
                return;
            }

            contentPane.fireEvent(FR.Events.BEFOREEDIT, $tdCell);

            editorO = FR.jsonDecode(editorO);
            // 状态保证能及时改变，所以不能取原始的信息
            var tmpWidget = contentPane.getWidgetByCell(editorO.location);
            if (tmpWidget === null || tmpWidget.options.disabled === true || tmpWidget.options.invisible === true) {
                return;
            }
            // alex:有editor属性,表明是可以编辑的,那么停止之前的编辑,开始新的编辑
            this.stopCellEditing();


            // 取到tr,safari、chrome中td的top计算比较乱，但是tr的还是比较一致的
            var $tr = $tdCell.parent();
            var top = $tr[0].offsetTop;

            var isEditor = !$tdCell.attr('widget');
            var searchEditor = this.write.getWidgetByCell(editorO.location);
            if (searchEditor) {
                this.editorEl = searchEditor;
            }

            /*
             * 取得编辑器需要编辑的内容
             * 查找的顺序依次为
             * fm(formula) -> cv(Cell.Value) -> text(TD.text())
             * 如果编辑器是数字类型的话,还需要转成数值(TODO 是否可以考虑把这个类型转换放到编辑器内部去做)
             */

            var editContent;
            if ((editContent = $tdCell.attr('cv')) != null) {
                editContent = FR.jsonDecode(editContent);
            } else if (!isEditor) {
                editContent = $tdCell.attr('cv');
            } else {
                editContent = $tdCell.hasClass("watermarkCell") ? "" : $tdCell.text();
            }
            // james:编辑器要编辑的值
            var val;
            if (typeof(editContent) == "number" || typeof(editContent) == "string") {
                val = editContent;
            } else {
                val = $.isEmptyObject(editContent) ? "" : editContent;
            }
            if (editorO.type == "number") {
                val = parseFloat(editContent);
                if (isNaN(val)) {
                    // james:不是数字的时候，不要给默认值0，就给空字符串
                    val = '';
                }
            }

            if (editContent && editContent.date_milliseconds && editorO.type != "datetime") {
                val = $tdCell.text();
            }

            if (isEditor) {
                this.$editor.css({
                    top: top + this.getSCOffsetTop() + etadjst - 2,
                    left: tdCell.offsetLeft + this.getSCOffsetLeft() + eladjst - 2
                });
            } else {
                this.$editor.css({top: '-100px', left: '-100px'});
            }

            if (isEditor) {
                // 能走到这一步，这个控件必然是可编辑的，不然会在前面拦截不会生成这个editor
                this.editorEl.element.removeClass("ui-state-disabled");
                var textEditor = $(".fr-texteditor", this.editorEl.element);
                if (textEditor.length > 0 && textEditor[0].disabled === true) {
                    textEditor[0].disabled = false;
                }
                this.$editor.append(this.editorEl.element);
                /*
                 * alex:因为在编辑过程中可能导致tdCell.size改变,所以每次都要resize一下
                 */
                this.editorEl.doResize({
                    width: $tdCell.width(),
                    height: $tdCell.height()
                });
            }

            if (this.editorEl && this.editorEl.couldUsedAsEditor()) {
                // 初始化控件的阶段进行赋值不触发编辑后事件，加false参数阻止之
                this.editorEl.setValue4Write(val, false);
                // copy style
                this.editorEl.cssFrom(tdCell);
            }

            // 要让$editor的offsetParent与currentTDCell.offsetParent相同
            var $current_offset_c = $(this.currentTDCell).parents(".offset-c:eq(0)");
            if (!FR.equals(this.$editor.parents(".offset-c:eq(0)"), $current_offset_c)) {
                $current_offset_c.append(this.$editor);
            }

            this.$editor.show();

            if (this.editorEl && this.editorEl.couldUsedAsEditor()) {
                var editComp = this.editorEl.editComp;
                if (editComp) {
                    if ($.isFunction(this.editorEl.selectText)) {
                        this.editorEl.selectText();
                    }
                    // 在没有参数界面时移动端填报页面的日期控件弹出框会被提前触发,这里导致的
                    if (!FR.isMobileApp()) {
                        editComp.focus();
                    }

                }

                this.editorEl.startEditing();
                this.editorEl.fireEvent(FR.Events.BEFOREEDIT, tdCell, this);
            }
            this.cellEditing = tdCell;

            // carl:直接触发列表
            if (FR.isMobileApp() && this.editorEl.shouldShowDirectly()) {
                this.editorEl.element.click();
            }
        },

        getWidgetCell: function (widget) {
            return $("#" + widget.options.location + "-" + this.idx + "-" + this.tableID);
        },

        // 把格子的值清空
        resetCellValue: function (widget) {
            //b:多级联动可能会报错
            var $tdCell = this.getWidgetCell(widget);
            if ($tdCell.length > 0) {
                this.fireCellValueChange($tdCell[0], "");
                this.displayTDCell($tdCell, "");
            }
        },

        stopCellEditing: function () {
            var isEditor = !$(this.currentTDCell).attr('widget');

            if (this.editorEl && this.editorEl.couldUsedAsEditor()) {
                if (!this.editorEl.isValidate()) {
                    //james：校验未通过，提示用户错误信息
                    var editor = this.editorEl;
                    //b:回复原值，现在就只有数字控件有这个操作
                    if (this.editorEl.getErrorMsg) {
                        FR.Msg.toast(this.editorEl.getErrorMsg());
                        $(this.currentTDCell).attr('title', this.editorEl.getErrorMsg());
                    } else if (this.editorEl.errorMsg) {
                        $(this.currentTDCell).attr('title', this.editorEl.errorMsg);
                    }
                    if (editor.recoveryValue) {
                        editor.recoveryValue();
                        if (editor.validateCss) {
                            editor.validateCss();
                        }
                    }
                    if (isEditor) {
                        this.$editor.hide();
                        this.editorEl.element.detach();
                        this.displayTDCell(this.currentTDCell, this.editorEl.getValue());
                    }
                    /*
                     * wei : 即使校验失败，也要记录用户输入的错误内容，不能直接将用户输入的内容清空或还原。
                     */
                    var cv = this.editorEl.getValue() || '';
                    this.fireCellValueChange(this.currentTDCell, cv);
                    this.editorEl = null;
                    this.cellEditing = null;
                    return false;
                } else {
                    var cellId = (this.currentTDCell.id.split('-'))[0];
                    var reportIndex = (this.currentTDCell.id.split('-'))[1];
                    var verifyErrorContainer = $('div.verify-error-container', FR.$view_container);
                    var verifyButton = $('button.x-emb-verify');
                    if (verifyErrorContainer.length > 0 && $('td#' + cellId + '-' + reportIndex, verifyErrorContainer).length > 0) {
                        $('td#' + cellId + '-' + reportIndex, verifyErrorContainer).remove();
                        var errornum = parseInt($('div.verify-error-number', verifyButton).text());
                        if (errornum - 1 > 0) {
                            $('div.verify-error-number', verifyButton).text(errornum - 1);
                        } else {
                            $('div.verify-error-number', verifyButton).remove();
                        }
                        if ($('td:visible', verifyErrorContainer).length === 0) {
                            $('div.verify-error-messages:visible', verifyErrorContainer).parent().remove();
                        }
                        if ($('td.verify-item-idx' + reportIndex, verifyErrorContainer).length === 0) {
                            var tabPane = contentPane.$contentPane.data('TabPane');
                            if (tabPane) {
                                for(var i=0;i<tabPane.tabBtns.length;i++){
                                    tabPane.tabBtns[i].setValidState(true);
                                }
                            }
                        }
                    }
                }
                var result, fired = false;
                if (this.writePane.fireStopEditOnChange === false) {
                    result = this.editorEl.fireEvent(FR.Events.STOPEDIT, this.currentTDCell, this);
                    fired = true;
                }
                if (this.editorEl.isDirty()) {
                    // richer:做这个判断是为了删除行列以后不再纠缠
                    var cell = this.getWidgetCell(this.editorEl);
                    if (cell.hasClass("del")) {
                        return false;
                    } else {
                        if (!fired) {
                            result = this.editorEl.fireEvent(FR.Events.STOPEDIT, this.currentTDCell, this);
                        }
                        // stopedit之后再取值，有可能stopedit事件中会有setValue操作
                        var value = this.editorEl.getValue();
                        contentPane.fireEvent(FR.Events.STOPEDIT, $(this.currentTDCell), value);
                        var cv = value;
                        if (!result) {
                            return false;
                        }
                        if (cv == null) {//不能用!cv判断，不然cv=0的时候也返回TRUE的
                            cv = '';//james：如果没有返回值怎么办呢？先返回一个空字符串吧
                        }

                        var $tr = $(this.currentTDCell).parent();
                        var oriHeight = $tr.isVisible() ? $tr.height() : 0;

                        if (isEditor) {
                            if (this.editorEl.options.passwordText) {
                                // 密码控件统一显示*
                                value = value.replace(/[0-9a-zA-Z_]/g, '*');
                            }
                            this.displayTDCell(this.currentTDCell, value);
                        }

                        // james：说明是下拉框等有value和text属性的返回值
                        // alex:这里displayTDCell的参数是cv而不是cv.text,因为里面会做dict处理
                        // richer:加一个参数选择displayTDCell的事cv还是cv.text,因为用dict的话需要很多多余的操作步骤,这样相当于提供一个统一的设置
                        this.fireCellValueChange(this.currentTDCell, cv);

                        var $tdCell = $(this.currentTDCell);

                        FR.modifyRowHeightAfterContentChange($tr, oriHeight);
                    }
                }
                $(this.currentTDCell).removeAttr('title');
                if (isEditor) {
                    this.editorEl.stopEditing();
                    this.$editor.hide();
                    this.editorEl.element.detach();
                }
            } else {
                //clear the hidden editorEls in editorDIV since editorEl.destroy() may pass focus to window
                //            clearDom(this.$editor.dom);
            }
            this.editorEl = null;
            this.cellEditing = null;

            if (this.isSelectable(this.currentTDCell)) {
                //还原wei的，原来不知道，这里如果格子大小变了的话（.html(), 不好检测），就需要重设边框了。
                this.dealWithBorder(this.currentTDCell);
            }

            return true;
        },

        /**
         *
         * @param col
         * @param row
         * @returns {jQuery}
         * @private
         */
        _get$TDCell: function (col, row) {
            if (row != null) {
                col = {col: col, row: row};
            }
            if (typeof col == 'object') {
                col = FR.columnRow2CellStr(col);
            }

            // alex:太诡异了,从全局取居然比从this.$table中取要快~~ TODO to find out why~
            // carl：不能全局，否则就搜到parameterPane那去了
            // denny: tracker@953, 全局直接id效率高的原因是可以直接getElementById,否则需要遍历
            var cell = $('#' + col + "-" + this.idx + "-" + this.tableID);
            if (cell == null) {
                cell = $('td[position*=' + '\'' + col + "-" + this.idx + '\']', this.$table);
            }

            return cell;
        },

        /**
         *
         * @param col
         * @param row
         * @returns {*}
         */
        getTDCell: function (col, row) { //alex:可以传一个参数{col:1,row:2}或"A1",也可以传两个参数1,2
            var $res = this._get$TDCell(col, row);
            if ($res != null && $res.length > 0) {
                return $res[0];
            }

            return null;
        },

        moveTDCell: function (direction) {
            if (this.currentTDCell == null) {
                return;
            }
            // alex:如果正在移动,直接return(报表大了,遍历也是挺费时的)
            if (this.__moving__ === true) {
                return;
            }
            this.__moving__ = true;

            var self = this;
            if (this.lastRow == null) {
                var trs = this.$table.find('tbody:eq(0)').children().filter('tr[id]');
                var lastTR = trs.eq(trs.length - 1)[0];
                this.lastRow = lastTR && lastTR.id ? parseInt(lastTR.id.split("-")[1]) : 0;
            }
            if (this.lastCol == null) {
                this.lastCol = 0;
                this.$table.find("tbody:eq(0)").children().each(function () {
                    var tds = $(this).children().filter('td[id]');
                    var lastTd = tds.eq(tds.length-1)[0];
                    if (lastTd && lastTd.id) {
                        self.lastCol = Math.max(self.lastCol, FR.id2ColumnRow(lastTd.id).col);
                    }
                });
            }

            var cr = FR.id2ColumnRow(this.currentTDCell.id);
            var row = cr.row;
            var column = cr.col;

            var tc = column;
            var tr = row;
            var tdCell = null;

            switch (direction) {
                case LEFT:
                    while (!this.isSelectable(tdCell) && tc >= 1) {
                        tc--;
                        tdCell = this.getTDCell(tc, tr);
                    }
                    break;

                case RIGHT:
                    tc += this.currentTDCell.colSpan - 1;
                    tdCell = this._moveRight(tdCell, tc, tr);
                    break;
                case UP:
                    while (!this.isSelectable(tdCell) && tr >= 1) {
                        tr--;
                        tdCell = this.getTDCell(tc, tr);
                    }
                    break;

                case DOWN:
                    tr += this.currentTDCell.rowSpan - 1;
                    tdCell = this._moveDown(tdCell, tc, tr);
                    break;
            }
            if (this.isSelectable(tdCell)) {
                this.selectTDCell(tdCell);
                if (this.writePane.editOnMove) {
                    this.editTDCell(tdCell);
                }
            }

            this.__moving__ = false;
        },

        _moveRight: function (tdCell, col, row) {
            var startCol = col, startRow = row;
            while (!this.isSelectable(tdCell)) {
                // move right
                if (col < this.lastCol) {
                    col++;
                    // move down
                } else if (row < this.lastRow) {
                    col = 0;
                    row++;
                    // move to start
                } else {
                    col = 0;
                    row = 0;
                }
                if (col == startCol && row == startRow) {
                    return null;
                }
                tdCell = this.getTDCell(col, row);
            }
            return tdCell;
        },

        _moveDown: function (tdCell, col, row) {
            var startCol = col, startRow = row;
            while (!this.isSelectable(tdCell)) {
                // move down
                if (row < this.lastRow) {
                    row++;
                    // move top
                } else if (col < this.lastCol) {
                    row = 0;
                    col++;
                    // move to start
                } else {
                    col = 0;
                    row = 0;
                }
                if (col == startCol && row == startRow) {
                    return null;
                }
                tdCell = this.getTDCell(col, row);
            }
            return tdCell;
        },

        previewAttachment: function (target, attach) {
            var self = this;

            function download(e) {
                window.open(FR.servletURL + "?op=fr_attach&cmd=ah_download&id="
                    + e.data);
                e.stopPropagation();
            }

            function addDownloadAllButton(target, attachid, isImage) {
                var top = target.parent()[0].offsetTop;
                var width = parseInt($(target[0]).attr('widgetwidth'));
                var $button = $('<div class = "fr-fileupload-download-all">').appendTo(target);
                if (isImage) {
                    $button.css({
                        top: top + self.getSCOffsetTop() + etadjst - 2,
                        left: target[0].offsetLeft + self.getSCOffsetLeft()
                            + eladjst - 18 + width
                    })
                }
                $button.click(function (e) {
                        window.open(FR.servletURL
                            + "?op=fr_attach&cmd=ah_download&id=" + attachid);
                        e.stopPropagation();
                    });
            }

            FR.lastTarget = target;
            var $target = $(target);
            $target.css("background-image", "");
            var showImage = false;
            if (attach.attach_type == 'image') {
                var id = $target[0].id;
                if (id && id.split("-").length > 0) {
                    var cr = id.split("-")[0];
                    var widget = contentPane.getWidgetByCell(cr);
                    if (widget && $.isFunction(widget.isShowViewImage)) {
                        showImage = widget.isShowViewImage();
                    } else {
                        showImage = true;
                    }
                }
            }
            if (showImage) {
                // 多文件的时候attach是数组 单文件并且是图片的时候默认显示图片背景
                var im_url = FR.servletURL + '?op=fr_attach&cmd=ah_image&id=' + attach.attach_id;
                $target.css('background', 'url(' + im_url + ") 0 0 no-repeat transparent");
                $target.css("cursor", "default").unbind("click", download);
                addDownloadAllButton($target, attach.attach_id, true);
            } else {
                $target.empty();
                var table = $("<table cellspacing='0' >")
                    .appendTo(($("<div />")
                        .appendTo($target)));
                var colGroup = $('<colgroup/>').appendTo(table);
                var w = $(target).width(), h = $(target).height();
                var wb = 18;
                colGroup.append($('<col col="0"/>').width(w-wb))
                    .append($('<col col="1"/>').width(wb));
                var trr = $("<tr />").height(h)
                    .appendTo($("<tbody>")
                        .appendTo(table));
                var tdd  = $("<td />").appendTo(trr);
                var tdd2 = $("<td style='vertical-align:top'>").appendTo(trr);
                if ($('.attach-download-div,.fr-fileupload-download-all',
                    $target).length !== 0) {
                    $('.attach-download-div,.fr-fileupload-download-all',
                        $target).remove();
                }
                var td = $("<td>")
                    .appendTo($("<tr>")
                        .appendTo($("<tbody>")
                            .appendTo(($("<table cellspacing='0' >")
                                .appendTo(($("<div class = 'attach-download-div'>").width(w-wb)
                                    .appendTo(tdd)))))));
                if (FR.isArray(attach)) {
                    var id = "";
                    for (var i = 0; i < attach.length; i++) {
                        var dup = 0;
                        var tempName = attach[i].filename;
                        for (var j = 0; j < i; j++) {
                            if (attach[i].filename === attach[j].filename) {
                                dup++;
                            }
                        }
                        if (dup > 0) {
                            tempName = FR.lengthenFileName(attach[i].filename, "(" + dup + ")");
                        }
                        td.append($("<span class='fr-attach-download'>"
                            + tempName + " </span>").bind(
                                'click', attach[i].attach_id, download));
                        id += attach[i].attach_id;
                        if (i != attach.length - 1) {
                            id += ".";
                        }
                    }
                    addDownloadAllButton(tdd2, id);
                } else {
                    td.append($("<span class='fr-attach-download'>"
                        + attach.filename + " </span>").bind('click',
                            attach.attach_id, download));
                }
                if ($.browser.msie) {
                    $(".fr-attach-download").css({'font-size': '12px'});
                }
            }
        },
        /*
         * 把值显示在TD里面
         *
         * cv 可以是 {text, value},就直接显示text, 也可以是一段字符串,则根据dict的有无来判断是否要用dict处理一下
         */
        displayTDCell: function (tdCell, cv, presentValue) {
            var $tdCell = $(tdCell);
            //b:widget状态只需显示控件
            if (this.showAsWidget($tdCell)) {
                return;
            }
            // carl : 隐藏的单元格不显示
            if ($tdCell.is('.cehide')) {
                return;
            }

            var self = this;
            //内部处理，定义这个主要是方便做ajax操作
            var formatAndSetContent = function (dp) {
                if (typeof dp == 'string') {
                    if (dp && dp.indexOf('\n') != -1) {
                        dp = dp.replace(/ /gi, "&nbsp;");
                    }
                    dp = dp.replace(/\n/gi, "<br/>");
                }
                // alex:再用格式处理显示值
                var fmt = $tdCell.attr('fmt');
                if (fmt == null && (cv instanceof Date || $tdCell.attr('editor') == "date")) {
                    fmt = 'DMM/dd/yyyy';
                }
                // jim:41954 自定义公式生成的图片，在填报重新计算时，显示新的图片
                if (!FR.isEmpty(dp) && dp.src != null) {
                    var url = dp.src;
                    $tdCell.html(null);
                    var $image = $("<img src='" + url + "'/>").css('border-width', 0);// ie 强制0
                    $image.appendTo($tdCell);
                }

                // alex:{attach_type, attach_id},表示一个附件
                else if (!FR.isEmpty(dp) && dp.attach_type != null && dp.attach_id != null) {
                    self.previewAttachment($tdCell, dp);
//                    $tdCell.empty();
                }
                //wei : 对多文件的处理
                else if (FR.isArray(dp) && dp.length > 0 && dp[0].attach_type != null && dp[0].attach_id != null) {
                    self.previewAttachment($tdCell, dp);
                } else {
                    if ($tdCell.is('.celink')) {
                        var link_span = $('.linkspan', $tdCell)[0];
                        if (link_span) {
                            $(link_span).html(FR.contentFormat(dp, fmt));
                        }
                    } else {
                        // richer:这里涉及到换行符，要把"\n"转换为"<br/>"所以用html()
                        var content = FR.contentFormat(dp, fmt);
                        //wei : 水印显示在单元格上
                        var editor = FR.jsonDecode($tdCell.attr('editor'));
                        var oldTdCellColor = $tdCell.css('color');
                        FR.$defaultImport('/com/fr/web/core/js/jquery.watermark.js', 'js');
                        if (content == '' && editor.watermark) {
                            $tdCell.text(editor.watermark).css('color', $tdCell.getwatermarkcolor());
                            $tdCell.addClass('watermarkCell');
                        } else {
                            $tdCell.removeClass('watermarkCell');
                            if ($tdCell.attr("showashtml") === "true" || content.indexOf("<br/>") !== -1) {
                                $tdCell.html(content);
                            } else {
                                if (editor.type == 'text') {
                                    content = content.replace(/ /gi, "&nbsp;");
                                    $tdCell.html(content);
                                } else {
                                    $tdCell.text(content);
                                }
                            }
                            // ie标准是 "rgb(204, 204, 204)" ie杂项是"rgb(204,204,204)"
                            if (oldTdCellColor && (oldTdCellColor == $tdCell.getwatermarkcolor()
                                || oldTdCellColor.replace(/ /g, '') == $tdCell.getwatermarkcolor().replace(/ /g, ''))) {
                                $tdCell.css('color', '');
                            } else {
                                $tdCell.css('color', oldTdCellColor);
                            }
                        }
                    }
                }
            };

            // BUG0001372 填报中下拉框选值无法显示正确
            if (FR.isArray(cv)) {// james：如果cv是Array的话，那么目前的情况就是复选框会出现这样的结果，其他的编辑器目前全部是只返回一个值
                if (cv[0] && cv[0].attach_id != null && cv[0].attach_type != null) {
                    content = cv;
                } else {
                    var delimiter = ',';
                    //wei : 树  // 复选树
                    if (cv[0] instanceof Array) {
                        delimiter = ';';
                    }
                    var content = '';
                    if ($tdCell.is('.presentable')) {   //august:做形态判断
                        // shoc 到这里的可能是下拉复选框 复选框组 单选树 复选树, 树的值要做整体处理,不然如果用公式形态treelayer的话不好搞
                        var editorAttr = FR.jsonDecode($tdCell.attr('editor'));
                        if (editorAttr && editorAttr.type == "treeComboBox" && !editorAttr.mutiSelection) {
                            content = this.present($tdCell, cv);
                        } else {
                            for (var i = 0; i < cv.length; i++) {
                                if (i !== 0) {
                                    content += delimiter;
                                }
                                content += this.present($tdCell, cv[i]);
                            }
                        }
                    }
                    else {
                        for (var i = 0; i < cv.length; i++) {
                            if (i !== 0) {
                                content += delimiter;
                            }
                            content += cv[i];
                        }
                    }
                }
                formatAndSetContent(content);
            } else {
                // alex:如果有present,要到服务器上去问一下,present之后是什么东西
                if ($tdCell.is('.presentable')) {
                    // 假如已经给计算了的，就直接用不需要再去服务器算了
                    if (presentValue) {
                        cv = presentValue;
                    } else {
                        cv = this.present($tdCell, cv);
                    }
                }

                formatAndSetContent(cv)
            }
        },

        /*
         * alex:作形态处理
         */
        present: function ($tdCell, cv) {
            // richer:记录关联格子信息
            var depO = {};
            var dep = FR.jsonDecode($tdCell.attr("presentDep"));
            var self = this;
            if (dep) {
                $.each(dep, function (i, item) {
                    var cell = item.toUpperCase().startWith("$") ? item.toUpperCase().substring(1) : item.toUpperCase();
                    depO[cell] = self.getCellValue(cell);
                });
            }
            FR.ajax({
                url: FR.servletURL + "?sessionID=" + this.writePane.currentSessionID,
                // james:BUG0003031
                data: $.extend({
                    op: "fr_write",
                    cmd: 'write_present',
                    value: cv,
                    dependence: depO}, FR.id2Location($tdCell.attr("id"))),
                async: false,
                complete: function (res, status) {
                    if (status == 'success') {
                        cv = FR.jsonDecode(res.responseText);
                    }
                }
            })

            // jsonDecode在705被改成可能返回空Object web端present怎么也不该返回这个东西
            // $.isEmptyObject("2")结果为true。。。
            return (typeof cv == 'object' && $.isEmptyObject(cv)) ? "" : cv;
        },

        // API的提供的行列都从1开始
        //wei:得到单元格的行号
        getTDRow:function (td) {
            var cr = FR.id2ColumnRow($(td).attr('id'));
            return cr ? (cr.row + 1) : -1;
        },
        //wei:得到单元格的列号
        getTDCol:function (td) {
            var cr = FR.id2ColumnRow($(td).attr('id'));
            return cr ? (cr.col + 1) : -1;
        },

        /**
         * 隐藏选中的黑框
         */
        hideSelectFrame: function() {
            this.$fD.ftop.css('display', 'none');
            this.$fD.fleft.css('display', 'none');
            this.$fD.fbottom.css('display', 'none');
            this.$fD.fright.css('display', 'none');
            this.$fD.fdot.css('display', 'none');
        }
    }
}());

//RowHelper提供插入行时的一些方法
FR.WLGP.RowHelper = {};
FR.WLGP.RowHelper.compare = function (colRow, row) {
    if (colRow.row > row) {
        return 1;
    }
    if (colRow.row < row) {
        return -1;
    }
    if (colRow.row == row) {
        return 0;
    }
};
FR.WLGP.RowHelper.add4CellStr = function (cellStr, len) {
    var colRow = FR.cellStr2ColumnRow(cellStr);
    colRow.row = colRow.row + len;
    return FR.columnRow2CellStr(colRow);
};
FR.WLGP.RowHelper.compare4CellStr = function (cellStr, row) {
    var colRow = FR.cellStr2ColumnRow(cellStr);
    return FR.WLGP.RowHelper.compare(colRow, row);
}
FR.WLGP.RowHelper.add4TrId = function (id, len) {
    var idArray = id.split("-");
    idArray[1] = len + parseInt(idArray[1]);
    return idArray.join("-");
};


$.extend(FR, {
    /*
     * 设置TDCell的值
     */
    setCellValue: function (tdCell, val) {
        if (val instanceof Date) {
            val = {date_milliseconds: val.getTime()}
        }
        $(tdCell).attr('cv', FR.jsonEncode(val));
    },

    /*
     * 获取TDCell的值
     */
    getCellValue: function (tdCell) {
        var json_cv = $(tdCell).attr('cv');
        // richer:没有值的时候直接返回空字符串,不要返回null
        if (json_cv == null) {
            return "";
        } else {
            return FR.jsonDecode(json_cv);
        }
    },

    /**
     * 调整对应行的行高，为冻结服务
     */
    modifyRowHeightAfterContentChange: function ($tr, oriHeight) {
        //不同table中相同id的元素用jquery取的话，chrome能取全部，ie67只能取第一个
//        var $trs = $("tr #"+$tr[0].id);
        if ($tr.length === 0 || $tr[0].id === null || $tr[0].id == undefined) {
            return;
        }
        var index = $tr[0].id.substring($tr[0].id.indexOf('-') + 1, $tr[0].id.lastIndexOf('-'));
        var $trs = $("tr [tridx='" + index + "']");
        var dif = ($tr.isVisible() ? $tr.height() : 0) - oriHeight;
        var hasVerticalBorder = function ($tr) {
            for (var i = 0; i < $tr.children().length; i++) {
                if ($tr.children().eq(i).border().top + $tr.children().eq(i).border().bottom > 0) {
                    return true;
                }
            }
        }
        if ($trs && $trs.length > 1) {
            for (var i = 0; i < $trs.length; i++) {
                var tmpTr = $trs.eq(i);
                if (!tmpTr.isChildAndSelfOf($tr) && tmpTr.isVisible()) {
                    if ($.browser.msie && $.browser.version < '8.0'
                        && hasVerticalBorder($tr) && hasVerticalBorder(tmpTr)) {
                        dif = dif - 1;
                    }
                    tmpTr.height(tmpTr.height() + dif);
                }
            }
        }
    }
});

//for ios
function onBridgeReady(event) {
    contentPane.bridge = event.bridge;

    FR.MobileTools.doWaitingTODO();

    contentPane.bridge.init(function(message) {
		contentPane.writeReport(0);
	});
}
if (FR.isMobile()) {
    document.addEventListener('WebViewJavascriptBridgeReady', onBridgeReady, false);
}

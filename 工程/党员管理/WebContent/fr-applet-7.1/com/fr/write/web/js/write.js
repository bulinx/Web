/*
 * Copyright (c) 2001-2014,FineReport Inc, All Rights Reserved.
 */

/**
 * �����ҳ������пؼ������¼����ṩ���������ȡ�
 * @class FR.Write
 * @extends FR.OB
 */
FR.Write = FR.extend(FR.OB, /**@class FR.Write*/{
    _init: function () {
        //b:��ʼ��ֻ��ʼwidget
        FR.Write.superclass._init.apply(this, arguments);

        /**
         * @property {Map} location_widgets λ�úͿؼ���ɵļ�ֵ�Լ���
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
     * Widget�������
     */
    WidgetMgr: {
        DependenceMgr: {
            //������location -> ����location���飬A2,A3�ؼ�����A1�ؼ�����dependenceMap["A1"]->["A2","A3"]
            _dependenceRelationMap: {},
            //location -> boolean,�������������ԵĿؼ���û�г�ʼ��
            _dependenceInitedMap: {},
            //��Ҫ�������������ϵ�ġ���Ҫ�Ǵ�widget���Ե��絥ѡ��ť�顣
            _shouldInitAtOnce : [],
            /**
             * ���������ϵ
             * @param location �������Ŀؼ�λ��
             * @param dependenceLocation ���������Կؼ���λ��
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
             * ��ȡ������ϵ
             * @param location �������Ŀؼ�λ��
             * @returns {*} ���ش��������Կؼ���λ������
             */
            getDependenceRelation:function(location){
                if (typeof location === "string") {
                    location = location.toUpperCase();
                }
                return this._dependenceRelationMap[location];
            },
            /**
             * ��ʶ�Ѿ���ʼ��
             * @param location ���������Կؼ���λ��
             */
            setInited:function(location){
                this._dependenceInitedMap[location]=true;
            },
            /**
             * �ж��Ƿ��ʼ��
             * @param location ���������Կؼ���λ��
             * @returns {boolean} �Ƿ��ʼ��
             */
            isInited:function(location){
                return !FR.isNull(this._dependenceInitedMap[location]);
            },

            /**
             * ���Ҫ��ʼ��������ϵ�Ŀؼ�
             * @param location �ؼ�
             */
            addWidgetShouldInitDependence:function(location){
                this._shouldInitAtOnce[this._shouldInitAtOnce.length] = location;
            },

            /**
             * ��ȡҪ��ʼ��������ϵ�Ŀؼ�
             * @returns {*}
             */
            getWidgetShouldInitDependence:function(){
                return this._shouldInitAtOnce;
            }

        }
    },
    /**
     * ���ؼ�ע�ᵽ�ؼ�λ�ü���(location_widgets)�Ϳؼ�������(name_widgets)��ȥ
     * @param {FR.Widget} editor Ҫע��Ŀؼ�
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
     * ��Ԫ���ʼ���ؼ������¼�������ѳ�ʼ����
     * @param $dom {$} ��Ԫ��DOMԪ��
     */
    addWidget: function ($dom) {
        // richie:���һ�����dom�ڵ��ϵĿؼ��Ѿ���ʼ��
        $.data($dom, "__initialized__", true);
        this.addLocationWidget($dom, FR.jsonDecode($dom.attr('widget')));
    },

    addWriteWidget: function ($dom) {
        this.addLocationWidgetWithoutWriteEvent($dom, FR.jsonDecode($dom.attr('editor')));
    },

    /**
     * ��Ԫ���ʼ���ؼ���ֻ��ָ��DOM�����ɿؼ��������¼���
     * @param {jQuery} $dom ��Ԫ��DOMԪ��
     * @param {JSON} editorConfig �ؼ���������
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
     * ��Ԫ���ʼ���ؼ������¼�
     * @param {jQuery} $dom ��Ԫ��DOMԪ��
     * @param {JSON} editorConfig �ؼ�����������
     */
    addLocationWidget: function ($dom, editorConfig) {
        this.addLocationWidgetWithoutWriteEvent($dom, editorConfig);

        if (editorConfig.location) {
            this.widgetOnWriteEvent(this.location_widgets[editorConfig.location]);
        }
    },

    /**
     * ���ؼ���ӽ��ؼ���������
     * @param {String} widgetName �ؼ���
     * @param {FR.Widget} widget �ؼ�
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
     * Ϊ�ؼ����¼�
     * @param {FR.Widget} widget �ؼ�����
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
            // ����У��ɹ���񣬶�Ӧ��ִ��fireCellValueChange����ȻgenerateReportXML��ֵ����ʵ��ֵ��һ��
            _g(this.options.sessionID).curLGP.fireCellValueChange(_g(this.options.sessionID).curLGP.getWidgetCell(this), this.getValue());
            if (!this.isValidate()) {
                FR.Msg.toast(this.getErrorMessage());
                return false;
            }
        });
    },
    /**
     * ���������ķ���
     * @param variable {*} ��������
     * @returns {*}
     */
    resolveVariable: function (variable) {
        if ($.isFunction(this.options.resolveVariable)) {
            return this.options.resolveVariable(variable);
        }
    },

    /**
     * ���ݵ�Ԫ��λ�û�ȡ��Ԫ���еĿؼ�
     * @param {String} location ��Ԫ���λ�ã���C2��A7
     * @param {FR.Widget[]} widgets �ؼ����ϣ��ò�������Ҫ
     * @returns {FR.Widget} �ؼ�
     */
    getWidgetByCell: function (location,widgets) {
        if (!this.location_widgets || !location) {
            return null;
        }
        return this.location_widgets[location] || this._findLocationWidget(location,widgets);
    },

    /**
     * ���ݿؼ����ֻ�ȡ�ؼ�
     * @param {String} name Ҫ��ȡ�Ŀؼ������еĿؼ���
     * @returns {FR.Widget} �ؼ�
     */
    getWidgetByName: function (name) {
        if (!name) {
            return null;
        }
        name = ((name.indexOf("$") !== 0) ? '$' + name : name).toUpperCase();
        // �����ȴ����еĿ�ʼ�� �������ξͲ���ͬһ���˶�����
        return (FR.isArray(this.name_widgets[name]) ? (this.name_widgets[name])[0] : this.name_widgets[name])
            || this._findNameWidget(name);
    },

    /**
     * ���ݿؼ�����ȡ����ͬһ���ֵĿؼ�����ļ���
     * @param {String} name Ҫ��ȡ�Ŀؼ������еĿؼ���
     * @returns {FR.Widget[]} �ؼ�����
     */
    getWidgetsByName: function (name) {
        if (!name) {
            return;
        }
        name = ((name.indexOf("$") !== 0) ? '$' + name : name).toUpperCase();
        // �����ȴ����еĿ�ʼ�� �������ξͲ���ͬһ���˶�����
        return this.name_widgets[name] || this._findNameWidget(name, true);
    },

    _findTDByLocation: function(location){
        return $('td[id^='+location+'-]', this.options.renderEl);
    },

    /**
     * �������ؼ��������ҵ�ָ����Ԫ��λ�õĿؼ�
     * @param {String} location ��Ԫ���λ��
     * @param {Array} widgetsSrc �ؼ�����
     * @returns {FR.Widget} �����ҵ��Ŀؼ�
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
                    //b:̫��Ť�ˣ��Ժ��widgetֱ��resize����
                    //��ȡoffsetWidth�ᵼ��reflow,�������ʼ����һ�㶼��resize����ʱȥ����������ʲô����
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
     * ��ʼ�������ؼ�
     * @param key DependenceMgr��relationMap�еļ��������ǿؼ�λ�û��߿ؼ�����
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
     * ��ʼ�������ؼ�
     * @param dependenceRelation �����ؼ���λ������
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
            // richer:����������õ���WLGP���¼������������ģ�����Ҫ������ѭ��
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
     * �Ѵ���editor���ԵĿؼ�config��������
     * @private
     */
    _cacheEditorConfig: function () {
        this.editorConfig = [];
        var widgets = $('td[editor]', this.options.renderEl);
        for (var i = 0, len = widgets.length; i < len; i++) {
            var config = FR.jsonDecode($(widgets[i]).attr('editor'));
            // ɾ���еľ�ȥ��
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
                         //b:̫��Ť�ˣ��Ժ��widgetֱ��resize����
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
    // ���������ʱ��Ӱ��Ч�� �ĳ���ɾ��ֻ�ı��Ӧ���еĿؼ��ȽϺ���
    refreshWidget: function() {

    }
});
$.shortcut("fr_write", FR.Write);

/**
 * ��ؼ��Ľӿڣ�Ϊ���ʹ�õĿؼ���ӹ����ĺ�������ť����ѡ��֮��ļ�ʱ��ʾ�Ŀؼ�����Ҫ�̳д���
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
     * ��dom�и��Ʋ�����ʽ���༭���Ա�֤�༭����ʽ�͸�����ʽ��һ����
     * @param dom Ҫ������ʽ��dom
     */
    cssFrom: function (dom) {
        if (!this.editComp) {
            return;
        }
        var $dom = $(dom);

        var $comp = this.editComp;

        //wei:���ﲻ֪��ΪʲôҪremove��ԭ�ȵ�class�����¿ؼ���ʼ�Զ������ʽ�ʱ��Ч��
        $comp.addClass($dom.attr("class"));
        //$comp.removeClass().addClass($dom.attr("class"));
        // alex:����$dom�Ĳ���style
        $.each(['fontFamily', 'fontVariant', 'fontStyle', 'fontWeight', 'fontSize',
            'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'backgroundColor'], function (idx, el) {
            $comp.css(el, $dom.css(el));
        })
        if ((/transparent|rgba\(0, 0, 0, 0\)/).test($comp.css('backgroundColor'))) {
            $comp.css('backgroundColor', 'white')
        }
    },

    /**
     * �жϿؼ����ڵĸ����Ƿ񱻱༭��
     * @returns {boolean}  �༭���򷵻�true�����򷵻�false
     */
    isDirty: function () {
        return this.isWriteDataChanged();
    },

    /**
     * ��ԭֵ����ֵ���бȽϣ��жϸÿؼ��Ƿ������ֵ�ĸĶ�
     * @returns {boolean}  ���ֵ�Ķ��˷���true�����򷵻�false
     */
    isWriteDataChanged: function () {
        return this.options.oldValue == null || !FR.equals(this.options.oldValue, this.getValue());
    },

    /**
     * ���ÿؼ���ֵ������ԭֵ�����Ƚ�
     * @param value ��ֵ
     * @param shouldFireEvent �Ƿ���Ҫ�����ؼ��ı༭����¼�
     * @returns {*}
     */
    setValue4Write: function (value, shouldFireEvent) {
        this.options.oldValue = value;
        return this.setValue(value, shouldFireEvent);
    },

    /**
     * ��ʼ�༭
     */
    startEditing: function () {
    },

    /**
     * �����༭
     */
    stopEditing: function () {
    },

    /**
     * ���ÿؼ���ֵ�����������
     */
    reset: function () {
        this.setValue("");
    }
});
$.shortcut("writeEditor", FR.WriteEditor);

/**
 * ���ʹ�õĿؼ�����FR.WriteEditor�����еĺ����������ڼ̳нӿ�
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
        selectMethod: 'editable', //��ѡֵall, editable��ʾ���и��Ӷ���ѡ�л��editable���Ӳ���ʹ��
        selectedIndex: -1, // alex:��ǰѡ�е�WLGP�����
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
         * alex:��ʼ��ContentPane
         */
        initContentPane: function () {
            //alex:����write.css
            FR.$defaultImport('/com/fr/write/web/css/write.css', 'css');
            if (this.options["writeCss"]) {
                $.each(this.options["writeCss"], function (i, item) {
                    FR.$import(item, 'css');
                });
            }
            var tabPane = this.$contentPane.data("TabPane");
            var self = this;
            if (tabPane) {//james��TabPane
                tabPane.on(FR.Events.TABCHANGESTART, function () {
                    if (self.curLGP) {
                        self.stopEditing();
                        if ($('div.verify-error-info:visible', FR.$view_container).length > 0) {
                            $('div.verify-error-info:visible', FR.$view_container).hide();
                        }
                    }
                });
                //james����TabPane��tabchange�¼�
                tabPane.on(FR.Events.TABCHANGE, function (tabPane, tabIndex) {
                    self.selectedIndex = tabIndex;
                    self.fireEvent(FR.Events.TABCHANGE, tabPane, tabIndex);
                });
                //james������ǰ��FormPane��tabchange�¼��������������ִ��tabchange������
                this.on(FR.Events.TABCHANGE, function (tabPane, tabIndex) {
                    if (self.delay) {
                        return;
                    }

                    self.selectedIndex = tabIndex;
                    var lgp = self.lgps[tabIndex];
                    if (lgp.loaded === false) {
                        lgp.loadLGPPane();
                    } else {
                        // Carl�������ô�ܲ���
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
                    // ���ҳ,��Ŀ��sheet��ҳ����Ϣ���ݸ�writePane,fire(afterload)Ϊ�˸��¹�������ҳ��
                    if (self.options["cutpage"] == 'v' || self.options["cutpage"] == 'w') {
                        self.currentPageIndex = lgp.currentPageIndex;
                        self.reportTotalPage = lgp.reportTotalPage;
                        self.fireEvent(FR.Events.AFTERLOAD);
                    }
                });

                var tabs = tabPane.options.tabs;//james����ȡtabs�ĸ���
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

            // ��ʼ��ճ������
            $("body").append("<div style='position:absolute;left:-1000px;top:-1000px;'><textarea id='cpTextArea' onkeyup='this.blur()'></textarea></div>");

            /**
             * ҳ��ת��ʱ��ʾ,��֧��opera
             */
            window.onbeforeunload = this.beforeUnloadCheck.createDelegate(this);

            // ��ֹbackspace��ת.
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
         * ��ʼ����ContentPane
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

            // �Ƿ���Ҫ���¼��ص�ǰsheet�����sheet
            if (reloadOthers !== false) {
                $.each(this.lgps, function (idx, lgp) {
                    lgp.loaded = false;
                });
            }
            if (this.curLGP == null) {
//                this.curLGP = this.lgps[0];
//                this.selectedIndex = 0;
                // ���ҳ�滹û��ʼ���� �л����ڶ���sheet �ٵ��ѯ��ť����ҳ�� ��Ҫload�ڶ���sheet
                if (this.selectedIndex > 0) {
                    this.curLGP = this.lgps[this.selectedIndex];
                } else {
                    this.curLGP = this.lgps[0];
                    this.selectedIndex = 0;
                }
            }
            this.delay = false;
            this.curLGP.loadLGPPane();
            //b:������ɺ�,����
            if (this.$contentPane.data("TabPane")) {
                this.fireEvent(FR.Events.SCROLLCHANGE, this.$contentPane.data("TabPane"), 0);
            }
        },

        // carl:��sheet��reload  fec:reload����Ҫһ��ʼselect�ĸ���
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

        // ��ǰsheet���¼���
        reCalCurLGPPane: function() {
            if (this.lgps == null || this.lgps.length === 0 || this.curLGP == null) {
                return;
            }
            var self = this;
            // �����ڿؼ��༭�����¼���ִ�� ��ʱһ�µȴ�dirty״̬
            setTimeout(function() {
                // ��û��������ݵĻ�Ҫ�ȱ����� �����ͬ����
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
         * ��ȡ��Ԫ���ֵ
         * @param {json} o
         * {<br/>
         *     reportIndex:rpIdx,   // sheet���<br/>
         *     columnIndex:colIdx,  // �������ڵ������<br/>
         *     rowIndex:rowIdx      // �������ڵ������<br/>
         * }
         * @returns {*}
         */
        getCellValue: function (o) {
            var config = {};
            // �����ϵĲ���
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
         * �������ֻ�ȡ�����ؼ����������ͬ���ֵĿؼ���ֻȡ���һ��
         * @param name �ؼ�������
         * @returns {FR.Widget} ָ�����ֵĿؼ�
         */
        getWidgetByName: function (name) {
            return this.curLGP.write.getWidgetByName(name);
        },

        /**
         * ���ݵ�Ԫ���Ż�ȡ�ؼ�
         * @param cell  �ؼ����ڵĵ�Ԫ��ı��
         * @returns {FR.Widget}   ִ�и����еĿؼ�
         */
        getWidgetByCell: function (cell) {
            return this.curLGP.write.getWidgetByCell(cell);
        },

        /**
         * �������ֻ�ȡ�ؼ�
         * @param name  Ҫ��ȡ�Ŀؼ�������
         * @returns {Array} ���о���ָ�����ֵĿؼ���ɵ�����
         */
        getWidgetsByName: function (name) {
            return this.curLGP.write.getWidgetsByName(name);
        },

        /**
         * o {
         *     reportIndex:rpIdx, //sheet���
         *     columnIndex:colIdx,//�������ڵ������
         *     rowIndex:rowIdx,   //�������ڵ������
         *     value:cv           //Ҫ�����Ӹ���ֵ
         * }
         */
        setCellValue: function (o) {
            var config = {};
            //Ϊ�˼�����ǰ�Ķ����д��
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
         * ֹͣ�༭��ǰ��Ԫ��
         */
        stopEditing: function () {
            if (this.curLGP) {
                this.curLGP.stopCellEditing();
            }
        },

        /**
         * У�鲢�ύ�޸�����,�ú����ڷ�������д���˵���
         * @param isAllSheet
         * @param successFn
         * @returns {boolean}  �ύ�ɹ�����true�����򷵻�false
         */
        verifyAndWriteReport: function (isAllSheet, submitButton, successFn, failFn) {
            if (this.fireEvent(FR.Events.BVW, this) === false) {
                return false;
            }

            //wei : ���ύ��ť������
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
            // shoc:�ӳ�10msִ�У���ֹ���������ʱ��������������������ύ�ؼ�disable��ִ�У��ͻ�bug26782
            setTimeout(verify, 10);
        },

        /**
         * @Deprecated ����̫��,�����Ƽ�ʹ��
         * ʹ����μ� {@link writeReportIgnoreVerify}
         */
        writeAndVerifyReport: function (isAllSheet) {
            this.writeReportIgnoreVerify(isAllSheet);
        },

        /**
         * ����У�������Ϣ��ֱ���ύ
         * �ύ��ť��ѡУ��ʧ����Ȼ�ύִ�еķ���
         * 705ǰ��ֻ�ύ��ǰsheet ��Ϊ�ύȫ��sheet 48285
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

        // carl:��̨����
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
                    // �õ�������еĸ��ӵ�ֵ
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
                        // carl:�����ʾû����������ã���ʾ�û�����
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
         * fn�Ǳ���֮���callback
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

        //b:Ϊ�˱��ⴴ��dom��������ô����������widget��isvalidate�����ظ�Ҫ��������ؼ����������ԣ�ugly
        //hiram �Ż���һ��ʵ��
        validateWidgets: function (resultJSON) {
            var widgets = [];
            if (arguments[1] === true) {
                //wei:������curLGP���������loadLGPPane�����仯
                var currentLGP = this.curLGP;
                for (var i = 0; i < this.lgps.length; i++) {
                    //wei:��У������sheet����ôУ��ǰ�����ȼ���һ��
                    if (this.lgps[i].loaded === false) {
                        //wei:��Ϊbug2960��Ϊajax�첽�����Ƕ�sheet����ʱ��Ҫajaxͬ�������Դ��ݲ���false��ʾ�Ƿ��첽
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
                    if (typeof widget.regex == 'string') {//String��ʱ�򣬹���һ��RegExp����
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
                            // �ж�С��λ�� ȥ������
                            if (numString.startWith('-')) {
                                numString = numString.substring(1);
                            }
                            // shoc:��ѧ������������
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

        _doVerify: function (successFn, failureFn, reportIndex) {//˽�з���
            // Ҫ��stop editing
            this.stopEditing();
            // shoc:verifyǰ���Ƴ�ȫ��  bug28182
            this.remove_error(reportIndex);

            var resultJSON = [];

            var self = this;
            var params = {op: "fr_write", cmd: "write_verify"};
            // richer:�Ƿ���Ҫ����Widget��invalidate()����������У�飿
            // james����У�������������ǲ����в�����Ϊ�գ���û��cvֵ�ĸ���
            if (reportIndex != null) {
                this.validateWidgets(resultJSON);
                params = $.extend(params, {reportIndex: reportIndex});
            } else {
                this.validateWidgets(resultJSON, true);
            }

            //TODOJ ����Ҫ����һ��verify���̣�û��У��ҲҪ���������Ǻܺã����ǲ�֪����ô�ж���Ҫʹ������У���жϣ��뵽���ټ���
            doSave.call(this, {params: params, fn: function (res, status) {
                var verifyInfo = {};
                if (status == 'success') {
                    var json_array = FR.jsonDecode(res.responseText);
                    if (json_array.length > 0) {
                        $.each(json_array, function (idx, item) {
                            // �������push��reportIndexȫ���ǵ�ǰsheet�� ���� ���ں�̨���
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
                        // û������У������ ���� �Ҳ����Զ���������
                        // �ʱ�����У�鲻��ʾ������� ֻ�е���������У�����ʾ
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
                // james��pdfPrint��Ҫ��format=pdfPrint������������ʶ��Ϊ�Ǵ�ӡ״̬��
                window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=pdf&isPDFPrint=true&extype=ori";
            }
            //wei : ���������ﴥ����ӡ����ʱ�䣬ajax�첽ִ�С�
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
         * alex:����XML,ֻдDirty�ĸ��ӵ�ֵ
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
                    //alex:ȡ����Ҫedit������
                    if ($tdCell.attr('cv') != null) {//marks:�Ƿ�Ϊ��
                        var columnRow = FR.id2ColumnRow($tdCell.attr("id"))

                        xml += "<C c=\"" + columnRow.col + "\" r=\""
                            + columnRow.row + "\">";
                        xml += writeCellValue(tdCell);
                        xml += "</C>";
                    }
                });

                this.lgps[i].dirtyCell = [];

                if (saveData) {
                    // alex:����cv��Ϊnull��status��D(isDirty)��TD,//marks:��ie��cv=0����Ϊfalse������cv�Ƿ�Ϊ�յ��������洦��
                    $('td.dirty', $table).each(function (idx, tdCell) {
                        //marks:ȥcvֵ�������Ƿ�Ϊ null
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
             * alex:��һ��С��,�벻�𵱳�ΪʲôҪ�滻+Ϊ%2B��
             * ��BUG0003106��ʾ,�����ʽ����+,����%2B�滻��,�ں�̨ԭ����10+20�ͱ��10%2B20��,���޷����������ʽ��
             */
//            return xml.replace(/\+/g, "%2B");   //TODO alex:�벻��������ΪʲôҪ���滻��
            //TODOJ james:�ǲ�����Ϊ��ʽ����+��ֻ�ǲ²⡭��
        },

        // alex:frozen
        frozen: function (column, row) {
            this.curLGP.frozen(column, row);
        },

        // carl:�뿪ҳ��ʱ��������dirty���ݣ���ʾ�û��Ƿ��뿪
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
            //wei : Ϊ�˵����ť���ܵ����ļ�ѡ����ڰ�ť��λ�÷�����һ��͸�����ļ��ϴ��ؼ���
            var importExcelButton = $(button.$table);
            importExcelButton.one("mouseover", function () {
                if ($("#importexcelform").length > 0) {
                    var $uploadForm = $("#importexcelform");
                    var input = $("input", $uploadForm);
                } else {
                    var $uploadForm = $('<form enctype="multipart/form-data" id="importexcelform"></form>').appendTo("body");
                    //����excel��button��widthΪauto��input�Ŀ����Ϊbutton��������н��������Ŀ��
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
                        //neil:��ε���ͬһ��excelֵ�����bug 21287
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
                                //neil:ΪʲôҪ��ô������, ��Ϊfile�����ie������readonly��, ��������ı�ֵ, replace��
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

        // Carl�� ctrl + v ��������
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
            // alex:�ڴ���#5346ʱ,��chrome�������,���ִ�Excel���濽��������,ǰ�󶼼�һ���س���,�����trim��,Paste�ͻ��λ,������һ��
//            var rows = $.trim(value).split("\n");
            // bug42177 ���Ƶĸ�����ǰ����пհ׸� trim�˾�û�� ��chrome������
            // ��excel��ʽ�����õ����ָ�ʽ ������ܻ��һ�����з�
            if (value.startWith('\n')) {
                value = value.substring(1, value.length);
            }
            if (value.endWith('\n')) {
                value = value.substring(0, value.length-1);
            }
            /*
             * wei : ��google docs��ĵ��ӱ��һ�������ƹ�����excel����
             * �����һ���������л��е����ݣ�����(a\nb)���ƹ����ĵ���valueֵ�ᱻ��������("a\nb")������������������������
             * ����ȫ������һ�������д���������һ��ȱ�ݣ�����2���������ݷֱ�Ϊ'"a'��'b"'ʱ�����ƹ�ȥ������һ�����������û������
             * ����Ϊ������٣�������������������
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
                    //wei : ����ؼ�������disabledΪtrue����directEditΪfalse����ôCtrl+V������Ӧ�øı���ֵ��
                    var editorO = FR.jsonDecode(cell.attr("editor"));
                    var widget = contentPane.getWidgetByCell(editorO.location);
                    var cev = cols[j];
                    if (needChangeValue(cell, cev, editorO)) {
                        // TODO carl:�������ŪУ�飬���ƺ��߼�����ô�㶼���׵�����ʱ������������excel����һ�������û�����ύ��У����ˡ�~_~
                        if (typeof cev == "string" && cev.startWith("=")) {
                            this.curLGP.fireCellValueChange(cell, null, cev);
                            this.curLGP.displayTDCell(cell, "");
                        } else {
                            if (editorO.type === 'number') {
                                // ��������ֿؼ����򽫸��Ƶ�ֵת��������
                                // ���Ǵ�ǧλ�����ŵ����,ȥ��
                                if (cev) {
                                    cev = $.trim(cev);
                                    cev = cev.replaceAll(",", "");
                                }
                                // parseFloat���"4.00"���4  "4.0400"���4.04
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
                                // ճ��10%��22sdf �������ݣ��������ǰ���пո�ı���
                                // ie9֮ǰ�İ汾��֧��string��trim����
                                if (cev && cev.toString() != $.trim(ori)) {
                                    cev = null;
                                }
                                if (isNaN(cev)) {
                                    cev = null;
                                }
                            }
                            this.curLGP.fireCellValueChange(cell, cev);
                            this.curLGP.displayTDCell(cell, cev);
                            // �ͻ�bug35401 ճ�������ؼ��ı༭���¼�
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
                        // ctrl+v��һ���ؼ�����༭״̬ editTDCell������ÿؼ�oldValue��
                        // �����༭�Ļ�oldValue����Ϊ�༭ǰ��ֵ ��ճ���Ļ��Ѿ��Ǳ༭����ֵ
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

        //wei : �ṩ���û�ʹ�õ�ɾ����/����еķ�����
        deleteRows: function () {
            this.deleteReportRC.apply(this, arguments);
        },

        appendRows: function () {
            this.appendReportRC.apply(this, arguments);
        },

        /**
         * �ṩ���ӿ�ʵ�ֵ������ܽ���༭
         */
        setEditOnClick: function(editOnClick) {
            this.editOnClick = editOnClick;
        },

        /**
         * �ṩ���ӿ�ʵ�ְ����л�������������༭
         * @param editOnMove
         */
        setEditOnMove: function(editOnMove) {
            this.editOnMove = editOnMove;
        },

        /**
         * �༭�����¼��Ƿ���Ҫ�ؼ�ֵ�ı�Ŵ���
         * @param fireOnChange
         */
        setFireStopEditOnChange: function(fireOnChange) {
            this.fireStopEditOnChange = fireOnChange;
        },

        //hiram : ����ͬ��ǰ�����̨�����ݣ����ھֲ�ˢ��
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
                //wei:��¼���д�tab���±�
                if (item.reportIndex != error_tabs[error_tabs.length - 1]) {
                    error_tabs.push(item.reportIndex);
                }
                var position = '';
                function makeErrorMsg(index) {
                    var iitem = json_array[index];
                    $.each(iitem.columnrows, function (idx, item2) {
                        position += item2 + ' ';
                        var $errorCell = _g().lgps[parseInt(item.reportIndex)]._get$TDCell(item2);
                        // �����Զ��������߶��ᣬ���ӵĽṹ�������Ĳ�ͬ
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
                // �������ĸ��Ӷ�û���ڵ�ǰҳ����ô�����ʱ��Ҫ��ҳ
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

            //Sean: ʱ�临�Ӷ�O(1)
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
            // james:ִ���¼� beforeappend/delete
            if (this.fireEvent('before' + it) === false) {
                return;
            }

            this.stopEditing();
            // ��������ǰע������¼�
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
                        //hiram_write �ֲ�ˢ�´���
                        if (reObject.isReload === "false") {
                            if (reObject.cmd == "appendRow") {
                                var $table = $(reObject.insertRow);
                                var $trs = $("tr[tridx]", $table);
                                this.curLGP.appendRow(reObject.startIndex, $trs, reObject.mergeCells);
                                this.curLGP.$fec = reObject.fec;
                                this.curLGP._selectFirstTD();
                                //Sean�����»�ȡ�½��㣬��������������(ɾ��)�а�ť�󣬽����ת����ť�ؼ���ȥ��keydown��ʧЧ
                                this.curLGP.onfocus();
                                //hiram ˢ�����ݣ���ʱһ��,�ò����������ʾ������ˢ��
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
                    // james��afterappend/delete�¼�
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
                    // james��afterappend/delete�¼�
                    this.fireEvent('after' + it);
                    refreshWidgets();
                }.createDelegate(this)
            };
            var targetCells = arguments[1];
            //wei : count����ֻ����������ʱ�������壬����Ӧ��֧��deleteReportRC(targetCells)��д����
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
     * ������һЩ˽�еķ���
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
                // carl:��Ϊsqltype����ʱû��BigInteger�����Զ���BigDecimal��
            } else if (("" + value).length >= 10) {
                xtype = "BigDecimal";
            } else {
                xtype = "I";
            }
        }
        // alex:��Ϊ�Ǳ�����attr�����,���������ͺ�Attachment��value��{}��ʽ����ʾ
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
     * Ϊʲôȡ������doSave��,��Ϊajax����Ĳ��������reportXML,�������˱�Ȼ�ᱣ��һ��
     * options {
     * 		params:�˴�ajax������Ҫ�Ĳ���
     * 		fn:�˴�ajax�����callback
     * }
     *
     * doSave����ajax��ͬ������,�����첽����
     */
    function doSave(options) {
        // carl:�����ͬ��ajax���ui.dialog.js���ڸǲ�createʱ��setTimeout������ͻ������bug0002671
        // ��ʱû�кõĽ���취��������дui.dialog���ڸǡ�������һ���������ж��Ƿ��ӳ��ڸǣ���ϸ�����bug0002671����
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
            }, options.params), // Ĭ��opΪ"write_saveContent",���Ᵽ��һ������
            complete: (options.fn || FR.emptyFn).createSequence(FR.hideLoadingDialog) // alex:�ص�loadingDialog�ĶԻ���
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
 * ����߼�ҳ��
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
    var UP = 1, DOWN = 2, LEFT = 3, RIGHT = 4, EE =FR.keyCode;// KeyCode����д
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
        // �����ʱ����relative�� �ڲ��Ĳ�Ҫ����ƫ��
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

        __moving__: false, // �Ƿ������ƶ���...
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
            //shoc:  __cutpage__:v ���з�ҳ
            if (cutPage == "v" || cutPage == 'w') {
                // û��page����,˵���Ǹռ���ʱ��
                if (page == undefined || page == null || this.reportTotalPage == undefined) {
                    this.currentPageIndex = 1;
                    page = 1;
                }
                else {
                    //��Ч��ҳ�룬����
                    if (typeof page == 'number' && page > 0 && page <= this.reportTotalPage) {
                        this.currentPageIndex = page;
                        if (this.dirtyCell.length > 0) {
                            this.saveCurrentPage();
                        }
                    }
                    //��Ч��ҳ�룬��ʾ
                    else {
                        FR.Msg.toast("Invalid Page Number");
                        return;
                    }
                }
            }

            this.$container.__load__({
                url: FR.servletURL,
                timeout: 600000,
                // richer������һ��������������⻺��Ӱ��
                params: {op: "fr_write", cmd: "read_w_content",
                    sessionID: this.writePane.currentSessionID,
                    reportIndex: this.idx,
                    browserWidth: document.body.clientWidth,
                    iid: Math.random(), async: arguments[1], __cutpage__: cutPage, pn: page},
                callback: function (el, success, res, options) {
                    if (success) {
                        this.initLGPComponent();
                    } else {
                        //������ɹ��Ļ�,ҲҪ�ѱ�����Ϣд��ҳ����
                        this.$container.html(res.responseText);
                    }
                    this.writePane.curLGP = this;
                    // alex:����this.$containerΪ��ǰ��formPane.ContentContainer
                    this.writePane.$currentContentContainer = this.$container;
                    this.writePane.isLoadingPage = -1;
                    delete this.loaded;

                    //fire formPane��afterload�¼�,����this��Ϊ��������ȥ
                    this.writePane.fireEvent(FR.Events.AFTERLOAD, this);

                    /*
                     * alex:Ӧ����afterload֮����ѡ�е�Ԫ��
                     * ��Ϊ�ͻ����ܻ���afterload�¼�����Ӽ���,������cellselectʱҪ��Щ����
                     */
                    if (success) {
                        //���¼��غ󣬻������ԭ�ȵĺõ㣬���򲻽��˷Ѳ��������׳�����
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
         * ����Panel������
         */
        loadLGPPane: function () {
            var self = this;
            if (this.writePane.isLoadingPage == this.idx) {
                return;
            }

            this.dirtyCell = [];

            this.writePane.fireEvent(FR.Events.STARTLOAD);
            this.writePane.isLoadingPage = this.idx;

            // alex:����ǿ������innerHTMLΪ���ַ���,jQuery.html()���������empty(),�ܷ�ʱ��
            // �ͻ���ˢ�·��ȹ������˰�
//	    	this.$container[0].innerHTML = "";
            this.gotoPage(_g().currentPageIndex, arguments[0]);
            // �������writePaneҲ�Ӹ�gotoPage����,�ͷ�ҳԤ��ͳһ,����������ҳ�������ʹ��
            this.writePane.gotoPage = function (index, anysc) {
                self.writePane.lgps[self.writePane.selectedIndex].gotoPage(index, anysc);
            }
        },

        /*
         * ��ʼ��LGPComponent
         */
        initLGPComponent: function () {
            this.$sheet_container = $('.sheet-container', this.$container);
            // richer:�ж���Ű���layout
            if (this.isFrozen()) {
                // ���sheet�ǿɼ��Ĳ���Layout ���ɼ���ʱ��ȡ���ĳߴ綼��0
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
            //Sean: this.$glance��ѡ�пɱ༭��Ԫ��ʱ�����ڵ�Ԫ�����Ͻ�ָʾ��Ԫ��ɱ༭��Сͼ���DOM�����ԡ�
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
                        // selectTDCell˳��ִ�����editTDCell,bug31946
                        if (self.selectTDCell(tdCell) !== false) {
                            self.editTDCell(tdCell);
                        }
                    }
                }).hide();

            //hiram_write ��$glance��top,left�ȼ��뵽һ��div��
            var oldParent = this.$glance.top.parent();
            this.$glance.div = $('<div id="glanceDiv" style="position:absolute;top:0px;left:0px"><div>');
            this.$glance.div.append(this.$glance.top);
            this.$glance.div.append(this.$glance.left);
            this.$glance.div.append(this.$glance.bottom);
            this.$glance.div.append(this.$glance.right);
            this.$glance.div.append(this.$glance.img);
            //$glance.img�Ǹ���glanceDiv��ʾ�����ˣ���ʼʱ����ʾ�����Ͻǣ���Ϊ-999px��������
            this.$glance.img.css("top", "-999px");
            this.$glance.img.show();
            this.$glance.top.show();
            this.$glance.left.show();
            this.$glance.bottom.show();
            this.$glance.right.show();
            this.$glance.div.appendTo(oldParent);
            //����ˮӡdiv���Ƴ�ʱҪremoveˮӡ
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

            // ��������ʹ�õ�����û���ɵĿؼ�����ID��Ӧ�������Ŀؼ�
            this.depEditors = {};
            this.$scrollable = this.$container; // ���ù�������Ϊ$container
            this.$table = $('.x-table', this.$container);
            // denny: ����tableID, ������ʶ��Ԫ���Ψһ�ԡ�
            this.tableID = this.$table.attr("id");
            this.write = this.$sheet_container.asComponent({type: "fr_write",
                selector: 'td[widget]',
                resolveVariable: function (variable) {
                    // alex:ִ��getCellValue("B2")
                    return self.getCellValue(variable);
                }
            });
            this.write.lgp=this;
            //wei : ����ˮӡ���������ȥ��ʾ�ؼ�  + ��ʼ������
            var widgets = $('td[editor],td[widget]', this.$sheet_container);
            this._addGlanceEventAndCalculateDependence(widgets);
            var arr=this.write.WidgetMgr.DependenceMgr.getWidgetShouldInitDependence();
            for(var i=arr.length - 1; i >= 0; i--) {
                self.write._initDependenceRelationWidgetByKey(arr[i]);
            }
            //Sean: this.$fD��ѡ�пɱ༭��Ԫ��ʱ���ֵı߿��ߡ�
            this.$fD = {};
            this.$fD.ftop = $('#fDtop', this.$container);
            this.$fD.fleft = $('#fDleft', this.$container);
            this.$fD.fbottom = $('#fDbottom', this.$container);
            this.$fD.fright = $('#fDright', this.$container);
            this.$fD.fdot = $('<div/>');

            this.table_width = this.$table.find("colgroup:eq(0)").children().length;
            this.table_height = this.$table.find('tbody:eq(0)').children().length;

            // Ϊ$sheet���¼�
            // alex:����ѡ�е�ĳ�����ӽ���༭״̬,ԭ������mousedown�¼�,$editorComponent.focus����
            this.$sheet_container.click(function (e) {
                var src = e.target;
                var secell;
                // ���ܵ��˸����ڲ���ʲô��Ĭ��ѡ����

                if (!isCell(src)) {
                    var $td = $(src).parents('td:eq(0)')
                    if ($td.length > 0 && isCell($td[0])) {
                        secell = $td[0];
                    }
                } else {
                    secell = src;
                }
                // �����Ѿ�ѡ���ˣ��ͽ���༭
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
            // ��onfocus�ļ����
            //b:mousedown���жϲ��Ǻܺá�����Ȼ��combobox���ж�
            $(document).mousedown(function (e) {
                self[FR.isAncestor(self.$sheet_container[0], e.target)
                    || (FR.$view_container && FR.isAncestor(
                    FR.$view_container[0], e.target))
                    ? 'onfocus'
                    : 'unfocus']();
            });

            // carl:���ò���̫�õĴ�����ý���ʱע���¼���ʧȥ����ʱ�Ƴ��¼�
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


                // richer:��ȡ�����Ĺ�������
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

        //hiram ����glance
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
        // ѡ�е�һ����ѡ�ĸ���
        _selectFirstTD: function () {
            var fecTD;
            // carl:������û���趨����Ҫ����ѡ�ĸ���
            if (this.$fec) {
                fecTD = this.getTDCell(this.$fec);
                if (this.isSelectable(fecTD)) {
                    this.selectTDCell(fecTD);
                } else {
                    fecTD = null;
                }
            }
            // alex:ѡ�е�һ����ѡ�еĸ���
            if (!fecTD) {
                $('td.fh', this.$table).each((function (idx, td) {
                    if (this.isSelectable(td)) {
                        this.selectTDCell(td);
                        return false;
                    }
                }).createDelegate(this));
            }
        },

        //hiram ����Ķ��ǲ����оֲ�ˢ�µ�
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
            // ���ҳ�Ļ���һ�п�������һҳ��ʱ����Ҫ����һ��
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

        //��ʱ��̨��������trs�����пհ׵�Ԫ����Ӧ���Ǻϲ���Ԫ��ռ��λ�����ⲿ��ȥ��
        _clipTrs: function ($trs, mergeCells) {
            if (typeof mergeCells === "undefined") {
                return
            }
            ;
            for (var i = 0; i < mergeCells.length; i++) {
                var colName = FR.digit2Letter(mergeCells[i].col + 1);
                //conNameΪA,B..,ȥ��ĳ�����е�Ԫ��
//                $('#' + colName + "-" + this.idx + "-" + this.tableID).remove();
                $("td[id^='" + colName + "']", $trs).remove();
            }
        },
        //�ı�ָ���ĵ�Ԫ��rowspan
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
        //��write.location_widgets�е�widgets�����ƣ�start��ʼ�ƶ����У�len����
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
        //���µ�Ԫ���widget��editor�������location
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
        //hiram �����з���End


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
                //���õ�Ԫ��ֵ����Ҫ���ÿؼ�ֵ������ؼ��Ѿ���ʼ���ˣ�������setValue����������ı���editorO.value����
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
         * alex:ȡ�õ�i�е��п�
         */
        getColumnWidth: function (i) {
            if (i >= 0 && i < this.table_width) {
                // alex:ԭ��������ע�͵�������д��,����opera & safari����᷵��0,������ʵ�ʵ�width
                return parseInt(this.$table.find("colgroup:eq(0)").children(":eq(" + i + ")").css('width'))
            }
            return 0;
        },

        /*
         * alex:ȡ�õ�i�е��и�
         */
        getRowHeight: function (i) {
            if (i >= 0 && i < this.table_height) {
                return this.$table.find("tbody:eq(0)").children().eq(i).height()
            }
            return 0;
        },

        /*
         * �����¼�
         */
        _onKeyDown: function (e) {
            var k = e.keyCode;
            var curCell, editor, tmpWidget;
            curCell = this.writePane.curLGP.currentTDCell;
            if (curCell != null && $(curCell).attr('editor') != null) {
                editor = FR.jsonDecode($(curCell).attr('editor'));
                tmpWidget = contentPane.getWidgetByCell(editor.location);
            }
            // delete �� paste ��Ҫ�жϿؼ� �ؼ������û򲻿ɼ���ʱ����ֹ��
            if ((k == EE.DELETE || k == EE.BACKSPACE) || (e.ctrlKey && k === 86)) {
                if (tmpWidget && tmpWidget.options) {
                    // �ؼ����ò��ҿɼ��Ĳ���delete paste
                    if (!(tmpWidget.options.disabled === false && tmpWidget.options.invisible === false)) {
                        return;
                    }
                }
            }

            // p: delete.
            if (k == EE.DELETE || k == EE.BACKSPACE) {
                if (this.writePane.curLGP.cellEditing == null) {
                    if (tmpWidget != null && FR.getCellValue($(curCell)) !== "") {
                        // �ؼ����ò��ҿɼ��Ĳ���delete
                        if ((!tmpWidget.options) || (tmpWidget.options.disabled === false && tmpWidget.options.invisible === false)) {
                            // �ı�td����ʾֵ
                            this.writePane.curLGP.displayTDCell(curCell, "");
                            // �ı�tdCell��ֵcv
                            this.writePane.curLGP.fireCellValueChange(curCell, "", null);
                            // �ı�ؼ���ֵ editComp�ÿ�
                            tmpWidget.editComp && tmpWidget.editComp.val("");
                            tmpWidget.reset();
                            // reset()�а�����afteredit�¼�
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
                // carl���¼���ð�������������������֮���ctrl+v���Ͳ����
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
            // ��a-zA-Z0-9��ʼ�༭(alex:��keydown�¼���,����a��A����65,��keypress�¼�����ie��a������97),[96~105]���ұߵ�С���̰�������
            else if (k == EE.SPACE || k >= 48 && k <= 57 || k >= 65 && k <= 90 || k >= 96 && k <= 105 || k === 109 || k === 189 ||
                e.shiftKey && k === 187 || k === 107) {
                if (this.writePane.curLGP.cellEditing == null) {
                    this.writePane.curLGP.editTDCell(null);
                    // alex:����ǰ��ո��,�����ǿ�ʼ�༭,��Ҫ�ѿո�д���༭������
                    if (k == EE.SPACE) {
                        e.stopEvent();
                    }
                }
            } else {
                var direction = 0;

                if (this.writeShortCuts == undefined) {
                    this.writeShortCuts = !this.getWriteShortCuts();
                }

                // richer:tab������
                if (e.shiftKey && k == EE.TAB) {
                    direction = this.writeShortCuts ? LEFT : UP;
                    // shift + enter������
                } else if (e.shiftKey && k == EE.ENTER) {
                    direction = this.writeShortCuts ? UP : LEFT;
                    // tab������
                } else if (!e.shiftKey && k == EE.TAB) {
                    direction = this.writeShortCuts ? RIGHT : DOWN;
                    // enter������
                } else if (!e.ctrlKey && k == EE.ENTER) {
                    direction = this.writeShortCuts ? DOWN : RIGHT;
                    // left������
                } else if (!e.ctrlKey && k == EE.LEFT) {
                    if (this.cellEditing != null) {
                        return;
                    }
                    direction = LEFT;
                    // right������
                } else if (!e.ctrlKey && k == EE.RIGHT) {
                    if (this.cellEditing != null) {
                        return;
                    }
                    direction = RIGHT;
                    // up������
                } else if (!e.ctrlKey && k == EE.UP) {
                    direction = UP;
                    // down������
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
         * ��Ԫ��ֵ�ı��
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
            // richer:֪ͨ��Ԫ��ı�,��������
            this.fireEvent(FR.Events.CELLVALUECHANGE, $(tdCell), cv);
        },

        /**
         * ���ҳʱ�򱣴浱ǰҳ������
         */
        saveCurrentPage: function () {
            if (this.dirtyCell && this.dirtyCell.length > 0) {
                var $tmpCell = $(this.dirtyCell[0]);
                this.writePane.writeDirtyAndRemoteCal(this.idx, FR.id2ColumnRow($tmpCell.attr("id")), $tmpCell.text());
            }
        },

        /*
         * ��һ��TD���ColumnRowString
         */
        cut2ColumnRowString: function (td) {
            if (td == null) {
                return null;
            }

            var iid = $(td).attr("id");
            return iid.substring(0, iid.length - ('-' + this.idx).length - ('-' + this.tableID).length)
        },

        /*
         * ѡ��һƬtdCell,��ʱ��Ҫ���ڹ�ʽ����A1:C3�����Ķ���
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
         * ��dom tdCell�Ƿ�ɱ�ѡ��
         */
        isSelectable: function (tdCell) {
            // richer:���ֱ����ʾ�༭���ˣ��Ͳ�����Ҫ�༭����
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
            //Sean:isVisible�ķ���ֻ���жϵ�ǰԪ�ص�display�����tr���صĻ���td�жϳ������ǿɼ��ģ����������������ȡ����������ķ���
            //if (!$tdCell.isVisible()) {
            if(!$tdCell.is(':visible')){
                return false;
            }
            return this.selectMethod == 'all'
                || $tdCell.attr('editor') != null
                || $tdCell.attr('ap') != null;
        },

        /*
         * ѡ��dom tdCell,Ҳ���ǼӸ��ڱ߿�,����tdCellȷ������Ļ����ʾ��Χ��
         */
        selectTDCell: function (tdCell) {
            // richer:����������У�����ԵĻ�,У�鲻ͨ��ʱֱ�ӷ���,������Ȼ�ڵ�ǰ���������
            if (this.stopCellEditing() === false) {
                return false;
            }

            var self = this;
            this.currentTDCell = tdCell;
            $(oldSelectedCell).parent().children().removeClass("test");
            oldSelectedCell = tdCell;
            $(this.currentTDCell).parent().children().addClass("test");
            //alex:ע��,������fire writePane.event,����this.event
            this.writePane.fireEvent("cellselect", this.currentTDCell);

            if (this.isSelectable(tdCell)) {
                this.dealWithBorder(tdCell);
                if (this.$glance.tdCell == tdCell) {
                    this.$glance.div.hide();
                }
            }

            // alex:��$scrollable����
            // bug50146 Ҫע�ⶳ������
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
            // ȡ��tr,safari��chrome��td��top����Ƚ��ң�����tr�Ļ��ǱȽ�һ�µ�
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
            // carl:5������
            this.$fD.ftop.css({top: bounds.top, left: bounds.left, width: bounds.width - 2});
            this.$fD.fleft.css({top: bounds.top + 1, left: bounds.left, height: bounds.height - 4});
            this.$fD.fbottom.css({top: bounds.top + bounds.height - 3, left: bounds.left, width: bounds.width - 2});
            this.$fD.fright.css({top: bounds.top + 1, left: bounds.left + bounds.width - 3, height: bounds.height - 4});
            this.$fD.fdot.css({top: bounds.top + bounds.height - 5, left: bounds.left + bounds.width - 5});
            this.$fD.tdCell = tdCell;
            // Ҫ��fD��offsetParent��currentTDCell.offsetParent��ͬ
            var $current_offset_c = $(this.currentTDCell).parents(".offset-c:eq(0)");
            if (!FR.equals(this.$fD.ftop.parents(".offset-c:eq(0)"), $current_offset_c)) {
                // carl:��Ū�ˣ�һ��Ū��ȥ����һ�����ж���
                $current_offset_c.append(this.$fD.ftop);
                $current_offset_c.append(this.$fD.fleft);
                $current_offset_c.append(this.$fD.fbottom);
                $current_offset_c.append(this.$fD.fright);
                $current_offset_c.append(this.$fD.fdot);
            }
        },

        removeGlanceEditor: function (e) {
            //hiram_write ���Ƴ�ʱ��glanceDiv�л��������ɱ༭��Ԫ����(��������)���Ͳ�������(������Ԫ����ػ�ˮӡ)������ҳ���ػ����
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
            // ״̬��֤�ܼ�ʱ�ı䣬���Բ���ȡԭʼ����Ϣ
            var tmpWidget = contentPane.getWidgetByCell(editorO.location);
            if (tmpWidget === null || tmpWidget.options.disabled === true || tmpWidget.options.invisible === true) {
                return;
            }
            // ȡ��tr,safari��chrome��td��top����Ƚ��ң�����tr�Ļ��ǱȽ�һ�µ�


//            this.$glance.img.show().appendTo($tdCell);
            this.$glance.tdCell = tdCell;

            if (tdCell == this.$fD.tdCell) {
//            	this._hideGlance();
                this.$glance.div.hide();
                return;
            }
            //hiram_wirte  �ع���ʾglance
            //mylable2
//            this.$glance.top.css({top:bounds.top, left:bounds.left, width:bounds.width - 2}).show();
//            this.$glance.left.css({top:bounds.top + 1, left:bounds.left, height:bounds.height - 4}).show();
//            this.$glance.bottom.css({top:bounds.top + bounds.height - 3, left:bounds.left, width:bounds.width - 2}).show();
//            this.$glance.right.css({top:bounds.top + 1, left:bounds.left + bounds.width - 3, height:bounds.height - 4}).show();
            this._showGlance(tdCell);
            //end

            // Ҫ��fD��offsetParent��currentTDCell.offsetParent��ͬ
            var $current_offset_c = $(tdCell).parents(".offset-c:eq(0)");
            if (!FR.equals(this.$glance.top.parents(".offset-c:eq(0)"), $current_offset_c)) {
                // carl:��Ū�ˣ�һ��Ū��ȥ����һ�����ж���
//                $current_offset_c.append(this.$glance.top);
//                $current_offset_c.append(this.$glance.left);
//                $current_offset_c.append(this.$glance.bottom);
//                $current_offset_c.append(this.$glance.right);
//                $current_offset_c.append(this.$glance.dot);
                $current_offset_c.append(this.$glance.div);
            }
        },

        /*
         * �༭dom tdCell
         */
        editTDCell: function (tdCell) {
            //wei:ȥ��У�������Ϣ
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
            // ״̬��֤�ܼ�ʱ�ı䣬���Բ���ȡԭʼ����Ϣ
            var tmpWidget = contentPane.getWidgetByCell(editorO.location);
            if (tmpWidget === null || tmpWidget.options.disabled === true || tmpWidget.options.invisible === true) {
                return;
            }
            // alex:��editor����,�����ǿ��Ա༭��,��ôֹ֮ͣǰ�ı༭,��ʼ�µı༭
            this.stopCellEditing();


            // ȡ��tr,safari��chrome��td��top����Ƚ��ң�����tr�Ļ��ǱȽ�һ�µ�
            var $tr = $tdCell.parent();
            var top = $tr[0].offsetTop;

            var isEditor = !$tdCell.attr('widget');
            var searchEditor = this.write.getWidgetByCell(editorO.location);
            if (searchEditor) {
                this.editorEl = searchEditor;
            }

            /*
             * ȡ�ñ༭����Ҫ�༭������
             * ���ҵ�˳������Ϊ
             * fm(formula) -> cv(Cell.Value) -> text(TD.text())
             * ����༭�����������͵Ļ�,����Ҫת����ֵ(TODO �Ƿ���Կ��ǰ��������ת���ŵ��༭���ڲ�ȥ��)
             */

            var editContent;
            if ((editContent = $tdCell.attr('cv')) != null) {
                editContent = FR.jsonDecode(editContent);
            } else if (!isEditor) {
                editContent = $tdCell.attr('cv');
            } else {
                editContent = $tdCell.hasClass("watermarkCell") ? "" : $tdCell.text();
            }
            // james:�༭��Ҫ�༭��ֵ
            var val;
            if (typeof(editContent) == "number" || typeof(editContent) == "string") {
                val = editContent;
            } else {
                val = $.isEmptyObject(editContent) ? "" : editContent;
            }
            if (editorO.type == "number") {
                val = parseFloat(editContent);
                if (isNaN(val)) {
                    // james:�������ֵ�ʱ�򣬲�Ҫ��Ĭ��ֵ0���͸����ַ���
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
                // ���ߵ���һ��������ؼ���Ȼ�ǿɱ༭�ģ���Ȼ����ǰ�����ز����������editor
                this.editorEl.element.removeClass("ui-state-disabled");
                var textEditor = $(".fr-texteditor", this.editorEl.element);
                if (textEditor.length > 0 && textEditor[0].disabled === true) {
                    textEditor[0].disabled = false;
                }
                this.$editor.append(this.editorEl.element);
                /*
                 * alex:��Ϊ�ڱ༭�����п��ܵ���tdCell.size�ı�,����ÿ�ζ�Ҫresizeһ��
                 */
                this.editorEl.doResize({
                    width: $tdCell.width(),
                    height: $tdCell.height()
                });
            }

            if (this.editorEl && this.editorEl.couldUsedAsEditor()) {
                // ��ʼ���ؼ��Ľ׶ν��и�ֵ�������༭���¼�����false������ֹ֮
                this.editorEl.setValue4Write(val, false);
                // copy style
                this.editorEl.cssFrom(tdCell);
            }

            // Ҫ��$editor��offsetParent��currentTDCell.offsetParent��ͬ
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
                    // ��û�в�������ʱ�ƶ����ҳ������ڿؼ�������ᱻ��ǰ����,���ﵼ�µ�
                    if (!FR.isMobileApp()) {
                        editComp.focus();
                    }

                }

                this.editorEl.startEditing();
                this.editorEl.fireEvent(FR.Events.BEFOREEDIT, tdCell, this);
            }
            this.cellEditing = tdCell;

            // carl:ֱ�Ӵ����б�
            if (FR.isMobileApp() && this.editorEl.shouldShowDirectly()) {
                this.editorEl.element.click();
            }
        },

        getWidgetCell: function (widget) {
            return $("#" + widget.options.location + "-" + this.idx + "-" + this.tableID);
        },

        // �Ѹ��ӵ�ֵ���
        resetCellValue: function (widget) {
            //b:�༶�������ܻᱨ��
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
                    //james��У��δͨ������ʾ�û�������Ϣ
                    var editor = this.editorEl;
                    //b:�ظ�ԭֵ�����ھ�ֻ�����ֿؼ����������
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
                     * wei : ��ʹУ��ʧ�ܣ�ҲҪ��¼�û�����Ĵ������ݣ�����ֱ�ӽ��û������������ջ�ԭ��
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
                    // richer:������ж���Ϊ��ɾ�������Ժ��پ���
                    var cell = this.getWidgetCell(this.editorEl);
                    if (cell.hasClass("del")) {
                        return false;
                    } else {
                        if (!fired) {
                            result = this.editorEl.fireEvent(FR.Events.STOPEDIT, this.currentTDCell, this);
                        }
                        // stopedit֮����ȡֵ���п���stopedit�¼��л���setValue����
                        var value = this.editorEl.getValue();
                        contentPane.fireEvent(FR.Events.STOPEDIT, $(this.currentTDCell), value);
                        var cv = value;
                        if (!result) {
                            return false;
                        }
                        if (cv == null) {//������!cv�жϣ���Ȼcv=0��ʱ��Ҳ����TRUE��
                            cv = '';//james�����û�з���ֵ��ô���أ��ȷ���һ�����ַ�����
                        }

                        var $tr = $(this.currentTDCell).parent();
                        var oriHeight = $tr.isVisible() ? $tr.height() : 0;

                        if (isEditor) {
                            if (this.editorEl.options.passwordText) {
                                // ����ؼ�ͳһ��ʾ*
                                value = value.replace(/[0-9a-zA-Z_]/g, '*');
                            }
                            this.displayTDCell(this.currentTDCell, value);
                        }

                        // james��˵�������������value��text���Եķ���ֵ
                        // alex:����displayTDCell�Ĳ�����cv������cv.text,��Ϊ�������dict����
                        // richer:��һ������ѡ��displayTDCell����cv����cv.text,��Ϊ��dict�Ļ���Ҫ�ܶ����Ĳ�������,�����൱���ṩһ��ͳһ������
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
                //��ԭwei�ģ�ԭ����֪��������������Ӵ�С���˵Ļ���.html(), ���ü�⣩������Ҫ����߿��ˡ�
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

            // alex:̫������,��ȫ��ȡ��Ȼ�ȴ�this.$table��ȡҪ��~~ TODO to find out why~
            // carl������ȫ�֣�������ѵ�parameterPane��ȥ��
            // denny: tracker@953, ȫ��ֱ��idЧ�ʸߵ�ԭ���ǿ���ֱ��getElementById,������Ҫ����
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
        getTDCell: function (col, row) { //alex:���Դ�һ������{col:1,row:2}��"A1",Ҳ���Դ���������1,2
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
            // alex:��������ƶ�,ֱ��return(�������,����Ҳ��ͦ��ʱ��)
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
                // ���ļ���ʱ��attach������ ���ļ�������ͼƬ��ʱ��Ĭ����ʾͼƬ����
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
         * ��ֵ��ʾ��TD����
         *
         * cv ������ {text, value},��ֱ����ʾtext, Ҳ������һ���ַ���,�����dict���������ж��Ƿ�Ҫ��dict����һ��
         */
        displayTDCell: function (tdCell, cv, presentValue) {
            var $tdCell = $(tdCell);
            //b:widget״ֻ̬����ʾ�ؼ�
            if (this.showAsWidget($tdCell)) {
                return;
            }
            // carl : ���صĵ�Ԫ����ʾ
            if ($tdCell.is('.cehide')) {
                return;
            }

            var self = this;
            //�ڲ��������������Ҫ�Ƿ�����ajax����
            var formatAndSetContent = function (dp) {
                if (typeof dp == 'string') {
                    if (dp && dp.indexOf('\n') != -1) {
                        dp = dp.replace(/ /gi, "&nbsp;");
                    }
                    dp = dp.replace(/\n/gi, "<br/>");
                }
                // alex:���ø�ʽ������ʾֵ
                var fmt = $tdCell.attr('fmt');
                if (fmt == null && (cv instanceof Date || $tdCell.attr('editor') == "date")) {
                    fmt = 'DMM/dd/yyyy';
                }
                // jim:41954 �Զ��幫ʽ���ɵ�ͼƬ��������¼���ʱ����ʾ�µ�ͼƬ
                if (!FR.isEmpty(dp) && dp.src != null) {
                    var url = dp.src;
                    $tdCell.html(null);
                    var $image = $("<img src='" + url + "'/>").css('border-width', 0);// ie ǿ��0
                    $image.appendTo($tdCell);
                }

                // alex:{attach_type, attach_id},��ʾһ������
                else if (!FR.isEmpty(dp) && dp.attach_type != null && dp.attach_id != null) {
                    self.previewAttachment($tdCell, dp);
//                    $tdCell.empty();
                }
                //wei : �Զ��ļ��Ĵ���
                else if (FR.isArray(dp) && dp.length > 0 && dp[0].attach_type != null && dp[0].attach_id != null) {
                    self.previewAttachment($tdCell, dp);
                } else {
                    if ($tdCell.is('.celink')) {
                        var link_span = $('.linkspan', $tdCell)[0];
                        if (link_span) {
                            $(link_span).html(FR.contentFormat(dp, fmt));
                        }
                    } else {
                        // richer:�����漰�����з���Ҫ��"\n"ת��Ϊ"<br/>"������html()
                        var content = FR.contentFormat(dp, fmt);
                        //wei : ˮӡ��ʾ�ڵ�Ԫ����
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
                            // ie��׼�� "rgb(204, 204, 204)" ie������"rgb(204,204,204)"
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

            // BUG0001372 ���������ѡֵ�޷���ʾ��ȷ
            if (FR.isArray(cv)) {// james�����cv��Array�Ļ�����ôĿǰ��������Ǹ�ѡ�����������Ľ���������ı༭��Ŀǰȫ����ֻ����һ��ֵ
                if (cv[0] && cv[0].attach_id != null && cv[0].attach_type != null) {
                    content = cv;
                } else {
                    var delimiter = ',';
                    //wei : ��  // ��ѡ��
                    if (cv[0] instanceof Array) {
                        delimiter = ';';
                    }
                    var content = '';
                    if ($tdCell.is('.presentable')) {   //august:����̬�ж�
                        // shoc ������Ŀ�����������ѡ�� ��ѡ���� ��ѡ�� ��ѡ��, ����ֵҪ�����崦��,��Ȼ����ù�ʽ��̬treelayer�Ļ����ø�
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
                // alex:�����present,Ҫ����������ȥ��һ��,present֮����ʲô����
                if ($tdCell.is('.presentable')) {
                    // �����Ѿ��������˵ģ���ֱ���ò���Ҫ��ȥ����������
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
         * alex:����̬����
         */
        present: function ($tdCell, cv) {
            // richer:��¼����������Ϣ
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

            // jsonDecode��705���ĳɿ��ܷ��ؿ�Object web��present��ôҲ���÷����������
            // $.isEmptyObject("2")���Ϊtrue������
            return (typeof cv == 'object' && $.isEmptyObject(cv)) ? "" : cv;
        },

        // API���ṩ�����ж���1��ʼ
        //wei:�õ���Ԫ����к�
        getTDRow:function (td) {
            var cr = FR.id2ColumnRow($(td).attr('id'));
            return cr ? (cr.row + 1) : -1;
        },
        //wei:�õ���Ԫ����к�
        getTDCol:function (td) {
            var cr = FR.id2ColumnRow($(td).attr('id'));
            return cr ? (cr.col + 1) : -1;
        },

        /**
         * ����ѡ�еĺڿ�
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

//RowHelper�ṩ������ʱ��һЩ����
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
     * ����TDCell��ֵ
     */
    setCellValue: function (tdCell, val) {
        if (val instanceof Date) {
            val = {date_milliseconds: val.getTime()}
        }
        $(tdCell).attr('cv', FR.jsonEncode(val));
    },

    /*
     * ��ȡTDCell��ֵ
     */
    getCellValue: function (tdCell) {
        var json_cv = $(tdCell).attr('cv');
        // richer:û��ֵ��ʱ��ֱ�ӷ��ؿ��ַ���,��Ҫ����null
        if (json_cv == null) {
            return "";
        } else {
            return FR.jsonDecode(json_cv);
        }
    },

    /**
     * ������Ӧ�е��иߣ�Ϊ�������
     */
    modifyRowHeightAfterContentChange: function ($tr, oriHeight) {
        //��ͬtable����ͬid��Ԫ����jqueryȡ�Ļ���chrome��ȡȫ����ie67ֻ��ȡ��һ��
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

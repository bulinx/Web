// EXCELSUBMIT.JS
;FR.EXCELSUBMIT = {};

$.extend(FR.EXCELSUBMIT, {
	_init : function() {
        this.options = {
            // 是否需要进度条
            need2ProgressBar: true,
            // 进度条刷新间隔
            interval: 500,
            // 是否排队提交
            submitInQueue: false
        };
		var self = this;
        this.checkRole();
        $('body').css('overflow', 'auto');
        $('body').bind('click', function(e) {
            if (!$(e.target).isChildAndSelfOf($('.es_cmd_view_btn'))
                && !$(e.target).isChildAndSelfOf($('.es_page_btn_wrap'))) {
                $('.fr_pop_pane').hide();
            }
        })

		this.taskTable = new FR.ESGrid({
			cls : 'fr_es_tasktable',
			height : $.browser.msie ? 520 : 503,
			selfbar : self.btn_bar,
			multi : true,
			pagecount : 10,
			columnsconfig : [{
                text : 'id',
                showValue : FR.i18nText('Task') + 'ID',
                width : 100
            },{
				text : 'taskname',
				showValue : FR.i18nText('Schedule-Task_Name'),
				forSearch : true,
				width : 200,
				sort : false,
				widget : {type : 'custom', createHandler : function (idx, data, renderEl) {
					renderEl.text(data.taskname);
                    if (self.isRoot) {
                        renderEl.addClass('fr_es_taskname');
                        renderEl.attr('title', FR.i18nText("Modify", "Schedule-Task_Name"));
                        renderEl.click(function () {
                            self.editTask(data, renderEl);
                        });
                    }
				}}
			},{
                text : 'action',
                showValue : FR.i18nText('Form-Action'),
                width : 110,
                widget : {type : 'custom', createHandler : function (idx, data, renderEl) {
                    if (self.isRoot) {
                        var btn = new FR.IconButton({
                            width: 19,
                            height: 19,
                            imgsrc: 'es_cmd_view_btn',
                            handler: function() {
                                var paneId = 'cmdpane' + data.id;
                                var pane = $('#' + paneId);
                                if (pane.length > 0) {
                                    if (pane.is(":hidden")) {
                                        $('.fr_pop_pane').hide();
                                        pane.show();
                                    } else {
                                        pane.hide();
                                    }
                                } else {
                                    $('.fr_pop_pane').hide();
                                    createCmdViewPane();
                                }
                            }
                        });
                        btn.element.appendTo(renderEl);
                        function createCmdViewPane() {
                            var pane = $('<div/>').attr('id', "cmdpane" + data.id)
                                .addClass('es_cmd_list_pane fr_pop_pane').appendTo('body')
                                .css({
                                    left: $(renderEl).offset().left + 10,
                                    top: $(renderEl).offset().top + 13
                                });
                            var clz = 'es_cmd_list_node';
                            var import_excel = $('<div>' + FR.i18nText('Import2') + '</div>').addClass(clz).appendTo(pane);
                            var remove_excel = $('<div>' + FR.i18nText('Schedule-Remove_Task') + '</div>').addClass(clz).appendTo(pane)
                                .click(function() {
                                    self.delTask(data);
                                });
                            var modify_task = $('<div>' + FR.i18nText('Modify') + '</div>').addClass(clz).appendTo(pane)
                                .click(function() {
                                    var taskNameEl = $('.fr_es_taskname', renderEl.parent().parent());
                                    self.editTask(data, taskNameEl);
                                })
                            self.initExcelButton(import_excel, data.id, idx, data);
                        }
                    } else {
                        var importExcel = $('<span>' + FR.i18nText('Import2') + '</span>')
                            .addClass('es_import_text').appendTo(renderEl);
                        self.initExcelButton(importExcel, data.id, idx, data);
                    }
                }}
            },{
				text : 'createtime',
				showValue : FR.i18nText('Create_Time'),
				width : 100
			}, {
				text : 'submittime',
				showValue : FR.i18nText('Last_Submit_Time'),
				width : 120,
				widget : {type : 'custom', createHandler : function (idx, data, renderEl) {
					var par = renderEl.parent();
					par.html('');
					if (!self.submittimeboxs) {
                        self.submittimeboxs = {};
                    }
					
					if (self.submittimeboxs[data.id]) {
						par.append(self.submittimeboxs[data.id]);
					} else {
						renderEl = $("<div/>").appendTo(par);
						self.submittimeboxs[data.id] = renderEl;
						renderEl.text(data.submittime);
					}
				}}
			}],
			items : []
		});
		this.taskTable.loading(true);
				
		this.errorInfos = {};
		
		setTimeout(function() {
			self.freshData(true);
		}, 100);
		
		$('body').append(this.taskTable.element);
	},

    checkRole : function() {
        var self = this;
        this.isRoot = false;
        if (this.checkDetail({op : 'fs_set',cmd : 'auth_checkesrole'})) {
            this.fromFS = true;
        } else if (this.checkDetail({op : 'excel_submit',cmd : 'es_check_role'})) {
            this.fromFS = false;
        } else {
            FR.Msg.toast("check role failed");
        }
    },

    checkDetail: function(data) {
        var self = this;
        var pass = false;
        FR.ajax({
            async : false,
            type : 'POST',
            url : FR.servletURL,
            data : data,
            complete: function(res, status) {
                var text = res.responseText;
            	var ro = FR.jsonDecode(text);
                if (ro && !$.isEmptyObject(ro)) {
                    if (ro.isRoot) {
                        pass = true;
                        FR.$defaultImport('/com/fr/write/web/excel/esprivilege.js');
                        self.isRoot = true;
                        self.addCommandButton();
                        self.plEditable = ro.plEditable;
                    } else if (ro.roleTask) {
                        pass = true;
                        self.roleTask = ro.roleTask || [];
                    }
                }
            }
        });
        return pass;
    },

	freshData : function(clearData) {
		if (clearData) {
			this.stateboxs = {};
			this.errorInfos = {};
		}
		this.submittimeboxs = {};
		
		var self = this;
		FR.ajax({
			async : false,
			type : 'POST',
			url : FR.servletURL,
			data : {
				op : 'excel_submit',
				cmd : 'es_show'
			},
			complete : function(res, status) {
				var text = res.responseText;
				var ro = FR.jsonDecode(text);
				if ($.isArray(ro)) {
                    var task = [];
                    if (self.isRoot) {
                        task = ro;
                    } else {
                        if (self.roleTask) {
                            var arr;
                            if (self.fromFS) {
                                arr = $.map(self.roleTask, function(report) {
                                    return parseInt(report.substring(1));
                                })
                            } else {
                                arr = self.roleTask;
                            }
                            for (var i=0; i<ro.length; i++) {
                                if (self.fromFS) {
                                    if ($.inArray(ro[i].id, arr) !== -1) {
                                        task.push(ro[i]);
                                    }
                                } else {
                                    if ($.inArray(ro[i].reportpath, arr) !== -1) {
                                        task.push(ro[i]);
                                    }
                                }
                            }
                        }
                    }
					self.taskTable.popData(task);
				} else {
					self.taskTable.popData([]);
				}
			}
		});
	},

    addCommandButton : function() {
        var self = this;
        var bar = $('<div/>').attr('id', 'fr_es_bar');
        this.btn_bar = bar;
        var btnHeight = 28;
        var addTask = new FR.IconButton({
            width: 68,
            height: btnHeight,
            renderEl : $('<div/>'),
            imgsrc : 'es_btn_add_task',
            handler : function() {
                self.addTask();
            }
        });
        var allocatePower = new FR.IconButton({
            width: 70,
            height: btnHeight,
            renderEl : $('<div/>'),
            imgsrc : 'es_btn_allocate',
            handler : function() {
                self.showAllocatePane();
            }
        });
        var removeTask = new FR.IconButton({
            width: 56,
            height: btnHeight,
            renderEl : $('<div/>'),
            imgsrc : 'es_btn_del_task',
            handler : function() {
                self.delTask();
            }
        });
        this.btn_bar.append(addTask.element.addClass('es_cmd_btn'))
            .append(allocatePower.element.addClass('es_cmd_btn'))
            .append(removeTask.element.addClass('es_cmd_btn'));
    },
	
	addTask : function () {
		if (!this.addTaskDialog) {
        	var self = this;
            var taskNamePane = {
                type: "border",
                items: [
                    {
                        el: {
                            type: "label",
                            textalign: 'right',
                            fontsize : '14px',
                            fontfamily : 'Microsoft Yahei',
                            value: FR.i18nText('Task',  'WF-Name') + "："
                        },
                        width: 80,
                        region:"west"
                    },
                    {
                        el: {
                            type : "text",
                            watermark: FR.i18nText('Task',  'WF-Name'),
                            id : "fr-es-task-name"
                        },
                        region:"center"
                    },
                    {
                        el : $("<div>"),
                        height : 5,
                        region : "north"
                    },
                    {
                        el : {
                            type : 'label',
                            value : "",
                            color : 'red',
                            id : "fr-es-task-name-error"
                        },
                        width : 200,
                        region: "east"
                    }
                ]
            };
            var treePane = $("<div class='fr-es-template-tree-pane'></div>").css({
                'overflow': 'auto',
                'border' : "1px solid #B5B8C8"
            });
            var previewHandler = function () {
                if (treePane.data("loaded") != "loaded") {
                    var $loading = $('<div class="fr-core-panel-loading"></div>').html(FR.i18nText('Loading') + "...");
                    treePane.append($loading);
                    FR.ajax({
                        url: FR.servletURL,
                        type: "POST",
                        data : {op : "excel_submit", cmd : "es_get_report"},
                        complete: function (res) {
                            var treedata = FR.jsonDecode(res.responseText);
                            var o = {
                                data: treedata,
                                onnodeclick: function () {
                                    var currentItem = treePane.getTCT();
                                    if (currentItem.hasChildren) {
                                        return;
                                    }
                                    var pathInput = $("#fr-es-template-select-path");
                                    pathInput.focus();
                                    pathInput.val(currentItem.path);
                                    var text = currentItem.text;
                                    if (text) {
                                        text = text.substring(0, text.indexOf(".cpt"));
                                        var nameInput = $("#fr-es-task-name");
                                        nameInput.focus();
                                        nameInput.val(text);
                                    }
                                    self.isValidTask(text, currentItem.path);
                                }
                            };

                            $loading.remove();
                            treePane.treeview(o);
                            treePane.data("loaded", "loaded");
                        }
                    });
                }

            };
            var templateSelectPane = {
                type: "border",
                items: [
                    {
                        el: {
                            type: "label",
                            textalign: 'right',
                            fontsize : '14px',
                            fontfamily : 'Microsoft Yahei',
                            value: FR.i18nText('Schedule-Select_Template') + "："
                        },
                        width: 80,
                        region: "west"
                    },
                    {
                        el: {
                            type : "text",
                            watermark: FR.i18nText('Schedule-Select_Template'),
                            id : "fr-es-template-select-path"
                        },
                        region: "center"
                    },
                    {
                        el : $("<div>"),
                        height : 5,
                        region : "north"
                    },
                    {
                        el : $("<div>"),
                        height : 5,
                        region : "south"
                    },
                    {
                        el : {
                            type : 'label',
                            value : "",
                            color : 'red',
                            id : "fr-es-template-select-path-error"
                        },
                        width : 200,
                        region: "east"
                    }
                ]
            };

            var border = new FR.BorderLayout({
                items : [
                    {
                        el : taskNamePane,
                        region : "north",
                        height : 27
                    },
                    {
                        el : {
                            type : "border",
                            items : [
                                {
                                    el : templateSelectPane,
                                    height : 32,
                                    region : "north"
                                },
                                {
                                    el : treePane,
                                    height: 230,
                                    region : "center"
                                },
                                {
                                    el : $('<div/>'),
                                    width: 80,
                                    region: "west"
                                },
                                {
                                    el : $("<div/>"),
                                    width : 40,
                                    region: "east"
                                }
                            ]
                        },
                        region : "center"
                    }
                ]
            });

        	var o = {
				title : FR.i18nText('Schedule-New_Task'),
				width : 450,
				height : 400,
				contentWidget : border,
                confirm : true,
                closeAfterAction: false,
                onOK : function() {
                    if (self.doAddTask() !== false) {
                        this.doClose();
                    }
                },
                onCancel: function() {
                    self.addTaskDialog.setVisible(false);
                }
			};

			this.addtask_treepane = treePane;

			this.addTaskDialog = new FR.Dialog(o);
            previewHandler();
            treePane.height(250);
            $("#fr-es-task-name").keyup(function() {
                if ($(this).val() != "") {
                    self.isValidTask($(this).val(), $("#fr-es-template-select-path").val());
                }
            })
    	} else {
			this.addtask_treepane.setCurrentItem(undefined);
            $("#fr-es-template-select-path").val('');
            $("#fr-es-task-name").val('');
    	}

    	this.addTaskDialog.setVisible(true);
	},
	
	doAddTask : function() {
        var nameInp = $("#fr-es-task-name");
        var pathInp = $("#fr-es-template-select-path");
		var tname = nameInp.val();
        var tpath = pathInp.val();
		if(!tname || (tname = tname.replace(/^\s+|\s+$/g,"")).length <= 0){
            nameInp.focus();
			FR.Msg.toast(FR.i18nText('Enter_Task_Name') + '！');
			return false;
		}
		if(!pathInp.val()){
            pathInp.focus();
			FR.Msg.toast(FR.i18nText('Please_Select', 'Report_Path'));
			return false;
		}

        if (!this.isValidTask(tname, tpath)) {
            return false;
        }

		var self = this;
		FR.ajax({
			async : false,
			type : 'POST',
			url : FR.servletURL,
			data : {
				op : 'excel_submit',
				cmd :	'es_add',
				task_name : tname,
				report_path : tpath
			},
			
			complete : function(res, status) {
				var text = res.responseText;
				var ro = FR.jsonDecode(text);
				if (ro.error) {
					FR.Msg.toast(ro.error);
				} else {
					if (!/^\d+$/.test(ro.id)) {
						FR.Msg.toast(FR.i18nText('Failed'));
						return false;
					} else {
						self.taskTable.addData(ro);
						FR.Msg.toast(FR.i18nText('Successfully'));
                        self.taskChange = true;
					}
				}
			}
		});
	},

    isValidTask: function(tname, tpath) {
        var taskItems = this.taskTable.options.items;
        var nameLabel = $("#fr-es-task-name-error")[0];
        var pathLabel = $("#fr-es-template-select-path-error")[0];
        for (var i=0; i<taskItems.length; i++) {
            if (tname == taskItems[i].taskname) {
                FR.Msg.toast(FR.i18nText('This_Name_Has_Exist') + "!");
                nameLabel.innerText = FR.i18nText('This_Name_Has_Exist');
                return false;
            }
            if (tpath == taskItems[i].reportpath) {
                FR.Msg.toast(FR.i18nText('This_Template_Has_Exist') + "!");
                pathLabel.innerText = FR.i18nText('This_Template_Has_Exist');
                return false;
            }
        }
        nameLabel.innerText = "";
        pathLabel.innerText = "";
        return true;
    },
	
	delTask : function(targetData) {
        var data;
        if (targetData) {
            data = $.isArray(targetData) ? targetData : [targetData];
        } else {
            data = this.taskTable.getSelectedData();
        }
		if (data.length <= 0) {
            return;
        }
		
		var self = this;
		FR.Msg.confirm(FR.i18nText('Tooltips'), FR.i18nText('sure_to_delete') + '？', function(result) {
			if (result) {
				var idarray = [];
				$.each(data, function(idx, item) {
					idarray.push(item.id);
				});
				
				FR.ajax({
					async : false,
					type : 'POST',
					url : FR.servletURL,
					data : {
						op : 'excel_submit',
						cmd : 'es_del',
						ids : idarray
					},
					complete : function(res, status) {
						var text = res.responseText;
						var ro = FR.jsonDecode(text);
						if (ro.error) {
							FR.Msg.toast(ro.error);
						} else if (ro.success){
							FR.Msg.toast(FR.i18nText('Successfully'));
                            self.taskChange = true;
						} else {
							FR.Msg.toast(FR.i18nText('Failed'));
						}
						
						// 重新刷下
						self.freshData(false);
					}
				});
			}
		});
	},
	
	editTask : function(data, textEl) {
		var self = this;
		FR.Msg.prompt(FR.i18nText('Modify', 'Task','Name'), FR.i18nText('New', 'Name'), data.taskname, function(value) {
            // 考虑任务名称重复问题
            var items = self.taskTable.options.items;
            for (var i=0; i<items.length; i++) {
                if (value == items[i].taskname) {
                    FR.Msg.toast(FR.i18nText('Task','Name', 'Repeat') + "!");
                    return;
                }
            }
			if (value) {
				FR.ajax({
					async : false,
					type : 'POST',
					url : FR.servletURL,
					data : {
						op : "excel_submit",
						cmd : "es_edit",
						id : data.id,
						taskname : value
					},
					complete : function(res, status) {
						var text = res.responseText;
						var ro = FR.jsonDecode(text);
						if (ro.error) {
							FR.Msg.toast(ro.error);
						} else if (ro.success){
							FR.Msg.toast(FR.i18nText('Successfully'));
							textEl.text(value);
							data.taskname = value;
                            self.taskChange = true;
						} else {
							FR.Msg.toast(FR.i18nText('Failed'));
						}
					}
				});
			}
		}, 225);
	},
	
	// carl:抄自write.js那边的处理
	initExcelButton : function(button, taskid, idx, data) {
		if (!taskid || ("" + taskid).length <= 0) {
            return;
        }
    	var importExcelButton = button.$table ?  $(button.$table) : $(button);
    	var formid = "importexcelform" + taskid;
    	var self = this;
    	importExcelButton.one("mouseover", function() {
            var excel_btn = $(this);
    		if($("#" + formid).length > 0) {
        		var $uploadForm = $("#" + formid);
        		var input = $("input", $uploadForm);
        	} else {
        		var $uploadForm = $('<form enctype="multipart/form-data" id="' + formid + '"></form>').appendTo("body");
                var inputWrap = $('<div/>').css({
                    position : 'absolute',
                    cursor : 'pointer'
                }).appendTo($uploadForm);
        		var input = $('<input type="file" name="file" multiple="multiple" size="2"/>')
                    .css({
                        width: 86,
                        height:21,
                        cursor: 'pointer',
                        opacity: 0,
                        filter: 'alpha(opacity=0)',
                        'z-index' : 9999
                    })
                    .hover(function() {
                        excel_btn.addClass('es_cmd_list_node_over');
                    }, function() {
                        excel_btn.removeClass('es_cmd_list_node_over');
                    })
                    .appendTo(inputWrap);
        	}
        	input.change(function() {
        		self.importExcel(idx, data);
        	});
    		input.parent().css({
                top : importExcelButton.offset().top,
    			left : importExcelButton.offset().left
    		});
    	});
    },
	
	importExcel : function(idx, data) {
		var $uploadForm = $("#importexcelform" + data.id);
    	var input = $("input", $uploadForm);
        // ie读不到files
        var files = input[0].files;
        if (files == null) {
            var $file = $('input:file', $uploadForm);
            var path = $file.val();
            var filename = path.substring(path.lastIndexOf('\\')+1, path.length);
            files = [{name:filename}];
        }
    	var fileCount = files ? files.length : 0;
        var self = this;

        var $statePane = this.createStatePane(data, files);
        var config = {
            title: FR.i18nText('Multi-Excel-Import'),
            width: 600,
            height: 440,
            text4OK: FR.i18nText('OK'),
            text4Cancel : FR.i18nText('Cancel'),
            confirm : true,
            resizeable: false,
            onOK: function() {
                self.stateDialog.destroy();
            },
            onCancel: function() {
                self.stateDialog.destroy();
            },
            contentHtml: $statePane
        }
        this.stateDialog = new FR.Dialog(config);
        this.stateDialog.setVisible(true);

        this.$uploadForm = $uploadForm;
        this.taskIndex = data.id;
        this.fileIndex = -1;
        this.fileCount = fileCount;
        // 是否开始执行了
        this.submitStarted = [];
        // 是否执行完毕
        this.submitComplete = [];
        // 存放每个excel文件提交的processid
        this.processIds = [];
        // 计数已经完成的
        this.completeCount = 0;

        if (this.options.need2ProgressBar) {
//            this.createProgressBar(files);
            this.ProgressInterval = setInterval(function() {
                for (var i=0; i<files.length; i++) {
                    var percent = 0;
                    if (self.submitComplete[i]) {
                        percent = 100;
                    } else {
                        percent = self.getProgressPercent(self.processIds[i]);
                    }
                    self.progressBars[i].setValue(percent);
                }
            }, this.options.interval);
        }

        // 分为排队和不排队两种情况
        if (this.options.submitInQueue) {
            this.submitNextExcelFile();
        } else {
            for (var i=0; i<files.length; i++) {
                this.submitNextExcelFile(i);
            }
        }
	},

    createStatePane : function(data, files) {
        var self = this;
        var $statePane = $('<div/>').addClass('es_state_pane');
        var $tableWrapper = $('<div/>').css({
            'width': '100%',
            'overflow-y': 'auto'
        }).appendTo($statePane);
        var $stateTable = $('<table style="border-spacing:0px" id="'+data.id+'"></talbe>').appendTo($tableWrapper);
        this.progressBars = [];
        for (var i=0; i<files.length; i++) {
            var nameTr = $('<tr>' +
                '<td class="es_import_name" colspan="4" id="'+"name"+i+'">'+ files[i].name +'</td>' +
                '</tr>').appendTo($stateTable);
            var stateTr = $('<tr id="'+i+'" >' +
                '<td class="es_import_td es_import_state" id="'+"state"+i+'" >' + FR.i18nText('Not_Imported') + '</td>' +
                '<td class="es_import_td es_import_message" id="'+"message"+i+'"></td>' +
                '<td class="es_import_td es_import_action" id="'+"action"+i+'"></td>' +
                '</tr>').appendTo($stateTable);
            this.progressBars[i] = new FR.SingleProgressBar();
            var $progressTd = $('<td/>').addClass("es_import_td es_import_progress").prependTo(stateTr);
            this.progressBars[i].element.appendTo($progressTd);
        }

        this.$stateTable = $stateTable;
        return $statePane;
    },

    createProgressBar : function(files) {
        var self = this;
        var names = $.map(files, function(file) {
            return file.name;
        });
        this.progressBar = new FR.ESProgressBar({
            count: self.fileCount,
            ids: [],
            texts: names
        });
        this.progressBar.element.appendTo($('body'));

        this.ProgressInterval = setInterval(function() {
            var ps = {};
            for (var i=0; i<self.processIds.length; i++) {
                var percent = 0;
                if (self.submitComplete[i]) {
                    percent = 100;
                } else {
                    percent = self.getProgressPercent(self.processIds[i]);
                }
                ps[self.processIds[i]] = percent;
            }
            self.progressBar.setValue(ps);
        }, this.options.interval);
    },

    getProgressPercent : function(processid) {
        var percent = 0;
        FR.ajax({
            type : 'POST',
            url : FR.servletURL,
            async: false,
            data : {
                op : "excel_submit",
                cmd : "es_get_process",
                processid : processid
            },
            complete: function(res, status) {
                if (status == 'success') {
                    var text = res.responseText;
                    var ro = FR.jsonDecode(text);
                    if (ro.process) {
                        percent = parseInt(ro.process);
                    }
                }
            }
        });
        return percent;
    },

    submitNextExcelFile: function(idx) {
        var self = this;
        // 如果idx没有定义 就是一开始的自动逐个导入 否则就是导入失败后的再次导入具体的某一个excel
        if (idx == undefined) {
            this.fileIndex = this.fileIndex + 1;
            if (this.fileIndex < 0 || this.fileIndex >= this.fileCount || this.submitStarted[this.fileIndex] === true) {
                return;
            }
        } else if(idx < 0 || idx >= this.fileCount) {
            return;
        } else {
            this.fileIndex = idx;
        }
        if (self.fileCount > 0) {
            self.stateBox = $('#state'+self.fileIndex, self.$stateTable);
            self.messageBox = $('#message'+self.fileIndex, self.$stateTable);
            self.actionBox = $('#action'+self.fileIndex, self.$stateTable);
        } else {
            self.stateBox = self.stateboxs[self.taskIndex];
            self.messageBox = self.stateboxs[self.taskIndex];
        }
        var stateBox = self.stateBox;
        var submitTimeBox = self.submittimeboxs[self.taskIndex];
        var fileIndex = self.fileIndex;
        this.submitStarted[this.fileIndex] = true;
        stateBox.text(FR.i18nText('Importing') + '...');
        this.progressBars[idx] && this.progressBars[idx].reset();

        FR.ajax({
            type: 'POST',
            url: FR.servletURL,
            data: {
                op: "excel_submit",
                cmd: "es_preload",
                id : self.taskIndex,
                fileIndex: self.fileIndex
            },
            complete: function (res, status) {
                var succ = false;
                if (status == 'success') {
                    var text = res.responseText;
                    var ro = FR.jsonDecode(text);
                    if (ro.processid) {
                        self.processIds[fileIndex] = ro.processid;
                        self.progressBar && self.progressBar.options.ids.push(ro.processid);
                        self.upload(ro.processid, stateBox, submitTimeBox, idx);
                        succ = true;
                    } else {
                        stateBox.text(FR.i18nText('Import_Failed'));
                    }
                } else {
                    FR.Msg.toast(FR.i18nText('HJS-Send_Failed'));
                }
                if (succ === false) {
                    self.createReloadButton();
                    if (self.options.submitInQueue) {
                        self.submitNextExcelFile();
                    }
                }
            }
        });
    },

    upload: function(processid, stateBox, submitTimeBox, fileIndex) {
        var self = this;
        var importOptions = {
            url : FR.servletURL + "?op=excel_submit&cmd=es_upload&id=" + self.taskIndex
                + "&fileIndex=" + fileIndex + "&processid=" + processid,
            filter : "xls",
            callback : function(res, status) {
                var succ = false;
                if (status == 'success') {
                    var text = res.responseText;
                    var ro = FR.jsonDecode(text);
                    if (ro.success) {
                        self.verify(processid, stateBox, submitTimeBox);
                        succ = true;
                    } else {
                        stateBox.text(FR.i18nText('Import_Failed'));
                    }
                } else {
                    FR.Msg.toast(FR.i18nText('HJS-Send_Failed'));
                }
                if (succ === false) {
                    self.createReloadButton();
                    if (self.options.submitInQueue) {
                        self.submitNextExcelFile();
                    }
                }
            }.createDelegate(self)
        }
        FR.notCloseDialogOnSubmit = true;
        FR.autoSubmit(importOptions, self.$uploadForm);
        delete FR.notCloseDialogOnSubmit;
    },
	
	verify : function(processid, statebox, submitTimeBox) {
		statebox.text(FR.i18nText('Verifying') + '...');

		var self = this;
		FR.ajax({
			type : 'POST',
			url : FR.servletURL,
			data : {
				op : "excel_submit",
				cmd : "es_verify",
				processid : processid
			},
			complete : function(res, status) {
				var text = res.responseText;
				var ro = FR.jsonDecode(text);
                var succ = false;
				if (ro.error) {
					statebox.text(FR.i18nText('Verify_Failed') + ':' + ro.error);
				} if (ro.noattr) {
					statebox.text(FR.i18nText('Report-Write_Attributes_Msg') + '！');
				} else {
					var success = -1;
					var warnnings = [];
					for (var item in ro) {
						if (item != 'exportfile' && item != 'exporterror') {
							if (!ro[item].success) {
								success = 0;
								if (ro[item].warning) {
									warnnings.push({name : item, warnning : ro[item].warning});
								}
							} else if (success < 0) {
								success = 1;
							}
						}
					}
					
					if (success === 1) {
						statebox.text(FR.i18nText('Verify-Verify_Success'));
                        $(statebox).removeClass('es_import_state_failed');
                        $(statebox).addClass('es_import_state_success');
                        self.messageBox.empty();
                        self.actionBox.empty();
						self.submit(processid, statebox, submitTimeBox);
                        succ = true;
					} else if (success == -1) {
						statebox.text(FR.i18nText('Verify_Failed'));
                        $(statebox).removeClass('es_import_state_success');
                        $(statebox).addClass('es_import_state_failed');
					} else {
						var html = '';
						if (warnnings.length > 0) {
							self.errorInfos[processid] = warnnings;
                            html = $('<span class="fr_es_error_a">' + FR.i18nText('Face_View') + '</span>')
                                .click(function() {
                                    self.getErrorMsg(processid, ro);
                                })
						}
						statebox.text(FR.i18nText('Verify_Failed'));
                        $(statebox).addClass('es_import_state_failed');
						self.messageBox.empty();
                        self.messageBox.append(html);
					}
				}
                if (succ === false) {
                    self.createReloadButton();
                    if (self.options.submitInQueue) {
                        self.submitNextExcelFile();
                    }
                }
			}
		});
	},
	
	submit : function(processid, statebox, submitTimeBox) {
		statebox.text(FR.i18nText('JavaScript-Commit_to_Database') + '...');

        var self = this;
		FR.ajax({
			type : 'POST',
			url : FR.servletURL,
			data : {
				op : "excel_submit",
				cmd : "es_submit",
				processid : processid
			},
			complete : function(res, status) {
				var text = res.responseText;
				var ro = FR.jsonDecode(text);
                var succ = false;
				if (ro.error) {
					statebox.text(FR.i18nText('JavaScript-Commit_to_Database', 'Failed') + ' :' + ro.error);
				} else if (ro.success){
					var d = new Date();
					var timestr = d.getFullYear().toString() + "-";
					if (d.getMonth() < 9) {
						timestr += "0" + (d.getMonth() + 1);
					} else {
						timestr += (d.getMonth() + 1);
					}
					timestr += "-" + d.getDate();
					submitTimeBox.text(timestr);
                    $(statebox).addClass('es_import_state_success');
					statebox.text(FR.i18nText('Successfully'));
                    succ = true;
				} else {
                    $(statebox).switchClass('es_import_state_success', 'es_import_state_failed');
					statebox.text(FR.i18nText('Failed'));
				}
                if (succ === false) {
                    self.createReloadButton();
                } else {
                    self.completeCount ++;
                    self.submitComplete[self.processIds.indexOf(processid)] = true;
                }

                // 如果是最后一个提交完成 那么要结束进度条刷新
                if (self.completeCount == self.fileCount) {
                    setTimeout(function() {
                        window.clearInterval(self.ProgressInterval);
                    }, self.options.interval);
                } else {
                    // 不是最后一个继续提交下一个
                    if (self.options.submitInQueue) {
                        self.submitNextExcelFile();
                    }
                }
			}
		});
	},

    createReloadButton : function() {
        var idx = this.fileIndex;
        var self = this;
        var link = '<a class="fr_es_error_a" href="javascript:FR.EXCELSUBMIT.submitNextExcelFile(' + idx + ')">'
                    + FR.i18nText('Import_Again') + '</a>';
        this.actionBox.empty();
        this.actionBox.append(link);
    },

    createAllocatePane : function() {
        var self = this;
        var $allocatePane = $('<div/>').addClass("es_allocate_pane");
        this.$allocatePane = $allocatePane;
        this.$allocateBody = $('<div/>').addClass('es_allocate_body').appendTo($allocatePane);

        // FS角色
        var FSRoles = FR.ESTrans.getFSRoles() || [];
        var allTaskItems = this.taskTable.options.items;
        for (var i = 0, len = FSRoles.length; i < len; i++) {
            var role = FSRoles[i];
            if (role.departmentname != null) {
                role.text = role.departmentname + role.postname;
            }
            var task = [];
            var taskReport = FR.ESTrans.getFSRoleAuth(role);
            taskReport.reports = $.map(taskReport.reports || [], function(report) {
                return parseInt(report.substring(1));
            })
            for (var k=0; k<allTaskItems.length; k++) {
                if ($.inArray(allTaskItems[k].id, taskReport.reports) != -1) {
                    task.push(allTaskItems[k]);
                }
            }
            role.esTask = task;
            role.esTask_backup_ids = [];
            for (var k=0; k<role.esTask.length; k++) {
                role.esTask_backup_ids.push(role.esTask[k].id);
            }
            role.value = role.text;
            role.chosenListIndex = 0;
            role.toChooseListIndex = 0;
        }

        // platForm角色
        this.platFormRoles_backup = [];
        var platFormRoles = FR.ESTrans.getPlatFormRoles() || [];
        for (var i=0; i<platFormRoles.length; i++) {
            this.platFormRoles_backup.push(platFormRoles[i].roleName);
        }
        this.initPlatFormRoles(platFormRoles);

        this.curOperateIdx = (platFormRoles.length > 0 || this.plEditable) && FSRoles.length === 0 ? 1 : 0;
        this.role_list = [];
        this.chosen_list = [];
        this.tochoose_list = [];
        this.$operatePane = [];

        var role_source = $('<div/>').addClass('es_role_source').appendTo(this.$allocateBody);
        var btn_wrapper = $('<div/>').addClass('es_allocate_body_btn_wrapper').appendTo(this.$allocateBody);
        // 两边都有角色设置时添加切换按钮
        if (FSRoles.length > 0 && (platFormRoles.length > 0 || this.plEditable)) {
            var switchPane = $('<div/>').addClass('es_switch_pane').appendTo(btn_wrapper);
            $.each(['left', 'right'], function(idx, item) {
                var clz = 'es_switch_btn_' + item;
                var btn = new FR.IconButton({
                    width: 80,
                    height: 28,
                    renderEl : $('<div/>'),
                    imgsrc : clz,
                    handler : function() {
                        for (var i=0; i<switchPane.children().length; i++) {
                            var it = i === 0 ? 'left' : 'right';
                            switchPane.children().eq(i).removeClass('es_switch_btn_' + it + '_click');
                            switchPane.children().eq(i).addClass('es_switch_btn_' + it);
                        }
                        btn.element.switchClass('es_switch_btn_' + item, 'es_switch_btn_' + item + '_click');
                        self.showOperatePane(idx);
                        refreshInstructions();
                    }
                })
                if (idx === 0) {
                    btn.element.switchClass('es_switch_btn_left', 'es_switch_btn_left_click');
                }
                btn.element.addClass('es_switch_btn').appendTo(switchPane);
            });
        }

        var searchPane = new FR.ESSearchPane({
            defaultText: FR.i18nText('Search', 'Role'),
            fn: function() {
                self.searchRole();
            }
        });
        searchPane.element.css('float','right').appendTo(btn_wrapper);

        if (FSRoles.length > 0) {
            this.$operatePane[0] = this.makeOperateListPane(FSRoles, 0);
            this.$operatePane[0].appendTo(this.$allocateBody);
        }
        if (platFormRoles.length > 0 || this.plEditable) {
            this.$operatePane[1] = this.makeOperateListPane(platFormRoles, 1);
            this.$operatePane[1].appendTo(this.$allocateBody);
        }

        if (FSRoles.length > 0 && (platFormRoles.length > 0  || this.plEditable)) {
            this.showOperatePane(0);
        }

        var bottom_inst = $('<div/>').addClass('es_role_source').appendTo(this.$allocateBody);

        refreshInstructions();
        function refreshInstructions() {
            role_source.html(FR.i18nText('Role_Source') + ' : ' +
                (self.curOperateIdx === 0 ? FR.i18nText('FS_Name') : FR.i18nText('M_Server-Platform_Manager')));
            var txt;
            if (self.curOperateIdx === 0) { // FS
                txt = FR.i18nText('ES_Role_Instruction1');
            } else if (self.plEditable) {  // PlatForm 可编辑
                txt = FR.i18nText('ES_Role_Instruction2');
            } else {     // PlatForm 不可编辑
                txt = FR.i18nText('ES_Role_Instruction3');
            }
            bottom_inst.html(txt);
        }

        var config = {
            title: FR.i18nText('Privilege_Allocate'),
            width: 600,
            height: 400,
            text4OK: FR.i18nText('OK'),
            text4Cancel : FR.i18nText('Cancel'),
            confirm : true,
            resizeable: false,
            closeAfterAction: false,
            onOK: function() {
                if (self.setAllRoles() !== false) {
                    this.doClose();
                }
            },
            onCancel: function() {
                self.hideAllocatePane()
            },
            contentHtml: $allocatePane
        }
        this.allocateDialog = new FR.Dialog(config);
        this.allocateDialog.setVisible(true);
    },

    initPlatFormRoles: function(platFormRoles) {
        var allTaskItems = this.taskTable.options.items;
        for (var i= 0, len=platFormRoles.length; i<len; i++) {
            var role = platFormRoles[i];
            role.text = role.roleName;
            role.value = role.roleName;
            var arr = [];
            role.esTask_backup_item = [];
            // role.esTask 是一个存有报表路径的数组
            for (var j=0; j<allTaskItems.length; j++) {
                if($.inArray(allTaskItems[j].reportpath, role.esTask) !== -1) {
                    arr.push(allTaskItems[j]);
                    role.esTask_backup_item.push(allTaskItems[j]);
                }
            }
            role.esTask = arr;
            role.chosenListIndex = 0;
            role.toChooseListIndex = 0;
        }
    },

    makeOperateListPane: function(roles, idx) {
        var self = this;
        var $operatePane = $('<div/>').css({
            width: '100%',
            height: 230
        });

        this.makeIdx = idx;
        var roleListPane = this.createSingleListPane(
            $operatePane, FR.i18nText('Role_List'), roles, function() {
            self.refreshTaskItems();
        });
        roleListPane.addClass('es_role_list');
        this.role_list[idx] = roleListPane.list;

        var chosenItems = (roles[0] && roles[0].esTask) ? roles[0].esTask : [];
        var chosenTaskPane = this.createSingleListPane(
            $operatePane, FR.i18nText('Task_List_Chosen'), chosenItems, function() {
            var role = self.getCurrentRoleObject();
            if (self.chosen_list[self.curOperateIdx]) {
                role.chosenListIndex = self.chosen_list[self.curOperateIdx].getSelectedIndex();
            }
        });
        chosenTaskPane.addClass('es_chosen_task').css('margin-left', '31px');
        this.chosen_list[idx] = chosenTaskPane.list;

        var operateButtonPane = $('<div style="float:left"/>').appendTo($operatePane).css({
            width:50,
            height:'100%',
            marginLeft:10,
            marginRight:10
        });

        var allItems = this.taskTable.options.items;
        var toChooseTaskPane = this.createSingleListPane(
            $operatePane, FR.i18nText('Task_List_To_Choose'), allItems, function() {
            var role = self.getCurrentRoleObject();
            if (self.tochoose_list[self.curOperateIdx]) {
                role.toChooseListIndex = self.tochoose_list[self.curOperateIdx].getSelectedIndex();
            }
        });
        toChooseTaskPane.addClass('es_tochoose_task');
        this.tochoose_list[idx] = toChooseTaskPane.list;

        function moveLeft(role) {
            var list = self.tochoose_list[self.curOperateIdx];
            if ($('.fr-list-node-el', $(list.element)).eq(list.getSelectedIndex()).hasClass('es_list_node_el_added')) {
                return;
            }
            var task = list.getSelectedData();
            role.esTask.push(task);
            role.toChooseListIndex ++;
        }
        function moveRight(role) {
            var list = self.chosen_list[self.curOperateIdx];
            var task = list.getSelectedData();
            role.esTask.remove(task);
            if (role.esTask.length > 0 && role.chosenListIndex >= role.esTask.length) {
                role.chosenListIndex --;
            }
        }
        function allMoveLeft(role) {
            role.esTask.length = 0;
            $.each(self.taskTable.options.items, function(idx, item) {
                role.esTask.push(item);
            });
        }
        function allMoveRight(role) {
            role.esTask.length = 0;
        }
        var moveBtn = [];
        $.each(["move_left", "move_right", "all_move_left", "all_move_right"], function(idx, item) {
            moveBtn[idx] = new FR.IconButton({
                width:44,
                height: 24,
                imgsrc: "es_btn_" + item,
                handler: function() {
                    var currentRole = self.getCurrentRoleObject();
                    switch (idx) {
                        case 0:
                            moveLeft(currentRole);
                            break;
                        case 1:
                            moveRight(currentRole);
                            break;
                        case 2:
                            allMoveLeft(currentRole);
                            break;
                        case 3:
                            allMoveRight(currentRole);
                            break;
                    }
                    self.refreshTaskItems();
                }
            });
            moveBtn[idx].element.addClass('es_operate_btn');
        })
        operateButtonPane
            .append(moveBtn[0].element).append(moveBtn[1].element)
            .append(moveBtn[2].element.css('margin-top', '35px')).append(moveBtn[3].element);
        return $operatePane;
    },

    createSingleListPane: function(parent, title, items, fn) {
        var self = this;
        var editable = this.makeIdx === 1 && this.plEditable;
        var listPane = $('<div/>').addClass('es_list_pane').appendTo(parent);
        var listTitle = $('<div>' + '<span style="float:left">' + title
            + '</span>' + '</div>').addClass('es_list_title').appendTo(listPane);
        if (editable) {
            var addBtn = $('<span>&nbsp;</span>')
                .addClass('es_role_add').addClass('es_title_btn')
                .click(function() {
                    var list = self.role_list[1];
                    if (list) {
                        var texts = list.getDataValues();
                        var defaultName = "newRole";
                        for(var i=0; ; i++) {
                            if ($.inArray("newRole" + i, texts) === -1) {
                                defaultName = 'newRole' + i;
                                break;
                            }
                        }
                        FR.Msg.prompt(FR.i18nText('Add', 'Role'),
                            FR.i18nText('Role', 'Name') + "：", defaultName, function(result) {
                                var datas = list.getDataItems();
                                for (var i=0; i<datas.length; i++) {
                                    if (datas[i].value == result) {
                                        FR.Msg.toast(FR.i18nText('Cannot_Set_Duplicate_Role_Name'));
                                        return;
                                    }
                                }
                                list.addItem({
                                    text: result,
                                    value: result,
                                    esTask: [],
                                    toChooseListIndex: 0,
                                    chosenListIndex: 0
                                })
                            }, 200);
                    }
                });
            if ($.browser.msie && !$.support.boxModel) {
                addBtn.css('margin-top', '0px');
            }
            listTitle.append(addBtn);
        }
        var list = new FR.ESList({
            width: 148,
            height:188,
            items: items,
            eventFn: fn,
            removeSelf: editable ? "es_role_remove" : undefined,
            removeConfirm: function(fun) {
                FR.Msg.confirm(FR.i18nText('Delete', 'Role'),
                    FR.i18nText('Sure_To_Remove_This_Role') + "？", function(result) {
                    if (result) {
                        fun();
                        self.refreshTaskItems();
                    }
                }, 200);
            },
            editSelf: editable ? "es_role_edit" : undefined,
            editConfirm: function(list, currentIndex) {
                var record = list.options.data.getRecord(currentIndex);
                FR.Msg.prompt(FR.i18nText('Edit', 'Role'),
                    FR.i18nText('Please_Enter') + FR.i18nText('Role', 'Name') + "：", record.data.text, function(result) {
                        if (result != null) {
                            // 考虑名字重复
                            var datas = list.getDataItems();
                            for (var i=0; i<datas.length; i++) {
                                if (datas[i].value == result) {
                                    FR.Msg.toast(FR.i18nText('Cannot_Set_Duplicate_Role_Name'));
                                    return;
                                }
                            }
                            list.editItem(currentIndex, {text: result, value: result});
                        }
                }, 200);
            }
        });
        if (items.length > 0) {
            list.setSelectedIndex(0);
        }
        listPane.append(list.element);
        listPane.list = list;
        delete this.makeIdx;
        return listPane;
    },

    refreshTaskItems: function() {
        var idx = this.curOperateIdx;
        if (!this.role_list[idx]) {
            return;
        }
        var role = this.getCurrentRoleObject();

        var chosenTask = role ? role.esTask : [];

        var selectedIndex = 0;
        if (role && role.chosenListIndex < chosenTask.length) {
            selectedIndex = role.chosenListIndex;
        }

        this.chosen_list[idx].refresh(chosenTask, selectedIndex);

        var choseIdArr = [];
        var toChooseList = this.tochoose_list[idx];
        var items = toChooseList.getDataItems();
        var listContent = $('.fr-list-content', $(toChooseList.element));
        for (var i=0; i<chosenTask.length; i++) {
            choseIdArr[i] = chosenTask[i].id;
        }
        for (var i=0; i<items.length; i++) {
            var el = $('.fr-list-node-el', listContent.children().eq(i));
            if ($.inArray(items[i].id, choseIdArr) != -1) {
                el.addClass('es_list_node_el_added');
            } else {
                el.removeClass('es_list_node_el_added');
            }
        }
        if (role && role.toChooseListIndex < items.length) {
            toChooseList.setSelectedIndex(role.toChooseListIndex);
        }
    },

    searchRole: function() {
        var inp = $(".es_search_input", this.$allocatePane);
        var val = inp.hasClass("es_search_input_empty") ? "" : inp.val();
        var showAll = false;
		if (val) {
			val = val.replace(/^\s+|\s+$/g,"");
		}
		if (!val || val.length <= 0) {
			showAll = true;
		}
        var list = this.role_list[this.curOperateIdx];
        var items = list.getDataItems();
        var listContent = $('.fr-list-content', $(list.element));
        for (var i=0; i<items.length; i++) {
            var listNode = listContent.children().eq(i);
            if (items[i].value.indexOf(val) === -1 && !showAll) {
                listNode.hide();
            } else {
                listNode.show();
            }
        }
    },

    getCurrentRoleObject: function() {
        return this.role_list[this.curOperateIdx].getSelectedData();
    },

    showOperatePane: function(idx) {
        if (idx === 0) {
            this.curOperateIdx = 0;
            this.$operatePane[0].show();
            this.$operatePane[1].hide();
        } else if (idx === 1) {
            this.curOperateIdx = 1;
            this.$operatePane[1].show();
            this.$operatePane[0].hide();
        }
        this.refreshTaskItems();
    },

    showAllocatePane: function() {
        var items = this.taskTable.options.items;
        if (!this.allocateDialog || this.taskChange) {
            for (var i=0; i<items.length; i++) {
                items[i].value = items[i].id;
                items[i].text = items[i].taskname;
            }
            this.createAllocatePane();
            this.taskChange = false;
        } else {
            this.allocateDialog.setVisible(true);
        }
    },

    hideAllocatePane: function() {
        this.allocateDialog.setVisible(false);
    },

    setAllRoles : function() {
        // 不管是FS和Platform保存的时候都传递改变的数据
        // 注意post get的数据长度限制
        if (this.$operatePane[0] && this.$operatePane[1]) {
            var s1 = this.setFSRoles();
            var s2 = this.setPlatFormRoles();
            // 存在非true非false的返回 那么返回false终止弹窗关闭
            if (s1 == null || s2 == null) {
                return false;
            } else {
                FR.Msg.toast((s1 === false || s2 === false) ? FR.i18nText('Failed') : FR.i18nText('Successfully'));
            }
        } else if (this.$operatePane[0]) {
            var s = this.setFSRoles();
            if (s == null) {
                return false;
            } else {
                FR.Msg.toast("Save FS roles " + (s ? "Successfully" : "Failed"));
            }
        } else if (this.$operatePane[1]) {
            var s = this.setPlatFormRoles();
            if (s == null) {
                return false;
            } else {
                FR.Msg.toast("Save PlatForm roles " + (s ? "Successfully" : "Failed"));
            }
        }
    },

    setFSRoles : function() {
        var allRole = this.role_list[0].getDataItems();
        return FR.ESTrans.setFSRoles(allRole);
    },

    setPlatFormRoles: function() {
        var self = this;
        // 提交前判断下平台管理的角色信息有没有发生变动
        var allRole = this.role_list[1].getDataItems();
        var newRoles = this.checkPlatformRoleChange();
        if (newRoles !== false) {
            FR.Msg.confirm(FR.i18nText('Warning'), FR.i18nText('Platform_Roles_Has_Changed'), function(confirm) {
                if (confirm) {
                    self.initPlatFormRoles(newRoles);
                    // 把设置的task数据传给新的角色列表
                    for (var i=0; i<newRoles.length; i++) {
                        for (var j=0; j<allRole.length; j++) {
                            if (allRole[j].roleName == newRoles[i].roleName) {
                                newRoles[i] = allRole[j];
                                break;
                            }
                        }
                    }
                    // 更新备份
                    self.platFormRoles_backup = [];
                    for (var i=0; i<newRoles.length; i++) {
                        self.platFormRoles_backup.push(newRoles[i].roleName);
                    }
                    // 更新界面
                    self.role_list[1].refresh(newRoles, 0);
                }
                return;
            }, 300);
        } else {
            return FR.ESTrans.setPlatFormRoles(allRole, this.platFormRoles_backup);
        }
    },

    // return false when not change or new roles when change
    checkPlatformRoleChange: function() {
        var newRoles = FR.ESTrans.getPlatFormRoles();
        if (newRoles.length == this.platFormRoles_backup.length) {
            for (var i=0; i<newRoles.length; i++) {
                if ($.inArray(newRoles[i].roleName, this.platFormRoles_backup) === -1) {
                    return newRoles;
                }
            }
            return false;
        }
        return newRoles;
    },
	
	getErrorMsg : function(processid, ro) {
        var self = this;
        var json_array = this.errorInfos[processid];
		if (json_array == null || !(FR.isArray(json_array))) {
			return '';
		}
		var $resDiv = $('<div/>').css({'overflow-x':'hidden', 'overflow-y':'auto', 'height':280, 'width':340, "padding-left":10});
		var $tableWrap = $('<div/>').css({'height':200, 'width':330, 'overflow':'auto'}).appendTo($resDiv);
		var $table = $("<table cellspacing='0' cellpadding='0'>")
            .addClass('verify-table').css('width', 300).appendTo($tableWrap);
		var $tbody = $("<tbody>").appendTo($table);
		$tbody.append("<tr class='verify-header'>" +
				"<td class='es_verify_failed'>" + FR.i18nText('Verify_Error') + "！" + "</td>" +
				"</tr>");
		$.each(json_array, function(idx, item) {
			for (var i = 0; i < item.warnning.length; i++) {
				var $td = $('<td/>').css('cursor', 'pointer').text('(' + item.name + ') ' + item.warnning[i]);
	        	$tbody.append($("<tr" + (idx % 2 === 0 ? " class='verify-row-alt'" : "") +"></tr>").append($td));
			}
        });
        var prospectFile = '';
        if (ro.exportfile) {
            if (ro.exporterror) {
                prospectFile += FR.i18nText('Prospecting_File_Error') + "：" + ro.exporterror;
            } else {
                prospectFile += '<a class="fr_es_error_a" href="' + FR.servletURL + "?op=excel_submit&cmd=es_download&processid=" + processid + '">'
                              + FR.i18nText('Face_View', 'Prospecting_File') + '</a>';
            }
        }
        var bottomPane = $('<div/>').css({
            'height':'28px',
            'width': '130px',
            'margin': $.browser.msie && !$.support.boxModel ? '15px 0 0 100px' : '15px auto 0 auto'
        }).appendTo($resDiv);
        var btn = new FR.QuickButton({
            width: 54,
            height: 28,
            style: 'blue',
            text: FR.i18nText('OK'),
            imgsrc: 'es_confirm_btn',
            handler: function() {
                self.verifyDialog.destroy();
                if (self.verifyDialog.mask) {
                    self.verifyDialog.mask.hide();
                }
            }
        });
        var fileLink = $('<div/>').html(prospectFile);
        var $bottomTable = $('<table cellpadding="0px" cellspacing="0px"/>').appendTo(bottomPane).css({
            'border-spacing': 0,
            'border-collapse': 'collapse'
        });
        var $tr = $('<tr/>').appendTo($bottomTable);
        $('<td/>').append(btn.element.css('position', 'relative')).appendTo($tr);
        $('<td/>').append(fileLink).appendTo($tr);

        var o = {
            title: FR.i18nText('Verify-Message'),
            width: 350,
            height: 300,
            contentHtml: $resDiv
        }
        this.verifyDialog = new FR.Dialog(o);
        this.verifyDialog.setVisible(true);

	}
});

/* 
 * carl:抄自FS那边的Grid控件，等ben把那边的控件统一了，再重构
 * 改动：
 * fs_开头的class改成fres_开头的
 * FS.IconButton 改成 FS.IconButton
 * 删了所有dialog相关，这里没必要
 * 把FS.Events 改成 FRES.Grid.Events
 * 实现multi
 * 实现内部内容控件化
 * .fr_es_tasktable #fres_grid_table tbody tr 变成 .fres_table_tr
 */
FR.ESGrid = FR.extend(FR.Widget, {
	_defaultConfig : function() {
		return $.extend(FR.ESGrid.superclass._defaultConfig.call(), {
			cls : '',
			selfbar : '',
			drag : false,
			resize : false,
			page : true,
			multi : false,
			pagecount : 10,
			columnsconfig : [{text : 'test', width : 120, sort: false, hide : false, widget : {type : 'text', items : []}}],
			items : [{test : 'hello'}, {test : 'world'}], 
			width : 500,
			height : 200
		});
	},
	
	_init : function() {
		FR.ESGrid.superclass._init.apply(this, arguments);
		this.confireWidth();
		this.element.addClass('fres_grid').addClass(this.options.cls);
		this.titlePane();
		this.toolbarPane();
		this.headPane();
		this.tablePane();
		this.element.append(this.tableContainer);
	},
	
	confireWidth : function() {
		var width = 0;
		for(var i = 0, len = this.options.columnsconfig.length; i < len; i++) {
			width += this.options.columnsconfig[i].width;	
		}
		this.options.width = width;
		this.element.width(width);
	},
		
	titlePane : function() {
		if (this.options.title != null) {
			this.titleDom = $('<div/>').attr('id', 'fres_grid_title').text(this.options.title);
			this.element.append(this.titleDom);
		}		
	},
	
	toolbarPane : function() {
        var self = this;
        var btnSize = 28;
        var toolbarPane = $('<div/>').attr('id', 'fres_grid_toolbar').appendTo(this.element);
        var firstWrapper = $('<div style="width:100%; height:28px; margin-top:10px">');
        var secondWrapper = $('<div/>').addClass('fres_grid_toolbar_wrapper').appendTo(toolbarPane);

        // 查询
        var searchPane = new FR.ESSearchPane({
            defaultText: FR.i18nText('Search') + FR.i18nText('Task_Name'),
            fn: function() {
                self.search();
            }
        });
        // 页码
        var pagePane = $('<div/>').addClass('es_page_pane');
        // 传入的按钮面板
        if (this.options.selfbar) {
            firstWrapper.prependTo(toolbarPane);
            searchPane.element.css('float','right').appendTo(firstWrapper);
            this.options.selfbar.appendTo(secondWrapper);
        } else {
            searchPane.element.css('float','left').appendTo(secondWrapper);
        }
        pagePane.appendTo(secondWrapper);

        this.totalpages = Math.ceil(this.options.items.length / this.options.pagecount);
        this.mp = new FR.IconButton({
            width: btnSize,
            height: btnSize,
            renderEl : $('<div/>'),
            imgsrc : 'es_btn_pre_page',
            handler : function() {
                self.move2PrePage();
            }
        });
        this.mn = new FR.IconButton({
            width: btnSize,
            height: btnSize,
            renderEl : $('<div/>'),
            imgsrc : 'es_btn_next_page',
            handler : function() {
                self.move2NextPage();
            }
        });
        this.activedPage = this.totalpages ? 1 : 0;
        var wrap = $('<div/>').addClass('es_page_btn_wrap')
            .click(function() {
                if (self.pageListPane) {
                    if (self.pageListPane.is(":hidden")) {
                        $('.fr_pop_pane').hide();
                        self.pageListPane.show();
                    } else {
                        self.pageListPane.hide();
                    }
                } else {
                    $('.fr_pop_pane').hide();
                    self.pageListPane = $('<div/>').addClass('es_page_list_pane fr_pop_pane').appendTo(paging_btn);
                    var data = [];
                    var total = self.totalpages;
                    for (var i=1; i<=total; i++) {
                        data.push({
                            'text': i + '/' + total,
                            'value': i
                        })
                    }
                    var list = self.pageList = new FR.ESList({
                        width: 70,
                        height: 150,
                        items: data,
                        eventFn: function() {
                            self.move2AppointPage(list.getValue());
                            self.pageListPane.hide();
                        }
                    });
                    list.element.appendTo(self.pageListPane);
                }
            });
        this.totalPane = $('<div/>').addClass('es_paging_span')
            .html(this.activedPage + '/' + this.totalpages).appendTo(wrap);
        var paging_btn = $('<div/>').addClass('es_paging_btn').appendTo(wrap);

        pagePane.append(wrap)
            .append(this.mp.element.addClass('es_page_btn'))
            .append(this.mn.element.addClass('es_page_btn'));

        this.checkPageButtonState();
	},
	
	headPane : function() {
		var h = (this.options.selfbar ? 30 : 0) + (this.options.page ? 22 : 0) + (this.options.title != null ? 20 : 0);
		this.tableContainer = $('<div/>').attr('id', 'fres_grid_tablecontainer').width(this.options.width).height(this.options.height - h);
		this.table = $('<table/>').attr({id : 'fres_grid_table', cellPadding : 0, cellSpacing : 0}).appendTo(this.tableContainer);
		this.head = $('<thead/>').attr('id', 'fres_grid_head');
		var tr = $('<tr/>').appendTo(this.head);
		if (this.options.multi) {
			this.multiHead(tr);
		}
		var cc = this.options.columnsconfig;
		this.columnInfos = cc;
		for (var i = 0, len = cc.length; i < len; i++) {
			var th = $('<th/>').addClass('fres_grid_headcontent'), config = cc[i];
			th.css("font-size", "13px");
			th.width(config.width).text(config.showValue ? config.showValue : config.text);
			if (config.sort) {
				this.sortHead(th);
			}
			if (config.hide) {
				this.hideHead(th);
			}
			tr.append(th);
		}
		if (this.options.drag) {
			this.dragHead();
		}
		if (this.options.resize) {
			this.resizeHead();
		}
		this.table.append(this.head);
	},
		
	multiHead : function(tr) {
		var self = this;
		var th = $('<th/>').addClass('fres_grid_headcontent');
		th.width(20);
		var cb = new FR.CheckBox({
			renderEl : $('<div/>').appendTo(th)
		});
		cb.on(FR.Events.CLICK, function() {
			self.selectAllBox(cb.selected());
		});
		
		this.multi_head_cb = cb;
		tr.append(th);
	},
	
	selectAllBox : function(select) {
		if (!this.multi_array) {
            return;
        }
		$.each(this.multi_array, function(idx, item){
			item.checkbox.selected(select);
		});
	},
	
	/*b:暂时数据全部加载*/
	tablePane : function() {
		this.tbody = $('<tbody/>').attr('id', 'fres_grid_tbody');
		this.renderActivePage();
		this.table.append(this.tbody);
	},
	
	footPane : function() {
		if (!this.options.page) {
			return;
		}
		this.foot = $('<div/>').attr('id', 'fres_grid_foot');
		var self = this;
		// 搜索
		var table = $('<table/>').attr({id : 'fres_grid_finder', cellPadding : 0, cellSpacing : 0});
		this.finder = new FR.IconButton({
			renderEl : $('<div/>'),
			imgsrc : 'fres_grid_bn_finder',
			handler : function() {
				self.search();
			}
		});
		var tr = $("<tr/>").append($("<td/>").append($('<input id="fres_grid_finder_input" type="text" />')));
		tr.append($("<td/>").append(this.finder.element));
		tr.appendTo(table);
		this.foot.append(table);
		this.finder.setEnable(true);
		
		// page..
		this.totalpages = Math.ceil(this.options.items.length/this.options.pagecount);
		table = $('<table/>').attr({id : 'fres_grid_foot_table', cellPadding : 0, cellSpacing : 0});
		this.mf = new FR.IconButton({
			renderEl : $('<div/>'),
			imgsrc : 'fres_grid_foot_movefirst',
			handler : function() {
				self.move2FirstPage();
			}
		});
		this.mp = new FR.IconButton({
			renderEl : $('<div/>'),
			imgsrc : 'fres_grid_foot_movepre',
			handler : function() {
				self.move2PrePage();
			}
		}); 
		this.mn = new FR.IconButton({
			renderEl : $('<div/>'),
			imgsrc : 'fres_grid_foot_movenext',
			handler : function() {
				self.move2NextPage();
			}
		}); 
		this.ml = new FR.IconButton({
			renderEl : $('<div/>'),
			imgsrc : 'fres_grid_foot_movelast',
			handler : function() {
				self.move2LastPage();
			}
		});
		this.activedPage = this.totalpages ? 1 : 0;
		this.pageLoader = $('<input id="fres_grid_foot_loader" type="text" />').val(this.activedPage).keydown(function(e) {
			if (e.keyCode === 13) {
				self.move2AppointPage($(this).val());
				e.stopEvent();
			}			
		});
		this.totalPane = $('<span/>').text(FR.i18nText('Page_Total') + this.totalpages + FR.i18nText('Page_Number'));
		$('<tr/>').append($('<td/>').append(this.mf.element)).append($('<td>').append(this.mp.element))
			.append($('<td/>').addClass('fres_grid_foot_pageshow').append(this.pageLoader).append(this.totalPane))
			.append($('<td/>').append(this.mn.element)).append($('<td/>').append(this.ml.element)).appendTo(table);
		
		
		if ($.browser.msie) {
			this.foot.append($("<center style='width:100%'></center>").append(table));
		} else {
			this.foot.append(table);
		}
		this.checkPageButtonState();
	},
	
	checkPageButtonState : function() {
		if (this.activedPage < 2) {
            this.enableButton(this.mf, false);
            this.enableButton(this.mp, false);
		} else {
            this.enableButton(this.mf, true);
            this.enableButton(this.mp, true);
		}
		if (this.activedPage == this.totalpages) {
            this.enableButton(this.mn, false);
            this.enableButton(this.ml, false);
		} else if (this.activedPage < this.totalpages && this.totalpages > 1) {
            this.enableButton(this.mn, true);
            this.enableButton(this.ml, true);
		}		
	},
    enableButton: function(btn, enable) {
        if (btn) {
            btn.setEnable(enable);
        }
    },
	
	move2NextPage : function() {
		++this.activedPage;
		this.renderActivePage();
	},
	
	move2PrePage : function() {
		--this.activedPage;
		this.renderActivePage();
	},
	
	move2FirstPage : function() {
		this.activedPage = 1;
		this.renderActivePage();
	},
	
	move2LastPage : function() {
		this.activedPage = this.totalpages;
		this.renderActivePage();
	},
	
	move2AppointPage : function(index) {
		if (index < 1 || index > this.totalpages) {
			FR.Msg.toast(FR.i18nText('HJS-Specified_Pages', 'Not_Exist') + "!");
			return;
		}
		if (this.activedPage == index) {
			return;
		}
		this.activedPage = index;
		this.checkPageButtonState();
		this.renderActivePage();
	},
	
	renderActivePage : function() {
		this.clearBody();
		if (!this.activedPage) {
			this.activedPage = 1;
		}
		if (this.pageLoader) {
			this.pageLoader.val(this.activedPage);
		}
		var startIndex = (this.activedPage - 1)*this.options.pagecount;
		var self = this, ilen = this.options.items.length;
		for (var i = startIndex, len = Math.min(this.options.pagecount + startIndex,  ilen); i < len; i++) {
			var item = this.options.items[i];
			var tr = $('<tr/>').addClass('fres_table_tr')
                .hover(function() {
                    $(this).find('td:first').addClass('fres_table_tr_triangle');
                }, function() {
                    $(this).find('td:first').removeClass('fres_table_tr_triangle');
                });
			if (!this.options.multi) {
				tr.click(function() {
					if (self.activedTR) {
						self.activedTR.removeClass('fres_grid_selectedtr');
					}
					$(this).addClass('fres_grid_selectedtr');
					self.activedTR = $(this);
					self.fireEvent(FR.ESGrid.Events.SELECTDATA);
				});
			}
			if (this.options.multi) {
				var cb_td = $('<td/>').addClass('fres_grid_td').appendTo(tr);
				var cb = new FR.CheckBox({
					renderEl : $('<div/>').appendTo(cb_td)
				});
				cb.element.data('tr', tr);
				cb.on(FR.Events.STATECHANGE, function(selected) {
					var tr = this.element.data('tr');
					if (selected) {
						tr.addClass('fres_table_tr_selected');
					} else {
						tr.removeClass('fres_table_tr_selected');
						self.multi_head_cb.selected(false);
					}
				});
				if (!this.multi_array) {
                    this.multi_array = [];
                }
				this.multi_array.push({index : i, checkbox : cb});
			}
			for (var j = 0, jen = this.columnInfos.length; j < jen; j++) {
				var widget = this.columnInfos[j].widget;
				if (widget && widget.type == 'custom' && widget.createHandler) {
					var cw_td = $('<td/>').addClass('fres_grid_td').appendTo(tr);
					var reEl = $('<div>').appendTo(cw_td);
					widget.createHandler(i, item, reEl);
				} else {
					var val = item[this.columnInfos[j].text];
					$('<td/>').addClass('fres_grid_td').text(val != null ? val : '').appendTo(tr);
				}
			}
			tr.appendTo(this.tbody);
		}
        this.totalPane.html(this.activedPage + '/' + this.totalpages);
		this.checkPageButtonState();

        if (this.pageList) {
            if (this.pageList.getSelectedData().value != this.activedPage) {
                this.pageList.setSelectedIndex(this.activedPage - 1);
            }
        }
	},
	
	clearBody : function() {
		this.tbody.empty();
		this.activedTR = null;
		this.multi_array = [];
		if (this.multi_head_cb) {
            this.multi_head_cb.selected(false);
        }
		this.fireEvent(FR.ESGrid.Events.NOSELECT);
	},
	
	getSelectedData : function() {
		if (!this.options.multi) {			
			return [this.options.items[this.getSelectedIndex()[0]]];
		} else {
			var selectIndexs = this.getSelectedIndex();
			var result = [];
			for (var i = 0; i < selectIndexs.length; i++) {
				result[i] = this.options.items[selectIndexs[i]];
			}
			
			return result;
		}
	},
	
	getSelectedIndex : function() {
		if (!this.options.multi) {
			if (!this.activedTR) {
				return;
			}
			var trs = $('tr', this.tbody);
			for (var i = 0, len = trs.length; i < len; i++) {
				if (trs[i] == this.activedTR[0]) {
					return [this.options.pagecount*(this.activedPage - 1) + i];
				}
			}
		} else {
			if (!this.multi_array) {
                return [];
            }
			var result = [];
			$.each(this.multi_array, function(idx, item){
				if (item.checkbox.selected()) {
					result.push(item.index);
				}
			});
			
			return result;
		}
	},
	
	reCalculator : function() {
		var pages = Math.ceil(this.options.items.length / this.options.pagecount);
        pages = pages === 0 ? 1 : pages;
		if (this.totalpages != pages) {
			this.totalpages = pages;
			this.totalPane.html(this.activedPage + '/' + this.totalpages);
		}
		
		if (this.activedPage > this.totalpages) {
			this.activedPage = this.totalpages;			
		}	
		if (!this.activedPage && this.totalpages) {
			this.activedPage = 1;
		}
		this.renderActivePage();
	},
	
	addData : function(item) {
		if (item == null) {
			return;
		}
		if (!this.fireEvent(FR.ESGrid.Events.APPENDDATA, item)) {
			return;
		}
		if (!$.isArray(item)) {
			item = [item];
		}
		Array.prototype.unshift.apply(this.options.items, item);
//		this.options.items.unshift(item);
		var si = this.getSelectedIndex();
		this.reCalculator();
		if (!this.options.multi) {
			this.activedTR = $('tr.fres_grid_selectedtr', this.tbody).eq((si ? si[0] : 0) + item.length);
			/*b:多选下要注意*/
			if (!this.activedTR[0]) {
				this.fireEvent(FR.ESGrid.Events.NOSELECT);
			} else {
				this.activedTR.addClass('fres_grid_selectedtr');
			}
		}

	},
	
	removeSelectedData : function() {
		var rs = this.getSelectedData();
		/*b:单个删除暂时*/
		if (!this.fireEvent(FR.ESGrid.Events.REMOVEDATA, this.options.multi ? rs : rs[0])) {
			FR.Msg.toast("Grid removedata failed!");
			return;
		}
		/*b:比较复杂的方式，to improve*/
		for (var i = 0, len = rs.length; i < len; i++) {
			this.options.items.remove(rs[i]);
		}
		this.reCalculator();
		this.activedTR = null;
		this.fireEvent(FR.ESGrid.Events.NOSELECT);
	},
	
	changeSelectedData : function(item) {
		var si = this.getSelectedIndex();
		this.options.items[si[0]] = $.extend(this.options.items[si[0]], item);
		if (!this.fireEvent(FR.ESGrid.Events.EDITDATA, this.options.items[si[0]])) {
			FR.Msg.toast("Grid editdata failed!");
			return;		
		}
		this.reCalculator();
		if (!this.options.multi) {
			this.activedTR = $('tr', this.tbody).eq(si[0]).addClass('fres_grid_selectedtr');
			this.fireEvent(FR.ESGrid.Events.SELECTDATA);
		}
	},
	
	popData : function(items) {
		if (items == null) {
			this.clearBody();
			this.options.items = [];
			return;
		}
		this.options.items = items;
		this.backup_items = items;
		this.reCalculator();
	},
	
	search : function() {
//		var val = $("#fres_grid_finder_input").val();
        var inp = $(".es_search_input", $(this.element));
        var val = inp.hasClass("es_search_input_empty") ? "" : inp.val();
		if (val) {
			val = val.replace(/^\s+|\s+$/g,"");
		}
		if (!val || val.length <= 0) {
			// 没有内容就全展示
			this.options.items = this.backup_items;
			this.reCalculator();
		} else {
			var result = [];
			var needSearch = {};
			$.each(this.options.columnsconfig, function(idx, item) {
				if (item.forSearch) {
					needSearch[item.text] = true;
				}
			});
			
			for (var i = 0; i < this.backup_items.length; i++) {
				var item = this.backup_items[i];
				for (var attr in item) {
					if (needSearch[attr]) {
						var value = item[attr];
						if (typeof value == 'string' && value.indexOf(val) > -1) {
							result.push(item);
							break;
						}
					}
				}
			}
			
			this.options.items = result;
			this.reCalculator();
		} 
	},
	
	loading : function(load) {
	
	},
	
	sortHead : function(th) {
		
	},
	
	sortItems : function() {
		
	},
	
	hideHead : function() {
		
	},
	
	resizeHead : function() {
		
	},
	
	dragHead : function() {
		
	}
});

$.extend(FR.ESGrid, {
	Events : {
		SELECTDATA : 'FG_SELECTDATA',
		
		NOSELECT : 'FG_NOSELECT',
		
		APPENDDATA : 'FG_APPENDDATA',
		
		EDITDATA : 'FG_EDITDATA',
		
		REMOVEDATA : 'FG_REMOVEDATA'
	}
});

FR.ESListReader = FR.extend(FR.ArrayReader, {
    _init : function() {
        FR.ESListReader.superclass._init.apply(this, arguments);
    },

    readObject : function(o) {
        if (o.length == null) {
            o = [o];
        }
        if ($.isArray(o)) {
            if (typeof o[0] == 'string') {
                this.options.showField = this.options.valueField = 'text';
                for (var i = 0, len = o.length; i < len; i++) {
                    o[i] = {text : o[i]};
                }
            }
            var records = [];
            var config = {};
            config.showField = this.options.showField != null ? this.options.showField : 'text';
            config.titleField = this.options.titleField != null ? this.options.titleField : 'titleText';
            config.valueField = this.options.valueField != null ? this.options.valueField : 'value';
            for (var i = 0, len = o.length; i < len; i++) {
                config.data = o[i];
                records.push(new FR.Record(config));
            }
            return records;
        }
    }
});

FR.ESList = FR.extend(FR.ListEditor, {
    _defaultConfig : function() {
   		return $.extend(FR.ESList.superclass._defaultConfig.call(), {
   			icon : false,
   			multi : false,
   			limitData :  2000,
   			textAlign : "left"
   		});
   	},

   	_init : function() {
   		FR.ESList.superclass._init.apply(this, arguments);
   		if (this.getSelectedIndex() < 0) {
   			this.fireEvent(FR.Events.NOSELECT);
   		}
   		if ($.browser.msie && $.browser.version == '6.0') {
   			this.element.css('position', 'relative');
   		}
   		$('div > ul', this.element).css('overflow', 'hidden');
   	},

    initData: function () {
        if (this.options.data) {
            return;
        }
        if (this.options.items) {
            this.options.data = new FR.SynchronData({
                dataSource: new FR.SynchronObjectSource({
                    object: this.options.items
                }),
                dataReader: new FR.ESListReader()
            });
            return;
        }
        FR.ESList.superclass.initData.apply(this);
    },

    getDataItems: function() {
        return this.options.items;
    },

    getDataValues: function() {
        var texts = [];
        for (var i=0; i<this.options.items.length; i++) {
            texts[i] = this.options.items[i].value;
        }
        return texts;
    },

    initLiEvent : function(li) {
        var self = this;
        li.hover(function(){
            $(this).addClass("fr-es-list-node-over");
        }, function(){
            $(this).removeClass("fr-es-list-node-over");
        }).click(function(e) {
            self.doSelected(e, $(this));
            if (self.options.eventFn) {
                self.options.eventFn.apply();
            }
        });
        if (this.options.draggable) {
            li.css('cursor', 'move');
        }
    },

    addItem: function(data) {
        var record = new FR.ESListReader().readObject([data])[0];
        this.options.needHead = true;
        this.doAddItem(record, false);
        this.options.items.push(data);
    },

    removeItem: function(li) {
        FR.ESList.superclass.removeItem.apply(this, arguments);
        var currentIndex = li.attr('id').split(this.options.cpPrefix)[1];
        this.options.items.splice(currentIndex, 1);
    },

    createLi: function(record, index) {
        var li = FR.ESList.superclass.createLi.apply(this, arguments);

        this.modifySpanLength(li, 19);

        if (this.options.editSelf) {
            // 删除按钮和编辑按钮只在hover的时候显示 离开随即移除
            var self = this;
            li.css('padding-left', '6px');
            var remove_btn = $('.es_role_remove', li);
            if (!this.removeBtn) {
                this.removeBtn = remove_btn.css('padding-left', '18px');
            }
            remove_btn.remove();

            if (!this.editBtn) {
                this.editBtn = $('<span>&nbsp;</span>').addClass(this.options.editSelf)
                    .css({'padding-left' : '12px', 'float' : 'right'});
            }

            li.hover(function() {
                self.modifySpanLength($(this), 14);
                $(this).addClass('fr-es-list-node-over');
                var dc = $('.fr-list-node-el', $(this));
                self.removeBtn
                    .click(function(e) {
                        var li = $(this).parent().parent();
                        if (self.options.removeConfirm) {
                            self.options.removeConfirm(function() {
                                self.removeItem(li);
                            });
                        }
                    });
                self.editBtn
                    .click(function(e) {
                        $(this).removeClass('fr-es-list-node-over');
                        var li = $(this).parent().parent();
                        var currentIndex = li.attr('id').split(self.options.cpPrefix)[1];
                        if (self.options.editConfirm) {
                            self.options.editConfirm(self, currentIndex);
                        }
                    });
                // firefox里a和span要想在同一行的话 span写在前面才行
                self.editBtn.prependTo(dc);
                self.removeBtn.prependTo(dc);
            }, function() {
                self.editBtn.remove();
                self.removeBtn.remove();
                self.modifySpanLength($(this), 19);
            })

  	    }
        return li;
    },

    clearSelected: function () {
        $('.fr-list-node', this.element)
            .removeClass('fr-es-list-node-selected');
        this.fireEvent(FR.Events.NOSELECT);
    },

    modifySpanLength: function(li, maxByte) {
        var span = $('.fr-list-node-anchor', li).children();
        if (this.options.items.length > 9) {
            maxByte -= 3;
        }
        // title 显示的是真实值
        var txt = span.attr('title');
        if ((txt.length + FR.byteLength(txt)) / 2 > maxByte) {
            txt = txt.substring(0, Math.min(txt.length, maxByte));
            while((txt.length + FR.byteLength(txt)) / 2 > maxByte) {
                txt = txt.substring(0, txt.length-1);
            }
            txt += "..";
        }
        span[0].innerText = txt;
    },

    refresh: function(items, selectedIndex) {
        var chosen_pane = $(this.element).parent();
        delete this.options.data;
        this.options.items = items;
        this._init();
        this.setSelectedIndex(selectedIndex);
        $('.fr-list-bwrap', chosen_pane).remove();
        chosen_pane.append(this.element);
    },

    editItem : function(currentIndex, data) {
        var record = this.options.data.getRecord(currentIndex);
        $.extend(record.data, data);
        var li = $("#" + this.id + this.options.cpPrefix + currentIndex);
        $('.fr-list-node-anchor', li).children().attr('title', data.value);
        if (this.fireEvent(FR.Events.EDITDATA, record.data)) {
            this.options.showAsHtml?$("a > span", li).html(record.getShowValue()):$("a > span", li).text(record.getShowValue());
        }
    }

});

FR.ESButton = FR.extend(FR.OB, {
    _defaultConfig: function () {
        return $.extend(FR.ESButton.superclass._defaultConfig.apply(this, arguments), {
            // 顺序: normal class, hover class, clicked class, other class
            classes: [],
            styles: undefined,
            hoverFn: [],
            clickFn: undefined,
            downFn: undefined
        })
    },

    _init: function() {
        var self = this;
        this.element = $('<div/>');
        if (this.options.classes) {
            for (var i=0; i<this.options.classes.length; i++) {
                if (i === 1 || i === 2) {
                    continue;
                }
                this.element.addClass(this.options.classes[i]);
            }
        }
        if (this.options.styles) {
            this.element.css(this.options.styles);
        }
        if (this.options.hoverFn && this.options.hoverFn.length === 2) {
            this.element.hover(this.options.hoverFn[0], this.options.hoverFn[1]);
        } else if (this.options.classes && this.options.classes.length > 1) {
            this.element.hover(function() {
                self.element.addClass(self.options.classes[1]);
            }, function() {
                self.element.removeClass(self.options.classes[1]);
            })
        }
        if (this.options.clickFn) {
            this.element.click(this.options.clickFn);
        }
        if (this.options.downFn && this.options.downFn.length === 2) {
            this.element.mousedown(this.options.downFn[0]);
            this.element.mouseup(this.options.downFn[1]);
        }
    }

});

FR.ESSearchPane = FR.extend(FR.OB, {
    _defaultConfig: function () {
        return $.extend(FR.ESSearchPane.superclass._defaultConfig.apply(this, arguments), {
            defaultText: 'input key word',
            fn: undefined
        })
    },

    _init: function() {
        var self = this;
        var searchPane = $('<div/>').addClass('es_search_pane');
        var search_input = $('<input class="es_search_input es_search_input_empty" type="text">')
            .val(self.options.defaultText)
            .click(function() {
                if (search_input.hasClass('es_search_input_empty')) {
                    search_input.val('');
                    search_input.removeClass('es_search_input_empty');
                }
            })
            .blur(function() {
                setTimeout(function() {
                    if (search_input.val() == '') {
                        search_input.val(self.options.defaultText);
                        search_input.addClass('es_search_input_empty');
                    }
                }, 100);
            })
            .keyup(function(e) {
                if (e.keyCode == FR.keyCode.ENTER) {
                    self.options.fn();
                }
            });
//        FR.$defaultImport('/com/fr/web/core/js/jquery.watermark.js', 'js');
//        $(search_input).watermark(self.options.defaultText);
        var search_btn = new FR.IconButton({
            width: 44,
            height: 28,
            renderEl: $('<div/>'),
            imgsrc : 'es_search_btn',
            handler : self.options.fn
        })
        search_btn.element.addClass('es_search_btn');
        var $table = $('<table cellpadding="0px" cellspacing="0px"/>').appendTo(searchPane).css({
            'border-spacing': 0,
            'border-collapse': 'collapse'
        });
        var $tr = $('<tr/>').appendTo($table);
        $('<td/>').append(search_input).appendTo($tr);
        $('<td/>').append(search_btn.element).appendTo($tr);
        this.element = searchPane;
    }
});

FR.SingleProgressBar = FR.extend(FR.OB, {
    _defaultConfig: function () {
        return $.extend(FR.SingleProgressBar.superclass._defaultConfig.apply(this, arguments), {
            width: 150,
            height: 18,
            value: 0
        })
    },

    _init: function() {
        var o = this.options;
        this.element = $('<div/>').addClass('progress_bar_wrap')
            .css({
                width: o.width,
                height: o.height
            });
        this.processSpan = $('<span/>').addClass('progress_bar_span').appendTo(this.element)
            .css({
                width: 0,
                height: o.height
            });
        this.processText = $('<div/>').addClass('progress_bar_text').appendTo(this.element)
            .css({
                width: o.width,
                height: o.height,
                'line-height': o.height + 'px'
            });
        this.reset();
    },

    setValue: function(per) {
        if (per == null) {
            return;
        }
        var p = parseFloat(per);
        if (p < 0) {
            p = 0;
        } else if (p > 100) {
            p = 100;
        }
        if (p === 0 && this.value > 0) {
            return;
        }
        this.value = p;
        this.processText[0].innerHTML = p + '%';
        this.processSpan.animate({width: this.options.width * p / 100});
    },

    reset: function() {
        this.value = 0;
        this.processText[0].innerHTML = '0%';
        this.processSpan.width(0);
    }
});

FR.ESProgressBar = FR.extend(FR.OB, {
    _defaultConfig: function () {
        return $.extend(FR.ESProgressBar.superclass._defaultConfig.apply(this, arguments), {
            title: 'Progress',
            width: 400,
            height: 200,
            barWidth: 250,
            barHeight: 20,
            // 进度条数目
            count: 1,
            // 每条进度条左侧说明
            texts: ['Progress：'],
            // 每条进度条的id
            ids: ['0'],
            // 进度条的值【初始值】
            values: [0]
        })
    },

    _init: function() {
        var o = this.options;
        this.element = $('<div/>').addClass('progress_bar_pane').css({
            width: o.width,
            height: o.height
        });
        this.processSpan = [];
        this.processText = [];
        var table = $('<table/>').addClass('progress_table').appendTo(this.element);
        for (var i=0; i<this.options.count; i++) {
            var tr = $('<tr/>').appendTo(table);
            var describeTd = $('<td>' + this.options.texts[i]
                + '</td>').addClass('progress_describe_td').appendTo(tr);
            var progressTd = $('<td/>').appendTo(tr);
            var wrap = $('<div/>').addClass('progress_bar_wrap').appendTo(progressTd)
                .css({
                    width: o.barWidth,
                    height: o.barHeight
                });
            this.processSpan[i] = $('<span/>').addClass('x-progress-bar').appendTo(wrap)
                .css({
                    width: 0,
                    height: o.barHeight
                });
            this.processText[i] = $('<div/>').addClass('x-progress-text').appendTo(wrap)
                .css({
                    width: o.barWidth,
                    height: o.barHeight,
                    'line-height': o.barHeight
                });
        }
        this.setValue(this.options.values);
    },

    // 设置进度 是从1到100的数值
    // process数组或者对象
    setValue: function(process) {
        if (process == null) {
            return;
        }
        var self = this;
        if ($.isArray(process)) {
            $.each(process, function(idx, item) {
                if (item != null) {
                    changeSpanAndText(idx, item);
                }
            })
        } else if (typeof process == 'object') {
            $.each(self.options.ids, function(idx, item) {
                if (process[item] != null) {
                    changeSpanAndText(idx, process[item]);
                }
            })
        } else {
            changeSpanAndText(0, parseInt(process));
        }
        function changeSpanAndText(idx, per) {
            console && console.log(per);
            var p = parseFloat(per);
            if (p < 0) {
                p = 0;
            } else if (p > 100) {
                p = 100;
            }
            var $text = self.processText[idx];
            var $span = self.processSpan[idx];
            $text[0].innerHTML = p + '%';
            $span.animate({width: self.options.barWidth * p / 100});
        }
    }
});

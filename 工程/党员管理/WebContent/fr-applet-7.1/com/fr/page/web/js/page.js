/**
 * 分页预览对象
 * @class FR.PagePane
 * @extends FR.BasePane
 */
$.extend(FR.PagePane.prototype, /**@class FR.PagePane*/{
    /**
     * @property {Number} 当前页所在总页数中的序号
     */
    currentPageIndex:0, // 该ReportPage所属的ReportPage集中的序号

    /**
     * @property {Number} 总页数
     */
    reportTotalPage:0, // 该ReportPage所属的ReportPage集成生成的总的ReportPage的个数

    /**
     * @property {Number} 正在加载的页的序号
     */
    isLoadingPage:-1,

    /**
     * @property {Number} 已经加载的页序号组成的数组
     */
    pagesLoaded : [],
    pagesBorder: false, //是否显示分页预览时的边框,冻结的时候必须显示

    /**
     * 转向报表的第一页
     */
    gotoFirstPage:function() {
        this.gotoPage(1);
    },

    /**
     * 转向报表的上一页
     */
    gotoPreviousPage:function () {
        if (this.currentPageIndex <= 1) {
            return;
        }
        this.gotoPage(this.currentPageIndex - 1);
    },

    /**
     * 转向报表的下一页
     */
    gotoNextPage:function() {
        this.gotoPage(this.currentPageIndex + 1);
    },

    /**
     * 转向报表的最后一页
     */
    gotoLastPage:function() {
        this.gotoPage(2147483647);
    },

    /**
     * 转向报表的指定页
     * @param {Number} pn 页序号
     */
    gotoPage:function(pn) {
    	if (typeof pn != 'number' || isNaN(pn)) {
    		return;
    	}
    	if (pn < 1){
    		pn = 1;
    	}
    	// 表示正在加载页面
    	if (this.isLoadingPage >= 0) {
    		return;
    	}
    	this.fireEvent(FR.Events.STARTLOAD);
    	
    	// 标记正在加载页面
    	this.isLoadingPage = pn;
    	
		//多sheet预览, 某个sheet冻结会设置成hidden, 其他sheet非冻结时默认overflow:auto, 不然滚动条会消失
  		this.$contentPane.css({
       		overflow : 'auto'
       	});
    	
    	// alex:下面强制设置innerHTML为空字符串,jQuery.html()方法会调用empty(),很费时间
		this.$contentPane.__load__({
			url : FR.servletURL,
			params : {op : "page_content",sessionID : this.currentSessionID, pn:pn},
			scripts : true,
			forceDisplay : true,
			timeout : 3600000,
			callback : function() {
				this.fireEvent(FR.Events.AFTERLOAD);

				// carl:暂时只有图表
				this.$contentPane.asComponent({type : "fr_form", selector : 'td[widget]'});
                var $contentDIV = $(".pageContentDIV",  this.$contentPane);
                var borderCss = '1px solid rgb(149, 149, 149)';
				var $frozenPage = $(".frozen-page", this.$contentPane);
				
				if ($frozenPage.length > 0) {
					// richer:开始准备冻结
					var isCenter = $contentDIV.hasClass("contentDIV");
			       
					if (isCenter) {	// denny: 冻结且，居中显示
                        //Sean: 居中且冻结时必须显示边框，否则不好看
                        $contentDIV.css('border',borderCss);
						var self = this;
						var frozen_layout = function() {
							self.$contentPane.css("overflow", "hidden");
							$frozenPage.css("height", $contentDIV.height() - parseInt($('.report-background', $contentDIV).css("top")));
							var pageWidth = Math.min(self.$contentPane.width(), $contentDIV.width());
							$frozenPage.css("width", pageWidth - parseInt($('.report-background', $contentDIV).css("left")));
							FR.layoutFrozen($frozenPage, self.$contentPane.offset().top);
						};
						frozen_layout();
						
						//17是滚动条高度
						var $footer = $(".HF-footer", this.$container);
						var footerTop = $('.frozen-center').height() + $('.frozen-north').height() - $footer.height() - 17 +
										parseInt($('.report-background').css('top'));
						$footer.css('top', footerTop + 'px');
					} else {
						
						this.$contentPane.asComponent({type : "border", items:[{region: 'center',el: $contentDIV}]});	
						
						var regions = [{region: 'center', el: $frozenPage}];
						var $header = $(".HF-header", this.$container);
						if ($header.length > 0) {
							regions.push({region: 'north', el:$header});
				       	}			
						var $footer = $(".HF-footer", this.$container);
						if ($footer.length > 0) {
							regions.push({region: 'south', el: $footer});
						}
						
						$contentDIV.asComponent({type : "border", items:regions});	
						FR.layoutFrozen($frozenPage, this.$contentPane.offset().top);
						this.$contentPane.doLayout();
			       }
			       
			       if ($.browser.msie && parseInt($.browser.version) < 9 && $.support.boxModel === true) {
						var initColCell = function(element, ano_row_ranges) {
							var col_ranges = [];
							col_ranges[0] = 0;
							var $cols = element.find('colgroup:eq(0)').children();
							var $col;
							var row_size = col_ranges.length;
							$.each($cols, function(idx, col){
								$col = $(col);
								if (ano_row_ranges) {
									var h = ano_row_ranges[idx + row_size] - ano_row_ranges[idx + row_size - 1];
									if (col.offsetWidth != h) {
										var ofs = parseInt($col.css("width")) + h - col.offsetWidth;
										$col.css("width", ofs);
										if (idx === 0 && col.offsetWidth !== h) {
											$col.css("width", ofs + h - col.offsetWidth);
										}
									}
								} else {
									col_ranges[idx + row_size] = col_ranges[idx + row_size - 1] + col.offsetWidth;
								}
							});
							return col_ranges;
						};

						var f_corner = $('.frozen-corner', this.$container);
						if (f_corner.length > 0) {
							var col_ranges = initColCell($('.frozen-west', this.$container));
							initColCell(f_corner, col_ranges);
						}
					}
			    }else{
                    if(this.pagesBorder === true){
                        $contentDIV.css('border',borderCss);
                    }else{
                        $contentDIV.css('border','none');
                    }
                }

                //wikky:把页脚的top调整下，防止页脚遮挡内容
                if($(".HF-footer", this.$container).length > 0) {
                var tableHeight = $(".report-background",this.$container).find("table").height();
                var backgroundHeight = $(".report-background",this.$container).height();
                var contentHeight = tableHeight > backgroundHeight ? tableHeight : backgroundHeight;
                var topHeight =  parseInt($(".report-background",this.$container).css("top"));
                if($(".HF-header", this.$container).length > 0) {
                    topHeight = parseInt($(".HF-header", this.$container).css("top")) + $(".HF-header", this.$container).height()
                }
                var footerTop = contentHeight + topHeight + 1;                     //wikky:+1是为了防止边框遮挡
                $(".HF-footer", this.$container).css("top",footerTop);
                }
                // IE8 杂项模式 格子设置了边框 如果上方一行tr是隐藏的话 上边框就会变细 貌似border-collapse的问题
                if ($.browser.msie && $.browser.version == '8.0' && !$.support.boxModel) {
                    var blankTr = $('tr:hidden', this.$contentPane);
                    for (var i=0; i<blankTr.length; i++) {
                        var nextTr = blankTr.eq(i).next('tr');
                        for(var j=0; j<nextTr.children().length; j++) {
                            var td = nextTr.children().eq(j);
                            for (var k=1; k<4; k++) {
                                if (td.hasClass('btw' + k)) {
                                    td.css('border-top-width', k*2);
                                }
                            }
                        }
                    }
                }

                // 取消正在加载页面的标记
                this.isLoadingPage = -1;
                
                if (FR.isMobileApp()) {
                    //new iScroll(this.$contentPane[0]);
                	if (!FR.isMobileAppNoZoom()) {
	                	$contentDIV = $(".pageContentDIV",  this.$contentPane);
						var $pageBlockDIV = $(".page-block",  this.$contentPane);
						var width = $contentDIV.width() || $pageBlockDIV.width();
                		var height = $contentDIV.height() || $pageBlockDIV.height();
						
	                	$contentDIV.css('position', 'relative');
	                	$('.content-container').width(width);
	                	$('.content-container').height(height);
	                	$('.content-container').css('overflow', 'hidden');
                	}
                	var needLoadNext = this.currentPageIndex < this.reportTotalPage ? true : false;
                	var needLoadBefore = this.currentPageIndex > 1 ? true : false;
                	var self = this;
					FR.MobileTools.showPageNumber();
					
					if(FR.isAndroid()) {
                        if(window.android && $.isFunction(window.android.onFinish)){
        				    window.android.onFinish();
                        }
        			}
                } else if (FR.isMobileBrowser() && !FR.isMobileBrowserNoZoom()) {
                	$contentDIV = $(".pageContentDIV",  this.$contentPane);
                	var $pageBlockDIV = $(".page-block",  this.$contentPane);
                	var width = $contentDIV.width() || $pageBlockDIV.width();
                	var height = $contentDIV.height() || $pageBlockDIV.height();
                	$('.content-container').height(height);
                	
                	FR.MobileTools.largeWidth(width);
                }

                // 48070 移动端chrome访问
                if($.browser.chrome && FR.isMobileBrowser()) {
                    $('body').css('overflow', 'auto');
                }

            }.createDelegate(this)
		});
    },

    pageSetup:function () {
    	// jim: page可以去掉此对话框了
        this.showPageSetupDialog({sessionID:this.currentSessionID});
    },
    printReportServer:function () {
        FR.showIframeDialog({
            title:FR.i18nText("ReportServerP-Print[Server]"),
            width:540,
            height:380,
            url:FR.servletURL + "?op=fr_dialog&cmd=read_print_server_dialog&sessionID=" + this.currentSessionID + "&pn=" + this.currentPageIndex
        });
    },
    emailReport:function () {
        if (this.fireEvent(FR.Events.BEMAIL) === false) {
            return;
        }
        var self = this;
        FR.showEmailDialog({sessionID:this.currentSessionID, onFinish : function(){
            self.fireEvent(FR.Events.AEMAIL);
        }});
    },
    pdfPrint:function (isPopup) {
        if (this.fireEvent(FR.Events.BPDFPRINT) === false) {
            return;
        }
        if ($.browser.msie) {
            FR.doPDFPrint(this.currentSessionID, isPopup);
        } else {
            // james：pdfPrint需要用format=pdfPrint，服务器才能识别为是打印状态啊
            window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=pdf&isPDFPrint=true&extype=ori";
            this.fireEvent(FR.Events.APDFPRINT);
        }
    },
    appletPrint:function () {
        FR.doAppletPrint(this.currentSessionID);
    },
    flashPrint:function () {
        FR.doFlashPrint(this.currentSessionID, this.currentPageIndex);
    },
    exportReportToPDF:function (extype) {
        if (this.fireEvent(FR.Events.BTOPDF) === false) {
            return;
        }
        window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=pdf&extype=" + extype;
        this.fireEvent(FR.Events.ATOPDF);
    },
    exportReportToExcel:function (extype) {
        if (this.fireEvent(FR.Events.BTOEXCEL) === false) {
            return;
        }
        // carl:还是弄个提示吧
        if (extype == 'ldpage') {
            FR.Msg.toast(FR.i18nText("Export-Excel-LargeData-Page-Info"));
        }
        window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=excel&extype=" + extype;
        this.fireEvent(FR.Events.ATOEXCEL);
    },
    exportReportToWord:function () {
        if (this.fireEvent(FR.Events.BTOWORD) === false) {
            return;
        }
        window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=word";
        this.fireEvent(FR.Events.ATOWORD);
    },
    exportReportToImage:function (extype) {
        if (this.fireEvent(FR.Events.BTOIMAGE) === false) {
            return;
        }
        window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=image&extype=" + extype;
        this.fireEvent(FR.Events.ATOIMAGE);
    },
    exportReportToHtml:function () {
        if (this.fireEvent(FR.Events.BTOHTML) === false) {
            return;
        }
        window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=html";
        this.fireEvent(FR.Events.ATOHTML);
    },
    printPreview:function () {
        window.open(FR.servletURL + "?op=print_preview&cmd=pw_init_page&__pi__=false&sessionID=" + this.currentSessionID, "_blank", "Scrollbar=yes,Resizable=yes,fullscreean=yes");
    },
    SetPrinterOffset:function () {
        FR.showIframeDialog({
            title:FR.i18nText("SetPrinterOffset"),
            width:420,
            height:300,
            url:FR.servletURL + "?op=printer_offset&cmd=pt_open&sessionID=" + this.currentSessionID
        });
    },
	initContentPane : function() {

		this.on("afterload", function() {
			this.autoScale();
		});

	},
	loadContentPane : function() {
		this.gotoPage(1);
	},

    _initSheetTabPane: function ($contentPane, sheetsO) {
        $contentPane.css("overflow", "auto").css('border-top', '0px');
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

    setBorderVisible: function(isVisible){
        this.pagesBorder = isVisible;
    }
});

function onBridgeReady(event) {
	contentPane.bridge = event.bridge;
//	if(contentPane.parameterEl) {
//		contentPane.bridge.send('hidetb');
//	}
	FR.MobileTools.doWaitingTODO();
	contentPane.bridge.init(function(message) {
//		if(message === "cached") {
//			var isSessionAlive = FR.checkIsSessionAlive();
//			if(isSessionAlive === "true") {
//				return;
//			} else {
//				contentPane.bridge.send("dead");
//			}
//		} else {
			contentPane.gotoPage(parseInt(message));	
//		}
	});
}

//for ios
if(FR.isMobile()) {
	document.addEventListener('WebViewJavascriptBridgeReady', onBridgeReady, false);
}

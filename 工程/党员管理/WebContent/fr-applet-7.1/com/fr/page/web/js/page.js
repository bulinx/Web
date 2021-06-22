/**
 * ��ҳԤ������
 * @class FR.PagePane
 * @extends FR.BasePane
 */
$.extend(FR.PagePane.prototype, /**@class FR.PagePane*/{
    /**
     * @property {Number} ��ǰҳ������ҳ���е����
     */
    currentPageIndex:0, // ��ReportPage������ReportPage���е����

    /**
     * @property {Number} ��ҳ��
     */
    reportTotalPage:0, // ��ReportPage������ReportPage�������ɵ��ܵ�ReportPage�ĸ���

    /**
     * @property {Number} ���ڼ��ص�ҳ�����
     */
    isLoadingPage:-1,

    /**
     * @property {Number} �Ѿ����ص�ҳ�����ɵ�����
     */
    pagesLoaded : [],
    pagesBorder: false, //�Ƿ���ʾ��ҳԤ��ʱ�ı߿�,�����ʱ�������ʾ

    /**
     * ת�򱨱�ĵ�һҳ
     */
    gotoFirstPage:function() {
        this.gotoPage(1);
    },

    /**
     * ת�򱨱����һҳ
     */
    gotoPreviousPage:function () {
        if (this.currentPageIndex <= 1) {
            return;
        }
        this.gotoPage(this.currentPageIndex - 1);
    },

    /**
     * ת�򱨱����һҳ
     */
    gotoNextPage:function() {
        this.gotoPage(this.currentPageIndex + 1);
    },

    /**
     * ת�򱨱�����һҳ
     */
    gotoLastPage:function() {
        this.gotoPage(2147483647);
    },

    /**
     * ת�򱨱��ָ��ҳ
     * @param {Number} pn ҳ���
     */
    gotoPage:function(pn) {
    	if (typeof pn != 'number' || isNaN(pn)) {
    		return;
    	}
    	if (pn < 1){
    		pn = 1;
    	}
    	// ��ʾ���ڼ���ҳ��
    	if (this.isLoadingPage >= 0) {
    		return;
    	}
    	this.fireEvent(FR.Events.STARTLOAD);
    	
    	// ������ڼ���ҳ��
    	this.isLoadingPage = pn;
    	
		//��sheetԤ��, ĳ��sheet��������ó�hidden, ����sheet�Ƕ���ʱĬ��overflow:auto, ��Ȼ����������ʧ
  		this.$contentPane.css({
       		overflow : 'auto'
       	});
    	
    	// alex:����ǿ������innerHTMLΪ���ַ���,jQuery.html()���������empty(),�ܷ�ʱ��
		this.$contentPane.__load__({
			url : FR.servletURL,
			params : {op : "page_content",sessionID : this.currentSessionID, pn:pn},
			scripts : true,
			forceDisplay : true,
			timeout : 3600000,
			callback : function() {
				this.fireEvent(FR.Events.AFTERLOAD);

				// carl:��ʱֻ��ͼ��
				this.$contentPane.asComponent({type : "fr_form", selector : 'td[widget]'});
                var $contentDIV = $(".pageContentDIV",  this.$contentPane);
                var borderCss = '1px solid rgb(149, 149, 149)';
				var $frozenPage = $(".frozen-page", this.$contentPane);
				
				if ($frozenPage.length > 0) {
					// richer:��ʼ׼������
					var isCenter = $contentDIV.hasClass("contentDIV");
			       
					if (isCenter) {	// denny: �����ң�������ʾ
                        //Sean: �����Ҷ���ʱ������ʾ�߿򣬷��򲻺ÿ�
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
						
						//17�ǹ������߶�
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

                //wikky:��ҳ�ŵ�top�����£���ֹҳ���ڵ�����
                if($(".HF-footer", this.$container).length > 0) {
                var tableHeight = $(".report-background",this.$container).find("table").height();
                var backgroundHeight = $(".report-background",this.$container).height();
                var contentHeight = tableHeight > backgroundHeight ? tableHeight : backgroundHeight;
                var topHeight =  parseInt($(".report-background",this.$container).css("top"));
                if($(".HF-header", this.$container).length > 0) {
                    topHeight = parseInt($(".HF-header", this.$container).css("top")) + $(".HF-header", this.$container).height()
                }
                var footerTop = contentHeight + topHeight + 1;                     //wikky:+1��Ϊ�˷�ֹ�߿��ڵ�
                $(".HF-footer", this.$container).css("top",footerTop);
                }
                // IE8 ����ģʽ ���������˱߿� ����Ϸ�һ��tr�����صĻ� �ϱ߿�ͻ��ϸ ò��border-collapse������
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

                // ȡ�����ڼ���ҳ��ı��
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

                // 48070 �ƶ���chrome����
                if($.browser.chrome && FR.isMobileBrowser()) {
                    $('body').css('overflow', 'auto');
                }

            }.createDelegate(this)
		});
    },

    pageSetup:function () {
    	// jim: page����ȥ���˶Ի�����
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
            // james��pdfPrint��Ҫ��format=pdfPrint������������ʶ��Ϊ�Ǵ�ӡ״̬��
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
        // carl:����Ū����ʾ��
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

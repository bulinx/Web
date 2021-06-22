//preview.js
$.extend(FR.PreviewPane.prototype, {
    currentPageIndex:0, // 该ReportPage所属的ReportPage集中的序号
    reportTotalPage:0, // 该ReportPage所属的ReportPage集成生成的总的ReportPage的个数
    isLoadingPage:-1,
    __singlesheet__ : false,
    reportIndex : -1,
    gotoFirstPage:function() {
        this.gotoPage(1);
    },
    gotoPreviousPage:function () {
        if (this.currentPageIndex <= 1) {
            return;
        }
        this.gotoPage(this.currentPageIndex - 1);
    },
    gotoNextPage:function() {
        this.gotoPage(this.currentPageIndex + 1);
    },
    gotoLastPage:function() {
        this.gotoPage(2147483640)
    },
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
    	
    	var paras = {op : "print_preview", cmd : "read_pp_content",sessionID : this.currentSessionID, pn:pn};
    	if (this.__singlesheet__ === true) {
    		paras.__singlesheet__ = true;
    		paras.reportIndex = this.reportIndex;
    	}
    	
    	// alex:下面强制设置innerHTML为空字符串,jQuery.html()方法会调用empty(),很费时间
//    	this.$contentPane[0].innerHTML = "";
		this.$contentPane.__load__({
			url : FR.servletURL,
			params : paras,
			scripts : true,
			forceDisplay : true,
			timeout : 3600000,
			callback : function() {
				this.fireEvent(FR.Events.AFTERLOAD);
				
				// 取消正在加载页面的标记
			    this.isLoadingPage = -1;
			}.createDelegate(this)
		});
    },
		
    pageSetup:function () {
    	  this.showPageSetupDialog({sessionID:this.currentSessionID});
    },
    printReportServer:function() {
    	FR.showIframeDialog({
    		title : FR.i18nText("ReportServerP-Print[Server]"),
    		width : 540,
    		height : 300,
    		url : FR.servletURL + "?op=fr_dialog&cmd=read_print_server_dialog&sessionID=" + this.currentSessionID + "&pn=" + this.currentPageIndex
    	});
    },
    emailReport:function() {
    	if (this.fireEvent(FR.Events.BEMAIL) === false) {
    		return;
    	}
        var self = this;
        FR.showEmailDialog({sessionID:this.currentSessionID, onFinish : function(){
            self.fireEvent(FR.Events.AEMAIL);
        }});
    },
    pdfPrint:function(isPopup) {
    	if(this.fireEvent(FR.Events.BPDFPRINT) === false) {
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
    appletPrint:function() {   	
    	FR.doAppletPrint(this.currentSessionID);   	
    },
    flashPrint:function() {
    	FR.doFlashPrint(this.currentSessionID, this.currentPageIndex);
    },
    exportReportToPDF:function(extype) {
    	if(this.fireEvent(FR.Events.BTOPDF) === false) {
    		return;
    	}
        window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=pdf&extype=" + extype;
    	this.fireEvent(FR.Events.ATOPDF);
    },
    exportReportToExcel:function(extype) {
    	if(this.fireEvent(FR.Events.BTOEXCEL) === false) {
    		return;
    	}
    	// carl:还是弄个提示吧
    	if (extype == 'ldpage') {
    		FR.Msg.toast(FR.i18nText("Export-Excel-LargeData-Page-Info"));
    	}
        window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=excel&extype=" + extype;
    	this.fireEvent(FR.Events.ATOEXCEL);
    },
    exportReportToWord:function() {
    	if(this.fireEvent(FR.Events.BTOWORD) === false){
    		return;
    	}
        window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=word";
    	this.fireEvent(FR.Events.ATOWORD);
    },
    exportReportToImage:function(extype){
    	if(this.fireEvent(FR.Events.BTOIMAGE) === false) {
    		return;
    	}
    	window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=image&extype=" + extype;
    	this.fireEvent(FR.Events.ATOIMAGE);
    },
	initContentPane : function() {
		
	},
	loadContentPane : function() {
		this.gotoPage(1);
	},
	SetPrinterOffset:function(){
	 FR.showIframeDialog({
    	    title : FR.i18nText("SetPrinterOffset"),
        	width : 420,
        	height : 300,
        	url:FR.servletURL + "?op=printer_offset&cmd=pt_open&sessionID=" + this.currentSessionID
    	  });	
	}
});

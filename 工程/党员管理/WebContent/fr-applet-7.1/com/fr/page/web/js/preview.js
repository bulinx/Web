//preview.js
$.extend(FR.PreviewPane.prototype, {
    currentPageIndex:0, // ��ReportPage������ReportPage���е����
    reportTotalPage:0, // ��ReportPage������ReportPage�������ɵ��ܵ�ReportPage�ĸ���
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
    	// ��ʾ���ڼ���ҳ��
    	if (this.isLoadingPage >= 0) {
    		return;
    	}
    	this.fireEvent(FR.Events.STARTLOAD);
    	
    	// ������ڼ���ҳ��
    	this.isLoadingPage = pn;
    	
    	var paras = {op : "print_preview", cmd : "read_pp_content",sessionID : this.currentSessionID, pn:pn};
    	if (this.__singlesheet__ === true) {
    		paras.__singlesheet__ = true;
    		paras.reportIndex = this.reportIndex;
    	}
    	
    	// alex:����ǿ������innerHTMLΪ���ַ���,jQuery.html()���������empty(),�ܷ�ʱ��
//    	this.$contentPane[0].innerHTML = "";
		this.$contentPane.__load__({
			url : FR.servletURL,
			params : paras,
			scripts : true,
			forceDisplay : true,
			timeout : 3600000,
			callback : function() {
				this.fireEvent(FR.Events.AFTERLOAD);
				
				// ȡ�����ڼ���ҳ��ı��
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
        	// james��pdfPrint��Ҫ��format=pdfPrint������������ʶ��Ϊ�Ǵ�ӡ״̬��
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
    	// carl:����Ū����ʾ��
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

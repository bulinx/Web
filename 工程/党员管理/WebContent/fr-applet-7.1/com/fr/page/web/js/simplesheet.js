//simplesheet.js
;$.extend(FR.SimpleSheetPane.prototype, {
    isLoadingPage:-1,
    printReportServer:function() {
    	if(this.fireEvent("beforeserverprint") === false) {
        		return;
        	}
    	FR.showIframeDialog({
    		title : FR.i18nText("ReportServerP-Print[Server]"),
    		width : 540,
    		height : 300,
    		url : FR.servletURL + "?op=fr_dialog&cmd=read_print_server_dialog&sessionID=" + this.currentSessionID + "&pn=" + this.currentPageIndex
    	});
    	this.fireEvent("afterserverprint");
    },
    emailReport:function() {
    	if(this.fireEvent("beforeemail") === false){
        		return;
        }
        var self = this;
        FR.showEmailDialog({sessionID:this.currentSessionID, onFinish : function(){
            self.fireEvent(FR.Events.AEMAIL);
        }});
    },
    pdfPrint:function(isPopup) {
    	if (this.fireEvent("beforepdfprint") === false) {
        		return;
        	};
        if ($.browser.msie) {
            FR.doPDFPrint(this.currentSessionID, isPopup);
        } else {
        	// james��pdfPrint��Ҫ��format=pdfPrint������������ʶ��Ϊ�Ǵ�ӡ״̬��
        	window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=pdf&isPDFPrint=true&extype=ori";
        }
        this.fireEvent("afterpdfprint");
    },
    appletPrint:function() {
    	FR.doAppletPrint(this.currentSessionID);
    },
    flashPrint:function() {
    	FR.doFlashPrint(this.currentSessionID);;
    },
    exportReportToPDF:function(extype) {
    	if(this.fireEvent("beforetopdf") === false) {
        		return;
        }
        window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=pdf&extype=" + extype;
   		this.fireEvent("aftertopdf");
    },
    exportReportToExcel:function(extype) {
    	if (this.fireEvent("beforetoexcel") === false) {
    			return;
    	}
     	window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=excel&extype=" + extype;
    	this.fireEvent("aftertoexcel");   	
    },
    exportReportToWord:function() {
    	if (this.fireEvent("beforetoword") === false) {
        		return;
        }
        window.location = FR.servletURL + "?op=export&sessionID=" + this.currentSessionID + "&format=word";
  		 this.fireEvent("aftertoword");	
    },
    
    /*
     * alex:��ʼ��ContentPane
     */
	initContentPane : function() {
        //alex:����write.css
        FR.$defaultImport('/com/fr/web/core/css/form.css', 'css');

        var tabPane = this.$contentPane.data("TabPane");
        var self = this;
        if (tabPane) {//james��TabPane
            //james����TabPane��tabchange�¼�
            tabPane.on('tabchange', function(eventObj, tabPane, tabIndex) {
               self.fireEvent("tabchange", tabPane, tabIndex);
            });
            //james������ǰ��FormPane��tabchange�¼��������������ִ��tabchange������
            this.on("tabchange", function(tabIndex) {
                var lgp = self.lgps[tabIndex];
                if(lgp.loaded === false) {
                    lgp.loadLGPPane();
                }
            });

            var tabs = $('div', tabPane.$tabContainer);//james����ȡtabs�ĸ���
            this.lgps = new Array(tabs.length);
            for (var i = 0, count = tabs.length; i < count; i++) {
                this.lgps[i] = new FR.FLGP({idx:i, $container:$(tabs[i]), formPane:this});
            }
            
            tabPane.invisible();
        } else {
            this.lgps = [new FR.FLGP({idx:0, $container:this.$contentPane, formPane:this})];
        }
    },
    
    /*
     * ��ʼ����ContentPane
     */
	loadContentPane : function() {
		var tabPane = this.$contentPane.data("TabPane");
		if (tabPane) {
			tabPane.visible();
		}
	
        if(this.lgps == null || this.lgps.length == 0) return;
        $.each(this.lgps, function(idx, lgp) {
            lgp.loaded = false;
        });
        if(this.curLGP == null) this.curLGP = this.lgps[0];
        this.curLGP.loadLGPPane();
    },
    
    // carl����ť�ύ
    buttonSubmit : function(config) {
    	if(this.lgps == null || this.lgps.length == 0) return;
    	if (this.curLGP == null) this.curLGP = this.lgps[0];
    	if (this.curLGP.form) {
    		this.curLGP.form.formSubmit(config);
    	}
    },
    getWidgetByName : function(name) {
    	if(this.lgps == null || this.lgps.length == 0) return;
    	if (this.curLGP == null) this.curLGP = this.lgps[0];
    	if (this.curLGP.form) {
    		return this.curLGP.form.name_widgets[name];
    	}
    },
	SetPrinterOffset:function(){
	 FR.showIframeDialog({
    	    title : FR.i18nText("SetPrinterOffset"),
        	width : 420,
        	height : 300,
        	url:FR.servletURL + "?op=printer_offset&cmd=pt_open&sessionID=" + this.currentSessionID
    	  });	
	}   
})

/*
 * alex:SheetLoGicalPane
 */
FR.FLGP = function(config) {
    config = config || {};
    this.initialConfig = config;
    $.extend(this, config);

    this.loaded = false;
}

FR.extend(FR.FLGP, FR.OB, {
	$container : null,
	formPane : null,
	idx : 0,
	loadLGPPane : function() {
        if(this.formPane.isLoadingPage == this.idx) {
            return;
        }
        this.formPane.isLoadingPane = this.idx;
	    //this.initLGPComponent();
	    this.formPane.curLGP = this;

        //fire sheetPane��afterload�¼�,����this��Ϊ��������ȥ
        this.formPane.fireEvent("afterload", this);
		
        this.formPane.isLoadingPage = -1;
            
        delete this.loaded;
	},
	
    /*
     * ��ʼ��LGPComponent
     */
    initLGPComponent: function() {
		// james:��ʼ���ؼ�
		var config = {
			type : "fr_form",
			selector : 'td[widget]'
		}
		this.form = this.$container.asComponent(config);
		
		// james����ʼ������
		var $frozenPage = $(".frozen-page", this.$container);
		if ($frozenPage.length > 0) {
			var $reportPane = $(".reportPane");
			// richer:reportPane����
			$reportPane.asComponent({type : "border", items:[{
				region: 'center',
				el: this.$container
			}]});
						
			var $contenDIV = $(".formContentDIV",  this.$container);
			// richer:contentContainer����
			this.$container.asComponent({type:"gridlayout", 
				rows: 2, columns: 2,
				items: [$("<div>"), $("<div>"), $("<div>"), $contenDIV],
				widths: [71, -1],
				heights: [25, -1]
			});
			
			var regions = [{
				region: 'center',
				el: $frozenPage
			}];
			var $header = $(".HF-header", this.$container);
			if ($header.length > 0) {
				regions.push({
					region: 'north',
					el:$header
				});
			}
			
			var $footer = $(".HF-footer", this.$container);
			if ($footer.length > 0) {
				regions.push({
					region: 'south',
					el: $footer
				});
			}
			
			$contenDIV.asComponent({type : "border", items : regions});
			FR.layoutFrozen($frozenPage);
			$reportPane.doLayout();
		}
	}															
});

if (this.options.form != null && $.isFunction(this.options.form.formSubmit)) {
    this.options.form.QueryBtn = this;
	this.options.form.formSubmit({
	url : "${servletURL}?op=fr_dialog&cmd=parameters_d&sessionID=${sessionID}",
	asyn : true,
	callback : function(res, status) {
		if (FR.isMobileApp()) {
    		lurl = '${servletURL}?op=mobile_reportshow&__pi__=false&sessionID=${sessionID}';
    		FR.MobileTools.openLink(lurl, '_blank');
    		_g().$toolbarBtnBack.show();
    	} else {
        	_g().loadContentPane();
        	if (FR.isMobileBrowser()) FR.MobileTools.largeWidth();
    	}
	}}				
	);
	var self = this;
	_g().once("afterload", function() {
		self.enable();
	})
}

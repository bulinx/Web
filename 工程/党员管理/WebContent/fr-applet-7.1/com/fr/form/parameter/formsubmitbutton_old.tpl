if (this.options.form != null && $.isFunction(this.options.form.formSubmit)) {
	this.options.form.formSubmit({
	url : "${servletURL}?op=fr_dialog&cmd=parameters_d&sessionID=${sessionID}",
	asyn : true,
	callback : function(res, status) {_g().loadContentPane();}}				
	);
	var self = this;
	_g().once("afterload", function() {
		self.enable();
	})
}
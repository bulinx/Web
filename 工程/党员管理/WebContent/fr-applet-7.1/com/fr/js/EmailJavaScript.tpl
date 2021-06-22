var fm; 
if(this.options){
	fm = this.options.form;
}
if(fm == null) {
	fm = new FR.Form();
}
fm.sentMail({xmlconf:
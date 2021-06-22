/*H-ui.admin.doc.js date:15:42 2015-04-29 by:guojunhui*/
$(function(){
	/*返回顶部调用*/
	$(window).on("scroll",$backToTopFun);
	$backToTopFun();
});
//角色按钮权限，二级菜单
function roles(){
    var roles =  $("[roles]");
    var subId = roles.eq(0).attr("roles").split("-")[1];
    $.post("button!getPageBtn",{"key":subId}, function (v) {
    	var btn = $.parseJSON(v);
    	 for(var i=0; i < roles.length; i++){
	        var role = roles.eq(i);
	        var val = role.attr("roles");
	        if (!checkRoleButton(btn, val)) {
	            role.remove();
	        }
	    }
    });
}
//检测
function checkRoleButton(data,value) {
    for (var i = 0; i < data.length; ++i) {
        if (data[i] == value) {
            return true;
        }
    }
    return false;
}

/*添加*/
function add(w,h,title,url){
	layer_show(w,h,title,url);
}

/*编辑*/
function edit(w,h,title,url){
	layer_show(w,h,title,url);
}

//格式化java时间yyyy-MM-dd
function getLocalTime(nS) {  
    var date = new Date(nS);
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    return year+"-"+month+"-"+day;
} 
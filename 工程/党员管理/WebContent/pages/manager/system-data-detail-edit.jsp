<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	String id = request.getParameter("id");
%>
<!DOCTYPE HTML>
<html>
<head>
  <base href="<%=basePath%>" />
<meta charset="utf-8">
<meta name="renderer" content="webkit|ie-comp|ie-stand">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
<meta http-equiv="Cache-Control" content="no-siteapp" />
<!--[if lt IE 9]>
<script type="text/javascript" src="lib/html5.js"></script>
<script type="text/javascript" src="lib/respond.min.js"></script>
<script type="text/javascript" src="lib/PIE_IE678.js"></script>
<![endif]-->
<link href="css/H-ui.min.css" rel="stylesheet" type="text/css" />
<link href="css/H-ui.admin.css" rel="stylesheet" type="text/css" />
<link href="lib/icheck/icheck.css" rel="stylesheet" type="text/css" />
<link href="lib/font-awesome/font-awesome.min.css" rel="stylesheet" type="text/css" />
<!--[if IE 7]>
<link href="lib/font-awesome/font-awesome-ie7.min.css" rel="stylesheet" type="text/css" />
<![endif]-->
<link href="lib/iconfont/iconfont.css" rel="stylesheet" type="text/css" />
<!--[if IE 6]>
<script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js" ></script>
<script>DD_belatedPNG.fix('*');</script>
<![endif]-->
<title>添加用户</title>
</head>
<body>
<div class="pd-20">
  <form action="dictionary!updateTxt" method="post" class="form form-horizontal" id="form-user-add">
  	<input type="hidden" value="<%=id %>" name="dictionaryText.id" id="id">
  	<input type="hidden" id="state" name="dictionaryText.state">
  	<input type="hidden" value="1" name="dictionaryText.flag">
  	<input type="hidden" id="dicId" name="dictionaryText.dicId">
  	<input type="hidden" id="dicName" name="dictionaryText.dicName">
    <div class="row cl">
      <label class="form-label col-3">显示值：</label>
      <div class="formControls col-6">
        <input type="text" class="input-text" placeholder="数据字典显示值" name="dictionaryText.name" id="name" datatype="*1-50" nullmsg="*必填">
      </div>
      <div class="col-3"> </div>
    </div>
    <div class="row cl">
      <label class="form-label col-3">编码值：</label>
      <div class="formControls col-6">
        <input type="text" class="input-text" id="value" placeholder="数据字典编码值" name="dictionaryText.value"  datatype="*1-50" nullmsg="*必填">
      </div>
      <div class="col-3"> </div>
    </div>
    <div class="row cl">
      <div class="col-9 col-offset-3">
        <input class="btn btn-primary radius" type="submit" value="&nbsp;&nbsp;提交&nbsp;&nbsp;">
      </div>
    </div>
  </form>
</div>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script> 
<script type="text/javascript" src="lib/Validform_v5.3.2.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script> 
<script type="text/javascript" src="js/H-ui.admin.js"></script> 
<script type="text/javascript">
$(function(){
	$("#form-user-add").Validform({
		tiptype:2,
		ajaxPost:true,
        callback:function(data){
			$.Hidemsg();
			if (data.success) {
                layer.msg(data.msg, 2, 1);
                setTimeout("closeLayer()",1500);
            } else {
                layer.msg(data.msg, 2);
            }
		}
	});
	init('<%=id%>');
});
//初始化
function init(id) {
	$.post("dictionary!findText",{"id":id},function(v){
		var res = $.parseJSON(v);
		$("#name").val(res.name);
		$("#value").val(res.value);
		$("#state").val(res.state);
		$("#dicId").val(res.dicId);
		$("#dicName").val(res.dicName);
	});
}
//关闭layer
function closeLayer() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.location.replace(parent.location.href);
    parent.layer.close(index);
}
</script>
</body>
</html>
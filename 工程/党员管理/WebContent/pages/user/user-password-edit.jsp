<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
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
<link href="lib/font-awesome/font-awesome.min.css" rel="stylesheet" type="text/css" />
<!--[if IE 7]>
<link href="lib/font-awesome/font-awesome-ie7.min.css" rel="stylesheet" type="text/css" />
<![endif]-->
<link href="lib/iconfont/iconfont.css" rel="stylesheet" type="text/css" />
<!--[if IE 6]>
<script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js" ></script>
<script>DD_belatedPNG.fix('*');</script>
<![endif]-->
<title>修改密码</title>
</head>
<body>
<div class="pd-20">
  <form action="users!updatePass" method="post" class="form form-horizontal" id="form-user-password">
    <div class="row cl">
      <label class="form-label col-4"><span class="c-red">*</span>旧密码：</label>
      <div class="formControls col-4">
        <input type="password" class="input-text" placeholder="密码" name="users.pass" datatype="*6-20" nullmsg="*必填" >
      </div>
      <div class="col-4"> </div>
    </div>
    <div class="row cl">
      <label class="form-label col-4"><span class="c-red">*</span>新密码：</label>
      <div class="formControls col-4">
        <input type="password" class="input-text" placeholder="新密码" name="key" id="key" datatype="*6-20" nullmsg="*必填" >
      </div>
      <div class="col-4"> </div>
    </div>
    <div class="row cl">
      <label class="form-label col-4"><span class="c-red">*</span>确认密码：</label>
      <div class="formControls col-4">
        <input type="password" class="input-text" placeholder="确认密码" recheck="key" datatype="*6-20" nullmsg="*必填" errormsg="您两次输入的密码不一致！" >
      </div>
      <div class="col-4"> </div>
    </div>
    <div class="row cl">
      <div class="col-8 col-offset-4">
        <input class="btn btn-primary radius" type="submit" value="&nbsp;&nbsp;提交&nbsp;&nbsp;">
      </div>
    </div>
  </form>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script> 
<script type="text/javascript" src="lib/Validform_v5.3.2.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script> 
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script>
  $(function() {
    $("#form-user-password").Validform({
      tiptype : 2,
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
  });
  
//关闭layer
  function closeLayer() {
      var index = parent.layer.getFrameIndex(window.name);
      parent.location.replace(parent.location.href);
      parent.layer.close(index);
  }
</script>
</body>
</html>
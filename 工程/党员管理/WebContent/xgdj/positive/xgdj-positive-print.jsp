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
<script type="text/javascript" src="lib/My97DatePicker/WdatePicker.js"></script>
<title>title</title>
</head>
<body>
<div class="pd-20">
  <form class="form form-horizontal" id="form-user-add">
    <div class="row cl">
      <label class="form-label col-3">打印日期：</label>
      <div class="formControls col-9">
        <input type="text" class="input-text" placeholder="打印日期" id="date" onclick="laydate({ format: 'YYYY年MM月DD日'});">
      </div>
    </div>
    <div class="row cl">
      <div class="col-9 col-offset-3">
        <input class="btn btn-primary radius" type="button" value="&nbsp;&nbsp;打印&nbsp;&nbsp;" onclick="sub();">
      </div>
    </div>
  </form>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script> 
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script src="lib/laydate-v1.1/laydate/laydate.js"></script>
<script type="text/javascript" src="ReportServer?op=emb&resource=finereport.js"></script>  
<script type="text/javascript">
function sub() {
    var date = $("#date").val();
    if (date.length > 0) {
    	layer.closeAll();
        window.open(FR.cjkEncode("ReportServer?reportlet=xgdj_positive.cpt&date="+date), "_blank");
    }
}
</script>
</body>
</html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
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
<meta name="viewport"
	content="width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
<meta http-equiv="Cache-Control" content="no-siteapp" />
<!--[if lt IE 9]>
    <script type="text/javascript" src="lib/html5.js"></script>
    <script type="text/javascript" src="lib/respond.min.js"></script>
    <script type="text/javascript" src="lib/PIE_IE678.js"></script>
    <![endif]-->
<link href="css/H-ui.min.css" rel="stylesheet" type="text/css" />
<link href="css/H-ui.login.css" rel="stylesheet" type="text/css" />
<link href="css/style.css" rel="stylesheet" type="text/css" />
<link href="lib/font-awesome/font-awesome.min.css" rel="stylesheet"
	type="text/css" />
<link href="css/drag.css" rel="stylesheet" type="text/css" />
<!--[if IE 7]>
    <link href="lib/font-awesome/font-awesome-ie7.min.css" rel="stylesheet" type="text/css" />
    <![endif]-->
<link href="lib/iconfont/iconfont.css" rel="stylesheet" type="text/css" />
<!--[if IE 6]>
    <script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js" ></script>
    <script>DD_belatedPNG.fix('*');</script>
    <![endif]-->
<title>${web.name} - 后台登录</title>
<meta name="keywords" content="${web.keywords}">
<meta name="description" content="${web.description}">

<link href="images/favicon.ico" mce_href="favicon.ico" rel="bookmark"
	type="image/x-icon" />
<link href="images/favicon.ico" mce_href="favicon.ico" rel="icon"
	type="image/x-icon" />
<link href="images/favicon.ico" mce_href="favicon.ico"
	rel="shortcut icon" type="image/x-icon" />

</head>
<body>
	<input type="hidden" id="TenantId" name="TenantId" value="" />
	<div class="header"></div>
	<div class="loginWraper">
		<div id="loginform" class="loginBox">
			<form class="form form-horizontal" action="login" method="post"
				id="form-add" onsubmit="return chkCode();">
				<div class="row cl">
					<label class="form-label col-3"><i class="iconfont">&#xf00ec;</i></label>
					<div class="formControls col-8">
						<input name="user.name" type="text" placeholder="账户"
							class="input-text size-L" datatype="*3-20">
					</div>
				</div>
				<div class="row cl">
					<label class="form-label col-3"><i class="iconfont">&#xf00c9;</i></label>
					<div class="formControls col-8">
						<input name="user.pass" type="password" placeholder="密码"
							class="input-text size-L" datatype="*6-20">
					</div>
				</div>
				<div class="row cl">
					<div class="formControls col-8 col-offset-3">
						<div id="drag"></div>
					</div>
				</div>
				<div class="row">
					<div class="formControls col-8 col-offset-3">
						<label for="online"> <input type="checkbox" name="online"
							id="online" value=""> 使我保持登录状态
						</label>
					</div>
				</div>
				<div class="row">
					<div class="formControls col-8 col-offset-3">
						<input type="submit" class="btn btn-success radius size-L"
							value="&nbsp;登&nbsp;&nbsp;&nbsp;&nbsp;录&nbsp;" onclick="loads();"> <input
							type="reset" class="btn btn-default radius size-L"
							value="&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;消&nbsp;">
					</div>
				</div>
			</form>
		</div>
	</div>
	<div class="footer">${web.icp} Copyright ${web.name} by H-ui.admin.V2.2</div>
	<script type="text/javascript" src="lib/jquery.min.js"></script>
	<script type="text/javascript" src="js/H-ui.js"></script>
	<script type="text/javascript" src="js/drag.js"></script>
	<script type="text/javascript" src="lib/Validform_v5.3.2.js"></script>
	<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
	<script type="text/javascript">
		$('#drag').drag();
		$(function() {
			$("#form-add").Validform({
				tiptype : 2,
			});
		});

		//验证码
		function chkCode() {
			//获得验证码
			var v = $("#drag").text();
			//判断
			if ("验证通过" != v) {
				layer.msg("请拖动滑块验证");
				return false;
			}
			return true;
		}
		//动画
		function loads() {
			layer.load('<(￣︶￣)↗[GO!] 主人别急...');
		}
	</script>
</body>
</html>
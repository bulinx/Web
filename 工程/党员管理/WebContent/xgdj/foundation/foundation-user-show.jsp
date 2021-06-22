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
<link href="css/H-ui.admin.css" rel="stylesheet" type="text/css" />
<link href="lib/font-awesome/font-awesome.min.css" rel="stylesheet"
	type="text/css" />
<!--[if IE 7]>
<link href="lib/font-awesome/font-awesome-ie7.min.css" rel="stylesheet" type="text/css" />
<![endif]-->
<link href="lib/iconfont/iconfont.css" rel="stylesheet"
	type="text/css" />
<!--[if IE 6]>
<script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js" ></script>
<script>DD_belatedPNG.fix('*');</script>
<![endif]-->
<title>用户查看</title>
</head>
<body style="width: 60%; margin: 0 auto; padding-top: 20px;">
	<div class="cl pd-20" style="background-color: #5bacb6;">
		<img class="avatar size-XL l" src="images/user.png">
		<dl style="margin-left: 80px; color: #fff">
			<dt>
				<span class="f-18">${base.realName}</span> <span class="pl-10 f-12">${base.sex}</span>
			</dt>
			<dd class="pt-10 f-12" style="margin-left: 0">${base.address}</dd>
		</dl>
	</div>
	<div class="pd-20">
		<a href="foundation!findForID?key=${base.id}" style="float: right;color:green;">编辑</a>
		<table class="table">
			<tbody>
				<tr>
					<th class="text-r" width="80">学号：</th>
					<td>${base.number}</td>
				</tr>
				<tr>
					<th class="text-r" width="80">班级：</th>
					<td>${base.classes}</td>
				</tr>
				<tr>
					<th class="text-r" width="80">出生日期：</th>
					<td>${base.birthday}</td>
				</tr>
				<tr>
				<th class="text-r" width="80">身份证号码：</th>
				<td>${base.idCard}</td>
				</tr>
				<tr>
					<th class="text-r" width="80">生源地：</th>
					<td>${base.source}</td>
				</tr>
				<tr>
					<th class="text-r" width="80">籍贯：</th>
					<td>${base.nation}</td>
				</tr>
				<tr>
					<th class="text-r" width="80">高考准考证号：</th>
					<td>${base.ticket}</td>
				</tr>
				<tr>
					<th class="text-r" width="80">政治面貌：</th>
					<td>${base.identity}</td>
				</tr>
				<tr>
					<th class="text-r">入学时间：</th>
					<td>${base.admission}</td>
				</tr>
				<tr>
					<th class="text-r">宿舍：</th>
					<td>${base.dormitory}</td>
				</tr>
				<tr>
					<th class="text-r">电话：</th>
					<td>${base.phone}</td>
				</tr>
				<tr>
					<th class="text-r">QQ号码：</th>
					<td>${base.qq}</td>
				</tr>
				<tr>
					<th class="text-r">邮箱：</th>
					<td>${base.email}</td>
				</tr>
			</tbody>
		</table>
	</div>
	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/H-ui.js"></script>
	<script type="text/javascript" src="js/H-ui.admin.js"></script>
</body>
</html>
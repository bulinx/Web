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
<title>404错误 - 您所访问的页面未找到</title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
<link rel="stylesheet" type="text/css" href="css/error.css"
	media="screen" />
<link href="images/favicon.ico" mce_href="favicon.ico" rel="bookmark"
	type="image/x-icon" />
<link href="images/favicon.ico" mce_href="favicon.ico" rel="icon"
	type="image/x-icon" />
<link href="images/favicon.ico" mce_href="favicon.ico"
	rel="shortcut icon" type="image/x-icon" />
</head>
<body>

	<div id="container">
		<img class="png" src="images/404.png" /> 
		<img class="png msg" src="images/404_msg.png" />
		<p>
			<a href="javascript:history.go(-1);">
				<img class="png" src="images/404_to_index.png" />
			</a>
		</p>
	</div>
	<div id="cloud" class="png"></div>
	<pre style="DISPLAY: none"></pre>
</body>
</html>
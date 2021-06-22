<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html>
<html>
<head>
<base href="<%=basePath%>" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Easyui基于日历插件的扩展</title>
<link id="others_jquery_easyui_131" rel="stylesheet" type="text/css"
	class="library" href="lib/jquery-easyui/easyui.css">
<script id="jquery_183" type="text/javascript" class="library"
	src="lib/jquery/1.9.1/jquery.min.js"></script>
<script id="others_jquery_easyui_131" type="text/javascript"
	class="library" src="lib/jquery-easyui/jquery.easyui.min.js"></script>
<script type="text/javascript"
	src="lib/jquery-easyui/jquery.fullcalendar.js"></script>
<script type="text/javascript"
	src="lib/jquery-easyui/easyui-lang-zh_CN.js"></script>
</head>
<body class="easyui-layout">
	<div region="center">
		<div class="easyui-fullCalendar" fit="true"></div>
	</div>
</body>
</html>
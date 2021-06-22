<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	String url = request.getParameter("url");
%>
<!DOCTYPE HTML>
<html>
<head>
<base href="<%=basePath%>" />
<meta charset="utf-8">
<title>WebUploader演示</title>
<link rel="stylesheet" type="text/css"
	href="lib/webuploader/0.1.5/webuploader-file.css" />
</head>
<body>
	<input type="hidden" value="<%=url%>" id="url">
	<div class="uploader-list-container">
		<div class="queueList">
			<div id="dndArea" class="placeholder">
				<div id="filePicker-2"></div>
				<p>或将文件拖到这里，点击开始上传导入数据</p>
			</div>
		</div>
		<div class="statusBar" style="display: none;">
			<div class="progress">
				<span class="text">0%</span> <span class="percentage"></span>
			</div>
			<div class="info" id="info"></div>
			<div class="btns">
				<div id="filePicker2"></div>
				<div class="uploadBtn">开始上传</div>
			</div>
		</div>
	</div>
	<script type="text/javascript" src="lib/jquery/1.9.1/jquery.min.js"></script>
	<script type="text/javascript" src="lib/layer/2.1/layer.js"></script>
	<script type="text/javascript"
		src="lib/webuploader/0.1.5/webuploader.min.js"></script>
	<script type="text/javascript"
		src="lib/webuploader/0.1.5/image-upload/upload-excel.js"></script>
</body>
</html>
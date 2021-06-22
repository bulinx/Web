<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
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
    <title>添加用户</title>
</head>
<body>
<nav class="breadcrumb">
    <i class="iconfont">&#xf012b;</i> 首页 <span class="c-gray en">&gt;</span>
    系统管理 <span class="c-gray en">&gt;</span> 开发文档
    <a class="btn btn-success radius r mr-20" style="line-height:1.6em;margin-top:3px" href="info" title="返回上级" >
        <i class="icon-arrow-left"></i>
    </a>
</nav>
<div class="pd-20">
    <form name="example" action="info!save" method="post" class="form form-horizontal" id="form-user-add">
        <div class="row cl">
            <label class="form-label col-3">标题：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" placeholder="标题" name="infomation.title" datatype="*1-50" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">摘要：</label>
            <div class="formControls col-6">
                <textarea name="infomation.summary" class="textarea"  placeholder="摘要" datatype="*1-200" dragonfly="true" nullmsg="*必填" onKeyUp="textarealength(this,200)"></textarea>
                <p class="textarea-numberbar"><em class="textarea-length">0</em>/200</p>
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">内容：</label>
            <div class="formControls col-8">
                <textarea rows="10" cols="90" type="text/plain" id="content" name="infomation.content">请输入.....</textarea>
            </div>
            <div class="col-2"> </div>
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
<script type="text/javascript" src="lib/icheck/jquery.icheck.min.js"></script>
<script type="text/javascript" src="lib/Validform_v5.3.2.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<!-- 配置文件 -->
<script type="text/javascript" src="ueditor/1.4.3/ueditor.config.js"></script>
<!-- 编辑器源码文件 -->
<script type="text/javascript" src="ueditor/1.4.3/ueditor.all.js"></script>
<!-- 实例化编辑器 -->
<script type="text/javascript">
    var ue = UE.getEditor('content');
</script>
<script type="text/javascript">
    $(function(){
        $("#form-user-add").Validform({
            tiptype:2
        });
    });
</script>
</body>
</html>
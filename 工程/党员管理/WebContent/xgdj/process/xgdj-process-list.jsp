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
    <link href="css/style.css" rel="stylesheet" type="text/css" />
    <link href="lib/font-awesome/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <!--[if IE 7]>
    <link href="lib/font-awesome/font-awesome-ie7.min.css" rel="stylesheet" type="text/css" />
    <![endif]-->
    <link href="lib/iconfont/iconfont.css" rel="stylesheet" type="text/css" />
    <!--[if IE 6]>
    <script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js" ></script>
    <script>DD_belatedPNG.fix('*');</script>
    <![endif]-->
    <title>title</title>
    <link href="css/css001.css" rel="stylesheet" type="text/css" />
</head>
<body>
<nav class="breadcrumb"><i class="iconfont">&#xf012b;</i> 首页
    <span class="c-gray en">&gt;</span> 系统管理 <span class="c-gray en">&gt;</span> 入党流程
    <a class="btn btn-success radius r mr-20" style="line-height:1.6em;margin-top:3px" href="javascript:location.replace(location.href);" title="刷新" >
        <i class="icon-refresh"></i>
    </a>
</nav>
<div class="pd-20">
    <div id="tab_demo" class="HuiTab">
        <div class="tabBar clearfix">
        <c:forEach items="${lists}" var="list">
        	<span>${list.title}</span>
        </c:forEach>
        </div>
        <c:forEach items="${lists}" var="list">
        <div class="tabCon">
            <div class="panel panel-default">
                <div class="panel-header">${list.title}
                    <a href="javascript:add(900,500,'编辑','xgdj/process/xgdj-process-add.jsp?id=${list.id}')" class="r">
                        <i class="icon-edit-sign"></i> 编辑
                    </a>
                </div>
                <div class="panel-body">
                    ${list.content}
                </div>
            </div>
        </div>
        </c:forEach>
    </div>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="lib/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript" src="js/H-ui.admin.doc.js"></script>
<script>
    $(function(){
        $.Huitab("#tab_demo .tabBar span","#tab_demo .tabCon","current","click","0");
    });
</script>
</body>
</html>
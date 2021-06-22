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
    <link href="lib/font-awesome/font-awesome-ie7.min.css" rel="stylesheet" type="text/css"/>
    <![endif]-->
    <link href="lib/iconfont/iconfont.css" rel="stylesheet" type="text/css" />
    <link href="lib/iconfont/1.0.7/iconfont.css" rel="stylesheet"
          type="text/css" />
    <!--[if IE 6]>
    <script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js"></script>
    <script>DD_belatedPNG.fix('*');</script>
    <![endif]-->
    <title>用户管理</title>
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
    <div style="width: 90%;margin:0 auto;padding-left: 5px;padding-bottom: 5px;" class="box-shadow">
        <h3 class="text-c">${infomation.title}</h3>
        <h6 class="text-c"><i class="icon-user">
        	</i>  ${infomation.publishMan}<span class="pipe">|</span><i class="icon-time"></i>  ${infomation.publishTime}
        	<span class="pipe">|</span><a href="info!goView?id=${infomation.id}"><i class="icon-edit"></i>  编辑</a>
        	<span class="pipe">|</span><a href="javascript:del('${infomation.id}');"><i class="icon-trash"></i>  删除</a>
        </h6>
        <div class="content">${infomation.content}</div>
    </div>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript">
/*删除*/
function del(id){
  layer.confirm('确认要删除吗？',function(index){
	  window.location.href="info!delete?id="+id;
  });
}
</script>
</body>
</html>
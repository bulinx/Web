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
    <link href="lib/Hui-iconfont/1.0.7/iconfont.css" rel="stylesheet" type="text/css" />
    <!--[if IE 6]>
    <script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js" ></script>
    <script>DD_belatedPNG.fix('*');</script>
    <![endif]-->
    <script type="text/javascript" src="js/echarts.js"></script>
    <title>添加用户</title>
</head>
<body>
<nav class="breadcrumb">
    <i class="iconfont">&#xf012b;</i> 首页 <span class="c-gray en">&gt;</span>
    数据统计 <span class="c-gray en">&gt;</span> 支部结构
    <a class="btn btn-success radius r mr-20" style="line-height: 1.6em; margin-top: 3px" href="javascript:location.replace(location.href);" title="刷新">
        <i class="icon-refresh"></i>
    </a>
</nav>
<div class="pd-20">
    <div class="bk-gray mb-10 lh-30 mt-10">
        <i class="icon-bar-chart ml-10 mr-10"></i>
        <a href="javascript:sex('xgdj/chart/xgdj-chart-sex.jsp');">男女比例</a><span class="pipe">|</span>
        <a href="javascript:void(0);">柱状图</a>
    </div>
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <iframe id="testIframe" name="testIframe" FRAMEBORDER='0' SCROLLING='AUTO' width='100%' height='500px' src="xgdj/chart/xgdj-chart-sex.jsp"></IFRAME>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript">
	//男女比例
    function sex(url) {
        $("#testIframe").attr("src", url);
    }
</script>
</body>
</html>
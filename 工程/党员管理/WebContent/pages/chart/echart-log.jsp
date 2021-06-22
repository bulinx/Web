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
    数据统计 <span class="c-gray en">&gt;</span> 登录区域
    <a class="btn btn-success radius r mr-20" style="line-height: 1.6em; margin-top: 3px" href="javascript:location.replace(location.href);" title="刷新">
        <i class="icon-refresh"></i>
    </a>
</nav>
<div class="pd-20">
	<div class="bk-gray mb-10 lh-30 mt-10" style="padding-left: 10px;">
        <i class="icon-time mr-10"></i>
        <a href="javascript:months();">最近一月</a><span class="pipe">|</span>
        <a href="javascript:years();">最近一年</a><span class="pipe">|</span>
        <a href="javascript:void(0);">最近一天</a>
        <i class="icon-bar-chart ml-30 mr-10"></i>
        <a href="javascript:cho('pages/chart/echart-log-init.jsp');">饼图</a><span class="pipe">|</span>
        <a href="javascript:cho('pages/chart/echart-log-bar.jsp');">折线图</a><span class="pipe">|</span>
        <a href="javascript:cho('pages/chart/echart-log-bar.jsp');">柱状图</a>
    </div>
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <iframe id="testIframe" name="testIframe" FRAMEBORDER='0' SCROLLING='AUTO' width='100%' height='500px' src="pages/chart/echart-log-init.jsp"></IFRAME>
    <!--<div id="main" style="width: 90%;height:400px;"></div>-->
    <input type="hidden" id="dates">
    <input type="hidden" id="chart">
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript">
	function cho(url) {
		$("#testIframe").attr("src", url);
	}
	var date = new Date;
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var mydate = (year.toString()+'-'+month.toString());
	
	$(function(){
	    $("#dates").val(mydate);
	    $("#chart").val('pie');
	});
	//最近一年
    function years() {
        $("#dates").val(year.toString());
        var chart = $("#chart").val();
        if (chart == 'pie') {
        	var url = "pages/chart/echart-log-pie-look.jsp?dates="+year.toString()+"&format=Y";
            $("#testIframe").attr("src", url);
        } else if (chart == 'bar') {
        	var url = "pages/chart/echart-view-bar-look.jsp?dates="+year.toString()+"&format=Y";
            $("#testIframe").attr("src", url);
        } else if (chart == 'line') {
        	var url = "pages/chart/echart-view-line-look.jsp?dates="+year.toString()+"&format=Y";
            $("#testIframe").attr("src", url);
        }
    }
  	//最近一月
    function months() {
        $("#dates").val(mydate);
        var chart = $("#chart").val();
        if (chart == 'pie') {
        	var url = "pages/chart/echart-log-pie-look.jsp?dates="+mydate+"&format=Y-m";
            $("#testIframe").attr("src", url);
        } else if (chart == 'bar') {
        	var url = "pages/chart/echart-view-bar-look.jsp?dates="+mydate+"&format=Y-m";
            $("#testIframe").attr("src", url);
        } else if (chart == 'line') {
        	var url = "pages/chart/echart-view-line-look.jsp?dates="+mydate+"&format=Y-m";
            $("#testIframe").attr("src", url);
        }
    }
</script>
</body>
</html>
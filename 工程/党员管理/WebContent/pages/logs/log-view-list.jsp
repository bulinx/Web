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
    <title>管理</title>
</head>
<body>
<nav class="breadcrumb">
    <i class="iconfont">&#xf012b;</i> 首页 <span class="c-gray en">&gt;</span>
    日志管理 <span class="c-gray en">&gt;</span> 访问记录 <a
        class="btn btn-success radius r mr-20"
        style="line-height: 1.6em; margin-top: 3px"
        href="javascript:location.replace(location.href);" title="刷新"><i
        class="icon-refresh"></i></a>
</nav>
<div class="pd-20">
    <div class="text-c">
        <form action="views!search" method="post">
            日期范围： <input type="text" placeholder="开始时间"
                         onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d %H:%m:%s'})"
                         id="datemin" name="start" class="input-text Wdate" style="width: 180px;">
            - <input type="text" placeholder="结束时间"
                     onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d %H:%m:%s'})"
                     id="datemax" name="end" class="input-text Wdate" style="width: 180px;">
            <input type="text" class="input-text" style="width: 150px"
                   placeholder="访问IP" name="views.ip" id="ip">
            <input type="text" class="input-text" style="width: 150px"
                   placeholder="访问地点" name="views.address" id="address">
            <button type="submit" class="btn btn-success">
                <i class="icon-search"></i> 搜记录
            </button>
            <button type="button" onclick="cle();" class="btn btn-success">
                <i class="icon-refresh"></i> 清空
            </button>
        </form>
    </div>
    <div class="cl pd-5 bg-1 bk-gray mt-20">
        <span class="r">共有数据：<strong>${page.totalCount}</strong> 条</span>
    </div>
    <table
            class="table table-border table-bordered table-hover table-bg table-sort">
        <thead>
        <tr class="text-c">
            <th width="25">序号</th>
            <th width="100">访问IP</th>
            <th width="100">MAC地址</th>
            <th width="40">访问地点</th>
            <th width="80">设备类型</th>
            <th width="90">访问时间</th>
            <th width="150">备注</th>
        </tr>
        </thead>
        <tbody>
        <c:forEach items="${lists}" var="list" varStatus="sta">
        	<tr class="text-c">
            <td>${sta.index+1}</td>
            <td>${list.ip}</td>
            <td>${list.macAddress}</td>
            <td>${list.address}</td>
            <td>${list.type}</td>
            <td>${list.createTime}</td>
            <td>${list.content}</td>
        </tr>
        </c:forEach>
        </tbody>
    </table>
    <div class="text-c mt-10" id="page_id"></div>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="lib/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript" src="js/H-ui.admin.doc.js"></script>
<script type="text/javascript" src="lib/laypage-v1.3/laypage/laypage.js"></script>
<script type="text/javascript" src="lib/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript">
    $('.table-sort').dataTable({
        "lengthMenu" : false,//显示数量选择
        "bFilter" : false,//过滤功能
        "bPaginate" : false,//翻页信息
        "bInfo" : false,//数量信息
        "aaSorting" : [ [ 0, "desc" ] ],//默认第几个排序
        "bStateSave" : true,//状态保存
        "aoColumnDefs" : [
            //{"bVisible": false, "aTargets": [ 3 ]} //控制列的隐藏显示
            {
                "orderable" : false,
                "aTargets" : [ 1,2, 3, 4,6 ]
            } // 制定列不参与排序
        ]
    });

    //page
    laypage({
        cont: 'page_id',
        pages: '${page.totalPage}', //总页数
        skip: true, //是否开启跳页
        curr: '${page.currentPage}',
        jump: function(e, first){ //触发分页后的回调
            if(!first){ //一定要加此判断，否则初始时会无限刷新
            	window.location.href = "views?currentPage=" + e.curr;
            }
        }
    });

    //清空搜索
    function cle() {
        $("#datemin").val("");
        $("#datemax").val("");
        $("#address").val("");
        $("#ip").val("");
    }
</script>
</body>
</html>
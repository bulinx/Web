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
    <span class="c-gray en">&gt;</span> 入党信息 <span class="c-gray en">&gt;</span>我的信息
    <a class="btn btn-success radius r mr-20" style="line-height:1.6em;margin-top:3px" href="javascript:location.replace(location.href);" title="刷新" >
        <i class="icon-refresh"></i>
    </a>
</nav>
<div class="pd-20">
    <div class="panel panel-default">
        <div class="panel-header">入党申请</div>
        <div class="panel-body">
            <table class="table table-border table-bordered table-bg table-hover">
                <thead>
                <tr class="text-c">
                    <th>学号</th>
                    <th>单位</th>
                    <th>姓名</th>
                    <th>身份证号码</th>
                    <th>性别</th>
                    <th>民族</th>
                    <th>出生日期</th>
                    <th>文化程度</th>
                    <th>职业</th>
                    <th>申请入党时间</th>
                    <th>列入考察时间</th>
                    <th>是否党校培训</th>
                    <th>是否团员</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c">
                    <td>${obj.number}</td>
                    <td>${obj.company}</td>
                    <td>${obj.name}</td>
                    <td>${obj.idCard}</td>
                    <td>${obj.sex}</td>
                    <td>${obj.nation}</td>
                    <td>${obj.birthday}</td>
                    <td>${obj.culture}</td>
                    <td>${obj.job}</td>
                    <td>${obj.partyDate}</td>
                    <td>${obj.viewDate}</td>
                    <td>${obj.partySchool}</td>
                    <td>${obj.youth}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <c:if test="${obj.positiveDate != null && obj.positiveDate != ''}">
    <div class="panel panel-default mt-5">
        <div class="panel-header">积极分子申请</div>
        <div class="panel-body">
            <table class="table table-border table-bordered table-bg table-hover">
                <thead>
                <tr class="text-c">
                    <th>姓名</th>
					<th>性别</th>
					<th>民族</th>
					<th>单位</th>
					<th>出生日期</th>
					<th>身份证号码</th>
					<th>学历</th>
					<th>申请入党时间</th>
					<th>推荐或推优方式</th>
					<th>确定为积极分子时间</th>
					<th>培养联系人</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c">
                    <td>${obj.name}</td>
					<td>${obj.sex}</td>
					<td>${obj.nation}</td>
					<td>${obj.company}</td>
					<td>${obj.birthday}</td>
					<td>${obj.idCard}</td>
					<td>${obj.culture}</td>
					<td>${obj.partyDate}</td>
					<td>${obj.promote}</td>
					<td>${obj.positiveDate}</td>
					<td>${obj.linkMan1},${obj.linkMan2}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    </c:if>
    <c:if test="${obj.train != null && obj.train != ''}">
    <div class="panel panel-default mt-5">
        <div class="panel-header">拟发展申请</div>
        <div class="panel-body">
            <table class="table table-border table-bordered table-bg table-hover">
                <thead>
                <tr class="text-c">
					<th>姓名</th>
					<th>性别</th>
					<th>单位</th>
					<th>出生日期</th>
					<th>民族</th>
					<th>身份证号码</th>
					<th width="100">受表彰情况</th>
					<th>发展对象培训情况</th>
					<th>入党介绍人</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c">
					<td>${obj.name}</td>
					<td>${obj.sex}</td>
					<td>${obj.company}</td>
					<td>${obj.birthday}</td>
					<td>${obj.nation}</td>
					<td>${obj.idCard}</td>
					<td title="${obj.honor}" style="cursor: pointer;">
						<p class="text-overflow" style="width:180px;">${obj.honor}</p>
					</td>
					<td>${obj.train}</td>
					<td>${obj.linkMan1},${obj.linkMan2}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    </c:if>
    <c:if test="${obj.volunteer != null && obj.volunteer != ''}">
    <div class="panel panel-default mt-5">
        <div class="panel-header">发展申请</div>
        <div class="panel-body">
            <table class="table table-border table-bordered table-bg table-hover">
                <thead>
                <tr class="text-c">
					<th>姓名</th>
					<th>性别</th>
					<th>单位</th>
					<th>出生日期</th>
					<th>民族</th>
					<th>身份证号码</th>
					<th width="100">受表彰情况</th>
					<th>发展对象培训情况</th>
					<th>入党介绍人</th>
					<th>支部通过时间</th>
					<th>分党委审批时间</th>
					<th>志愿书编号</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-c">
					<td>${obj.name}</td>
					<td>${obj.sex}</td>
					<td>${obj.company}</td>
					<td>${obj.birthday}</td>
					<td>${obj.nation}</td>
					<td>${obj.idCard}</td>
					<td title="${obj.honor}" style="cursor: pointer;">
						<p class="text-overflow" style="width:180px;">${obj.honor}</p>
					</td>
					<td>${obj.train}</td>
					<td>${obj.linkMan1},${obj.linkMan2}</td>
					<td>${obj.passDate}</td>
					<td>${obj.approveDate}</td>
					<td>${obj.volunteer}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    </c:if>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="lib/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
</body>
</html>
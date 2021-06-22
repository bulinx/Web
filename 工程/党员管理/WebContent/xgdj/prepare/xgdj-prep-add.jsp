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
    <meta name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <!--[if lt IE 9]>
    <script type="text/javascript" src="lib/html5.js"></script>
    <script type="text/javascript" src="lib/respond.min.js"></script>
    <script type="text/javascript" src="lib/PIE_IE678.js"></script>
    <![endif]-->
    <link href="css/H-ui.min.css" rel="stylesheet" type="text/css"/>
    <link href="css/H-ui.admin.css" rel="stylesheet" type="text/css"/>
    <link href="lib/icheck/icheck.css" rel="stylesheet" type="text/css"/>
    <link href="lib/font-awesome/font-awesome.min.css" rel="stylesheet" type="text/css"/>
    <!--[if IE 7]>
    <link href="lib/font-awesome/font-awesome-ie7.min.css" rel="stylesheet" type="text/css"/>
    <![endif]-->
    <link href="lib/iconfont/iconfont.css" rel="stylesheet" type="text/css"/>
    <link href="ZeroClipboard/jquery-zclip.css" rel="stylesheet" type="text/css"/>
    <!--[if IE 6]>
    <script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js"></script>
    <script>DD_belatedPNG.fix('*');</script>
    <![endif]-->
    <title>title</title>
</head>
<body>
<nav class="breadcrumb">
    <i class="iconfont">&#xf012b;</i> 首页 <span class="c-gray en">&gt;</span>
    入党信息 <span class="c-gray en">&gt;</span> 发展申请
    <a class="btn btn-success radius r mr-20" style="line-height: 1.6em; margin-top: 3px"
       href="javascript:location.replace(location.href);" title="刷新">
        <i class="icon-refresh"></i>
    </a>
</nav>
<div class="pd-20">
    <form action="prepare!update" method="post" class="form form-horizontal" id="form-user-add">
        <div class="row cl">
            <label class="form-label col-3">学号：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" value="${obj.number}" readonly="readonly" name="data.number" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">姓名：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" value="${obj.name}" readonly="readonly" placeholder="姓名" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">性别：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" value="${obj.sex}" readonly="readonly" placeholder="性别" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">单位：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" value="${obj.company}" readonly="readonly" placeholder="单位" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">出生日期：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text laydate-icon" readonly="readonly" placeholder="出生日期" value="${obj.birthday}" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">民族：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" value="${obj.nation}" readonly="readonly" placeholder="民族" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">身份证：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" placeholder="身份证" readonly="readonly" value="${obj.idCard}"
                       datatype="card" nullmsg="*必填" errormsg="格式错误">
            </div>
            <div class="col-3"></div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">第一联系人：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" value="${obj.linkMan1}" readonly="readonly" placeholder="第一联系人" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">第二联系人：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" value="${obj.linkMan2}" readonly="readonly" placeholder="第二联系人" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">培训情况：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" value="${obj.train}" readonly="readonly" placeholder="培训情况" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">受表彰情况：</label>
            <div class="formControls col-6">
                <textarea readonly="readonly"  class="textarea"  placeholder="例：2011年11月被湖北民族大学评为三好学生标兵" datatype="*1-200" nullmsg="不能为空！">${obj.honor}</textarea>
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">支部通过时间：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text laydate-icon" onclick="laydate();" placeholder="支部通过时间" name="data.passDate" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">分党委审批时间：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text laydate-icon" onclick="laydate();" placeholder="分党委审批时间" name="data.approveDate" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">志愿书编号：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" name="data.volunteer" placeholder="志愿书编号" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <div class="col-9 col-offset-3">
                <input class="btn btn-primary radius" type="submit" value="&nbsp;&nbsp;提交&nbsp;&nbsp;">
            </div>
        </div>
    </form>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="lib/Validform_v5.3.2.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script src="lib/laydate-v1.1/laydate/laydate.js"></script>
<script type="text/javascript">
    $(function () {
        $("#form-user-add").Validform({
            tiptype: 2,
            datatype : {
                "card" : /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
            }
        });
    });
</script>
</body>
</html>
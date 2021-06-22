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
    <title>完善基础信息</title>
</head>
<body>
<div class="pd-20">
    <form action="foundation!update" method="post" class="form form-horizontal" id="form-user-add">
        <div class="row cl">
            <label class="form-label col-3">学号：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" value="${user.name}" readonly="readonly" name="foundation.number" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">班级：</label>
            <div class="formControls col-6"> <span class="select-box">
        <select class="select" size="1" name="foundation.classes" id="classes" datatype="*" nullmsg="*必选">
            <option value="${obj.classes}" selected>${obj.classes}</option>
        </select>
        </span></div>
            <div class="col-3"></div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">入学年份：</label>
            <div class="formControls col-6"> <span class="select-box">
        <select class="select" size="1" id="schoolYear" name="foundation.schoolYear" datatype="*" nullmsg="*必选">
            <option value="${obj.schoolYear}" selected>${obj.schoolYear}</option>
        </select>
        </span></div>
            <div class="col-3"></div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">姓名：</label>
            <div class="formControls col-6">
                <input type="text" value="${obj.realName}" class="input-text" name="foundation.realName" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">性别：</label>
            <div class="formControls col-6"> <span class="select-box">
        <select class="select" size="1" name="foundation.sex" datatype="*" nullmsg="*必选">
            <option value="${obj.sex}" selected>${obj.sex}</option>
            <option value="男">男</option>
            <option value="女">女</option>
        </select>
        </span></div>
            <div class="col-3"></div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">出生日期：</label>
            <div class="formControls col-6">
                <input type="text" value="${obj.birthday}" class="input-text laydate-icon" onclick="laydate();" name="foundation.birthday" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">身份证：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" placeholder="身份证" name="foundation.idCard"
                       datatype="card" value="${obj.idCard}" nullmsg="*必填" errormsg="格式错误">
            </div>
            <div class="col-3"></div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">生源地：</label>
            <div class="formControls col-6">
                <input type="text" value="${obj.source}" class="input-text" name="foundation.source">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">籍贯：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" value="${obj.nation}" name="foundation.nation" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">高考准考证号：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" value="${obj.ticket}" name="foundation.ticket">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">政治面貌：</label>
            <div class="formControls col-6"> <span class="select-box">
        <select class="select" size="1" name="foundation.identity" id="identity" datatype="*" nullmsg="*必选">
            <option value="${obj.identity}" selected>${obj.identity}</option>
        </select>
        </span></div>
            <div class="col-3"></div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">入学日期：</label>
            <div class="formControls col-6">
                <input type="text" value="${obj.admission}" class="input-text laydate-icon" onclick="laydate();" name="foundation.admission" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">宿舍：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" value="${obj.dormitory}" name="foundation.dormitory" datatype="*" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">电话：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" value="${obj.phone}" name="foundation.phone" datatype="m" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">QQ：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" name="foundation.qq" value="${obj.qq}">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">E-mail：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" name="foundation.email" value="${obj.email}">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">通信地址：</label>
            <div class="formControls col-6">
                <textarea name="foundation.address" class="textarea"  placeholder="详细通信地址">${obj.address}</textarea>
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
<script type="text/javascript" src="js/dictionary.js"></script>
<script type="text/javascript">
    $(function () {
        $("#form-user-add").Validform({
            tiptype: 2,
            datatype : {
                "card" : /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
            }
        });
		//入学年份
        year();
        //班级
        classesText("classes");
        //政治面貌
        politicalText("identity");
    });
	
    //入学年份
    function year() {
        var date = new Date();
        for (var i = 0; i < 8; ++i) {
            var j = date.getFullYear()-i;
            $("#schoolYear").append('<option value="'+j+'">'+j+'</option>');
        }
    }
</script>
</body>
</html>
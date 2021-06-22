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
    <link href="lib/icheck/icheck.css" rel="stylesheet" type="text/css" />
    <link href="lib/font-awesome/font-awesome.min.css" rel="stylesheet"
          type="text/css" />
    <!--[if IE 7]>
    <link href="lib/font-awesome/font-awesome-ie7.min.css" rel="stylesheet" type="text/css"/>
    <![endif]-->
    <link href="lib/iconfont/iconfont.css" rel="stylesheet" type="text/css" />
    <!--[if IE 6]>
    <script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js"></script>
    <script>DD_belatedPNG.fix('*');</script>
    <![endif]-->
    <link href="css/Validform_v5.3.2.css" rel="stylesheet" type="text/css">
    <title>添加用户</title>
</head>
<body>
<div class="pd-20">
    <form action="users!save" method="post" class="form form-horizontal" id="form-user-add">
        <div class="row cl">
            <label class="form-label col-3">用户名：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" placeholder="用户名" name="users.name"
                       datatype="*3-20" nullmsg="*必填" id="name" ajaxurl="users!checkName">
            </div>
            <div class="col-3"></div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">用户角色：</label>
            <div class="formControls col-6">
                <span class="select-box">
                    <select class="select" size="1" id="author" name="users.role.id" datatype="*" nullmsg="*必选">
                        <option value="" selected="selected">--请选择--</option>
                    </select>
                </span>
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">初始密码：</label>
            <div class="formControls col-6">
                <input datatype="*6-20" type="text" class="input-text" name="users.pass" plugin="passwordStrength" nullmsg="*必填">
                <div class="passwordStrength">密码强度： <span>弱</span><span>中</span><span class="last">强</span></div>
            </div>
            <div class="col-3"></div>
        </div>
        <div class="row cl">
            <div class="col-9 col-offset-3">
                <input class="btn btn-primary radius" type="submit"
                       value="&nbsp;&nbsp;提交&nbsp;&nbsp;">
            </div>
        </div>
    </form>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="lib/icheck/jquery.icheck.min.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="lib/Validform_v5.3.2.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript" src="lib/Validform/5.3.2/passwordStrength-min.js"></script>
<script type="text/javascript">
    $(function() {
        s20();
        role();
    });
    
    $("#form-user-add").Validform({
		ajaxPost:true,
		tiptype : 2,
		usePlugin:{
            passwordstrength:{
                minLen:6,
                maxLen:20
            }
        },
		callback:function(data){
			$.Hidemsg();
			if (data.success) {
                layer.msg(data.msg, 2, 1);
                setTimeout("closeLayer()",1500);
            } else {
                layer.msg(data.msg, 2);
            }
		}
	});

    //关闭layer
    function closeLayer() {
        var index = parent.layer.getFrameIndex(window.name);
        parent.location.replace(parent.location.href);
        parent.layer.close(index);
    }

    //生成9位随机数
    function s20() {
        var data = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ];
        var result = "";
        for (var i = 0; i < 9; i++) { //产生20位就使i<20
            r = Math.floor(Math.random() * 10); //16为数组里面数据的数量，目的是以此当下标取数组data里的值！
            result += data[r]; //输出9次随机数的同时，让rrr加20次，就是20位的随机字符串了。
        }
        $("#name").val(result);
    }
    
    function role() {
    	$.post("role!getRoles",{},function(v){
    		var r = eval("("+v+")");
    		for (var i = 0; i < r.length; ++i) {
    			$("#author").append('<option value="'+r[i].id+'">'+r[i].name+'</option>');
    		}
    	});
    }
</script>
</body>
</html>
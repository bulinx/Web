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
    <!--[if IE 6]>
    <script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js" ></script>
    <script>DD_belatedPNG.fix('*');</script>
    <![endif]-->
    <title>添加用户</title>
</head>
<body>
<div class="pd-20">
    <form action="button!saveButton" method="post" class="form form-horizontal" id="form-user-add">
        <div class="row cl">
            <label class="form-label col-3">按钮名称：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" placeholder="按钮名称" name="button.name" datatype="*1-50" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div>
            <div class="row cl" id="mr">
                <label class="form-label col-3">父级菜单：</label>
                <div class="formControls col-6"> <span class="select-box">
                    <select class="select" size="1" name="button.subName" id="subId" onchange="guid(this);" datatype="*" nullmsg="*必选">
                        <option value="" selected>--请选择--</option>
                    </select></span>
                </div>
                <div class="col-3"> </div>
            </div>
        </div>
        <div id="iden" class="row cl" style="display: none;">
            <label class="form-label col-3">按钮标识：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" placeholder="按钮标识" name="button.identity" id="identity" readonly="readonly">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">描述：</label>
            <div class="formControls col-6">
                <textarea name="button.content" class="textarea"  placeholder="按钮说明" datatype="*0-200" dragonfly="true" nullmsg="备注不能为空！" onKeyUp="textarealength(this,200)"></textarea>
                <p class="textarea-numberbar"><em class="textarea-length">0</em>/200</p>
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
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="lib/Validform_v5.3.2.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript">
    $(function(){
        $("#form-user-add").Validform({
            tiptype:2,
            ajaxPost:true,
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
        sub();
    });
  	//关闭layer
    function closeLayer() {
        var index = parent.layer.getFrameIndex(window.name);
        parent.location.replace(parent.location.href);
        parent.layer.close(index);
    }
    //标识
    function guid(obj) {
    	var arr = $(obj).val().split("-");
        var gid = (((1+Math.random())*0x10000)|0).toString(16).substring(1)+"-"+arr[0];
        $("#iden").show();
        $("#identity").val(gid);
    }
    //二级菜单
    function sub() {
    	$.post("menu!subMenu",{},function(v){
    		var res = $.parseJSON(v);
    		for (var i = 0; i < res.length; ++i) {
    			$("#subId").append('<option value="'+res[i].id+'-'+res[i].name+'">'+res[i].name+'</option>');
    		}
    	});
    }
</script>
</body>
</html>
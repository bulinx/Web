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
    <form method="post" class="form form-horizontal" id="form-add">
        <input type="hidden" id="codes" name="menu.codes" value="0">
        <div class="row cl">
            <label class="form-label col-3">名称：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" placeholder="菜单名称" name="menu.name" datatype="*1-50" nullmsg="*必填">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">类型：</label>
            <div class="formControls col-6 skin-minimal">
                <div class="radio-box">
                    <input type="radio" id="sex-1" name="more" value="1" datatype="*" nullmsg="*必选">
                    <label for="sex-1">父级菜单</label>
                </div>
                <div class="radio-box">
                    <input type="radio" id="sex-2" value="2" name="more">
                    <label for="sex-2">子菜单</label>
                </div>
            </div>
            <div class="col-3"> </div>
        </div>
        <div id="pr" style="display: none;">
            <div class="row cl">
                <label class="form-label col-3">图标：</label>
                <div class="formControls col-6">
                    <input type="text" class="input-text" placeholder="菜单图标，H-ui" name="menu.icon" datatype="*0-50" nullmsg="*必填">
                </div>
                <div class="col-3"> </div>
            </div>
        </div>
        <div id="ch" style="display: none;">
            <div class="row cl" id="mr">
                <label class="form-label col-3">父级菜单：</label>
                <div class="formControls col-6"> <span class="select-box">
                    <select class="select" size="1" id="pcode" onchange="code(this);" datatype="*" nullmsg="*必选">
                        <option value="" selected>--请选择--</option>
                    </select></span>
                </div>
                <div class="col-3"> </div>
            </div>
            <div class="row cl">
                <label class="form-label col-3">URL：</label>
                <div class="formControls col-6">
                    <input type="text" class="input-text" placeholder="访问地址" name="menu.url" datatype="en" nullmsg="*必填" errormsg="不能输入中文">
                </div>
                <div class="col-3"> </div>
            </div>
        </div>
        <div class="row cl">
            <label class="form-label col-3">序号：</label>
            <div class="formControls col-6">
                <input type="text" class="input-text" placeholder="排序序号" name="menu.orderNum" datatype="n" nullmsg="*必填" errormsg="*数字">
            </div>
            <div class="col-3"> </div>
        </div>
        <div class="row cl">
	      	<label class="form-label col-3">描述：</label>
	      	<div class="formControls col-6">
	        	<textarea name="menu.content" class="textarea"  placeholder="菜单说明" datatype="*1-100" dragonfly="true" nullmsg="备注不能为空！" onKeyUp="textarealength(this,100)"></textarea>
	       		<p class="textarea-numberbar"><em class="textarea-length">0</em>/100</p>
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
<script type="text/javascript" src="lib/icheck/jquery.icheck.min.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="lib/Validform_v5.3.2.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript">
    $(function(){
        $("#form-add").Validform({
            tiptype:2,
            datatype : {
                "en":/^[^\u4e00-\u9fa5]{0,}$/
            }
        });
        //多级
        $("input[name=more]").click(function(){
            var v = $(this).val();
            if (v == 1) {
                $("#pr").show();
                $("#ch").hide();
            }
            if (v == 2) {
                $("#pr").hide();
                $("#ch").show();
            }
        });
        
        menu();
    });

    function code(obj) {
        var v = $(obj).val();
        $("#codes").val(v);
    }
    
  //异步提交
   $("#form-add").submit(function() {
   	$.ajax({
   		url : "menu!save",
   		data : $('#form-add').serialize(),
   		type : "POST",
   		dataType : 'text',
   		success : function(v) {
   			var r = eval("(" + v + ")");
   			if (r.success) {
   				layer.msg(r.msg, 2, 1);
   				setTimeout("closeLayer()", 1500);
   			} else {
   				layer.msg(r.msg, 2);
   			}
   		}
   	});
   	return false;
   });
  
 	//关闭layer
	function closeLayer() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.location.replace(parent.location.href);
		parent.layer.close(index);
	}
 	
	 function menu() {
		 $.post("menu!parentMenu",{},function(v){
	         var r = eval("("+v+")");
	         for (var i = 0; i < r.length; ++i) {
	             $("#pcode").append('<option value="'+ r[i].id+'">'+ r[i].name+'</option>');
	         }
        });
	 }
</script>
</body>
</html>
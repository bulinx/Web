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
    <title>基本设置</title>
</head>
<body>
<nav class="breadcrumb"><i class="iconfont">&#xf012b;</i> 首页
    <span class="c-gray en">&gt;</span> 用户管理 <span class="c-gray en">&gt;</span>
    系统用户 <a class="btn btn-success radius r mr-20" style="line-height:1.6em;margin-top:3px" href="javascript:location.replace(location.href);" title="刷新" >
        <i class="icon-refresh"></i></a>
</nav>
<div class="pd-20">
    <div class="text-c">
        <form action="users!search" method="post">
            日期范围：
            <input type="text" id="datemin" name="start" class="input-text Wdate" style="width: 180px;"
                   onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d %H:%m:%s'})"
                    placeholder="开始时间">
            - <input type="text" id="datemax" name="end" class="input-text Wdate" style="width: 180px;"
                     onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d %H:%m:%s'})"
                     placeholder="开始时间" >
            <input type="text" class="input-text" style="width:150px" placeholder="用户名" name="users.name" id="key">
            <button type="submit" class="btn btn-success"><i class="icon-search"></i> 搜用户</button>
            <button type="button" onclick="cle();" class="btn btn-success">
                <i class="icon-refresh"></i> 清空
            </button>
        </form>
    </div>

    <div class="cl pd-5 bg-1 bk-gray mt-20">
        <span class="l">
            <a roles="d7a7-48" href="javascript:void(0);" onclick="datadel()" class="btn btn-danger radius">
                <i class="icon-trash"></i> 批量删除
            </a>
            <a roles="b341-48" href="javascript:void(0);" onclick="add('550','320','添加用户','pages/user/user-system-add.jsp')" class="btn btn-primary radius">
                <i class="icon-plus"></i> 添加系统用户
            </a>
        </span>
        <span class="r">共有数据：<strong>${page.totalCount}</strong> 条</span>
    </div>
    <table class="table table-border table-bordered table-bg table-hover table-sort">
        <thead>
        <tr class="text-c">
            <th width="25"><input type="checkbox"></th>
            <th>序号</th>
            <th>用户名</th>
            <th>用户权限</th>
            <th>创建时间</th>
            <th>状态</th>
            <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <c:forEach items="${lists}" var="list" varStatus="sta">
        <c:if test="${list.state==0}">
        	<tr class="text-c">
            <td><input type="checkbox" value="${list.id}" name="ck"></td>
            <td>${sta.index+1}</td>
            <td>${list.name}</td>
            <td>${list.role.name}</td>
            <td>${list.createTime}</td>
            <td class="article-status"><span class="label label-success radius">已启用</span></td>
            <td class="f-14 article-manage">
                <a roles="aef3-48" style="text-decoration:none" onClick="stop(this,'${list.id}')" href="javascript:void(0);" title="停用"><i class="icon-hand-down"></i></a>
                <a roles="4fd6-48" style="text-decoration:none" class="ml-5" onclick="edit('450','300','编辑','pages/user/user-system-edit.jsp?id=${list.id}')" href="javascript:void(0);" title="编辑"><i class="icon-edit"></i></a>
                <a roles="76aa-48" style="text-decoration:none" class="ml-5" onClick="reset_password('${list.id}')" href="javascript:void(0);" title="重置密码">
                    <i class="icon-key"></i>
                </a>
                <a roles="eed7-48" title="删除" href="javascript:void(0);" onclick="del(this,'${list.id}')" class="ml-5" style="text-decoration:none"><i class="icon-trash"></i></a>
            </td>
            </td>
        	</tr>
        </c:if>
        <c:if test="${list.state==1}">
        <tr class="text-c">
            <td><input type="checkbox" value="${list.id}" name="ck"></td>
            <td>${sta.index+1}</td>
            <td>${list.name}</td>
            <td>${list.role.name}</td>
            <td>${list.createTime}</td>
            <td class="article-status"><span class="label label radius">已停用</span></td>
            <td class="f-14 article-manage">
                <a roles="aef3-48" style="text-decoration:none" onClick="start(this,'${list.id}')" href="javascript:void(0);" title="启用"><i class="icon-hand-up"></i></a>
                <a roles="4fd6-48" style="text-decoration:none" class="ml-5" onclick="edit('450','300','编辑','pages/user/user-system-edit.jsp?id=${list.id}')" href="javascript:void(0);" title="编辑"><i class="icon-edit"></i></a>
                <a roles="76aa-48" style="text-decoration:none" class="ml-5" onClick="reset_password('${list.id}')" href="javascript:void(0);" title="重置密码">
                    <i class="icon-key"></i>
                </a>
                <a roles="eed7-48" title="删除" href="javascript:void(0);" onclick="del(this,'${list.id}')" class="ml-5" style="text-decoration:none"><i class="icon-trash"></i></a>
            </td>
        </tr>
        </c:if>
        </c:forEach>
        </tbody>
    </table>
    <div class="text-c mt-10" id="page_id"></div>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="lib/Validform_v5.3.2.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="lib/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript" src="lib/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="js/H-ui.admin.doc.js"></script>
<script src="lib/laypage-v1.3/laypage/laypage.js"></script>
<script type="text/javascript">
	$(function(){
		roles();
	});

    $('.table-sort').dataTable({
        "lengthMenu":false,//显示数量选择
        "bFilter": false,//过滤功能
        "bPaginate": false,//翻页信息
        "bInfo": false,//数量信息
        "aaSorting": [[ 1, "desc" ]],//默认第几个排序
        "bStateSave": true,//状态保存
        "aoColumnDefs": [
            {"orderable":false,"aTargets":[0,2,3,5,6]}// 制定列不参与排序
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
                location.href = 'users?currentPage='+e.curr;
            }
        }
    });

    /*添加*/
    function add(w,h,title,url){
        layer_show(w,h,title,url);
    }

    /*编辑*/
    function edit(w,h,title,url){
        layer_show(w,h,title,url);
    }

    /*停用*/
    function stop(obj,id){
        layer.confirm('确认要停用吗？',function(index){
        	$.post("users!updateState",{"key":id,"state":1},function(v){
        		var r = eval("("+v+")");
        		if (r.success) {
        			$(obj).parents("tr").find(".article-manage").prepend('<a style="text-decoration:none" onClick="start(this,'+id+')" href="javascript:void(0);" title="启用"><i class="icon-hand-up"></i></a>');
                    $(obj).parents("tr").find(".article-status").html('<span class="label radius">已停用</span>');
                    $(obj).remove();
                    layer.msg('已停用',1,1);
        		} else {
        			layer.msg(r.msg,1);
        		}
        	});
        });
    }

    /*启用*/
    function start(obj,id){
        layer.confirm('确认要启用吗？',function(index){
        	$.post("users!updateState",{"key":id,"state":0},function(v){
        		var r = eval("("+v+")");
        		if (r.success) {
        			$(obj).parents("tr").find(".article-manage").prepend('<a style="text-decoration:none" onClick="stop(this,'+id+')" href="javascript:void(0);" title="停用"><i class="icon-hand-down"></i></a>');
                    $(obj).parents("tr").find(".article-status").html('<span class="label label-success radius">已启用</span>');
                    $(obj).remove();
                    layer.msg('已启用',1,1);
        		} else {
        			layer.msg(r.msg,1);
        		}
        	});
        });
    }

    /*删除*/
    function del(obj,id){
        layer.confirm('确认要删除吗？',function(index){
        	$.post("users!deleteByIds",{"key":id},function(v){
        		var r = eval("("+v+")");
        		if (r.success) {
        			$(obj).parents("tr").remove();
        	        layer.msg(r.msg,1,1);
        		} else {
        			layer.msg(r.msg,3);
        		}
        	});
        });
    }

    /*重置密码*/
    function reset_password(id){
        layer.confirm('确认要重置密码吗？',function(index){
        	$.post("users!resetPass",{"key":id},function(v){
        		var r = eval("("+v+")");
        		if (r.success) {
        	        layer.msg(r.msg,5,1);
        		} else {
        			layer.msg(r.msg,3);
        		}
        	});
        });
    }

    /*批量删除*/
    function datadel(){
        var chk_value =[];
        $('input[name="ck"]:checked').each(function(){
            chk_value.push($(this).val());
        });

        if (chk_value.length <= 0) {
            //没有选择
            layer.msg('请选择操作对象',2);
        } else {
            layer.confirm('确认要删除吗？',function(index){
            	$.post("users!deleteByIds",{"key":chk_value.toString()},function(v){
            		var r = eval("("+v+")");
            		if (r.success) {
            			$('input[name="ck"]:checked').each(function(){
                            $(this).parents("tr").remove();
                        });
            	        layer.msg(r.msg,1,1);
            		} else {
            			layer.msg(r.msg,3);
            		}
            	});
            });
        }
    }

    //清空搜索
    function cle() {
        $("#datemin").val("");
        $("#datemax").val("");
        $("#key").val("");
    }
</script>
</body>
</html>
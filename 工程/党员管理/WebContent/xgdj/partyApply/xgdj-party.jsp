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
    <!--[if IE 6]>
    <script type="text/javascript" src="lib/DD_belatedPNG_0.0.8a-min.js"></script>
    <script>DD_belatedPNG.fix('*');</script>
    <![endif]-->
    <title>title</title>
</head>
<body>
<nav class="breadcrumb">
    <i class="iconfont">&#xf012b;</i> 首页 <span class="c-gray en">&gt;</span>
    入党信息 <span class="c-gray en">&gt;</span> 我的信息
    <a class="btn btn-success radius r mr-20" style="line-height: 1.6em; margin-top: 3px"
        href="javascript:location.replace(location.href);" title="刷新">
        <i class="icon-refresh"></i>
    </a>
</nav>
<div class="pd-20">
    <ul id="Huifold1" class="Huifold">
    <c:forEach items="${processes}" var="pro">
    <c:if test="${pro.state==1}">
    	<li class="item">
            <h4>1、${pro.title}
            	<c:if test="${state == null}">
            	<span class="c-red">(未通过)</span>
            	</c:if>
            	<c:if test="${state.apply==0}">
            	<span class="c-red">(待审核)</span>
            	</c:if>
            	<c:if test="${state.apply==1}">
            	<span class="c-green">(已通过)</span>
            	</c:if>
            	<b>+</b>
            </h4>
            <div class="info">
                <div>${pro.content}</div>
                <div class="bk-gray radius" style="padding: 10px;">
               		<c:if test="${state.apply==1}">
	            		<span class="c-green">恭喜您，您的入党申请已通过，请继续努力！</span>
	            	</c:if>
	            	<c:if test="${state.apply!=1}">
	            		<a roles="393a-77" href="javascript:apply();" class="btn btn-success radius">
	                        <i class="icon-arrow-right"></i> 我要入党
	                    </a>
	            	</c:if>
                    <span class="c-red ml-30" id="tip1"></span>
                </div>
            </div>
        </li>
    </c:if>
    <c:if test="${pro.state==2}">
    	<li class="item">
            <h4>2、${pro.title}
            	<c:if test="${state.positive==0}">
            		<span class="c-red">(未通过)</span>
            	</c:if>
            	<c:if test="${state.positive==1}">
            		<span class="c-red">(待审核)</span>
            	</c:if>
            	<c:if test="${state.positive==2}">
            		<span class="c-green">(已通过)</span>
            	</c:if>
            	<c:if test="${state == null}">
            	<span class="c-red">(未通过)</span>
            	</c:if>
            	<b>+</b>
            </h4>
            <div class="info">
               	${pro.content}
                <div class="bk-gray radius" style="padding: 10px;">
                	<c:if test="${state.positive==2}">
	            		<span class="c-green">恭喜您，您的积极分子申请已通过，端正思想，继续努力！</span>
	            	</c:if>
	            	<c:if test="${state.positive!=2}">
	            		<a roles="593e-77" href="javascript:positive();" class="btn btn-success radius">
	                        <i class="icon-arrow-right"></i> 我要申请
	                    </a>
	            	</c:if>
                    <span class="c-red ml-30" id="tip2"></span>
                </div>
            </div>
        </li>
    </c:if>
    <c:if test="${pro.state==3}">
    	<li class="item">
            <h4>3、${pro.title}
            	<c:if test="${state.develop==0}">
            		<span class="c-red">(未通过)</span>
            	</c:if>
            	<c:if test="${state.develop==1}">
            		<span class="c-red">(待审核)</span>
            	</c:if>
            	<c:if test="${state.develop==2}">
            		<span class="c-green">(已通过)</span>
            	</c:if>
            	<c:if test="${state == null}">
            	<span class="c-red">(未通过)</span>
            	</c:if>
            <b>+</b>
            </h4>
            <div class="info">${pro.content}
            	<div class="bk-gray radius" style="padding: 10px;">
                	<c:if test="${state.develop==2}">
	            		<span class="c-green">恭喜您，您的拟发展申请已通过，牢记党章，不忘初心！</span>
	            	</c:if>
	            	<c:if test="${state.develop!=2}">
	            		<a roles="603b-77" href="javascript:develop();" class="btn btn-success radius">
	                        <i class="icon-arrow-right"></i> 我要申请
	                    </a>
	            	</c:if>
                    <span class="c-red ml-30" id="tip3"></span>
                </div>
            </div>
        </li>
    </c:if>
    <c:if test="${pro.state==4}">
    	<li class="item">
            <h4>4、${pro.title}
            	<c:if test="${state == null}">
            	<span class="c-red">(未通过)</span>
            	</c:if>
            	<c:if test="${state.prepare==0}">
            		<span class="c-red">(未通过)</span>
            	</c:if>
            	<c:if test="${state.prepare==1}">
            		<span class="c-red">(待审核)</span>
            	</c:if>
            	<c:if test="${state.prepare==2}">
            		<span class="c-green">(已通过)</span>
            	</c:if>
            	<b>+</b>
            </h4>
            <div class="info">${pro.content}
            	<div class="bk-gray radius" style="padding: 10px;">
                	<c:if test="${state.prepare == 2}">
	            		<span class="c-green">恭喜您，您已经是一名中共党员了，争做先锋，树立榜样！</span>
	            	</c:if>
	            	<c:if test="${state.prepare != 2}">
	            		<a roles="1569-77" href="javascript:prep();" class="btn btn-success radius">
	                        <i class="icon-arrow-right"></i> 我要申请
	                    </a>
	            	</c:if>
                    <span class="c-red ml-30" id="tip4"></span>
                </div>
            </div>
        </li>
    </c:if>
    <c:if test="${pro.state==5}">
    	<li class="item">
            <h4>5、${pro.title}
            <c:if test="${state == null}">
           	<span class="c-red">(未通过)</span>
           	</c:if>
           	<c:if test="${state.normal==0}">
           		<span class="c-red">(未通过)</span>
           	</c:if>
           	<c:if test="${state.normal==1}">
           		<span class="c-red">(待审核)</span>
           	</c:if>
           	<c:if test="${state.normal==2}">
           		<span class="c-green">(已通过)</span>
           	</c:if>
            <b>+</b>
            </h4>
            <div class="info">${pro.content}
            	<div class="bk-gray radius" style="padding: 10px;">
                	<c:if test="${state.normal == 2}">
	            		<span class="c-green">恭喜您，您的转正申请已通过，时刻牢记党员的权利与义务！</span>
	            	</c:if>
	            	<c:if test="${state.normal != 2}">
	            		<a roles="6e1b-77" href="javascript:normal();" class="btn btn-success radius">
	                        <i class="icon-arrow-right"></i> 我要申请
	                    </a>
	            	</c:if>
                    <span class="c-red ml-30" id="tip5"></span>
                </div>
            </div>
        </li>
    </c:if>
    </c:forEach>
    </ul>
</div>
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="js/H-ui.js"></script>
<script type="text/javascript" src="js/H-ui.admin.js"></script>
<script type="text/javascript" src="lib/layer1.8/layer.min.js"></script>
<script type="text/javascript" src="js/H-ui.admin.doc.js"></script>
<script type="text/javascript">
	$(function() {
        $.Huifold("#Huifold1 .item h4","#Huifold1 .item .info","fast",1,"click"); /*5个参数顺序不可打乱，分别是：相应区,隐藏显示的内容,速度,类型,事件*/
        roles();
	});
	
	/*入党申请*/
    function apply() {
        layer.confirm('确认要申请入党吗？',function(index){
        	layer.load('正在处理', 3);
            $.post("partyApply!checkApply",{},function(v){
                var res = $.parseJSON(v);
                if (res.success) {
                	if (res.code == 1) {
                		//未申请
                		window.location.href="partyApply!findByNum?key=${user.name}";
                	} else if (res.code == 3) {
                		//审核中
                		$("#tip1").html("提示："+res.msg);
                		layer.msg(res.msg,2);
                	} else if (res.code == 4) {
                		//审核中
                		$("#tip1").html("提示："+res.msg);
                		layer.msg(res.msg,2);
                	} else if (res.code == 2) {
                		//审核通过
                		$("#tip1").html("提示："+res.msg);
                		layer.msg(res.msg,2);
                	} else {
                		layer.msg(res.msg,2);
                	}
                } else {
                    layer.msg(res.msg,2);
                }
            });
        });
    }
	
    /*积极申请*/
    function positive() {
        layer.confirm('确认要提交积极分子申请吗？',function(index){
        	layer.load('正在处理', 3);
            $.post("positive!checkPositive",{},function(v){
                var res = $.parseJSON(v);
                if (res.success) {
                    layer.msg(res.msg,1,1);
                    window.location.href="positive!findByNum";
                } else {
                	$("#tip2").html("提示："+res.msg);
                    layer.msg(res.msg,2);
                }
            });
        });
    }
    
    /*拟发展*/
    function develop() {
        layer.confirm('确认要提交拟发展申请吗？',function(index){
        	layer.load('正在处理', 3);
            $.post("develop!check",{},function(v){
                var res = $.parseJSON(v);
                if (res.success) {
                    layer.msg(res.msg,1,1);
                    window.location.href="develop!findByNum";
                } else {
                	$("#tip3").html("提示："+res.msg);
                    layer.msg(res.msg,2);
                }
            });
        });
    }
    
    /*发展*/
    function prep() {
        layer.confirm('确认要提交发展申请吗？',function(index){
        	layer.load('正在处理', 3);
            $.post("prepare!check",{},function(v){
                var res = $.parseJSON(v);
                if (res.success) {
                    layer.msg(res.msg,1,1);
                    window.location.href="prepare!findByNum";
                } else {
                	$("#tip4").html("提示："+res.msg);
                    layer.msg(res.msg,2);
                }
            });
        });
    }
    
    /*转正*/
    function normal() {
        layer.confirm('确认要提交转正申请吗？',function(index){
        	layer.load('正在处理', 3);
            $.post("normal!check",{},function(v){
                var res = $.parseJSON(v);
                if (res.success) {
                    layer.msg(res.msg,1,1);
                    window.location.href="normal!findByNum";
                } else {
                	$("#tip5").html("提示："+res.msg);
                    layer.msg(res.msg,2);
                }
            });
        });
    }
</script>
</body>
</html>
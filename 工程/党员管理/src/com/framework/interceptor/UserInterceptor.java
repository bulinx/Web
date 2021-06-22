 package com.framework.interceptor;

import java.util.Map;

import com.framework.po.User;
import com.framework.utils.Constant;
import com.opensymphony.xwork2.Action;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

/**
 * 普通用户拦截器
 * @author tch
 * 2015-03
 */
public class UserInterceptor extends AbstractInterceptor{

	private static final long serialVersionUID = 1L;
	//通过action
	private String excludeActions;

	public String getExcludeActions() {
		return excludeActions;
	}

	public void setExcludeActions(String excludeActions) {
		this.excludeActions = excludeActions;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		//取得请求相关的actionContext实例
		ActionContext actionContext = invocation.getInvocationContext();
		
		Map session = actionContext.getSession();
		
		//获得请求action名称
		String actionName = invocation.getInvocationContext().getName();
		//可通过action
		String[] excludeAction = excludeActions.split(",");
		for (int i = 0; i < excludeAction.length; ++i) {
			if (actionName.startsWith(excludeAction[i])) {
				return invocation.invoke();
			}
		}
		
		//得到登录属性
		User user = (User) session.get(Constant.CURRENT_USER);

		//已登录
		if (user != null) {
			return invocation.invoke();
		}
		
		//没有登录，野蛮设置为request属性
		actionContext.put("tip", "请先登录！");
		//返回登录
		return Action.LOGIN;
	}
}

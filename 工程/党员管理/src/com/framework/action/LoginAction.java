package com.framework.action;

import java.util.List;

import com.framework.po.MenuResult;
import com.framework.po.User;
import com.framework.service.LogService;
import com.framework.service.UserService;
import com.framework.utils.Constant;
import com.framework.utils.SystemUtil;
import com.xgdj.service.MessageService;

@SuppressWarnings("serial")
public class LoginAction extends AbstractAction {
	//实例
	private User user;
	
	/**
	 * 登录验证
	 */
	@Override
	public String execute() throws Exception {
		//验证输入
		if (user == null) {
			//登录信息不完整
			return ERROR;
		}
		
		// 登录验证，基本信息通过
		User user1 = UserService.getInstance().checkLogin(user);
		
		//用户其他信息验证
		boolean boo = UserService.getInstance().checkAuthor(user1);
		//判断
		if (user1 != null && boo) {//成功
			//查询菜单
			List<MenuResult> list = UserService.getInstance().getUserMenus(user1);
			//设置session
			session.setAttribute(Constant.MENU_RESULT, list);
			session.setAttribute(Constant.CURRENT_USER, user1);
			//登录日志
			LogService.getInstance().saveLog(user.getName(), "登录成功", SystemUtil.getIpAddress(request));
			
			//查询未读记录
			int count = MessageService.getInstance().unReadCount(user1.getId());
			//参数
			request.setAttribute("unread", count);
			
			return SUCCESS;
		} else {//失败
			//登录日志
			LogService.getInstance().saveLog(user.getName(), "登录失败", SystemUtil.getIpAddress(request));
			
			return ERROR;
		}
	}

	/**
	 * 退出登录
	 * 
	 * @return
	 * @throws Exception
	 */
	public String loginOut() throws Exception {
		this.removeSession();
		return LOGIN;
	}
	
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
}

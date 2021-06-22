package com.framework.action;

import java.util.List;

import com.framework.dao.impl.UserDAOImpl;
import com.framework.po.User;
import com.framework.service.OperateService;
import com.framework.service.UserService;
import com.framework.utils.Constant;
import com.framework.utils.Md5Util;
import com.framework.utils.PageResult;
import com.framework.utils.Result;
import com.google.gson.Gson;

/**
 * 
 * 描述：系统用户业务处理
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class UserAction extends AbstractAction {
	
	//当前页
	private int currentPage;
	// 开始时间
	private String start;
	// 结束时间
	private String end;
	//实例
	private User users;
	//key
	private String key;
	//状态
	private Byte state;

	@Override
	public String execute() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = UserService.getInstance().getListByPage(User.class, currentPage);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());

		return SUCCESS;
	}
	
	/**
	 * 条件查询
	 * @return
	 * @throws Exception
	 */
	public String search() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = UserService.getInstance().searchUser(currentPage, users, start, end);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());

		//查询参数
		request.setAttribute("start", start);
		request.setAttribute("end", end);
		request.setAttribute("users", users);
		
		return "search";
	}
	
	/**
	 * 新增检测用户账号
	 * @return
	 * @throws Exception
	 */
	public String checkName() throws Exception {
		//按用户账号name查询
		List<User> list = UserDAOImpl.getInstance().findByProperty(User.class, "name", request.getParameter("param"));
		// 返回结果
		Result result = new Result();
		//Gson
		Gson gson = new Gson();
		//判断
		if (list.isEmpty()) {
			//没有注册，可以使用
			result.setStatus("y");
			result.setInfo("验证通过");
		} else {
			//已注册，不能使用
			result.setStatus("");
			result.setInfo("用户名已经存在");
		}
		
		//返回
		outPrint(gson.toJson(result));
		return null;
	}
	
	/**
	 * 新增用户
	 * @return
	 * @throws Exception
	 */
	public String save() throws Exception {
		// 返回结果
		Result result = new Result();
		
		// gson
		Gson gson = new Gson();
		
		//密码加密
		users.setPass(Md5Util.encode(users.getPass()));
		// 保存
		int count = (Integer) UserDAOImpl.getInstance().save(users);
		
		//判断
		if (count > 0) {
			result.setSuccess(true);
			result.setMsg("操作成功");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "新增用户", "成功ID:"+count);
		} else {
			result.setSuccess(false);
			result.setMsg("操作失败");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "新增用户", "失败");
		}
		
		// 返回数据
		outPrint(gson.toJson(result));
		return null;
	}
	
	/**
	 * 修改用户状态
	 * @return
	 * @throws Exception
	 */
	public String updateState() throws Exception {
		// 返回结果
		Result result = new Result();
		
		// gson
		Gson gson = new Gson();
		
		//修改
		int count = UserService.getInstance().updateUserState(key, state);
		
		//判断
		if (count >= 0) {
			result.setSuccess(true);
			result.setMsg("操作成功");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "修改用户状态", "状态："+state+"，成功ID:"+key);
		} else {
			result.setSuccess(false);
			result.setMsg("操作失败");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "修改用户状态", "失败");
		}
		
		// 返回数据
		outPrint(gson.toJson(result));
		return null;
	}
	
	/**
	 * 删除用户
	 * @return
	 * @throws Exception
	 */
	public String deleteByIds() throws Exception {
		// 返回结果
		Result result = new Result();
		
		// gson
		Gson gson = new Gson();
		
		//修改
		int count = UserService.getInstance().deleteUserByIds(key);
		
		//判断
		if (count > 0) {
			result.setSuccess(true);
			result.setMsg("操作成功");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "删除用户", "成功ID:"+key);
		} else {
			result.setSuccess(false);
			result.setMsg("操作失败");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "删除用户", "失败ID:"+key);
		}
		
		// 返回数据
		outPrint(gson.toJson(result));
		return null;
	}
	
	/**
	 * 重置密码
	 * @return
	 * @throws Exception
	 */
	public String resetPass() throws Exception {
		// 返回结果
		Result result = new Result();
		
		// gson
		Gson gson = new Gson();
		
		//修改
		int count = UserService.getInstance().resetPass(key);
		
		//判断
		if (count >= 0) {
			result.setSuccess(true);
			result.setMsg("密码已重置为"+Constant.INIT_PASS);
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "重置用户密码", "成功ID:"+key);
		} else {
			result.setSuccess(false);
			result.setMsg("操作失败");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "重置用户密码", "失败ID:"+key);
		}
		
		// 返回数据
		outPrint(gson.toJson(result));
		return null;
	}
	
	/**
	 * 异步获取用户信息
	 * @return
	 * @throws Exception
	 */
	public String getUser() throws Exception {
		// gson
		Gson gson = new Gson();
		
		//查询
		User user = UserDAOImpl.getInstance().get(User.class, Integer.parseInt(key));
		
		// 返回数据
		outPrint(gson.toJson(user));
		return null;
	}
	
	/**
	 * 用户编辑
	 * @return
	 * @throws Exception
	 */
	public String editUser() throws Exception {
		// 返回结果
		Result result = new Result();
		
		// gson
		Gson gson = new Gson();
		
		//修改
		int count = UserService.getInstance().editUser(users);
		
		//判断
		if (count >= 0) {
			result.setSuccess(true);
			result.setMsg("操作成功");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "编辑用户", "成功ID:"+key);
		} else {
			result.setSuccess(false);
			result.setMsg("操作失败");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "编辑用户", "失败ID:"+key);
		}
		
		// 返回数据
		outPrint(gson.toJson(result));
		return null;
	}
	
	/**
	 * 用户修改密码
	 * @return
	 * @throws Exception
	 */
	public void updatePass() throws Exception {
		//结果
		Result result = new Result();
		//GSON
		Gson gson = new Gson();
		//参数
		users.setId(user.getId());
		//执行
		result = UserService.getInstance().updatePass(users, key, user.getPass());
		//操作日志
		OperateService.getInstance().saveOperateLog(user.getName(), "用户修改密码", result.getMsg()+"ID:"+user.getId());
		//返回
		outPrint(gson.toJson(result));
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public String getStart() {
		return start;
	}

	public void setStart(String start) {
		this.start = start;
	}

	public String getEnd() {
		return end;
	}

	public void setEnd(String end) {
		this.end = end;
	}

	public User getUsers() {
		return users;
	}

	public void setUsers(User users) {
		this.users = users;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public Byte getState() {
		return state;
	}

	public void setState(Byte state) {
		this.state = state;
	}
}

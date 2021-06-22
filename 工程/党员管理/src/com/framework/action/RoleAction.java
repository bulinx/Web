package com.framework.action;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.framework.dao.impl.RoleDAOImpl;
import com.framework.po.MenuResult;
import com.framework.po.Role;
import com.framework.po.RoleMenu;
import com.framework.po.User;
import com.framework.service.OperateService;
import com.framework.service.RoleService;
import com.framework.service.UserService;
import com.framework.utils.PageResult;
import com.framework.utils.Result;
import com.google.gson.Gson;

/**
 * 
 * 描述：角色权限业务逻辑
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class RoleAction extends AbstractAction {
	// 当前页
	private int currentPage;
	//实例
	private Role role;
	private User users;
	//选中菜单
	private String[] menus;
	//key
	private String key;
	//状态
	private Byte state;
	// 开始时间
	private String start;
	// 结束时间
	private String end;
	
	/**
	 * 分页查询所有角色
	 */
	@Override
	public String execute() throws Exception {
		// 查询
		PageResult pageResult = RoleService.getInstance().getListByPage(Role.class, currentPage);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());

		return SUCCESS;
	}
	
	/**
	 * 查询角色
	 * @return
	 * @throws Exception
	 */
	public String search() throws Exception {
		// 查询
		PageResult pageResult = RoleService.getInstance().search(key);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());
		
		//参数
		request.setAttribute("key", key);

		return SUCCESS;
	}
	
	/**
	 * 获得菜单数据
	 * @return
	 * @throws Exception
	 */
	public String getMenus() throws Exception {
		// 查询
		List<MenuResult> lists = RoleService.getInstance().makeMenuResult();

		// 页面数据
		request.setAttribute("lists", lists);
		request.setAttribute("flag", "1");
		
		return "getMenus";
	}
	
	/**
	 * 新增角色
	 * @return
	 * @throws Exception
	 */
	public String saveRole() throws Exception {
		// 返回结果
		Result result = new Result();
		
		// gson
		Gson gson = new Gson();
		
		int count = 0;
		
		//验证
		if (StringUtils.isBlank(role.getName())) {
			count = -1;
		} else {
			//保存
			RoleService.getInstance().saveRole(menus, role);
			count = 2;
		}
		
		
		//判断
		if (count > 0) {
			result.setSuccess(true);
			result.setMsg("操作成功");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "新增角色", "批量成功"+role.getName());
		} else {
			result.setSuccess(false);
			result.setMsg("操作失败");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "新增角色", "失败");
		}
		
		// 返回数据
		outPrint(gson.toJson(result));
		return null;
	}
	
	/**
	 * 修改角色状态
	 * @return
	 * @throws Exception
	 */
	public String updateState() throws Exception {
		// 返回结果
		Result result = new Result();
		
		// gson
		Gson gson = new Gson();
		
		//修改
		int count = RoleService.getInstance().updateRoleState(key, state);
		
		//判断
		if (count > 0) {
			result.setSuccess(true);
			result.setMsg("操作成功");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "修改角色状态", "状态："+state+"，成功:"+key);
		} else {
			result.setSuccess(false);
			result.setMsg("操作失败");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "修改角色状态", "失败");
		}
		
		// 返回数据
		outPrint(gson.toJson(result));
		return null;
	}
	
	/**
	 * 修改角色信息
	 * @return
	 * @throws Exception
	 */
	public String beforeEditRole() throws Exception {
		// 查询
		List<MenuResult> lists = RoleService.getInstance().makeMenuResult();

		// 页面数据
		request.setAttribute("lists", lists);
		request.setAttribute("flag", "1");
		
		//查询角色
		Role role = RoleDAOImpl.getInstance().get(Role.class, Integer.parseInt(key));
		//查询角色权限
		List<RoleMenu> roleMenus = RoleDAOImpl.getInstance().findByProperty(RoleMenu.class, "roleId", Integer.parseInt(key));
		
		//页面数据
		request.setAttribute("roles", role);
		request.setAttribute("roleMenus", roleMenus);
		
		return "beforeEditRole";
	}
	
	/**
	 * 修改角色
	 * @return
	 * @throws Exception
	 */
	public String editRole() throws Exception {
		// 返回结果
		Result result = new Result();
		
		// gson
		Gson gson = new Gson();
		
		int count = 0;
		
		//验证
		if (StringUtils.isBlank(role.getName())) {
			count = -1;
		}
		
		//执行修改
		count = RoleService.getInstance().editRole(role, menus);
		
		//判断
		if (count > 0) {
			result.setSuccess(true);
			result.setMsg("操作成功");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "修改角色", "修改成功"+role.getName());
		} else {
			result.setSuccess(false);
			result.setMsg("操作失败");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "修改角色", "失败");
		}
		
		// 返回数据
		outPrint(gson.toJson(result));
		return null;
	}
	
	/**
	 * 获得角色信息
	 * @return
	 * @throws Exception
	 */
	public String getRoles() throws Exception {
		// gson
		Gson gson = new Gson();
		
		Byte state = 0;
		//查询角色
		List<Role> list = RoleDAOImpl.getInstance().findByProperty(Role.class, "state", state);
		
		// 返回数据
		outPrint(gson.toJson(list));
		return null;
	}
	
	/**
	 * 删除角色
	 * @return
	 * @throws Exception
	 */
	public String deleteRole() throws Exception {
		// 返回结果
		Result result = new Result();
		
		// gson
		Gson gson = new Gson();
		
		//执行修改
		int count = RoleService.getInstance().deleteRole(key);
		
		//判断
		if (count >= 0) {
			result.setSuccess(true);
			result.setMsg("操作成功");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "删除角色", "成功ID:"+key);
		} else {
			if (count == -11) {
				result.setMsg("存在用户拥有该角色，不能删除");
			} else {
				result.setMsg("操作失败");
			}
			result.setSuccess(false);
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "删除角色", "失败ID:"+key);
		}
		
		// 返回数据
		outPrint(gson.toJson(result));
		return null;
	}
	
	/**
	 * 查询用户列表
	 * @return
	 * @throws Exception
	 */
	public String searchUser() throws Exception {
		//查询参数
		Role role = new Role();
		role.setId(Integer.parseInt(key));
		if (users == null) {
			users = new User();
		}
		users.setRole(role);
		// 查询提交申请名单
		PageResult pageResult = UserService.getInstance().searchUser(currentPage, users, start, end);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());

		//查询参数
		request.setAttribute("users", users);
		request.setAttribute("start", start);
		request.setAttribute("end", end);
		
		return "searchUser";
	}

	public int getCurrentPage() {
		return currentPage;
	}
	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	public void setMenus(String[] menus) {
		this.menus = menus;
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
	public User getUsers() {
		return users;
	}
	public void setUsers(User users) {
		this.users = users;
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
}

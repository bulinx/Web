package com.framework.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.dao.impl.UserDAOImpl;
import com.framework.po.Menu;
import com.framework.po.MenuResult;
import com.framework.po.RoleMenu;
import com.framework.po.User;
import com.framework.utils.Constant;
import com.framework.utils.Md5Util;
import com.framework.utils.Page;
import com.framework.utils.PageResult;
import com.framework.utils.PageUtil;
import com.framework.utils.Result;
import com.framework.utils.StringTools;

/**
 * 
 * 描述：用户业务处理
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class UserService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final UserService instance = new UserService();

	// 静态工厂方法
	public static UserService getInstance() {
		return instance;
	}
	
	/**
	 * 注册新用户
	 * @param name 账号
	 * @param pass 密码MD5加密
	 * @return boolean
	 */
	public boolean saveUser(String name, String pass) {
		//查询是否存在
		User user = UserDAOImpl.getInstance().findUniqueByProperty(User.class, "name", name);
		//判断
		if (user == null) {//可以注册
			//实例
			user = new User(name, Md5Util.encode(pass));
			//保存
			int count = (Integer) UserDAOImpl.getInstance().save(user);
			//判断
			if (count <= 0) {//失败
				//日志
				OperateService.getInstance().saveOperateLog(name, "注册用户", "插入数据失败");
				return false;
			} else {//成功
				//日志
				OperateService.getInstance().saveOperateLog(name, "注册用户", "插入数据成功:"+count);
				return true;
			}
		} else {
			//已存在，不能注册
			return false;
		}
	}
	
	/**
	 * 验证用户登录，用户名，密码
	 * @param user 登录用户
	 * @return User
	 */
	public User checkLogin(User user) {
		//查询
		User user1 = UserDAOImpl.getInstance().findUniqueByProperty(User.class, "name", user.getName());
		//判断
		if (user1 == null) {
			//用户不存在
			return null;
		} else {
			//验证密码
			if (user1.getPass().equals(Md5Util.encode(user.getPass()))){
				//密码正确
				return user1;
			}
		}
		return null;
	}
	
	/**
	 * 用户权限及其他项目义验证
	 * @param user 验证通过用户
	 * @return boolean
	 */
	public boolean checkAuthor(User user) {
		//用户状态必须为启用
		if (user != null && user.getState() == 0) {
			//用户停用
			return true;
		}
		return false;
	}
	
	/**
	 * 获得用户菜单
	 * @param user 用户
	 * @return  List<MenuResult>
	 */
	public List<MenuResult> getUserMenus(User user) {
		//结果
		List<MenuResult> list = new ArrayList<MenuResult>();
		//查询用户菜单
		List<RoleMenu> list1 = UserDAOImpl.getInstance().findByProperty(RoleMenu.class, "roleId", user.getRole().getId());
		//查询菜单
		List<Menu> list2 = getAllUserMenu(list1);
		//获取父级菜单
		List<Menu> parent = RoleService.getInstance().getParentMenu(list2);
		//处理子菜单
		for (Menu menu2 : parent) {
			MenuResult result = new MenuResult();
			result.setMenu(menu2);
			result.setSubMenus(RoleService.getInstance().getSubMen(menu2, list2));
			list.add(result);
		}
		//排序
		Collections.sort(list);
		//返回结果
		return list;
	}
	
	/**
	 * 获得用户
	 * @param list1
	 * @return
	 */
	public List<Menu> getAllUserMenu(List<RoleMenu> list1) {
		//结果
		List<Menu> menus = new ArrayList<Menu>();
		//全部菜单
		List<Menu> all = SystemService.getInstance().getAllMenu();
		//处理，获得子菜单
		for (int i = 0; i < list1.size(); i++) {
			for (int j = 0; j < all.size(); ++j) {
				if (list1.get(i).getMenuId() == all.get(j).getId()) {
					menus.add(all.get(j));
				}
			}
		}
		//获得父级菜单
		List<Integer> parentId = getParentMenuIds(menus);
		for (int i = 0; i < parentId.size(); i++) {
			for (int j = 0; j < all.size(); ++j) {
				if (parentId.get(i) == all.get(j).getId()) {
					menus.add(all.get(j));
				}
			}
		}
		return menus;
	}
	
	/**
	 * 获得菜单ID
	 * @param list1 数据
	 * @return List<Integer>
	 */
	public List<Integer> getParentMenuIds(List<Menu> menus) {
		//结果,父级菜单
		Integer[] ids = new Integer[menus.size()];
		//处理
		for (int i = 0; i < menus.size(); ++i) {
			ids[i] = menus.get(i).getCodes();
		}
		//去除重复的父级菜单
		List<Integer> list = new ArrayList<Integer>();    
	    for (int i = 0; i < ids.length; i++) {    
	        if(!list.contains(ids[i])) {    
	            list.add(ids[i]);    
	        }    
	    }    
		//返回
		return list;
	}
	
	/**
	 * 条件查询所有记录
	 * @param currentPage 当前页
	 * @param user 实例
	 * @param start 开始时间
	 * @param end 结束时间
	 * @return PageResult
	 */
	public PageResult searchUser(int currentPage, User user, String start, String end) {
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(Constant.EVERY_PAGE);
		// 设置当前页
		page.setCurrentPage(currentPage);
		
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), UserDAOImpl.getInstance().findUserCount(user, start, end), page
				.getCurrentPage());

		// 查询
		List<User> lists = UserDAOImpl.getInstance().findUserByPage(page, user, start, end);

		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, lists);

		return result;
	}
	
	/**
	 * 修改用户状态
	 * @param ids 主键ID，逗号分开
	 * @param state 状态0-启用，1-停用
	 * @return Integer更新记录
	 */
	public Integer updateUserState(String ids, Byte state) {
		//拆分ID
		String[] sIds = StringUtils.split(ids, ",");
		//转换
		Integer[] iIds = StringTools.stringsToIntegers(sIds);
		//修改
		int count = (Integer) UserDAOImpl.getInstance().updatePropertyById(User.class, "state", state, iIds);
		//返回
		return count;
	}
	
	/**
	 * 批量删除用户
	 * @param ids 主键ID，逗号分开
	 * @return  Integer
	 */
	public int deleteUserByIds(String ids) {
		//拆分ID
		String[] sIds = StringUtils.split(ids, ",");
		//转换
		Integer[] iIds = StringTools.stringsToIntegers(sIds);
		//删除
		int count = (Integer) UserDAOImpl.getInstance().deleteById(User.class, iIds);
		//返回
		return count;
	}
	
	/**
	 * 重置密码
	 * @param id 主键ID
	 * @return int
	 */
	public int resetPass(String id) {
		//查询用户
		User user = UserDAOImpl.getInstance().get(User.class, Integer.parseInt(id));
		//修改密码,初始
		user.setPass(Md5Util.encode(Constant.INIT_PASS));
		//备份标志
		user.setFlag((byte) 1);
		//执行修改
		return (Integer) UserDAOImpl.getInstance().update(user);
	}
	
	/**
	 * 编辑用户
	 * @param user 实例
	 * @return int
	 */
	public int editUser(User user) {
		//查询
		User user2 = UserDAOImpl.getInstance().get(User.class, user.getId());
		//修改权限
		user2.setRole(user.getRole());
		//备份标志
		user2.setFlag((byte) 1);
		//执行
		return (Integer) UserDAOImpl.getInstance().update(user2);
	}
	
	/**
	 * 用户修改密码
	 * @param user 旧密码
	 * @param newPass 新密码
	 * @return Result
	 */
	public Result updatePass(User user, String newPass, String oldPass) {
		//结果
		Result result = new Result();
		//验证原密码是否符合
		if (oldPass.equals(Md5Util.encode(user.getPass()))) {
			//原密码符合，修改
			User user1 = CommonDAOImpl.getInstance().get(User.class, user.getId());
			//密码
			user1.setPass(Md5Util.encode(newPass));
			//执行修改
			int count = (Integer) CommonDAOImpl.getInstance().update(user1);
			//修改结果
			if (count >= 0) {
				//成功
				result.setSuccess(true);
				result.setMsg("密码修改成功下次登录生效");
			} else {
				result.setSuccess(false);
				result.setMsg("密码修改失败");
			}
		} else {
			//原密码错误
			result.setSuccess(false);
			result.setMsg("您输入的旧密码错误");
		}
		//返回
		return result;
	}
}

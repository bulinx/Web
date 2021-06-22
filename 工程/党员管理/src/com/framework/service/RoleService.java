package com.framework.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.framework.dao.impl.RoleDAOImpl;
import com.framework.po.Menu;
import com.framework.po.MenuResult;
import com.framework.po.Role;
import com.framework.po.RoleMenu;
import com.framework.po.User;
import com.framework.utils.Page;
import com.framework.utils.PageResult;
import com.framework.utils.PageUtil;
import com.framework.utils.StringTools;

/**
 * 
 * 描述：角色权限业务处理
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class RoleService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final RoleService instance = new RoleService();

	// 静态工厂方法
	public static RoleService getInstance() {
		return instance;
	}
	
	/**
	 * 获得构造的菜单数据
	 * @return List<MenuResult>
	 */
	public List<MenuResult> makeMenuResult() {
		//结果
		List<MenuResult> list = new ArrayList<MenuResult>();
		//查询全部菜单
		List<Menu> list1 = SystemService.getInstance().getAllMenu();
		//获取父级菜单
		List<Menu> parent = getParentMenu(list1);
		//处理子菜单
		for (Menu menu2 : parent) {
			MenuResult result = new MenuResult();
			result.setMenu(menu2);
			result.setSubMenus(getSubMen(menu2, list1));
			list.add(result);
		}
		//返回结果
		return list;
	}
	
	/**
	 * 获取父级菜单的子菜单
	 * @param menu 父级菜单
	 * @param list 菜单数据
	 * @return 子菜单
	 */
	public List<Menu> getSubMen(Menu menu, List<Menu> list) {
		List<Menu> menus = new ArrayList<Menu>();
		//处理
		for (Menu menu2 : list) {
			if (menu2.getState() == 0 && menu2.getCodes() == menu.getId()) {
				menus.add(menu2);
			}
		}
		//排序
		Collections.sort(menus);
		//返回结果
		return menus;
	}
	
	/**
	 * 获取父级菜单
	 * @param list 菜单数据
	 * @return 父级菜单
	 */
	public List<Menu> getParentMenu(List<Menu> list) {
		List<Menu> menus = new ArrayList<Menu>();
		//处理数据
		for (Menu menu : list) {
			if (menu.getState() == 0 && menu.getCodes() == 0) {
				//父级菜单
				menus.add(menu);
			}
		}
		//排序
		Collections.sort(menus);
		//返回
		return menus;
	}
	
	/**
	 * 新增角色
	 * @param menus 角色拥有菜单
	 * @param role 新角色
	 */
	public void saveRole(String[] menus, Role role) {
		//新增角色
		Integer id = (Integer) RoleDAOImpl.getInstance().save(role);
		//拥有菜单
		List<RoleMenu> list = new ArrayList<RoleMenu>();
		//处理拥有菜单
		for (String string : menus) {
			RoleMenu roleMenu = new RoleMenu(id, Integer.parseInt(string));
			list.add(roleMenu);
		}
		//批量保存、
		RoleDAOImpl.getInstance().batchSave(list);
	}
	
	/**
	 * 批量修改角色状态
	 * @param ids ID
	 * @param state 状态(默认0)：0-启用，1-停用
	 * @return Integer
	 */
	public Integer updateRoleState(String ids, Byte state) {
		//拆分ID
		String[] sIds = StringUtils.split(ids, ",");
		//转换
		Integer[] iIds = StringTools.stringsToIntegers(sIds);
		//修改
		int count = (Integer) RoleDAOImpl.getInstance().updatePropertyById(Role.class, "state", state, iIds);
		//返回
		return count;
	}
	
	/**
	 * 修改角色信息
	 * @param role 角色
	 * @param menus 权限
	 * @return int
	 */
	public int editRole(Role role, String[] menus) {
		//备份标志
		role.setFlag((byte) 1);
		//修改角色信息
		int count = (Integer) RoleDAOImpl.getInstance().merge(role);
		//判断
		if (count >= 0) {
			//删除旧权限，查询
			List<RoleMenu> list = RoleDAOImpl.getInstance().findByProperty(RoleMenu.class, "roleId", role.getId());
			//删除
			RoleDAOImpl.getInstance().deleteAllEntitie(list);
			//保存修改权限
			editRole(menus, role);
		} else {
			count = -1;
		}
		return count;
	}
	
	/**
	 * 修改角色
	 * @param menus 角色拥有菜单
	 * @param role 新角色
	 */
	public void editRole(String[] menus, Role role) {
		//拥有菜单
		List<RoleMenu> list = new ArrayList<RoleMenu>();
		//处理拥有菜单
		for (String string : menus) {
			RoleMenu roleMenu = new RoleMenu(role.getId(), Integer.parseInt(string));
			list.add(roleMenu);
		}
		//批量保存
		RoleDAOImpl.getInstance().batchSave(list);
	}
	
	/**
	 * 删除角色
	 * @param id 主键ID，逗号分开
	 * @return int
	 */
	public int deleteRole(String id) {
		//拆分ID
		String[] sIds = StringUtils.split(id, ",");
		//转换
		Integer[] iIds = StringTools.stringsToIntegers(sIds);
		//检测是否用户拥有该权限
		boolean boo = checkRole(id);
		//判断
		if (boo) {
			//执行删除
			return (Integer) RoleDAOImpl.getInstance().deleteById(Role.class, iIds);
		} else {
			//有用户不能删除
			return -11;
		}
	}
	
	/**
	 * 检测角色，检测是否用户拥有该权限
	 * @param ids 主键ID，逗号分开
	 * @return boolean
	 */
	private boolean checkRole(String ids) {
		//拆分ID
		String[] sIds = StringUtils.split(ids, ",");
		//转换
		Integer[] iIds = StringTools.stringsToIntegers(sIds);
		//循环检测
		for (Integer integer : iIds) {
			//查询,检测是否用户拥有该权限
			List<User> list1 = RoleDAOImpl.getInstance().findByProperty(User.class, "role.id", integer);
			//判断
			if (!list1.isEmpty()) {
				return false;
			}
		}
		return true;
	}
	
	/**
	 * 条件查询角色
	 * @param name 角色名称
	 * @return PageResult
	 */
	public PageResult search(String name) {
		//查询数据
		List<Role> list = RoleDAOImpl.getInstance().findRoleWithLike(name);
		
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(list.size());
		// 设置当前页
		page.setCurrentPage(1);
		
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), list.size(), page.getCurrentPage());
		
		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, list);

		return result;
	}
}

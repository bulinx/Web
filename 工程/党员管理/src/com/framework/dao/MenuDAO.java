package com.framework.dao;

import java.util.List;

import com.framework.po.Menu;
import com.framework.po.RoleMenu;
import com.framework.utils.Page;

/**
 * 
 * 描述：菜单管理数据接口
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public interface MenuDAO {
	/**
	 * 条件查询菜单
	 * @param page 页面
	 * @param name 名称
	 * @return List<Menu>
	 */
	public List<Menu> findMenuByPage(Page page, String name);
	/**
	 * 条件查询记录数
	 * @param name 名称
	 * @return Integer
	 */
	public Integer findMenuCount(String name);
	/**
	 * 按ID查询菜单
	 * @param ids 逗号分开ID
	 * @return List<Menu>
	 */
	public List<Menu> findMenuInIds(Integer[] ids);
	/**
	 * 查询所有二级菜单
	 * @return List<Menu>
	 */
	public List<Menu> getAllSubMenu();
	/**
	 * 按角色查询拥有菜单ID
	 * @param roleId 角色ID
	 * @return List<RoleMenu>
	 */
	public List<RoleMenu> findRoleMenuByRole(Integer roleId);
}

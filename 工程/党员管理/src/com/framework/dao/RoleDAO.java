package com.framework.dao;

import java.util.List;

import com.framework.po.Role;

/**
 * 
 * 描述：角色权限数据接口
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public interface RoleDAO {
	/**
	 * 按菜单主键修改状态
	 * @param ids 菜单主键
	 * @param state 状态(默认0)：0-启用，1-停用
	 * @return Integer
	 */
	public Integer updateRoleMenuByMenu(Integer[] ids, Byte state);
	/**
	 * 模糊查询角色
	 * @param name 角色名称
	 * @return  List<Role>
	 */
	public List<Role> findRoleWithLike(String name);
}

package com.framework.dao;

import java.util.List;

import com.framework.po.Button;
import com.framework.po.RoleButton;


/**
 * @Description: 按钮数据接口
 * @ClassName:  ButtonDAO.java
 * @author 谭长华
 * @date 2016年10月28日 
 *
 */
public interface ButtonDAO {
	/**
	 * 按角色二级菜单查询按钮
	 * @param roleId 角色ID
	 * @param menuId 二级菜单ID
	 * @return List<RoleButton>
	 */
	public List<RoleButton> findRoleButtonByRoleAndMenu(Integer roleId, Integer menuId);
	/**
	 * 条件查询按钮
	 * @param subId 二级菜单ID
	 * @return List<Button>
	 */
	public List<Button> findButtonForSearch(Integer subId, String name);
}

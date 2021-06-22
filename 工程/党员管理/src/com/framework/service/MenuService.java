package com.framework.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.dao.impl.MenuDAOImpl;
import com.framework.dao.impl.RoleDAOImpl;
import com.framework.po.Menu;
import com.framework.po.RoleMenu;
import com.framework.po.Ztree;
import com.framework.utils.Constant;
import com.framework.utils.Page;
import com.framework.utils.PageResult;
import com.framework.utils.PageUtil;
import com.framework.utils.StringTools;

/**
 * 
 * 描述：菜单管理业务处理
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class MenuService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final MenuService instance = new MenuService();

	// 静态工厂方法
	public static MenuService getInstance() {
		return instance;
	}
	
	/**
	 * 获得菜单管理树节点
	 * @return List<Menu>
	 */
	public List<Ztree> getZtree() {
		//结果
		List<Ztree> list = new ArrayList<Ztree>();
		//查询
		List<Menu> list1 = SystemService.getInstance().getAllMenu();
		//处理子节点
		if (!list1.isEmpty()) {
			for (int i = 0; i < list1.size(); ++i) {
				//实例
				Ztree ztree = new Ztree(list1.get(i).getId(), list1.get(i).getCodes(), false, list1.get(i).getUrl(), false,list1.get(i).getName());
				//查询子节点
				if (list1.get(i).getCodes() == 0) {
					//设置图标
					ztree.setIconSkin(list1.get(i).getIcon());
					//查询
					List<Menu> list2 = getSubZtree(list1.get(i).getId());
					//子节点
					if (list2.isEmpty()) {
						ztree.setIsParent(true);
					} else {
						ztree.setIsParent(false);
					}
				} else {
					//设置图标
					ztree.setIconSkin("sub");
					ztree.setIsParent(false);
				}
				
				list.add(ztree);
			}
		}
		//返回
		return list;
	}
	
	/**
	 * 查询所有一级菜单
	 * @return List<Menu>
	 */
	public List<Menu> getParentMenu() {
		//结果
		List<Menu> list = new ArrayList<Menu>();
		//查询
		list = MenuDAOImpl.getInstance().findByProperty(Menu.class, "codes", 0);
		//返回
		return list;
	}
	
	/**
	 * 查询父级菜单子节点
	 * @param id 主键ID
	 * @return List<Menu> 
	 */
	private List<Menu> getSubZtree(Integer id) {
		//结果
		List<Menu> list = new ArrayList<Menu>();
		//查询
		list = MenuDAOImpl.getInstance().findByProperty(Menu.class, "codes", id);
		//返回
		return list;
	}
	
	/**
	 * 修改菜单状态
	 * @param ids 主键ID，逗号分开
	 * @param state 状态0-启用，1-停用
	 * @return Integer更新记录
	 */
	public Integer updateMenuState(String ids, Byte state) {
		//拆分ID
		String[] sIds = StringUtils.split(ids, ",");
		//转换
		Integer[] iIds = StringTools.stringsToIntegers(sIds);
		//修改
		int count = (Integer) MenuDAOImpl.getInstance().updatePropertyById(Menu.class, "state", state, iIds);
		//修改对应角色菜单状态，查询菜单权限
		if (count >= 0) {
			count = RoleDAOImpl.getInstance().updateRoleMenuByMenu(iIds, state);
		}
		
		//返回
		return count;
	}
	
	/**
	 * 删除菜单
	 * @param ids 主键ID，逗号分开
	 * @return  Integer
	 */
	public Integer deleteMenuById(String ids) {
		//拆分ID
		String[] sIds = StringUtils.split(ids, ",");
		//转换
		Integer[] iIds = StringTools.stringsToIntegers(sIds);
		//检测子节点
		if (!checkSubMenu(iIds)) {
			//有子节点，不能删除
			return -10;
		}
		//检测是否可以删除，没有角色拥有该菜单权限
		List<RoleMenu> list = MenuDAOImpl.getInstance().findPropertyInValues(RoleMenu.class, "menuId", iIds);
		if (!list.isEmpty()) {
			//存在角色拥有权限不可删除
			return -11;
		}
		
		//删除
		int count = (Integer) MenuDAOImpl.getInstance().deleteById(Menu.class, iIds);
		//返回
		return count;
	}
	
	/**
	 * 检测是否可以删除，没有子节点
	 * @param ids 主键ID
	 * @return boolean
	 */
	private boolean checkSubMenu(Integer[] ids) {
		List<Menu> list1 = MenuDAOImpl.getInstance().findByInId(Menu.class, ids);
		//检测
		for (Menu menu : list1) {
			if (menu.getCodes() == 0) {//父级菜单
				List<Menu> list2 = getSubZtree(menu.getId());
				if (!list2.isEmpty()) {
					//有子节点不能删除
					return false;
				}
			}
		}
		return true;
	}
	
	/**
	 * 点击Ztree获得数据
	 * @param id 主键ID
	 * @return PageResult
	 */
	public PageResult getClickZtree(Integer id) {
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(Constant.EVERY_PAGE);
		// 设置当前页
		page.setCurrentPage(1);
		
		//查询
		List<Menu> list = MenuDAOImpl.getInstance().findByProperty(Menu.class, "codes", id);
		//查询自己
		Menu menu = CommonDAOImpl.getInstance().get(Menu.class, id);
		//合并
		list.add(menu);
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), list.size(), page.getCurrentPage());
		
		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, list);

		return result;
	}
	
	/**
	 * 条件查询所有记录
	 * @param currentPage 当前页
	 * @param name 名称
	 * @return PageResult
	 */
	public PageResult searchMenu(int currentPage, String name) {
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(Constant.EVERY_PAGE);
		// 设置当前页
		page.setCurrentPage(currentPage);
		
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), MenuDAOImpl.getInstance().findMenuCount(name), page
				.getCurrentPage());

		// 查询
		List<Menu> lists = MenuDAOImpl.getInstance().findMenuByPage(page, name);

		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, lists);

		return result;
	}
}

package com.framework.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.framework.dao.impl.ButtonDAOImpl;
import com.framework.dao.impl.CommonDAOImpl;
import com.framework.dao.impl.MenuDAOImpl;
import com.framework.po.Button;
import com.framework.po.ButtonResult;
import com.framework.po.Menu;
import com.framework.po.RoleButton;
import com.framework.po.RoleMenu;
import com.framework.po.SubMenu;
import com.framework.po.User;
import com.framework.utils.Page;
import com.framework.utils.PageResult;
import com.framework.utils.PageUtil;
import com.framework.utils.Result;
import com.framework.utils.StringTools;
import com.google.gson.Gson;


/**
 * @Description: 按钮业务处理
 * @ClassName:  ButtonService.java
 * @author 谭长华
 * @date 2016年10月28日 
 *
 */
public class ButtonService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final ButtonService instance = new ButtonService();

	// 静态工厂方法
	public static ButtonService getInstance() {
		return instance;
	}
	
	/**
	 * 新增按钮
	 * @param button 实例
	 * @return Result
	 */
	public Result saveButton(Button button) {
		//结果
		Result result = new Result();
		//处理菜单
		String[] sub = button.getSubName().split("-");
		//subid
		button.setSubId(Integer.parseInt(sub[0]));
		//name
		button.setSubName(sub[1]);
		//保存
		int count = (Integer) CommonDAOImpl.getInstance().save(button);
		//判断
		if (count > 0) {
			result.setSuccess(true);
			result.setMsg("按钮新增成功ID:"+count);
		} else {
			result.setSuccess(false);
			result.setMsg("按钮新增失败");
		}
		//返回
		return result;
	}
	
	/**
	 * 修改按钮
	 * @param button 实例
	 * @return Result
	 */
	public Result updateButton(Button button) {
		// 返回结果
		Result result = new Result();
		//查询
		Button button2 = CommonDAOImpl.getInstance().get(Button.class, button.getId());
		//名称
		button2.setName(button.getName());
		//描述
		button2.setContent(button.getContent());
		//执行修改
		int count = (Integer) CommonDAOImpl.getInstance().update(button2);
		//判断
		if (count >= 0) {
			result.setSuccess(true);
			result.setMsg("按钮修改成功");
		} else {
			result.setSuccess(false);
			result.setMsg("按钮修改失败");
		}
		//返回
		return result;
	}
	
	/**
	 * 修改状态
	 * @param ids 主键ID，逗号分开
	 * @param state 状态0-启用，1-停用
	 * @return Result
	 */
	public Result updateState(String ids, Byte state) {
		// 返回结果
		Result result = new Result();
		//拆分ID
		String[] sIds = StringUtils.split(ids, ",");
		//转换
		Integer[] iIds = StringTools.stringsToIntegers(sIds);
		//修改
		int count = (Integer) CommonDAOImpl.getInstance().updatePropertyById(Button.class, "state", state, iIds);
		//判断
		if (count >= 0) {
			result.setSuccess(true);
			result.setMsg("按钮状态修改成功");
		} else {
			result.setSuccess(false);
			result.setMsg("按钮状态修改失败");
		}
		//返回
		return result;
	}
	
	/**
	 * 按钮权限数据
	 * @param roleId 角色ID
	 * @return List<ButtonResult>
	 */
	public List<ButtonResult> getRoleButton(Integer roleId) {
		//结果
		List<ButtonResult> results = new ArrayList<ButtonResult>();
		//查询所有一级菜单
		//List<Menu> parentMenu = MenuService.getInstance().getParentMenu();
		//查询角色拥有的菜单
		List<RoleMenu> roleMenus = MenuDAOImpl.getInstance().findRoleMenuByRole(roleId);
		//查询角色拥有菜单
		List<Menu> parentMenu = findRoleParentMenu(roleMenus);
		//循环处理
		for (Menu menu : parentMenu) {
			//实例
			ButtonResult buttonResult = new ButtonResult();
			buttonResult.setMenu(menu);
			//二级菜单
			buttonResult.setList(getSubMenu(menu.getId(), roleId));
			//add
			if (!buttonResult.getList().isEmpty()) {
				results.add(buttonResult);
			}
		}
		//返回
		return results;
	}
	
	/**
	 * 获得角色拥有的一级菜单
	 * @param roleMenus 角色拥有的菜单
	 * @return List<Menu>
	 */
	public List<Menu> findRoleParentMenu(List<RoleMenu> roleMenus) {
		//获得菜单ID，二级菜单
		Integer[] subMenuId = new Integer[roleMenus.size()];
		//处理
		for (int i = 0; i < roleMenus.size(); i++) {
			subMenuId[i] = roleMenus.get(i).getMenuId();
		}
		//查询菜单
		List<Menu> list = MenuDAOImpl.getInstance().findMenuInIds(subMenuId);
		//获得一级菜单Id
		Integer[] parentId = new Integer[list.size()];
		//数据处理
		for (int i = 0; i < parentId.length; i++) {
			parentId[i] = list.get(i).getCodes();
		}
		//获得去重后的一级菜单
		Integer[] onlyParent = StringTools.listToIntegers(StringTools.getUniqurArray(parentId));
		//查询角色拥有一级菜单
		List<Menu> list2 = MenuDAOImpl.getInstance().findMenuInIds(onlyParent);
		//检测停用
		for (Menu menu : list2) {
			if (menu.getState() == 1) {
				list2.remove(menu);
			}
		}
		//返回
		return list2;
	}
	
	/**
	 * 获得二级菜单及按钮
	 * @param parentMenuId 一级菜单ID
	 * @return List<SubMenu>
	 */
	public List<SubMenu> getSubMenu(Integer parentMenuId, Integer roleId) {
		//结果
		List<SubMenu> list = new ArrayList<SubMenu>();
		//查询二级菜单
		List<Menu> subMenu = CommonDAOImpl.getInstance().findByProperty(Menu.class, "codes", parentMenuId);
		//循环处理
		for (Menu menu : subMenu) {
			//实例
			SubMenu subMenu2 = new SubMenu();
			subMenu2.setSubMenu(menu);
			//查询按钮
			List<Button> buttons = getButtonForSubMenu(menu.getId(), roleId);
			subMenu2.setButtons(buttons);
			//add
			if (!buttons.isEmpty()) {
				list.add(subMenu2);
			}
		}
		//返回结果
		return list;
	}
	
	/**
	 * 查询二级菜单的按钮
	 * @param subMenuId 菜单ID
	 * @return List<Button>
	 */
	public List<Button> getButtonForSubMenu(Integer subMenuId, Integer roleId) {
		//菜单所有按钮
		List<Button> list = CommonDAOImpl.getInstance().findByProperty(Button.class, "subId", subMenuId);
		//用户拥有按钮权限
		List<RoleButton> list2 = CommonDAOImpl.getInstance().findByProperty(RoleButton.class, "roleId", roleId);
		//处理数据
		for (int i = 0; i < list.size(); ++i) {
			if (checkRole(list2, list.get(i).getId())) {
				//用户拥有权限
				list.get(i).setTemp(1);
			}
		}
		//返回数据
		return list;
	}
	
	/**
	 * 检测用户是否拥有权限
	 * @param list 所有按钮
	 * @param value 检测按钮ID
	 * @return boolean
	 */
	private boolean checkRole(List<RoleButton> list, Integer value) {
		for (RoleButton button : list) {
			if (button.getButtonId() == value) {
				//用户拥有权限
				return true;
			}
		}
		//用户没有权限
		return false;
	}
	
	/**
	 * 分配按钮权限
	 * @param roleId 角色ID
	 * @param buttonId 按钮ID
	 * @return  Result
	 */
	public Result updateButtonRole(Integer roleId, String[] buttonId) {
		// 返回结果
		Result result = new Result();
		//查询当前角色拥有按钮按钮
		List<RoleButton> roleButtons = CommonDAOImpl.getInstance().findByProperty(RoleButton.class, "roleId", roleId);
		//判断
		if (buttonId == null) {
			CommonDAOImpl.getInstance().deleteAllEntitie(roleButtons);
			result.setSuccess(true);
			result.setMsg("清除所有权限");
			return result;
		}
		
		//构造权限
		List<RoleButton> list = new ArrayList<RoleButton>();
		//处理数据
		for (String bid : buttonId) {
			//拆分
			String[] bs = bid.split("-");
			//没有该按钮权限，实例
			RoleButton roleButton = new RoleButton();
			//参数
			roleButton.setButtonId(Integer.parseInt(bs[0]));
			roleButton.setSubMenuId(Integer.parseInt(bs[1]));
			roleButton.setRoleId(roleId);
			//add
			list.add(roleButton);
		}
		//新增按钮权限
		if (!list.isEmpty()) {
			CommonDAOImpl.getInstance().batchSave(list);
		}
		//移除之前拥有按钮权限
		if (!roleButtons.isEmpty()) {
			CommonDAOImpl.getInstance().deleteAllEntitie(roleButtons);
		}
		//信息
		result.setSuccess(true);
		result.setMsg("角色按钮权限分配成功");
		//返回
		return result;
	}
	
	/**
	 * 检测需要移除按钮权限
	 * @param has 新的
	 * @param old 旧的
	 * @return boolean
	 */
	public boolean checkRemoveRole(String[] has, Integer old) {
		for (String s : has) {
			//拆分
			String[] arr = s.split("-");
			if (old == Integer.parseInt(arr[0])) {
				//不移除按钮权限
				return true;
			}
		}
		//移除
		return false;
	}
	
	/**
	 * 参数转换
	 * @param list 数据
	 * @return Integer[] 
	 */
	private Integer[] listToArray(List<Integer> list) {
		//实例
		Integer[] integers = new Integer[list.size()];
		for (int i = 0; i < list.size(); ++i) {
			integers[i] = list.get(i);
		}
		return integers;
	}
	
	/**
	 * 删除按钮
	 * @param ids ID逗号分开
	 * @return Result
	 */
	public Result deleteButton(String ids) {
		// 返回结果
		Result result = new Result();
		//拆分ID
		String[] sIds = ids.split(",");
		//转换ID
		Integer[] iIds = StringTools.stringsToIntegers(sIds);
		//删除id
		List<Integer> delId = new ArrayList<Integer>();
		//检测是否可以删除
		for (Integer integer : iIds) {
			//查询按钮
			List<RoleButton> list = CommonDAOImpl.getInstance().findByProperty(RoleButton.class, "buttonId", integer);
			//判断
			if (list.isEmpty()) {
				//可以删除
				delId.add(integer);
			}
		}
		//删除
		CommonDAOImpl.getInstance().deleteById(Button.class, listToArray(delId));
		//结果
		result.setSuccess(true);
		if (delId.size() == iIds.length) {
			//全部删除
			result.setMsg("删除"+delId.size()+"个按钮");
		} else if (delId.size() == 0) {
			//全部不能删除
			result.setSuccess(false);
			result.setMsg("所有按钮存在用户拥有权限，不能删除");
			return result;
		} else {
			int count = iIds.length-delId.size();
			//部分删除
			result.setMsg("删除"+delId.size()+"个按钮，"+count+"个不能删除，存在用户拥有权限");
		}
		return result;
	}
	
	/**
	 * 当前用户指定页面的按钮权限
	 * @param user 登录用户
	 * @param menuId 二级菜单ID
	 * @return String
	 */
	public String getPageBtn(User user, Integer menuId) {
		//Gson
		Gson gson = new Gson();
		//查询角色按钮权限
		List<RoleButton> list = ButtonDAOImpl.getInstance().findRoleButtonByRoleAndMenu(user.getRole().getId(), menuId);
		//获得button ID
		Integer[] btnId = new Integer[list.size()];
		for (int i = 0; i < list.size(); ++i) {
			btnId[i] = list.get(i).getButtonId();
		}
		//获得页面按钮权限
		if (btnId.length <= 0) {
			//没有按钮权限
			String[] pageBtn = {"1"};
			//返回json
			return gson.toJson(pageBtn);
		} else {
			//查询按钮
			List<Button> list2 = CommonDAOImpl.getInstance().findByInId(Button.class, btnId);
			String[] pageBtn = new String[list2.size()];
			for (int i = 0; i < list2.size(); i++) {
				if (list2.get(i).getState() == 0) {
					pageBtn[i] = list2.get(i).getIdentity();
				}
			}
			//返回json
			return gson.toJson(pageBtn);
		}
	}
	
	/**
	 * 条件查询按钮
	 * @param name 按钮名称
	 * @param subId 二级菜单ID
	 * @return PageResult
	 */
	public PageResult search(Integer subId,String name) {
		//查询数据
		List<Button> list = ButtonDAOImpl.getInstance().findButtonForSearch(subId, name);
		
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

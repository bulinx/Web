 package com.framework.action;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.framework.dao.impl.MenuDAOImpl;
import com.framework.po.Menu;
import com.framework.po.Ztree;
import com.framework.service.MenuService;
import com.framework.service.OperateService;
import com.framework.utils.PageResult;
import com.framework.utils.Result;
import com.google.gson.Gson;

/**
 * 
 * 描述：菜单管理业务逻辑
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("serial")
public class MenuAction extends AbstractAction {
	//实例
	private Menu menu;
	//当前页
	private int currentPage;
	//key
	private String key;
	//状态
	private Byte state;

	/**
	 * 查询ztree
	 */
	@Override
	public String execute() throws Exception {
		// gson
		Gson gson = new Gson();
		
		//查询
		List<Ztree> list = MenuService.getInstance().getZtree();
		
		// 返回数据
		request.setAttribute("list", gson.toJson(list));
		return SUCCESS;
	}
	
	/**
	 * 查询所有菜单
	 * @return
	 * @throws Exception
	 */
	public String menuList() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = MenuService.getInstance().getListByPage(Menu.class, currentPage);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());
		return "menuList";
	}
	
	
	/**
	 * 查询父级菜单
	 * @return
	 * @throws Exception
	 */
	public String parentMenu() throws Exception {	
		// gson
		Gson gson = new Gson();
		
		//查询
		List<Menu> list = MenuDAOImpl.getInstance().findByProperty(Menu.class, "codes", 0);
		
		// 返回数据
		outPrint(gson.toJson(list));
		return null;
	}
	
	/**
	 * 查询子菜单
	 * @return
	 * @throws Exception
	 */
	public String subMenu() throws Exception {	
		// gson
		Gson gson = new Gson();
		
		//查询
		List<Menu> list = MenuDAOImpl.getInstance().getAllSubMenu();
		
		// 返回数据
		outPrint(gson.toJson(list));
		return null;
	}
	
	/**
	 * 新增菜单
	 * @return
	 * @throws Exception
	 */
	public String save() throws Exception {
		// 返回结果
		Result result = new Result();
		
		// gson
		Gson gson = new Gson();
		
		int count = 0;
		//判断为空
		if (StringUtils.isBlank(menu.getName())) {
			//为空
			result.setSuccess(false);
			result.setMsg("信息填写不完整");
			// 返回数据
			outPrint(gson.toJson(result));
			return null;
		} else {
			// 保存
			count = (Integer) MenuDAOImpl.getInstance().save(menu);
		}
		
		//判断
		if (count > 0) {
			result.setSuccess(true);
			result.setMsg("操作成功");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "新增菜单", "成功ID:"+count);
		} else {
			result.setSuccess(false);
			result.setMsg("操作失败");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "新增菜单", "失败");
		}
		
		// 返回数据
		outPrint(gson.toJson(result));
		return null;
	}
	
	/**
	 * 修改菜单状态
	 * @return
	 * @throws Exception
	 */
	public String updateState() throws Exception {
		// 返回结果
		Result result = new Result();
		
		// gson
		Gson gson = new Gson();
		
		//修改
		int count = MenuService.getInstance().updateMenuState(key, state);
		
		//判断
		if (count >= 0) {
			result.setSuccess(true);
			result.setMsg("操作成功");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "修改菜单状态", "状态："+state+"，成功:"+key);
		} else {
			result.setSuccess(false);
			result.setMsg("操作失败");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "修改菜单状态", "失败");
		}
		
		// 返回数据
		outPrint(gson.toJson(result));
		return null;
	}
	
	/**
	 * 删除菜单
	 * @return
	 * @throws Exception
	 */
	public String deleteById() throws Exception {
		// 返回结果
		Result result = new Result();
		
		// gson
		Gson gson = new Gson();
		
		//修改
		int count = MenuService.getInstance().deleteMenuById(key);
		
		//判断
		if (count > 0) {
			result.setSuccess(true);
			result.setMsg("操作成功");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "删除菜单", "成功:"+key);
		} else {
			result.setSuccess(false);
			if (count == -10) {
				result.setMsg("存在父节点拥有子节点，不能删除");
			} else if (count == -11) { 
				result.setMsg("存在用户拥有权限，不能删除");
			} else {
				result.setMsg("操作失败");
			}
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "删除菜单", "失败");
		}
		
		// 返回数据
		outPrint(gson.toJson(result));
		return null;
	}
	
	/**
	 * 点击ztree
	 * @return
	 * @throws Exception
	 */
	public String clickZtree() throws Exception {
		// 查询
		PageResult pageResult = MenuService.getInstance().getClickZtree(Integer.parseInt(key));

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());
		return "clickZtree";
	}
	
	/**
	 * 查询菜单
	 * @return
	 * @throws Exception
	 */
	public String getMenuById() throws Exception {
		// gson
		Gson gson = new Gson();
		
		//查询
		Menu menu = MenuDAOImpl.getInstance().get(Menu.class, Integer.parseInt(key));
		
		// 返回数据
		outPrint(gson.toJson(menu));
		return null;
	}
	
	/**
	 * 修改菜单
	 * @return
	 * @throws Exception
	 */
	public String update() throws Exception {
		// 返回结果
		Result result = new Result();
		
		// gson
		Gson gson = new Gson();
		
		//备份标志
		menu.setFlag((byte) 1);
		//修改
		int count = (Integer) MenuDAOImpl.getInstance().merge(menu);
		
		//判断
		if (count > 0) {
			result.setSuccess(true);
			result.setMsg("操作成功");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "修改菜单", "成功:"+menu.getId());
		} else {
			result.setSuccess(false);
			result.setMsg("操作失败");
			//操作日志
			OperateService.getInstance().saveOperateLog(user.getName(), "修改菜单", "失败"+menu.getId());
		}
		
		// 返回数据
		outPrint(gson.toJson(result));
		return null;
	}
	
	/**
	 * 条件查询
	 * @return
	 * @throws Exception
	 */
	public String search() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = MenuService.getInstance().searchMenu(currentPage, key);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());

		//查询参数
		request.setAttribute("key", key);
		
		return "search";
	}

	public Menu getMenu() {
		return menu;
	}

	public void setMenu(Menu menu) {
		this.menu = menu;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
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

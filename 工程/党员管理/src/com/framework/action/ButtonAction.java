package com.framework.action;

import java.util.List;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.po.Button;
import com.framework.po.ButtonResult;
import com.framework.po.Role;
import com.framework.service.ButtonService;
import com.framework.service.OperateService;
import com.framework.utils.PageResult;
import com.framework.utils.Result;
import com.google.gson.Gson;


/**
 * @Description: 
 * @ClassName:  ButtonAction.java
 * @author 谭长华
 * @date 2016年10月28日 
 *
 */
@SuppressWarnings("serial")
public class ButtonAction extends AbstractAction {
	
	//实例
	private Button button;
	//当前页
	private int currentPage;
	//key
	private String key;
	//state
	private Byte state;
	//页面参数
	private String[] btns;
	//subId
	private Integer subId;
	
	/**
	 * 查询所有按钮
	 */
	@Override
	public String execute() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = ButtonService.getInstance().getListByPage(Button.class, currentPage);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());
		return SUCCESS;
	}
	
	/**
	 * 查询按钮
	 * @return
	 * @throws Exception
	 */
	public String search() throws Exception {
		// 查询
		PageResult pageResult = ButtonService.getInstance().search(subId, key);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());
		
		//参数
		request.setAttribute("key", key);
		request.setAttribute("subId", subId);

		return SUCCESS;
	}

	/**
	 * 新增菜单
	 * @throws Exception
	 */
	public void saveButton() throws Exception {
		// 返回结果
		Result result = new Result();
		// gson
		Gson gson = new Gson();
		//保存
		result = ButtonService.getInstance().saveButton(button);
		//操作日志
		OperateService.getInstance().saveOperateLog(user.getName(), "新增按钮", result.getMsg());
		//返回
		outPrint(gson.toJson(result));
	}
	
	/**
	 * 查询按钮
	 * @throws Exception
	 */
	public void getButtons() throws Exception {
		// gson
		Gson gson = new Gson();
		//查询
		Button button = CommonDAOImpl.getInstance().get(Button.class, Integer.parseInt(key));
		//返回
		outPrint(gson.toJson(button));		
	}
	
	/**
	 * 修改按钮
	 * @throws Exception
	 */
	public void updateButton() throws Exception {
		// 返回结果
		Result result = new Result();
		// gson
		Gson gson = new Gson();
		//保存
		result = ButtonService.getInstance().updateButton(button);
		//操作日志
		OperateService.getInstance().saveOperateLog(user.getName(), "按钮修改", result.getMsg()+"ID:"+button.getId());
		//返回
		outPrint(gson.toJson(result));
	}
	
	/**
	 * 修改按钮状态
	 * @throws Exception
	 */
	public void updateState() throws Exception {
		// 返回结果
		Result result = new Result();
		// gson
		Gson gson = new Gson();
		//保存
		result = ButtonService.getInstance().updateState(key, state);
		//操作日志
		OperateService.getInstance().saveOperateLog(user.getName(), "按钮状态修改", result.getMsg()+"ID:"+key+",State:"+state);
		//返回
		outPrint(gson.toJson(result));
	}
	
	/**
	 * 获得角色按钮权限
	 * @return
	 * @throws Exception
	 */
	public String editButtonRole() throws Exception {
		//获得按钮数据
		List<ButtonResult> list = ButtonService.getInstance().getRoleButton(Integer.parseInt(key));
		//角色
		Role role = CommonDAOImpl.getInstance().get(Role.class, Integer.parseInt(key));
		//返回数据
		request.setAttribute("lists", list);
		request.setAttribute("flag", 1);
		request.setAttribute("role", role);
		return "editButtonRole";
	}
	
	/**
	 * 修改角色按钮权限
	 * @throws Exception
	 */
	public void updateButtonRole() throws Exception {
		// 返回结果
		Result result = new Result();
		// gson
		Gson gson = new Gson();
		//保存
		result = ButtonService.getInstance().updateButtonRole(Integer.parseInt(key), btns);
		//操作日志
		OperateService.getInstance().saveOperateLog(user.getName(), "分配角色按钮权限", result.getMsg()+"ID:"+key);
		//返回
		outPrint(gson.toJson(result));
	}
	
	/**
	 * 删除按钮
	 * @throws Exception
	 */
	public void deleteButton() throws Exception {
		// 返回结果
		Result result = new Result();
		// gson
		Gson gson = new Gson();
		//保存
		result = ButtonService.getInstance().deleteButton(key);
		//操作日志
		OperateService.getInstance().saveOperateLog(user.getName(), "删除按钮", result.getMsg()+"ID:"+key);
		//返回
		outPrint(gson.toJson(result));
	}
	
	/**
	 * 获得角色页面按钮权限
	 * @throws Exception
	 */
	public void getPageBtn() throws Exception {
		//返回
		outPrint(ButtonService.getInstance().getPageBtn(user, Integer.parseInt(key)));
	}

	public Button getButton() {
		return button;
	}

	public void setButton(Button button) {
		this.button = button;
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

	public String[] getBtns() {
		return btns;
	}

	public void setBtns(String[] btns) {
		this.btns = btns;
	}

	public Integer getSubId() {
		return subId;
	}

	public void setSubId(Integer subId) {
		this.subId = subId;
	}	
}

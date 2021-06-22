package com.xgdj.action;

import com.framework.action.AbstractAction;
import com.framework.dao.impl.CommonDAOImpl;
import com.framework.service.OperateService;
import com.framework.utils.PageResult;
import com.framework.utils.Result;
import com.xgdj.po.Foundation;
import com.xgdj.po.PartyData;
import com.xgdj.service.PositiveService;

/**
 * 积极分子
 * @author 谭长华
 * @ClassName PositiveAction.java
 * @date 2017年3月25日
 *
 */
@SuppressWarnings("serial")
public class PositiveAction extends AbstractAction {
	
	//KEY
	private String key;
	//实例
	private PartyData data;
	//state
	private Integer state;

	/**
	 * 验证积极分子申请
	 */
	public void checkPositive() throws Exception {
		//验证
		Result result = PositiveService.getInstance().checkPositive(user.getName());
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "验证积极分子申请", result.getMsg());
		//返回结果
		outPrint(result);
	}
	
	/**
	 * 按学号查询入党信息，填写积极分子申请
	 * @return String
	 * @throws Exception
	 */
	public String findByNum() throws Exception {
		//视图
		String view = "findByNum";
		//处理
		try {
			//查询基础信息
			Foundation foundation = CommonDAOImpl.getInstance().findUniqueByProperty(Foundation.class, "number", user.getName());
			//查询入党信息
			PartyData partyData = CommonDAOImpl.getInstance().findUniqueByProperty(PartyData.class, "number", user.getName());
			//籍贯
			partyData.setRegion(foundation.getNation());
			//数据
			request.setAttribute("obj", partyData);
			//视图
			view = "findByNum";
		} catch (Exception e) {
			view = "ERROR";
		}
		return view;
	}
	
	/**
	 * 提交积极分子申请
	 * @return String
	 * @throws Exception
	 */
	public String update() throws Exception {
		//执行
		Result result = PositiveService.getInstance().update(data);
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "提交积极分子申请", result.getMsg());
		//判断
		if (result.isSuccess()) {
			return "update";
		} else {
			return ERROR;
		}
	}
	
	/**
	 * 查询积极分子申请
	 * @return String
	 * @throws Exception
	 */
	public String searchPositive() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = PositiveService.getInstance().searchPositive();

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());

		return "searchPositive";
	}
	
	/**
	 * 修改积极分子申请状态
	 */
	public void updatePositive() throws Exception {
		//执行
		Result result = PositiveService.getInstance().updatePositive(state, key);
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "修改积极分子申请状态", result.getMsg()+state);
		//返回结果
		outPrint(result);
	}
	
	/**
	 * 按ID查询
	 */
	public void findById() throws Exception {
		//查询
		PartyData data = CommonDAOImpl.getInstance().get(PartyData.class, Integer.parseInt(key));
		//返回结果
		outPrint(data);
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public PartyData getData() {
		return data;
	}

	public void setData(PartyData data) {
		this.data = data;
	}

	public Integer getState() {
		return state;
	}

	public void setState(Integer state) {
		this.state = state;
	}
}

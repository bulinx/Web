package com.xgdj.action;

import com.framework.action.AbstractAction;
import com.framework.dao.impl.CommonDAOImpl;
import com.framework.service.OperateService;
import com.framework.utils.PageResult;
import com.framework.utils.Result;
import com.xgdj.po.PartyData;
import com.xgdj.service.DevelopService;

/**
 * 拟发展
 * @author 谭长华
 * @ClassName DevelopAction.java
 * @date 2017年3月31日
 *
 */
@SuppressWarnings("serial")
public class DevelopAction extends AbstractAction {
	//KEY
	private String key;
	//state
	private Integer state;
	//实例
	private PartyData data;
	
	/**
	 * 验证拟发展申请
	 */
	public void check() throws Exception {
		//验证
		Result result = DevelopService.getInstance().check(user.getName());
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "验证拟发展申请", result.getMsg());
		//返回结果
		outPrint(result);
	}
	
	/**
	 * 按学号查询入党信息，填写拟发展申请
	 * @return String
	 * @throws Exception
	 */
	public String findByNum() throws Exception {
		//视图
		String view = "findByNum";
		//处理
		try {
			//查询入党信息
			PartyData partyData = CommonDAOImpl.getInstance().findUniqueByProperty(PartyData.class, "number", user.getName());
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
	 * 提交拟发展申请
	 * @return String
	 * @throws Exception
	 */
	public String update() throws Exception {
		//执行
		Result result = DevelopService.getInstance().update(data);
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "提交拟发展申请", result.getMsg());
		//判断
		if (result.isSuccess()) {
			return "update";
		} else {
			return ERROR;
		}
	}
	
	/**
	 * 查询拟发展申请
	 * @return String
	 * @throws Exception
	 */
	public String searchDevelop() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = DevelopService.getInstance().searchDevelop();

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());

		return "searchDevelop";
	}

	/**
	 * 修改拟发展申请状态
	 */
	public void updateDevelop() throws Exception {
		//执行
		Result result = DevelopService.getInstance().updateDevelop(state, key);
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "修改拟发展申请状态", result.getMsg()+state);
		//返回结果
		outPrint(result);
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

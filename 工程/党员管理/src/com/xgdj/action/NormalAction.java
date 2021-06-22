package com.xgdj.action;

import com.framework.action.AbstractAction;
import com.framework.dao.impl.CommonDAOImpl;
import com.framework.service.OperateService;
import com.framework.utils.PageResult;
import com.framework.utils.Result;
import com.xgdj.po.PartyData;
import com.xgdj.service.NormalService;

/**
 * 转正申请
 * @author 谭长华
 * @ClassName NormalAction.java
 * @date 2017年4月8日
 *
 */
@SuppressWarnings("serial")
public class NormalAction extends AbstractAction {
	//KEY
	private String key;
	//state
	private Integer state;
	//实例
	private PartyData data;
	
	/**
	 * 验证转正申请
	 */
	public void check() throws Exception {
		//验证
		Result result = NormalService.getInstance().check(user.getName());
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "验证转正申请", result.getMsg());
		//返回结果
		outPrint(result);
	}
	
	/**
	 * 按学号查询入党信息，填写转正申请
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
	 * 提交转正申请
	 * @return String
	 * @throws Exception
	 */
	public String update() throws Exception {
		//执行
		Result result = NormalService.getInstance().update(data);
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "提交转正申请", result.getMsg());
		//判断
		if (result.isSuccess()) {
			return "update";
		} else {
			return ERROR;
		}
	}
	
	/**
	 * 查询转正申请
	 * @return String
	 * @throws Exception
	 */
	public String searchNormal() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = NormalService.getInstance().searchNormal();

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());

		return "searchNormal";
	}
	
	/**
	 * 修改转正申请状态
	 */
	public void updateNormal() throws Exception {
		//执行
		Result result = NormalService.getInstance().updateNormal(state, key);
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "修改转正申请状态", result.getMsg()+state);
		//返回结果
		outPrint(result);
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public Integer getState() {
		return state;
	}

	public void setState(Integer state) {
		this.state = state;
	}

	public PartyData getData() {
		return data;
	}

	public void setData(PartyData data) {
		this.data = data;
	}
}

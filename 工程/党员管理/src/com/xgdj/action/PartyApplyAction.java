package com.xgdj.action;

import java.util.List;

import com.framework.action.AbstractAction;
import com.framework.dao.impl.CommonDAOImpl;
import com.framework.service.OperateService;
import com.framework.utils.PageResult;
import com.framework.utils.Result;
import com.xgdj.po.Foundation;
import com.xgdj.po.PartyData;
import com.xgdj.po.Process;
import com.xgdj.po.UserState;
import com.xgdj.service.PartyApplyService;
import com.xgdj.utils.MsgUtil;

/**
 * 申请入党
 * @author 谭长华
 * @ClassName PartyApplyAction
 * @date 2017年3月18日
 *
 */
@SuppressWarnings("serial")
public class PartyApplyAction extends AbstractAction {
	//KEY
	private String key;
	//实例
	private PartyData data;
	//state
	private Integer state;

	/**
	 * 我的入党状态
	 */
	@Override
	public String execute() throws Exception {
		//视图
		String view = SUCCESS;
		//处理
		try {
			//查询用户状态
			UserState userState = CommonDAOImpl.getInstance().findUniqueByProperty(UserState.class, "numbers", user.getName());
			//入党流程参数
			List<Process> processes = CommonDAOImpl.getInstance().loadAll(Process.class);
			//页面数据
			request.setAttribute("state", userState);
			request.setAttribute("processes", processes);
		} catch (Exception e) {
			view = ERROR;
		}
		//返回
		return view;
	}
	
	/**
	 * 验证入党申请
	 */
	public void checkApply() throws Exception {
		//验证
		Result result = PartyApplyService.getInstance().checkApply(user.getName());
		//返回结果
		outPrint(result);
	}
	
	/**
	 * 按学号查询入党信息
	 * @return String
	 * @throws Exception
	 */
	public String findByNum() throws Exception {
		//视图
		String view = "findByNum";
		//处理
		try {
			//查询
			Foundation foundation = CommonDAOImpl.getInstance().findUniqueByProperty(Foundation.class, "number", key);
			//数据
			request.setAttribute("obj", foundation);
			//视图
			view = "findByNum";
		} catch (Exception e) {
			view = "ERROR";
		}
		return view;
	}
	
	/**
	 * 入党申请数据保存
	 * @return String
	 * @throws Exception
	 */
	public String save() throws Exception {
		//保存
		Result result = PartyApplyService.getInstance().save(data);
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "入党申请", result.getMsg()+user.getName());
		//判断
		if (result.isSuccess()) {
			//发送消息
			MsgUtil.sendApply(user.getId());
			//成功
			return "save";
		} else {
			//失败
			return ERROR;
		}
	}
	
	/**
	 * 查询入党申请
	 * @return String
	 * @throws Exception
	 */
	public String searchApply() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = PartyApplyService.getInstance().searchApply();

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());

		return "searchApply";
	}
	
	/**
	 * 修改入党申请状态,通过入党申请
	 */
	public void updateApply() throws Exception {
		//执行
		Result result = PartyApplyService.getInstance().updateApply(state, key);
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "通过入党申请状态", result.getMsg()+state);
		//返回结果
		outPrint(result);
	}
	
	/**
	 * 驳回入党申请
	 */
	public void deleteApply() throws Exception {
		//执行
		Result result = PartyApplyService.getInstance().deleteApply(key);
		//日志
				OperateService.getInstance().saveOperateLog(user.getName(), "驳回入党申请状态", result.getMsg()+state);
		//返回结果
		outPrint(result);
	}
	
	/**
	 * 查询所有支部学习数据
	 * @return String
	 * @throws Exception
	 */
	public String viewAll() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = PartyApplyService.getInstance().searchByPage(currentPage, data);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());
		
		//参数
		request.setAttribute("obj", data);

		return "viewAll";
	}
	
	/**
	 * 查询入党信息
	 * @return String
	 * @throws Exception
	 */
	public String findParty() throws Exception {
		//查询
		PartyData partyData = CommonDAOImpl.getInstance().findUniqueByProperty(PartyData.class, "number", user.getName());
		//参数
		request.setAttribute("obj", partyData);
		//视图
		return "findParty";
	}
	
	/**
	 * 入党申请数据修改，临时，过渡阶段，以后禁止使用该功能
	 * @return String
	 * @throws Exception
	 */
	public String update() throws Exception {
		//保存
		Result result = PartyApplyService.getInstance().update(data);
		//日志
		OperateService.getInstance().saveOperateLog(user.getName(), "入党申请修改", result.getMsg()+user.getName());
		//判断
		if (result.isSuccess()) {
			//成功
			return "save";
		} else {
			//失败
			return ERROR;
		}
	}
	
	/**
	 * 查询入党信息
	 * @return String
	 * @throws Exception
	 */
	public String findPartyData() throws Exception {
		//查询
		PartyData partyData = CommonDAOImpl.getInstance().findUniqueByProperty(PartyData.class, "number", user.getName());
		//参数
		request.setAttribute("obj", partyData);
		//视图
		return "findPartyData";
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

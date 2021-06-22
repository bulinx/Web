package com.xgdj.service;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.service.CommonService;
import com.xgdj.po.UserState;

/**
 * 用户状态
 * @author 谭长华
 * @ClassName UserStateService.java
 * @date 2017年3月26日
 *
 */
public class UserStateService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final UserStateService instance = new UserStateService();

	// 静态工厂方法
	public static UserStateService getInstance() {
		return instance;
	}
	
	/**
	 * 入党申请(0-未通过，1-通过)
	 * @param number 学号
	 * @param state 状态
	 */
	public void updateApply(String number, Integer state) {
		//查询入党状态
		UserState userState = CommonDAOImpl.getInstance().findUniqueByProperty(UserState.class, "numbers", number);
		//修改状态
		userState.setApply(state);
		//执行
		CommonDAOImpl.getInstance().update(userState);
	}
	
	/**
	 * 积极分子申请(0-未通过，1-提交审核，2-通过)
	 * @param number 学号
	 * @param state 状态
	 */
	public void updatePositive(String number, Integer state) {
		//查询入党状态
		UserState userState = CommonDAOImpl.getInstance().findUniqueByProperty(UserState.class, "numbers", number);
		//修改状态
		userState.setPositive(state);
		//执行
		CommonDAOImpl.getInstance().update(userState);
	}
	
	/**
	 * 拟发展申请(0-未通过，1-提交审核，2-通过)
	 * @param number 学号
	 * @param state 状态
	 */
	public void updateDevelop(String number, Integer state) {
		//查询入党状态
		UserState userState = CommonDAOImpl.getInstance().findUniqueByProperty(UserState.class, "numbers", number);
		//修改状态
		userState.setDevelop(state);
		//执行
		CommonDAOImpl.getInstance().update(userState);
	}
	
	/**
	 * 发展申请(0-未通过，1-提交审核，2-通过)
	 * @param number 学号
	 * @param state 状态
	 */
	public void updatePrepare(String number, Integer state) {
		//查询入党状态
		UserState userState = CommonDAOImpl.getInstance().findUniqueByProperty(UserState.class, "numbers", number);
		//修改状态
		userState.setPrepare(state);
		//执行
		CommonDAOImpl.getInstance().update(userState);
	}
	
	/**
	 * 转正申请(0-未通过，1-提交审核，2-通过)
	 * @param number 学号
	 * @param state 状态
	 */
	public void updateNormal(String number, Integer state) {
		//查询入党状态
		UserState userState = CommonDAOImpl.getInstance().findUniqueByProperty(UserState.class, "numbers", number);
		//修改状态
		userState.setNormal(state);
		//执行
		CommonDAOImpl.getInstance().update(userState);
	}
}

package com.xgdj.utils;

/**
 * 使用的全局常量
 * @author 谭长华
 * @ClassName Constant
 * @date 2017年3月18日
 *
 */
public class Constant {
	/**
	 * 普通用户角色
	 */
	public static final Integer COMMOM_ROLE = 10;
	
	/**
	 * 入党申请状态，通过
	 */
	public static final Integer APPLY_OK = 1;
	
	/**
	 * 入党申请状态，未通过
	 */
	public static final Integer APPLY_NO = 0;
	
	/**
	 * 积极分子申请状态，未通过
	 */
	public static final Integer POSITIVE_NO = 0;
	
	/**
	 * 积极分子申请状态，审核
	 */
	public static final Integer POSITIVE_DO = 1;
	
	/**
	 * 积极分子申请状态，通过
	 */
	public static final Integer POSITIVE_OK = 2;
	
	/**
	 * 拟发展申请状态，未通过
	 */
	public static final Integer DEVELOP_NO = 0;
	
	/**
	 * 拟发展申请状态，审核
	 */
	public static final Integer DEVELOP_DO = 1;
	
	/**
	 * 拟发展申请状态，通过
	 */
	public static final Integer DEVELOP_OK = 2;
	
	/**
	 * 发展申请状态，未通过
	 */
	public static final Integer PREP_NO = 0;
	
	/**
	 * 发展申请状态，审核
	 */
	public static final Integer PREP_DO = 1;
	
	/**
	 * 发展申请状态，通过
	 */
	public static final Integer PREP_OK = 2;
	
	/**
	 * 转正申请状态，未通过
	 */
	public static final Integer NORMAL_NO = 0;
	
	/**
	 * 转正申请状态，审核
	 */
	public static final Integer NORMAL_DO = 1;
	
	/**
	 * 转正申请状态，通过
	 */
	public static final Integer NORMAL_OK = 2;
	
	/**
	 * 入党申请提交3个月后可提交积极分子申请
	 * @return int
	 */
	public static int getApplyTerm() {
		//入党申请已满3个月
		return 3;
	}
	
	/**
	 * 成为积极分子12个月后可提交拟发展申请
	 * @return int
	 */
	public static int getDevelopTerm() {
		return 12;
	}
	
	/**
	 *预备期满12个月后可提交转正申请
	 * @return int
	 */
	public static int getnormalTerm() {
		return 12;
	}
}

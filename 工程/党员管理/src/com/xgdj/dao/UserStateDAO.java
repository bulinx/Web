package com.xgdj.dao;


/**
 * 用户状态
 * @author 谭长华
 * @ClassName UserStateDAO
 * @date 2017年3月18日
 *
 */
public interface UserStateDAO {
	/**
	 * 按学号修改状态
	 * @param propertyName 修改的字段
	 * @param value 修改值
	 * @param nums 学号数组
	 * @return int
	 */
	public int updatePropertyByNumber(String propertyName, Integer value, String[] nums);
}

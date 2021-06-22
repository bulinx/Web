package com.framework.dao;

import java.util.List;

import com.framework.po.User;
import com.framework.utils.Page;

/**
 * 
 * 描述：用户基本信息数据接口
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public interface UserDAO {
	/**
	 * 条件查询用户
	 * @param page 页面
	 * @param user 实例
	 * @param start 开始时间
	 * @param end 结束时间
	 * @return List<User>
	 */
	public List<User> findUserByPage(Page page, User user, String start, String end);
	/**
	 * 条件查询记录数
	 * @param user 实例
	 * @param start 开始时间
	 * @param end 结束时间
	 * @return Integer
	 */
	public Integer findUserCount(User user, String start, String end);
	
	/**
	 * 按用户账号查询
	 * @param names 账号
	 * @return List<User>
	 */
	public List<User> findInName(String[] names);
}

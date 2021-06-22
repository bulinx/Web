package com.framework.dao;

import java.util.List;

import com.framework.po.Log;
import com.framework.po.Views;
import com.framework.utils.Page;

/**
 * 
 * 描述：登录日志数据接口
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public interface LogDAO {
	/**
	 * 条件查询登录日志
	 * @param page 页面
	 * @param log 登录日志实例
	 * @param start 开始时间
	 * @param end 结束时间
	 * @return List<Log>
	 */
	public List<Log> findLogByPage(Page page, Log log, String start, String end);
	/**
	 * 条件查询登录日志记录数
	 * @param log 登录日志实例
	 * @param start 开始时间
	 * @param end 结束时间
	 * @return Integer
	 */
	public Integer findLogCount(Log log, String start, String end);
	/**
	 * 条件查询访问记录
	 * @param page 页面
	 * @param views 访问实例
	 * @param start 开始时间
	 * @param end 结束时间
	 * @return List<Views>
	 */
	public List<Views> findViewsByPage(Page page, Views views, String start, String end);
	/**
	 * 条件查询访问记录数
	 * @param views 实例
	 * @param start 开始时间
	 * @param end 结束时间
	 * @return Integer
	 */
	public Integer findViewsCount(Views views, String start, String end);
}

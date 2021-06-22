package com.framework.dao;

import java.util.List;

import com.framework.po.OperateLog;
import com.framework.utils.Page;

/**
 * 
 * 描述：操作日志数据接口
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public interface OperateDAO {
	/**
	 * 条件查询操作日志
	 * @param page 页面
	 * @param log 志实例
	 * @param start 开始时间
	 * @param end 结束时间
	 * @return List<OperateLog>
	 */
	public List<OperateLog> findOperateLogByPage(Page page, OperateLog log, String start, String end);
	/**
	 * 条件查询记录数
	 * @param log 实例
	 * @param start 开始时间
	 * @param end 结束时间
	 * @return Integer
	 */
	public Integer findOperateLogCount(OperateLog log, String start, String end);
}

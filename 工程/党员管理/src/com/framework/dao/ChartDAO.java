package com.framework.dao;

import java.util.List;

import com.framework.po.echart.ChartData;

/**
 * 
 * 描述：EChart数据接口
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public interface ChartDAO {
	/**
	 * 查询访问记录
	 * @param dates 日期 2011-11-11
	 * @param format 格式 %Y-%m-%d
	 * @return List<ChartData>
	 */
	public List<ChartData> findView(String dates, String format);
	/**
	 * 查询最近一周访问记录
	 * @return List<ChartData>
	 */
	public List<ChartData> findView();
	/**
	 * 查登录记录
	 * @param dates 日期 2011-11-11
	 * @param format 格式 %Y-%m-%d
	 * @return List<ChartData>
	 */
	public List<ChartData> findLog(String dates, String format);
	/**
	 * 查询最近一周登录记录
	 * @return List<ChartData>
	 */
	public List<ChartData> findLog();
}

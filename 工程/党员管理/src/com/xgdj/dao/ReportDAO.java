package com.xgdj.dao;

import java.util.List;

import com.framework.utils.Page;
import com.xgdj.po.Report;

/**
 * 思想汇报
 * @author 谭长华
 * @ClassName ReportDAO.java
 * @date 2017年4月11日
 *
 */
public interface ReportDAO {
	/**
	 * 条件查询数据
	 * @param page 页面
	 * @param obj 参数
	 * @return List<Report>
	 */
	public List<Report> findByPage(Page page, Report obj);
	
	/**
	 * 条件查询记录数
	 * @param obj 参数
	 * @return Integer
	 */
	public Integer findCount(Report obj);
	
	/**
	 * 按学号删除
	 * @param number 学号
	 * @return Integer
	 */
	public Integer deleteByNumber(String number);
}

package com.xgdj.dao;

import java.util.List;

import com.framework.utils.Page;
import com.xgdj.po.Foundation;

/**
 * 基础数据
 * @author 谭长华
 * @ClassName FoundationDAO
 * @date 2017年3月18日
 *
 */
public interface FoundationDAO {
	/**
	 * 条件查询数据
	 * @param page 页面
	 * @param obj 参数
	 * @return List<Foundation>
	 */
	public List<Foundation> findByPage(Page page, Foundation obj);
	
	/**
	 * 条件查询记录数
	 * @param obj 参数
	 * @return Integer
	 */
	public Integer findCount(Foundation obj);
	
	/**
	 * 按学号查询，逗号分开
	 * @param arr 学号
	 * @return List<Foundation>
	 */
	public List<Foundation> findInNumber(String[] arr);
}

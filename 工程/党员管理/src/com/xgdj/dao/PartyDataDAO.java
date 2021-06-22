package com.xgdj.dao;

import java.util.List;

import com.framework.utils.Page;
import com.xgdj.po.PartyData;

/**
 * 入党数据
 * @author 谭长华
 * @ClassName PartyApplyDAO
 * @date 2017年3月18日
 *
 */
public interface PartyDataDAO {
	/**
	 * 按学号查询，逗号分开
	 * @param arr 学号
	 * @return List<Foundation>
	 */
	public List<PartyData> findInNumber(String[] arr);
	/**
	 * 条件查询数据
	 * @param page 页面
	 * @param obj 参数
	 * @return List<PartyData>
	 */
	public List<PartyData> findByPage(Page page, PartyData obj);
	
	/**
	 * 条件查询记录数
	 * @param obj 参数
	 * @return Integer
	 */
	public Integer findCount(PartyData obj);
}

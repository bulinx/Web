package com.xgdj.dao;

import java.util.List;

import com.framework.utils.Page;
import com.xgdj.po.MsgRelation;

/**
 * 站内信
 * @author 谭长华
 * @ClassName MessageDAO
 * @date 2017年3月18日
 *
 */
public interface MessageDAO {
	/**
	 * 条件查询数据
	 * @param page 页面
	 * @param obj 参数
	 * @return List<MsgRelation>
	 */
	public List<MsgRelation> findByPage(Page page, MsgRelation obj);
	
	/**
	 * 条件查询记录数
	 * @param obj 参数
	 * @return Integer
	 */
	public Integer findCount(MsgRelation obj);
}

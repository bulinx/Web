package com.framework.dao;

import java.util.List;

import com.framework.po.Dictionary;
import com.framework.po.DictionaryText;
import com.framework.utils.Page;


/**
 * @Description: 字典数据接口
 * @ClassName:  DictionaryDAO.java
 * @author 谭长华
 * @date 2016年11月2日 
 *
 */
public interface DictionaryDAO {
	/**
	 * 条件查询字典值
	 * @param page 页面
	 * @param text 参数
	 * @return List<DictionaryText>
	 */
	public List<DictionaryText> findTextByPage(Page page, DictionaryText text);
	/**
	 * 条件查询记录数
	 * @param text 参数
	 * @return Integer
	 */
	public Integer findTextCount(DictionaryText text);
	/**
	 * 条件查询字典值
	 * @param page 页面
	 * @param dicId 参数
	 * @return List<DictionaryText>
	 */
	public List<DictionaryText> findTextByPage(Page page, Integer dicId);
	/**
	 * 条件查询记录数
	 * @param dicId 参数
	 * @return Integer
	 */
	public Integer findTextCount(Integer dicId);
	/**
	 * 条件查询字典
	 * @param page 页面
	 * @param dictionary 参数
	 * @return List<Dictionary>
	 */
	public List<Dictionary> findDictionaryByPage(Page page, Dictionary dictionary);
	/**
	 * 条件查询记录数
	 * @param dictionary 参数
	 * @return Integer
	 */
	public Integer findDictionaryCount(Dictionary dictionary);
	/**
	 * 按字典查询字典值
	 * @param dicId 字典ID
	 * @param state 状态
	 * @return List<DictionaryText>
	 */
	public List<DictionaryText> findAllDictionaryText(Integer dicId, Byte state);
}

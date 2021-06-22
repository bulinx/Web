package com.framework.service;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.dao.impl.DictionaryDAOImpl;
import com.framework.po.Dictionary;
import com.framework.po.DictionaryText;
import com.framework.utils.Constant;
import com.framework.utils.Page;
import com.framework.utils.PageResult;
import com.framework.utils.PageUtil;
import com.framework.utils.Result;
import com.framework.utils.StringTools;


/**
 * @Description: 字典值业务处理
 * @ClassName:  DictionaryTextService.java
 * @author 谭长华
 * @date 2016年11月2日 
 *
 */
public class DictionaryTextService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final DictionaryTextService instance = new DictionaryTextService();

	// 静态工厂方法
	public static DictionaryTextService getInstance() {
		return instance;
	}
	
	/**
	 * 分页查询字典值
	 * @param text 参数
	 * @param currentPage 当前页
	 * @return PageResult
	 */
	public PageResult getListByPage(DictionaryText text, int currentPage) {
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(Constant.EVERY_PAGE);
		// 设置当前页
		page.setCurrentPage(currentPage);
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), DictionaryDAOImpl.getInstance().findTextCount(text), page.getCurrentPage());

		// 查询
		List<DictionaryText> lists = DictionaryDAOImpl.getInstance().findTextByPage(page, text);

		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, lists);

		return result;
	}
	
	/**
	 * 分页查询字典值
	 * @param text 参数
	 * @param currentPage 当前页
	 * @return PageResult
	 */
	public PageResult getListByPage(Integer dicId, int currentPage) {
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(Constant.EVERY_PAGE);
		// 设置当前页
		page.setCurrentPage(currentPage);
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), DictionaryDAOImpl.getInstance().findTextCount(dicId), page.getCurrentPage());

		// 查询
		List<DictionaryText> lists = DictionaryDAOImpl.getInstance().findTextByPage(page, dicId);

		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, lists);

		return result;
	}
	
	/**
	 * 分页查询字典值
	 * @param dicId
	 * @return
	 */
	public PageResult getListByPage(Integer dicId) {
		// 查询
		List<DictionaryText> lists = CommonDAOImpl.getInstance().findByProperty(DictionaryText.class, "dicId", dicId);

		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(Constant.EVERY_PAGE);
		// 设置当前页
		page.setCurrentPage(lists.size());
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), lists.size(), page.getCurrentPage());
		
		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, lists);

		return result;
	}
	
	/**
	 * 添加字典值
	 * @param text 实例
	 * @return Result
	 */
	public Result save(DictionaryText text) {
		//结果
		Result result = new Result();
		
		//查询字典
		Dictionary dictionary = CommonDAOImpl.getInstance().get(Dictionary.class, text.getDicId());
		//保存
		text.setDicName(dictionary.getName());
		int count = (Integer) CommonDAOImpl.getInstance().save(text);
		//判断
		if (count >= 0) {
			result.setSuccess(true);
			result.setMsg("新增成功");
			result.setCode(count);
		} else {
			result.setSuccess(false);
			result.setMsg("新增失败");
			result.setCode(-1);
		}
		//返回
		return result;
	}
	
	/**
	 * 批量删除字典
	 * @param ids 主键ID，逗号分开
	 * @return  Integer
	 */
	public Result deleteByIds(String ids) {
		//结果
		Result result = new Result();
		//拆分ID
		String[] sIds = StringUtils.split(ids, ",");
		//转换
		Integer[] iIds = StringTools.stringsToIntegers(sIds);
		//删除
		int count = (Integer) CommonDAOImpl.getInstance().deleteById(DictionaryText.class, iIds);
		//判断
		if (count >= 0) {
			result.setSuccess(true);
			result.setMsg("删除"+iIds.length+"个数据");
		} else {
			result.setSuccess(false);
			result.setMsg("删除失败");
		}
		//返回
		return result;
	}
	
	/**
	 * 修改字典值状态
	 * @param ids 主键ID，逗号分开
	 * @param state 状态0-启用，1-停用
	 * @return Result
	 */
	public Result updateState(String ids, Byte state) {
		//结果
		Result result = new Result();
		//拆分ID
		String[] sIds = StringUtils.split(ids, ",");
		//转换
		Integer[] iIds = StringTools.stringsToIntegers(sIds);
		//修改
		int count = (Integer) CommonDAOImpl.getInstance().updatePropertyById(DictionaryText.class, "state", state, iIds);
		//判断
		if (count >= 0) {
			result.setSuccess(true);
			result.setMsg("修改状态成功");
		} else {
			result.setSuccess(false);
			result.setMsg("修改状态失败");
		}
		//返回
		return result;
	}
	
	/**
	 * 修改字典值
	 * @param dictionary 实例
	 * @return Result
	 */
	public Result update(DictionaryText text) {
		//结果
		Result result = new Result();
		//修改
		int count = (Integer) CommonDAOImpl.getInstance().update(text);
		//判断
		if (count >= count) {
			result.setSuccess(true);
			result.setMsg("修改成功");
		} else {
			result.setSuccess(false);
			result.setMsg("修改失败");
		}
		//返回
		return result;
	}
}

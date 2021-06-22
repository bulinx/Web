package com.framework.service;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.dao.impl.DictionaryDAOImpl;
import com.framework.dao.impl.UserDAOImpl;
import com.framework.po.Dictionary;
import com.framework.po.DictionaryText;
import com.framework.utils.Constant;
import com.framework.utils.Page;
import com.framework.utils.PageResult;
import com.framework.utils.PageUtil;
import com.framework.utils.Result;
import com.framework.utils.StringTools;
import com.google.gson.Gson;


/**
 * @Description: 字典业务处理
 * @ClassName:  DictionaryService.java
 * @author 谭长华
 * @date 2016年11月2日 
 *
 */
public class DictionaryService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final DictionaryService instance = new DictionaryService();

	// 静态工厂方法
	public static DictionaryService getInstance() {
		return instance;
	}
	
	/**
	 * 添加字典
	 * @param name 名称
	 * @param code 代码
	 * @return Result
	 */
	public Result addDictionary(String name, String code) {
		//结果
		Result result = new Result();
		//实例
		Dictionary dictionary = new Dictionary();
		dictionary.setName(name);
		dictionary.setCode(code);
		//验证是否可以增加
		List<Dictionary> list = CommonDAOImpl.getInstance().findByProperty(Dictionary.class, "code", code);
		//判断
		if (!list.isEmpty()) {
			result.setSuccess(false);
			result.setMsg("字典代码："+code+"，已经存在不能添加");
			return result;
		}
		//保存
		int count = (Integer) CommonDAOImpl.getInstance().save(dictionary);
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
		//验证是否可以删除
		for (int i = 0; i < iIds.length; ++i) {
			//查询字典值
			List<DictionaryText> list = CommonDAOImpl.getInstance().findByProperty(DictionaryText.class, "dicId", iIds[i]);
			//判断
			if (!list.isEmpty()) {
				result.setSuccess(false);
				result.setMsg("字典ID："+iIds[i]+"，拥有字典值不能删除");
				return result;
			}
		}
		//删除
		int count = (Integer) UserDAOImpl.getInstance().deleteById(Dictionary.class, iIds);
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
	 * 修改字典状态
	 * @param ids 主键ID，逗号分开
	 * @param state 状态0-启用，1-停用
	 * @return Result
	 */
	public Result updateDictionaryState(String ids, Byte state) {
		//结果
		Result result = new Result();
		//拆分ID
		String[] sIds = StringUtils.split(ids, ",");
		//转换
		Integer[] iIds = StringTools.stringsToIntegers(sIds);
		//修改
		int count = (Integer) UserDAOImpl.getInstance().updatePropertyById(Dictionary.class, "state", state, iIds);
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
	 * 修改字典
	 * @param dictionary 实例
	 * @return Result
	 */
	public Result updateDictionary(Dictionary dictionary) {
		//结果
		Result result = new Result();
		//修改
		int count = (Integer) CommonDAOImpl.getInstance().update(dictionary);
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
	
	/**
	 * 获得字典json数据
	 * @return String
	 */
	public String findDictionaryStr() {
		//查询所有数据
		List<Dictionary> list = CommonDAOImpl.getInstance().loadAll(Dictionary.class);
		//Gson
		Gson gson = new Gson();
		//返回
		return gson.toJson(list);
	}
	
	/**
	 * 分页查询字典值
	 * @param dictionary 参数
	 * @param currentPage 当前页
	 * @return PageResult
	 */
	public PageResult getListByPage(Dictionary dictionary, int currentPage) {
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(Constant.EVERY_PAGE);
		// 设置当前页
		page.setCurrentPage(currentPage);
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), DictionaryDAOImpl.getInstance().findDictionaryCount(dictionary), page.getCurrentPage());

		// 查询
		List<Dictionary> lists = DictionaryDAOImpl.getInstance().findDictionaryByPage(page, dictionary);

		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, lists);

		return result;
	}
}

package com.framework.service;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.utils.Constant;
import com.framework.utils.Page;
import com.framework.utils.PageResult;
import com.framework.utils.PageUtil;
import com.framework.utils.Result;
import com.framework.utils.StringTools;

/**
 * 
 * 描述：通用业务
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final CommonService instance = new CommonService();

	// 静态工厂方法
	public static CommonService getInstance() {
		return instance;
	}
	
	/**
	 * 分页查询实体类
	 * @param entityClass 实体
	 * @param currentPage 当前页
	 * @return <T> PageResult 
	 */
	public <T> PageResult getListByPage(Class<T> entityClass, int currentPage) {
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(Constant.EVERY_PAGE);
		// 设置当前页
		page.setCurrentPage(currentPage);
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), Integer.parseInt(CommonDAOImpl.getInstance().findAllCount(entityClass)+""), page.getCurrentPage());

		// 查询
		List<T> lists = CommonDAOImpl.getInstance().findListByPage(entityClass, page);

		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, lists);

		return result;
	}
	
	/**
	 * 分页查询实体类
	 * @param entityClass 实体
	 * @param currentPage 当前页
	 * @param everyPage 每页显示记录数
	 * @return <T> PageResult 
	 */
	public <T> PageResult getListByPage(Class<T> entityClass, int currentPage, int everyPage) {
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(everyPage);
		// 设置当前页
		page.setCurrentPage(currentPage);
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), Integer.parseInt(CommonDAOImpl.getInstance().findAllCount(entityClass)+""), page.getCurrentPage());

		// 查询
		List<T> lists = CommonDAOImpl.getInstance().findListByPage(entityClass, page);

		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, lists);

		return result;
	}
	
	/**
	 * 新增记录
	 * @param obj 实例
	 * @return Result
	 */
	public <T> Result save(T obj) {
		//结果
		Result result = new Result();
		//存储
		int count = (Integer) CommonDAOImpl.getInstance().save(obj);
		//判断
		if (count > 0) {
			//成功
			result.setSuccess(true);
			result.setMsg("新增成功");
		} else {
			//失败
			result.setSuccess(false);
			result.setMsg("新增失败");
		}
		//返回
		return result;
	}
	
	/**
	 * 按主键删除
	 * @param id ID
	 * @return Result
	 */
	public <T> Result deleteById(Class<T> entityClass, Integer id) {
		//结果
		Result result = new Result();
		//存储
		int count = (Integer) CommonDAOImpl.getInstance().deleteById(entityClass, id);
		//判断
		if (count > 0) {
			//成功
			result.setSuccess(true);
			result.setMsg("删除成功");
		} else {
			//失败
			result.setSuccess(false);
			result.setMsg("删除失败");
		}
		//返回
		return result;
	}
	
	/**
	 * 修改状态
	 * @param entityClass 实体类
	 * @param ids 主键ID，逗号分开
	 * @param state 状态0-启用，1-停用
	 * @return Result
	 */
	public <T> Result updateState(Class<T> entityClass, String ids, Byte state) {
		// 返回结果
		Result result = new Result();
		//拆分ID
		String[] sIds = StringUtils.split(ids, ",");
		//转换
		Integer[] iIds = StringTools.stringsToIntegers(sIds);
		//修改
		int count = (Integer) CommonDAOImpl.getInstance().updatePropertyById(entityClass, "state", state, iIds);
		//判断
		if (count >= 0) {
			result.setSuccess(true);
			result.setMsg("操作成功");
		} else {
			result.setSuccess(false);
			result.setMsg("操作失败");
		}
		//返回
		return result;
	}
	
	/**
	 * 修改实例
	 * @param obj 实例
	 * @return Result
	 */
	public <T> Result update(T obj) {
		//结果
		Result result = new Result();
		//修改
		int count = (Integer) CommonDAOImpl.getInstance().update(obj);
		//判断
		if (count > 0) {
			//成功
			result.setSuccess(true);
			result.setMsg("修改成功");
		} else {
			//失败
			result.setSuccess(false);
			result.setMsg("修改失败");
		}
		//返回
		return result;
	}
}

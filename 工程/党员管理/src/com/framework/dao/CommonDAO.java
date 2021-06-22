package com.framework.dao;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

import com.framework.utils.Page;

/**
 * 
 * 描述：系统数据接口，包含基础数据操作，通用
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public interface CommonDAO {
	/**
	 * 保存实体类
	 * @param obj 实例
	 * @return Serializable，主键值
	 */
	public <T> Serializable save(T obj);
	/**
	 * 新增或修改实体
	 * @param obj 实体
	 * @return <T> Serializable
	 */
	public <T> Serializable saveOrUpdate(T obj);
	/**
	 * 批量插入数据
	 * @param lists 插入数据
	 */
	public <T> void batchSave(List<T> lists);
	/**
	 * 修改实体
	 * @param obj 实例
	 * @return Serializable，主键值
	 */
	public <T> Serializable update(T obj);
	/**
	 * 修改实体
	 * @param obj 实例
	 * @return Serializable，主键值
	 */
	public <T> Serializable merge(T obj);
	/**
	 * 按属性查询唯一实体
	 * @param entityClass 实体名
	 * @param propertyName 属性
	 * @param value 值
	 * @return <T> T
	 */
	public <T> T findUniqueByProperty(Class<T> entityClass,
			String propertyName, Object value);
	/**
	 * 分页查询实体
	 * @param entityClass 实体
	 * @param page 页面数据
	 * @return <T> List<T>
	 */
	public <T> List<T> findListByPage(Class<T> entityClass, Page page);
	/**
	 * 查询指定类全部记录数
	 * @param entityClass 实体
	 * @return <T> T 记录数
	 */
	public <T> Serializable findAllCount(Class<T> entityClass);
	/**
	 * 根据主键查询实体
	 * @param entityName 实体
	 * @param id 主键ID
	 * @return <T> T
	 */
	public <T> T get(Class<T> entityName, Serializable id);
	/**
	 * 加载全部实体
	 * @param entityClass 实体
	 * @return <T> List<T> 
	 */
	public <T> List<T> loadAll(final Class<T> entityClass);
	/**
	 * 按属性查找对象列表
	 * @param entityClass 实体
	 * @param propertyName 属性
	 * @param value 值
	 * @return <T> List<T>
	 */
	public <T> List<T> findByProperty(Class<T> entityClass, String propertyName, Object value);
	/**
	 * 按ID批量修改指定属性
	 * @param entityClass 实体
	 * @param propertyName 属性
	 * @param value  值,支持类型Boolean Integer Byte Double Date String
	 * @return Serializable
	 */
	public <T> Serializable updatePropertyById(Class<T> entityClass, String propertyName, Object value, Object[] ids);
	/**
	 * 按主键ID删除实体
	 * @param entityClass 实体
	 * @param ids ID
	 * @return  <T> Serializable
	 */
	public <T> Serializable deleteById(Class<T> entityClass, Object[] ids);
	/**
	 * 按主键ID删除记录
	 * @param entityClass entityClass 实体
	 * @param id 主键,支持类型Boolean Integer Byte Double Date String
	 * @return <T> Serializable
	 */
	public <T> Serializable deleteById(Class<T> entityClass, Object id);
	/**
	 * 按主键ID查询，逗号分开
	 * @param entityClass 实体
	 * @param ids 主键
	 * @return <T> List<T>
	 */
	public <T> List<T> findByInId(Class<T> entityClass, Object[] ids);
	/**
	 * 按指定属性批量查询实体
	 * @param entityClass 实体
	 * @param propertyName 属性
	 * @return <T> List<T>
	 */
	public <T> List<T> findPropertyInValues(Class<T> entityClass, String propertyName, Object[] values);
	/**
	 * 批量删除数据
	 * @param lists 数据
	 */
	public <T> Integer deleteAllEntitie(Collection<T> lists);
	/**
	 * 删除实体
	 * @param obj 实体
	 */
	public <T> Integer delete(T obj);
}

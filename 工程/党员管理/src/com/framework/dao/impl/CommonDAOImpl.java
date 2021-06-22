package com.framework.dao.impl;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

import com.framework.dao.CommonDAO;
import com.framework.hibernate.HibernateSessionFactory;
import com.framework.utils.Page;

/**
 * 
 * 描述：系统数据接口实现，包含基础数据操作，数据操作都继承该类
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class CommonDAOImpl implements CommonDAO {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final CommonDAOImpl instance = new CommonDAOImpl();

	// 静态工厂方法
	public static CommonDAOImpl getInstance() {
		return instance;
	}
	
	@Override
	public <T> Serializable save(T obj) {
		// 获得Session
		Session session = HibernateSessionFactory.getSession();
		// 事务对象
		Transaction transaction = null;
		
		//保存主键
		Serializable id;

		try {
			// 开启事务
			transaction = session.beginTransaction();
			// 保存
			id = session.save(obj);
			// 提交事务
			transaction.commit();
		} catch (Exception e) {
			e.printStackTrace();
			//保存出错
			id = -1;
			// 事务回滚
			transaction.rollback();
		} finally {
			// 关闭Session对象
			HibernateSessionFactory.closeSession();
		}
		
		return id;
	}

	@Override
	public <T> Serializable update(T obj) {
		// 获得Session
		Session session = HibernateSessionFactory.getSession();
		// 事务对象
		Transaction transaction = null;
		
		//保存主键
		Serializable id = 1;

		try {
			// 开启事务
			transaction = session.beginTransaction();
			// 保存
			session.update(obj);
			// 提交事务
			transaction.commit();
		} catch (Exception e) {
			e.printStackTrace();
			//保存出错
			id = -1;
			// 事务回滚
			transaction.rollback();
		} finally {
			// 关闭Session对象
			HibernateSessionFactory.closeSession();
		}

		return id;
	}

	@Override
	public <T> Serializable merge(T obj) {
		// 获得Session
		Session session = HibernateSessionFactory.getSession();
		// 事务对象
		Transaction transaction = null;
		
		//保存主键
		Serializable id = 1;

		try {
			// 开启事务
			transaction = session.beginTransaction();
			// 保存
			session.merge(obj);
			// 提交事务
			transaction.commit();
		} catch (Exception e) {
			e.printStackTrace();
			//保存出错
			id = -1;
			// 事务回滚
			transaction.rollback();
		} finally {
			// 关闭Session对象
			HibernateSessionFactory.closeSession();
		}

		return id;
	}

	@Override
	public <T> void batchSave(List<T> lists) {
		// 获得Session
		Session session = HibernateSessionFactory.getSession();
		// 事务对象
		Transaction transaction = session.beginTransaction();
		//循环保存
		for (int i = 0; i < lists.size(); ++i) {
			//保存
			session.save(lists.get(i));
			if (i % 20 == 0) {
				// 20个对象后才清理缓存，写入数据库
				session.flush();
				session.clear();
			}
		}
		
		// 提交事务
		transaction.commit();
					
		// 最后清理一下----防止大于20小于40的不保存
		session.flush();
		session.clear();
		
		// 关闭Session对象
		HibernateSessionFactory.closeSession();
	}

	@Override
	@SuppressWarnings("unchecked")
	public <T> T findUniqueByProperty(Class<T> entityClass,
			String propertyName, Object value) {
		T obj = null;
		try {
			if (!StringUtils.isBlank(propertyName)) {
				obj = (T) createCriteria(entityClass,
						Restrictions.eq(propertyName, value)).uniqueResult();
			} else {
				obj = null;
			}
		} catch (Exception e) {
			obj = null;
		} finally {
			// 关闭Session对象
			HibernateSessionFactory.closeSession();
		}
		return obj;
	}
	
	/**
	 * 创建Criteria对象带属性比较
	 *
	 * @param <T>
	 * @param entityClass 类
	 * @param criterions 条件 
	 * @return <T> Criteria
	 */
	private <T> Criteria createCriteria(Class<T> entityClass,
			Criterion... criterions) {
		// 获得Session
		Session session = HibernateSessionFactory.getSession();
		//查询条件
		Criteria criteria = session.createCriteria(entityClass);
		//添加查询条件
		for (Criterion c : criterions) {
			criteria.add(c);
		}
		return criteria;
	}

	@Override
	@SuppressWarnings("unchecked")
	public <T> List<T> findListByPage(Class<T> entityClass, Page page) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();

		// hql语句
		String hql = "FROM "+entityClass.getName()+" ORDER BY id DESC";

		Query query = session.createQuery(hql);

		// 查询结果
		List<T> lists = null;

		try {
			// 查询记录数
			query.setMaxResults(page.getEveryPage());
			// 查询起始地址
			query.setFirstResult(page.getBeginIndex());
			// 查询
			lists = query.list();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			// 关闭
			HibernateSessionFactory.closeSession();
		}
		return lists;
	}

	@Override
	public <T> Serializable findAllCount(Class<T> entityClass) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();

		// hql语句
		String hql = "SELECT COUNT(id) FROM " + entityClass.getName();

		Query query = session.createQuery(hql);

		// 查询结果
		Long count = 0L;

		try {
			// 查询
			count = (Long) query.uniqueResult();
		} catch (Exception e) {
			count = 0L;
			e.printStackTrace();
		} finally {
			// 关闭
			HibernateSessionFactory.closeSession();
		}
		//判断是否为null
		if (count == null) {
			count = 0L;
		}
		return count;
	}

	@Override
	@SuppressWarnings("unchecked")
	public <T> T get(Class<T> entityName, Serializable id) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		T obj = (T) session.get(entityName, id);
		// 关闭
		HibernateSessionFactory.closeSession();
		return obj;
	}

	@Override
	@SuppressWarnings("unchecked")
	public <T> List<T> loadAll(Class<T> entityClass) {
		Criteria criteria = createCriteria(entityClass);
		List<T> list = criteria.list();
		// 关闭
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	@SuppressWarnings("unchecked")
	public <T> List<T> findByProperty(Class<T> entityClass,
			String propertyName, Object value) {
		List<T> list = (List<T>) createCriteria(entityClass,
				Restrictions.eq(propertyName, value)).list();
		// 关闭
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	public <T> Serializable updatePropertyById(Class<T> entityClass,
			String propertyName, Object value, Object[] ids) {
		// 获得Session
		Session session = HibernateSessionFactory.getSession();
		// 事务对象
		Transaction transaction = null;

		// 定义批量更新的HQL语句
		String hql = "UPDATE "+entityClass.getName()+" SET "+propertyName+" = :propertyName WHERE id IN (:ids)";

		Query query = session.createQuery(hql);

		int count = -1;

		try {
			// 开启事务
			transaction = session.beginTransaction();
			//参数
			if (value instanceof Boolean) {
				query.setBoolean("propertyName", (boolean) value);
			}
			if (value instanceof Integer) {
				query.setInteger("propertyName", (int) value);
			}
			if (value instanceof Byte) {
				query.setByte("propertyName", (byte) value);
			}
			if (value instanceof Double) {
				query.setDouble("propertyName", (double) value);
			}
			if (value instanceof Date) {
				query.setDouble("propertyName", (double) value);
			}
			if (value instanceof String) {
				query.setString("propertyName", (String) value);
			}
			query.setParameterList("ids", ids);
			// 执行更新
			count = query.executeUpdate();
			// 提交事务
			transaction.commit();
		} catch (Exception e) {
			e.printStackTrace();
			// 事务回滚
			transaction.rollback();
			return -1;
		} finally {
			// 关闭Session对象
			HibernateSessionFactory.closeSession();
		}

		return count;
	}

	@Override
	public <T> Serializable deleteById(Class<T> entityClass, Object[] ids) {
		// 获得Session
		Session session = HibernateSessionFactory.getSession();
		// 事务对象
		Transaction transaction = null;

		// 定义批量更新的HQL语句
		String hql = "DELETE "+entityClass.getName()+" WHERE id IN (:ids)";

		Query query = session.createQuery(hql);

		int count = -1;

		// 开启事务
		transaction = session.beginTransaction();

		try {
			// 参数
			query.setParameterList("ids", ids);
			// 执行
			count = query.executeUpdate();
			// 提交事务
			transaction.commit();
		} catch (Exception e) {
			e.printStackTrace();
			// 事务回滚
			transaction.rollback();
			return -1;
		} finally {
			// 关闭Session对象
			HibernateSessionFactory.closeSession();
		}

		return count;
	}

	@Override
	public <T> Serializable saveOrUpdate(T obj) {
		// 获得Session
		Session session = HibernateSessionFactory.getSession();
		// 事务对象
		Transaction transaction = null;
		
		//保存主键
		Serializable id = 1;

		try {
			// 开启事务
			transaction = session.beginTransaction();
			// 保存
			session.saveOrUpdate(obj);
			// 提交事务
			transaction.commit();
		} catch (Exception e) {
			e.printStackTrace();
			//保存出错
			id = -1;
			// 事务回滚
			transaction.rollback();
		} finally {
			// 关闭Session对象
			HibernateSessionFactory.closeSession();
		}
		
		return id;
	}

	@Override
	@SuppressWarnings("unchecked")
	public <T> List<T> findByInId(Class<T> entityClass, Object[] ids) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();

		// hql语句
		String hql = "FROM "+entityClass.getName()+" WHERE id IN (:ids)";

		Query query = session.createQuery(hql);

		// 查询结果
		List<T> lists = null;

		try {
			// 参数
			query.setParameterList("ids", ids);
			// 查询
			lists = query.list();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			// 关闭
			HibernateSessionFactory.closeSession();
		}
		return lists;
	}

	@Override
	@SuppressWarnings("unchecked")
	public <T> List<T> findPropertyInValues(Class<T> entityClass,
			String propertyName, Object[] values) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();

		// hql语句
		String hql = "FROM " + entityClass.getName() + " WHERE "+propertyName+" IN (:vlu)";

		Query query = session.createQuery(hql);

		// 查询结果
		List<T> lists = null;

		try {
			// 参数
			query.setParameterList("vlu", values);
			// 查询
			lists = query.list();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			// 关闭
			HibernateSessionFactory.closeSession();
		}
		return lists;
	}

	@Override
	public <T> Integer deleteAllEntitie(Collection<T> lists) {
		// 获得Session
		Session session = HibernateSessionFactory.getSession();
		// 事务对象
		Transaction transaction = null;

		try {
			// 开启事务
			transaction = session.beginTransaction();
			// 删除
			for (T t : lists) {
				session.delete(t);
			}
			// 提交事务
			transaction.commit();
		} catch (Exception e) {
			e.printStackTrace();
			// 事务回滚
			transaction.rollback();
		} finally {
			// 关闭Session对象
			HibernateSessionFactory.closeSession();
		}
		
		return lists.size();
	}

	@Override
	public <T> Integer delete(T obj) {
		// 获得Session
		Session session = HibernateSessionFactory.getSession();
		// 事务对象
		Transaction transaction = null;

		int count = 1;
		
		try {
			// 开启事务
			transaction = session.beginTransaction();
			// 删除
			session.delete(obj);
			// 提交事务
			transaction.commit();
		} catch (Exception e) {
			e.printStackTrace();
			count = -1;
			// 事务回滚
			transaction.rollback();
		} finally {
			// 关闭Session对象
			HibernateSessionFactory.closeSession();
		}
		
		return count;
	}

	@Override
	public <T> Serializable deleteById(Class<T> entityClass, Object id) {
		// 获得Session
		Session session = HibernateSessionFactory.getSession();
		// 事务对象
		Transaction transaction = null;

		// 定义批量更新的HQL语句
		String hql = "DELETE "+entityClass.getName()+" WHERE id = :id";

		Query query = session.createQuery(hql);

		int count = -1;

		// 开启事务
		transaction = session.beginTransaction();

		try {
			//参数
			if (id instanceof Boolean) {
				query.setBoolean("id", (boolean) id);
			}
			if (id instanceof Integer) {
				query.setInteger("id", (int) id);
			}
			if (id instanceof Byte) {
				query.setByte("id", (byte) id);
			}
			if (id instanceof Double) {
				query.setDouble("id", (double) id);
			}
			if (id instanceof Date) {
				query.setDouble("id", (double) id);
			}
			if (id instanceof String) {
				query.setString("id", (String) id);
			}
			// 执行
			count = query.executeUpdate();
			// 提交事务
			transaction.commit();
		} catch (Exception e) {
			e.printStackTrace();
			// 事务回滚
			transaction.rollback();
			return -1;
		} finally {
			// 关闭Session对象
			HibernateSessionFactory.closeSession();
		}

		return count;
	}
}

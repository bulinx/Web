package com.framework.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

import com.framework.dao.RoleDAO;
import com.framework.hibernate.HibernateSessionFactory;
import com.framework.po.Role;
/**
 * 
 * 描述：角色权限数据实现
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class RoleDAOImpl extends CommonDAOImpl implements RoleDAO {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final RoleDAOImpl instance = new RoleDAOImpl();

	// 静态工厂方法
	public static RoleDAOImpl getInstance() {
		return instance;
	}

	@Override
	public Integer updateRoleMenuByMenu(Integer[] ids, Byte state) {
		// 获得Session
		Session session = HibernateSessionFactory.getSession();
		// 事务对象
		Transaction transaction = null;

		// 定义批量更新的HQL语句
		String hql = "UPDATE RoleMenu SET state = :state,flag=1 WHERE menuId IN (:ids)";

		Query query = session.createQuery(hql);

		int count = -1;

		try {
			// 开启事务
			transaction = session.beginTransaction();
			//参数
			query.setByte("state", state);
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
	@SuppressWarnings("unchecked")
	public List<Role> findRoleWithLike(String name) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(Role.class);
		//条件判断
		crit.add(Restrictions.like("name", "%"+name+"%"));
		List<Role> list = crit.list();
		//关闭
		HibernateSessionFactory.closeSession();
		return list;
	}
}

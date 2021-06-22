package com.xgdj.daoImpl;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.hibernate.HibernateSessionFactory;
import com.xgdj.dao.UserStateDAO;

/**
 * 用户状态
 * @author 谭长华
 * @ClassName UserStateDAOImpl
 * @date 2017年3月18日
 *
 */
public class UserStateDAOImpl extends CommonDAOImpl implements UserStateDAO {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final UserStateDAOImpl instance = new UserStateDAOImpl();

	// 静态工厂方法
	public static UserStateDAOImpl getInstance() {
		return instance;
	}

	@Override
	public int updatePropertyByNumber(String propertyName, Integer value, String[] nums) {
		// 获得Session
		Session session = HibernateSessionFactory.getSession();
		// 事务对象
		Transaction transaction = null;

		// 定义批量更新的HQL语句
		String hql = "UPDATE UserState SET "+propertyName+" = :propertyName WHERE numbers IN (:nums)";

		Query query = session.createQuery(hql);

		int count = -1;

		try {
			// 开启事务
			transaction = session.beginTransaction();
			//参数
			query.setInteger("propertyName", value);
			//学号
			query.setParameterList("nums", nums);
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
}

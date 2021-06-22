package com.framework.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import com.framework.dao.UserDAO;
import com.framework.hibernate.HibernateSessionFactory;
import com.framework.po.User;
import com.framework.utils.DateUtil;
import com.framework.utils.Page;

/**
 * 
 * 描述：用户基本信息数据接口实现
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class UserDAOImpl extends CommonDAOImpl implements UserDAO {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final UserDAOImpl instance = new UserDAOImpl();

	// 静态工厂方法
	public static UserDAOImpl getInstance() {
		return instance;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<User> findUserByPage(Page page, User user, String start,
			String end) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(User.class);
		//条件判断
		if (user != null && !StringUtils.isBlank(user.getName())) {
			//登录用户
			crit.add(Restrictions.like("name", "%"+user.getName()+"%"));
		}
		if (user != null && user.getRole() != null && user.getRole().getId() > 0) {
			//角色
			crit.add(Restrictions.eq("role.id", user.getRole().getId()));
		}
		if (!StringUtils.isBlank(start)) {
			//开始时间
			crit.add(Restrictions.ge("createTime", DateUtil.getDate(start)));
		}
		if (!StringUtils.isBlank(end)) {
			//结束时间
			crit.add(Restrictions.le("createTime", DateUtil.getDate(end)));
		}
		//分页参数
		crit.setMaxResults(page.getEveryPage());
		crit.setFirstResult(page.getBeginIndex());
		//查询结果
		List<User> list = crit.list();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	public Integer findUserCount(User user, String start, String end) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(User.class);
		//条件判断
		if (user != null && !StringUtils.isBlank(user.getName())) {
			//登录用户
			crit.add(Restrictions.like("name", "%"+user.getName()+"%"));
		}
		if (user != null && user.getRole() != null && user.getRole().getId() > 0) {
			//角色
			crit.add(Restrictions.eq("role.id", user.getRole().getId()));
		}
		if (!StringUtils.isBlank(start)) {
			//开始时间
			crit.add(Restrictions.ge("createTime", DateUtil.getDate(start)));
		}
		if (!StringUtils.isBlank(end)) {
			//结束时间
			crit.add(Restrictions.le("createTime", DateUtil.getDate(end)));
		}
		//设置聚合运算
		crit.setProjection(Projections.rowCount());
		//查询结果
		int count = ((Number)crit.uniqueResult()).intValue();
		//关闭session
		HibernateSessionFactory.closeSession();
		//返回记录数
		return count;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<User> findInName(String[] names) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();

		// hql语句
		String hql = "FROM User WHERE name IN (:names)";

		Query query = session.createQuery(hql);

		// 查询结果
		List<User> lists = new ArrayList<User>();

		try {
			// 参数
			query.setParameterList("names", names);
			// 查询
			lists = query.list();
		} catch (Exception e) {
			e.printStackTrace();
			return lists;
		} finally {
			// 关闭
			HibernateSessionFactory.closeSession();
		}
		return lists;
	}
}

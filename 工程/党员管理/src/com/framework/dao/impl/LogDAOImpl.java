package com.framework.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import com.framework.dao.LogDAO;
import com.framework.hibernate.HibernateSessionFactory;
import com.framework.po.Log;
import com.framework.po.Views;
import com.framework.utils.DateUtil;
import com.framework.utils.Page;

/**
 * 
 * 描述： 登录日志数据实现
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class LogDAOImpl extends CommonDAOImpl implements LogDAO {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final LogDAOImpl instance = new LogDAOImpl();

	// 静态工厂方法
	public static LogDAOImpl getInstance() {
		return instance;
	}

	@Override
	public Integer findLogCount(Log log, String start, String end) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(Log.class);
		//条件判断
		if (log != null && !StringUtils.isBlank(log.getName())) {
			//登录用户
			crit.add(Restrictions.like("name", "%"+log.getName()+"%"));
		}
		if (log != null && !StringUtils.isBlank(log.getIp())) {
			//登录IP
			crit.add(Restrictions.eq("ip", log.getIp()));
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
	public List<Log> findLogByPage(Page page, Log log, String start, String end) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(Log.class);
		//条件判断
		if (log != null && !StringUtils.isBlank(log.getName())) {
			//登录用户
			crit.add(Restrictions.like("name", "%"+log.getName()+"%"));
		}
		if (log != null && !StringUtils.isBlank(log.getIp())) {
			//登录IP
			crit.add(Restrictions.eq("ip", log.getIp()));
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
		List<Log> list = crit.list();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Views> findViewsByPage(Page page, Views views, String start,
			String end) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(Views.class);
		//条件判断
		if (views != null && !StringUtils.isBlank(views.getAddress())) {
			//访问地点
			crit.add(Restrictions.like("address", "%"+views.getAddress()+"%"));
		}
		if (views != null && !StringUtils.isBlank(views.getIp())) {
			//IP
			crit.add(Restrictions.eq("ip", views.getIp()));
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
		List<Views> list = crit.list();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	public Integer findViewsCount(Views views, String start, String end) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(Views.class);
		//条件判断
		if (views != null && !StringUtils.isBlank(views.getAddress())) {
			//访问地点
			crit.add(Restrictions.like("address", "%"+views.getAddress()+"%"));
		}
		if (views != null && !StringUtils.isBlank(views.getIp())) {
			//IP
			crit.add(Restrictions.eq("ip", views.getIp()));
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
}

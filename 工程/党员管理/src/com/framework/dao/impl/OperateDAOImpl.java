package com.framework.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import com.framework.dao.OperateDAO;
import com.framework.hibernate.HibernateSessionFactory;
import com.framework.po.OperateLog;
import com.framework.utils.DateUtil;
import com.framework.utils.Page;

/**
 * 
 * 描述：操作日志数据接口实现
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class OperateDAOImpl extends CommonDAOImpl implements OperateDAO {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final OperateDAOImpl instance = new OperateDAOImpl();

	// 静态工厂方法
	public static OperateDAOImpl getInstance() {
		return instance;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OperateLog> findOperateLogByPage(Page page, OperateLog log,
			String start, String end) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(OperateLog.class);
		//条件判断
		if (log != null && !StringUtils.isBlank(log.getOperateBy())) {
			//操作人
			crit.add(Restrictions.like("operateBy", "%"+log.getOperateBy()+"%"));
		}
		if (log != null && !StringUtils.isBlank(log.getKeywords())) {
			//关键字
			crit.add(Restrictions.like("keywords", "%"+log.getKeywords()+"%"));
		}
		if (!StringUtils.isBlank(start)) {
			//开始时间
			crit.add(Restrictions.ge("operateTime", DateUtil.getDate(start)));
		}
		if (!StringUtils.isBlank(end)) {
			//结束时间
			crit.add(Restrictions.le("operateTime", DateUtil.getDate(end)));
		}
		//分页参数
		crit.setMaxResults(page.getEveryPage());
		crit.setFirstResult(page.getBeginIndex());
		//查询结果
		List<OperateLog> list = crit.list();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	public Integer findOperateLogCount(OperateLog log, String start, String end) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(OperateLog.class);
		//条件判断
		if (log != null && !StringUtils.isBlank(log.getOperateBy())) {
			//操作人
			crit.add(Restrictions.like("operateBy", "%"+log.getOperateBy()+"%"));
		}
		if (log != null && !StringUtils.isBlank(log.getKeywords())) {
			//关键字
			crit.add(Restrictions.like("keywords", "%"+log.getKeywords()+"%"));
		}
		if (!StringUtils.isBlank(start)) {
			//开始时间
			crit.add(Restrictions.ge("operateTime", DateUtil.getDate(start)));
		}
		if (!StringUtils.isBlank(end)) {
			//结束时间
			crit.add(Restrictions.le("operateTime", DateUtil.getDate(end)));
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

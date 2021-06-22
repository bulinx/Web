package com.xgdj.daoImpl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.hibernate.HibernateSessionFactory;
import com.framework.utils.Page;
import com.xgdj.dao.ReportDAO;
import com.xgdj.po.Report;

/**
 * 思想汇报
 * @author 谭长华
 * @ClassName ReportDAOImpl.java
 * @date 2017年4月11日
 *
 */
public class ReportDAOImpl extends CommonDAOImpl implements ReportDAO {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final ReportDAOImpl instance = new ReportDAOImpl();

	// 静态工厂方法
	public static ReportDAOImpl getInstance() {
		return instance;
	}
	
	@Override
	public List<Report> findByPage(Page page, Report obj) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(Report.class);
		//条件判断
		if (obj != null && StringUtils.isNotBlank(obj.getNumbers())) {
			crit.add(Restrictions.eq("numbers", obj.getNumbers()));
		}
		if (obj != null && StringUtils.isNotBlank(obj.getName())) {
			crit.add(Restrictions.eq("name", obj.getName()));
		}
		//分页参数
		crit.setMaxResults(page.getEveryPage());
		crit.setFirstResult(page.getBeginIndex());
		//查询结果
		@SuppressWarnings("unchecked")
		List<Report> list = crit.list();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	public Integer findCount(Report obj) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(Report.class);
		//条件判断
		if (obj != null && StringUtils.isNotBlank(obj.getNumbers())) {
			crit.add(Restrictions.eq("numbers", obj.getNumbers()));
		}
		if (obj != null && StringUtils.isNotBlank(obj.getName())) {
			crit.add(Restrictions.eq("name", obj.getName()));
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
	public Integer deleteByNumber(String number) {
		// 获得Session
		Session session = HibernateSessionFactory.getSession();
		// 事务对象
		Transaction transaction = null;

		// 定义批量更新的HQL语句
		String hql = "DELETE Report WHERE numbers = :num";

		Query query = session.createQuery(hql);

		int count = -1;

		// 开启事务
		transaction = session.beginTransaction();

		try {
			//参数
			query.setString("num", number);
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

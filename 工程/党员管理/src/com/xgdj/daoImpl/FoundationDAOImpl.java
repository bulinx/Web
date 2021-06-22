package com.xgdj.daoImpl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.hibernate.HibernateSessionFactory;
import com.framework.utils.Page;
import com.xgdj.dao.FoundationDAO;
import com.xgdj.po.Foundation;

/**
 *  基础数据
 * @author 谭长华
 * @ClassName FoundationDAOImpl
 * @date 2017年3月18日
 *
 */
public class FoundationDAOImpl extends CommonDAOImpl implements FoundationDAO {

	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final FoundationDAOImpl instance = new FoundationDAOImpl();

	// 静态工厂方法
	public static FoundationDAOImpl getInstance() {
		return instance;
	}
	
	@Override
	public List<Foundation> findByPage(Page page, Foundation obj) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(Foundation.class);
		//条件判断
		if (obj != null && StringUtils.isNotBlank(obj.getNumber())) {
			crit.add(Restrictions.eq("number", obj.getNumber()));
		}
		if (obj != null && StringUtils.isNotBlank(obj.getRealName())) {
			crit.add(Restrictions.eq("realName", obj.getRealName()));
		}
		//分页参数
		crit.setMaxResults(page.getEveryPage());
		crit.setFirstResult(page.getBeginIndex());
		//查询结果
		@SuppressWarnings("unchecked")
		List<Foundation> list = crit.list();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	public Integer findCount(Foundation obj) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(Foundation.class);
		//条件判断
		if (obj != null && StringUtils.isNotBlank(obj.getNumber())) {
			crit.add(Restrictions.eq("number", obj.getNumber()));
		}
		if (obj != null && StringUtils.isNotBlank(obj.getRealName())) {
			crit.add(Restrictions.eq("realName", obj.getRealName()));
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

	/**
	 * 按学号查询基础信息
	 */
	@Override
	@SuppressWarnings("unchecked")
	public List<Foundation> findInNumber(String[] arr) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();

		// hql语句
		String hql = "FROM Foundation WHERE number IN (:nums)";

		Query query = session.createQuery(hql);

		// 查询结果
		List<Foundation> lists = null;

		try {
			// 参数
			query.setParameterList("nums", arr);
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
	
}

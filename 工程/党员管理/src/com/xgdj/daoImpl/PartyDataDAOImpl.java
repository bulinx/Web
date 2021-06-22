package com.xgdj.daoImpl;

import java.util.ArrayList;
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
import com.xgdj.dao.PartyDataDAO;
import com.xgdj.po.PartyData;

/**
 * 入党数据
 * @author 谭长华
 * @ClassName PartyDataDAOImpl
 * @date 2017年3月18日
 *
 */
public class PartyDataDAOImpl extends CommonDAOImpl implements PartyDataDAO {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final PartyDataDAOImpl instance = new PartyDataDAOImpl();

	// 静态工厂方法
	public static PartyDataDAOImpl getInstance() {
		return instance;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PartyData> findInNumber(String[] arr) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();

		// hql语句
		String hql = "FROM PartyData WHERE number IN (:nums)";

		Query query = session.createQuery(hql);

		// 查询结果
		List<PartyData> lists = new ArrayList<PartyData>();

		try {
			// 参数
			query.setParameterList("nums", arr);
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

	@Override
	public List<PartyData> findByPage(Page page, PartyData obj) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(PartyData.class);
		//条件判断
		if (obj != null && StringUtils.isNotBlank(obj.getNumber())) {
			crit.add(Restrictions.eq("number", obj.getNumber()));
		}
		if (obj != null && StringUtils.isNotBlank(obj.getName())) {
			crit.add(Restrictions.eq("name", obj.getName()));
		}
		//分页参数
		crit.setMaxResults(page.getEveryPage());
		crit.setFirstResult(page.getBeginIndex());
		//查询结果
		@SuppressWarnings("unchecked")
		List<PartyData> list = crit.list();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	public Integer findCount(PartyData obj) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(PartyData.class);
		//条件判断
		if (obj != null && StringUtils.isNotBlank(obj.getNumber())) {
			crit.add(Restrictions.eq("number", obj.getNumber()));
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
}

package com.xgdj.daoImpl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.hibernate.HibernateSessionFactory;
import com.framework.utils.Page;
import com.xgdj.dao.MessageDAO;
import com.xgdj.po.MsgRelation;

/**
 * 站内信
 * @author 谭长华
 * @ClassName MessageDAOImpl
 * @date 2017年3月18日
 *
 */
public class MessageDAOImpl extends CommonDAOImpl implements MessageDAO {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final MessageDAOImpl instance = new MessageDAOImpl();

	// 静态工厂方法
	public static MessageDAOImpl getInstance() {
		return instance;
	}
	
	@Override
	public List<MsgRelation> findByPage(Page page, MsgRelation obj) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(MsgRelation.class);
		//条件判断
		if (obj != null && obj.getRecvMan() != null) {
			crit.add(Restrictions.eq("recvMan", obj.getRecvMan()));
		}
		crit.addOrder(Order.desc("id"));
		//分页参数
		crit.setMaxResults(page.getEveryPage());
		crit.setFirstResult(page.getBeginIndex());
		//查询结果
		@SuppressWarnings("unchecked")
		List<MsgRelation> list = crit.list();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	public Integer findCount(MsgRelation obj) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(MsgRelation.class);
		//条件判断
		if (obj != null && obj.getRecvMan() != null) {
			crit.add(Restrictions.eq("recvMan", obj.getRecvMan()));
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

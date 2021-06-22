package com.framework.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import com.framework.dao.DictionaryDAO;
import com.framework.hibernate.HibernateSessionFactory;
import com.framework.po.Dictionary;
import com.framework.po.DictionaryText;
import com.framework.utils.Page;


/**
 * @Description: 字典数据实现
 * @ClassName:  DictionaryDAOImpl.java
 * @author 谭长华
 * @date 2016年11月2日 
 *
 */
public class DictionaryDAOImpl extends CommonDAOImpl implements DictionaryDAO {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final DictionaryDAOImpl instance = new DictionaryDAOImpl();

	// 静态工厂方法
	public static DictionaryDAOImpl getInstance() {
		return instance;
	}

	@Override
	public List<DictionaryText> findTextByPage(Page page, DictionaryText text) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(DictionaryText.class);
		//条件判断
		if (text != null && text.getDicId() != null) {
			crit.add(Restrictions.eq("dicId", text.getDicId()));
		} else {
			crit.add(Restrictions.eq("dicId", -1));
		}
		//字典值
		if (text != null && !StringUtils.isBlank(text.getName())) {
			crit.add(Restrictions.like("name", text.getName()+"%"));
		}
		//字典代码
		if (text != null && !StringUtils.isBlank(text.getValue())) {
			crit.add(Restrictions.like("value", text.getValue()));
		}
		//分页参数
		crit.setMaxResults(page.getEveryPage());
		crit.setFirstResult(page.getBeginIndex());
		//结果
		@SuppressWarnings("unchecked")
		List<DictionaryText> list = crit.list();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	public Integer findTextCount(DictionaryText text) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(DictionaryText.class);
		//条件判断
		if (text != null && text.getDicId() != null) {
			crit.add(Restrictions.eq("dicId", text.getDicId()));
		} else {
			crit.add(Restrictions.eq("dicId", -1));
		}
		//字典值
		if (text != null && !StringUtils.isBlank(text.getName())) {
			crit.add(Restrictions.like("name", text.getName()+"%"));
		}
		//字典代码
		if (text != null && !StringUtils.isBlank(text.getValue())) {
			crit.add(Restrictions.like("value", text.getValue()));
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
	public List<DictionaryText> findTextByPage(Page page, Integer dicId) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(DictionaryText.class);
		//条件判断
		if (dicId != null) {
			crit.add(Restrictions.eq("dicId", dicId));
		} else {
			crit.add(Restrictions.eq("dicId", -1));
		}
		//分页参数
		crit.setMaxResults(page.getEveryPage());
		crit.setFirstResult(page.getBeginIndex());
		//结果
		@SuppressWarnings("unchecked")
		List<DictionaryText> list = crit.list();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	public Integer findTextCount(Integer dicId) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(DictionaryText.class);
		//条件判断
		if (dicId != null) {
			crit.add(Restrictions.eq("dicId", dicId));
		} else {
			crit.add(Restrictions.eq("dicId", -1));
		}
		//记录数
		int count = crit.list().size();
		//关闭session
		HibernateSessionFactory.closeSession();
		//返回记录数
		return count;
	}

	@Override
	public List<Dictionary> findDictionaryByPage(Page page,
			Dictionary dictionary) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(Dictionary.class);
		//条件判断
		if (dictionary != null && !StringUtils.isBlank(dictionary.getName())) {
			crit.add(Restrictions.eq("name", dictionary.getName()));
		}
		//分页参数
		crit.setMaxResults(page.getEveryPage());
		crit.setFirstResult(page.getBeginIndex());
		//结果
		@SuppressWarnings("unchecked")
		List<Dictionary> list = crit.list();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	public Integer findDictionaryCount(Dictionary dictionary) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(Dictionary.class);
		//条件判断
		if (dictionary != null && !StringUtils.isBlank(dictionary.getName())) {
			crit.add(Restrictions.eq("name", dictionary.getName()));
		}
		//记录数
		int count = crit.list().size();
		//关闭session
		HibernateSessionFactory.closeSession();
		//返回记录数
		return count;
	}

	@Override
	public List<DictionaryText> findAllDictionaryText(Integer dicId, Byte state) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(DictionaryText.class);
		//条件判断
		if (dicId != null) {
			crit.add(Restrictions.eq("dicId", dicId));
		} else {
			crit.add(Restrictions.eq("dicId", -1));
		}
		//字典值状态
		if (state != null) {
			crit.add(Restrictions.like("state", state));
		} else {
			crit.add(Restrictions.like("state", (byte)-1));
		}
		//结果
		@SuppressWarnings("unchecked")
		List<DictionaryText> list = crit.list();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}
}

package com.framework.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import com.framework.dao.MenuDAO;
import com.framework.hibernate.HibernateSessionFactory;
import com.framework.po.Menu;
import com.framework.po.RoleMenu;
import com.framework.utils.Page;

/**
 * 
 * 描述：菜单管理数据实现
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class MenuDAOImpl extends CommonDAOImpl implements MenuDAO {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final MenuDAOImpl instance = new MenuDAOImpl();

	// 静态工厂方法
	public static MenuDAOImpl getInstance() {
		return instance;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Menu> findMenuByPage(Page page, String name) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(Menu.class);
		//条件判断
		if (!StringUtils.isBlank(name)) {
			//登录用户
			crit.add(Restrictions.like("name", "%"+name+"%"));
		}
		//分页参数
		crit.setMaxResults(page.getEveryPage());
		crit.setFirstResult(page.getBeginIndex());
		//查询结果
		List<Menu> list = crit.list();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	public Integer findMenuCount(String name) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(Menu.class);
		//条件判断
		if (!StringUtils.isBlank(name)) {
			//登录用户
			crit.add(Restrictions.like("name", "%"+name+"%"));
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
	public List<Menu> findMenuInIds(Integer[] ids) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();

		// hql语句
		String hql = "FROM Menu WHERE id IN (:ids)";

		Query query = session.createQuery(hql);

		// 查询结果
		List<Menu> lists = null;

		try {
			//参数
			query.setParameterList("ids", ids);
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

	@Override
	@SuppressWarnings("unchecked")
	public List<Menu> getAllSubMenu() {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(Menu.class);
		//参数
		crit.add(Restrictions.ne("codes", 0));
		//查询结果
		List<Menu> list = crit.list();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	public List<RoleMenu> findRoleMenuByRole(Integer roleId) {
		// 数据结果
		List<RoleMenu> list = new ArrayList<RoleMenu>();
		//查询
		list = CommonDAOImpl.getInstance().findByProperty(RoleMenu.class, "roleId", roleId);
		//返回
		return list;
	}
}

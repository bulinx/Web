package com.framework.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import com.framework.dao.ButtonDAO;
import com.framework.hibernate.HibernateSessionFactory;
import com.framework.po.Button;
import com.framework.po.RoleButton;



/**
 * @Description: 按钮数据实现
 * @ClassName:  ButtonDAO.java
 * @author 谭长华
 * @date 2016年10月28日 
 *
 */
public class ButtonDAOImpl extends CommonDAOImpl implements ButtonDAO {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final ButtonDAOImpl instance = new ButtonDAOImpl();

	// 静态工厂方法
	public static ButtonDAOImpl getInstance() {
		return instance;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RoleButton> findRoleButtonByRoleAndMenu(Integer roleId,
			Integer menuId) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(RoleButton.class);
		//条件判断
		if (roleId != null) {
			//登录用户
			crit.add(Restrictions.eq("roleId", roleId));
		}
		if (menuId != null) {
			//角色
			crit.add(Restrictions.eq("subMenuId", menuId));
		}
		List<RoleButton> list = crit.list();
		//关闭
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<Button> findButtonForSearch(Integer subId, String name) {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(Button.class);
		//条件判断
		if (subId != null) {
			//登录用户
			crit.add(Restrictions.eq("subId", subId));
		}
		if (!StringUtils.isBlank(name)) {
			//角色
			crit.add(Restrictions.like("name", "%"+name+"%"));
		}
		List<Button> list = crit.list();
		//关闭
		HibernateSessionFactory.closeSession();
		return list;
	}
}

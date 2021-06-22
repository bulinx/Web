package com.xgdj.daoImpl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.transform.Transformers;
import org.hibernate.type.StandardBasicTypes;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.hibernate.HibernateSessionFactory;
import com.xgdj.dao.ChartDAO;
import com.xgdj.po.ChartPIE;
import com.xgdj.po.UserState;

public class ChartDAOImpl extends CommonDAOImpl implements ChartDAO {

	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final ChartDAOImpl instance = new ChartDAOImpl();

	// 静态工厂方法
	public static ChartDAOImpl getInstance() {
		return instance;
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ChartPIE> findSexPIE() {
		//数据
		List<ChartPIE> list = new ArrayList<ChartPIE>();
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		//开启事务
		Transaction transaction = session.beginTransaction();
		//SQL
		String sql = "SELECT COUNT(id) AS `value`,sex AS `name` FROM tb_xg_apply WHERE state = 0 GROUP BY sex";
		//执行
		SQLQuery sqlQuery = session.createSQLQuery(sql);
		
		//映射
		sqlQuery.addScalar("value", StandardBasicTypes.INTEGER);
		sqlQuery.addScalar("name", StandardBasicTypes.STRING);
		sqlQuery.setResultTransformer(Transformers.aliasToBean(ChartPIE.class));
		list = sqlQuery.list();
		//提交事务
		transaction.commit();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	public UserState findPartyPIE() {
		//数据
		UserState userState = new UserState();
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		//开启事务
		Transaction transaction = session.beginTransaction();
		//SQL
		String sql = "SELECT SUM(CASE WHEN apply = 1 THEN 1 ELSE 0 END) AS apply,SUM(CASE WHEN positive = 2 THEN 1 ELSE 0 END) AS positive,SUM(CASE WHEN develop = 2 THEN 1 ELSE 0 END) AS develop,SUM(CASE WHEN `prepare` = 2 THEN 1 ELSE 0 END) AS `prepare`,SUM(CASE WHEN normal = 2 THEN 1 ELSE 0 END) AS normal FROM tb_xg_state WHERE state = 0";
		//执行
		SQLQuery sqlQuery = session.createSQLQuery(sql);
		
		//映射
		sqlQuery.addScalar("apply", StandardBasicTypes.INTEGER);
		sqlQuery.addScalar("positive", StandardBasicTypes.INTEGER);
		sqlQuery.addScalar("develop", StandardBasicTypes.INTEGER);
		sqlQuery.addScalar("prepare", StandardBasicTypes.INTEGER);
		sqlQuery.addScalar("normal", StandardBasicTypes.INTEGER);
		sqlQuery.setResultTransformer(Transformers.aliasToBean(UserState.class));
		userState = (UserState) sqlQuery.uniqueResult();
		//提交事务
		transaction.commit();
		//关闭session
		HibernateSessionFactory.closeSession();
		return userState;
	}
}

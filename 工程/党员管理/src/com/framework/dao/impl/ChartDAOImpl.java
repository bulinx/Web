package com.framework.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.transform.Transformers;
import org.hibernate.type.StandardBasicTypes;

import com.framework.dao.ChartDAO;
import com.framework.hibernate.HibernateSessionFactory;
import com.framework.po.echart.ChartData;
import com.framework.utils.StringTools;

/**
 * 
 * 描述：EChart数据实现
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class ChartDAOImpl extends CommonDAOImpl implements ChartDAO {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final ChartDAOImpl instance = new ChartDAOImpl();

	// 静态工厂方法
	public static ChartDAOImpl getInstance() {
		return instance;
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ChartData> findView(String dates, String format) {
		//数据
		List<ChartData> list = new ArrayList<ChartData>();
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		//开启事务
		Transaction transaction = session.beginTransaction();
		//SQL
		String sql = "SELECT count(1) AS total,"
				+ "DATE_FORMAT(v.createTime, '"+StringTools.getChartFormat(format)+"') AS legend FROM tb_views v "
				+ "WHERE DATE_FORMAT(v.createTime, '"+format+"') = '"+dates+"' GROUP BY legend";
		//执行
		SQLQuery sqlQuery = session.createSQLQuery(sql);
		
		//映射
		sqlQuery.addScalar("total", StandardBasicTypes.INTEGER);
		sqlQuery.addScalar("legend", StandardBasicTypes.STRING);
		sqlQuery.setResultTransformer(Transformers.aliasToBean(ChartData.class));
		list = sqlQuery.list();
		//提交事务
		transaction.commit();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ChartData> findView() {
		//数据
		List<ChartData> list = new ArrayList<ChartData>();
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		//开启事务
		Transaction transaction = session.beginTransaction();
		//SQL
		String sql = "SELECT count(1) AS total,DATE_FORMAT(v.createTime, '%Y-%m-%d') "
		+"AS legend FROM tb_views v WHERE DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= DATE(v.createTime) "
		+"GROUP BY legend";
		//执行
		SQLQuery sqlQuery = session.createSQLQuery(sql);
		
		//映射
		sqlQuery.addScalar("total", StandardBasicTypes.INTEGER);
		sqlQuery.addScalar("legend", StandardBasicTypes.STRING);
		sqlQuery.setResultTransformer(Transformers.aliasToBean(ChartData.class));
		list = sqlQuery.list();
		//提交事务
		transaction.commit();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ChartData> findLog(String dates, String format) {
		//数据
		List<ChartData> list = new ArrayList<ChartData>();
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		//开启事务
		Transaction transaction = session.beginTransaction();
		//SQL
		String sql = "SELECT count(1) AS total,"
				+ "DATE_FORMAT(v.createTime, '"+StringTools.getChartFormat(format)+"') AS legend FROM tb_log v "
				+ "WHERE DATE_FORMAT(v.createTime, '"+format+"') = '"+dates+"' GROUP BY legend";
		//执行
		SQLQuery sqlQuery = session.createSQLQuery(sql);
		
		//映射
		sqlQuery.addScalar("total", StandardBasicTypes.INTEGER);
		sqlQuery.addScalar("legend", StandardBasicTypes.STRING);
		sqlQuery.setResultTransformer(Transformers.aliasToBean(ChartData.class));
		list = sqlQuery.list();
		//提交事务
		transaction.commit();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ChartData> findLog() {
		//数据
		List<ChartData> list = new ArrayList<ChartData>();
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		//开启事务
		Transaction transaction = session.beginTransaction();
		//SQL
		String sql = "SELECT count(1) AS total,DATE_FORMAT(v.createTime, '%Y-%m-%d') "
		+"AS legend FROM tb_log v WHERE DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= DATE(v.createTime) "
		+"GROUP BY legend";
		//执行
		SQLQuery sqlQuery = session.createSQLQuery(sql);
		
		//映射
		sqlQuery.addScalar("total", StandardBasicTypes.INTEGER);
		sqlQuery.addScalar("legend", StandardBasicTypes.STRING);
		sqlQuery.setResultTransformer(Transformers.aliasToBean(ChartData.class));
		list = sqlQuery.list();
		//提交事务
		transaction.commit();
		//关闭session
		HibernateSessionFactory.closeSession();
		return list;
	}
}

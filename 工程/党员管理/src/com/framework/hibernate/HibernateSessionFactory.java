package com.framework.hibernate;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.cfg.Configuration;

/**
 * 
 * 描述：hibernate数据连接类
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
@SuppressWarnings("deprecation")
public class HibernateSessionFactory {
	//指定配置文件位置
	private static String CONFIG_FILE_LOCATION = "/hibernate.cfg.xml";
	//定义ThreadLocal
	private static final ThreadLocal<Session> threadLocal = new ThreadLocal<Session>();
	//定义Configuration对象
	private static Configuration configuration = new Configuration();
	//定义SessionFactory对象
	private static org.hibernate.SessionFactory sessionFactory;
	
	private static String configFile = CONFIG_FILE_LOCATION;
	
	//静态代码
	static {
		try {
			//读取配置文件
			configuration.configure(configFile);
			//根据配置文件创建SessionFactory对象
			sessionFactory = configuration.buildSessionFactory();
		} catch (Exception e) {
			System.err.println("%%%% Error Creating SessionFactory %%%%");
			e.printStackTrace();
		}
		
	}
	
	private HibernateSessionFactory() {
	}
	
	public static Session getSession() throws HibernateException {
		//从Threadlocal对象中获得Session对象
		Session session = (Session)threadLocal.get();
		//判断Session是否为空或者未打开
		if (session == null || !session.isOpen()) {
			if ( null == sessionFactory) {
				//没有创建SessionFactory，先创建
				rebuildSessionFactory();
			}
			//创建Session对象
			session = (sessionFactory != null) ? sessionFactory.openSession() : null;
			//在Threadlocal对象中保存Session对象
			threadLocal.set(session);
		}
		return session;
	}
	
	public static void rebuildSessionFactory() {
		try {
			//读取配置文件
			configuration.configure(configFile);
			//根据配置文件创建SessionFactory
			sessionFactory = configuration.buildSessionFactory();
		} catch (Exception e) {
			System.err.println("%%%% Error Creating SessionFactory %%%%");
			e.printStackTrace();
		}
	}
	
	public static void closeSession() throws HibernateException {
		// 获得Session对象
		Session session = (Session)threadLocal.get();
		//当前线程对象Session从Threadlocal中移除
		threadLocal.set(null);
		if (session != null) {
			session.close();
		}
	}
	
	//获得SessionFactory对象
	public static org.hibernate.SessionFactory getSessionFactory() {
		return sessionFactory;
	}
	
	//设置新的配置文件
	public static void setConfigFile(String configFile) {
		HibernateSessionFactory.configFile = configFile;
		sessionFactory = null;
	}
	
	//获得Configuration对象
	public static Configuration getConfiguration() {
		return configuration;
	}
}

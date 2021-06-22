package com.xgdj.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.hibernate.HibernateSessionFactory;
import com.framework.po.Role;
import com.framework.utils.DateUtil;
import com.framework.utils.ExcelUtil;
import com.framework.utils.Md5Util;
import com.google.gson.Gson;
import com.xgdj.daoImpl.ChartDAOImpl;
import com.xgdj.po.ChartPIE;
import com.xgdj.po.Foundation;
import com.xgdj.po.PartyData;
import com.xgdj.po.Process;
import com.xgdj.po.UserState;
import com.xgdj.service.MessageService;

/**
 * 测试
 * @author 谭长华
 * @ClassName Test
 * @date 2017年3月17日
 *
 */
public class Test {

	public static void main(String[] args) {
		f9();
	}
	
	public static void f9() {
		List<ChartPIE> list = ChartDAOImpl.getInstance().findSexPIE();
		Gson gson = new Gson();
		System.out.println(gson.toJson(list));
		for (ChartPIE chartPIE : list) {
			System.out.println(chartPIE.getName()+"--"+chartPIE.getValue());
		}
	}
	
	public static void f8() {
		// 获得session
		Session session = HibernateSessionFactory.getSession();
		// Criteria实例,持久化类的查询
		Criteria crit = session.createCriteria(UserState.class);
		//条件判断
		crit.add(Restrictions.eq("develop", 1));
		//设置聚合运算
		crit.setProjection(Projections.rowCount());
		//查询结果
		int count = ((Number)crit.uniqueResult()).intValue();
		//关闭session
		HibernateSessionFactory.closeSession();
		//返回记录数
		System.out.println(count);
	}
	
	public static void f7() {
		File file = new File("D:/1.xls");
		try {
			//java流
			FileInputStream fileInputStream = new FileInputStream(file);
			// 创建excel工具类
			ExcelUtil<PartyData1> util = new ExcelUtil<PartyData1>(PartyData1.class);
			//读取数据
			List<PartyData1> list = util.importExcel("sheet0", 2, fileInputStream);
			//打印
			System.out.println("----"+list.size());
			List<PartyData> list2 = new ArrayList<PartyData>();
			List<UserState> list3 = new ArrayList<UserState>();
			for (PartyData1 foundation1 : list) {
				PartyData foundation = new PartyData();
				foundation.setNumber(foundation1.getNumber());
				foundation.setCompany(foundation1.getCompany());
				foundation.setName(foundation1.getName());
				foundation.setIdCard(foundation1.getIdCard());
				foundation.setSex(foundation1.getSex());
				foundation.setNation(foundation1.getNation());
				foundation.setBirthday(foundation1.getBirthday());
				foundation.setCulture(foundation1.getCulture());
				foundation.setJob(foundation1.getJob());
				foundation.setPartyDate(foundation1.getPartyDate());
				foundation.setViewDate(foundation1.getViewDate());
				foundation.setPartySchool(foundation1.getPartySchool());
				foundation.setYouth(foundation1.getYouth());
				list2.add(foundation);
				System.out.println(foundation.getNumber()+"----"+foundation.getName());
				
				UserState state = new UserState(foundation1.getNumber());
				state.setApply(0);
				list3.add(state);
			}
			CommonDAOImpl.getInstance().batchSave(list2);
			CommonDAOImpl.getInstance().batchSave(list3);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void f6() {
		File file = new File("D:/jc.xls");
		try {
			//java流
			FileInputStream fileInputStream = new FileInputStream(file);
			// 创建excel工具类
			ExcelUtil<Foundation1> util = new ExcelUtil<Foundation1>(Foundation1.class);
			//读取数据
			List<Foundation1> list = util.importExcel("sheet0", 2, fileInputStream);
			//打印
			System.out.println("----"+list.size());
			List<Foundation> list2 = new ArrayList<Foundation>();
			for (Foundation1 foundation1 : list) {
				Foundation foundation = new Foundation();
				foundation.setNumber(foundation1.getNumber());
				foundation.setRealName(foundation1.getRealName());
				foundation.setBirthday(foundation1.getBirthday());
				foundation.setSex(foundation1.getSex());
				foundation.setIdCard(foundation1.getIdCard());
				foundation.setSource(foundation1.getSource());
				foundation.setNation(foundation1.getNation());
				foundation.setAddress(foundation1.getAddress());
				foundation.setTicket(foundation1.getTicket());
				foundation.setIdentity(foundation1.getIdentity());
				foundation.setAdmission(foundation1.getAdmission());
				foundation.setDormitory(foundation1.getDormitory());
				foundation.setEmail(foundation1.getEmail());
				foundation.setQq(foundation1.getQq());
				foundation.setPhone(foundation1.getPhone());
				foundation.setOperateTime(foundation1.getOperateTime().toString());
				//账号
				foundation.setName(foundation.getNumber());
				//密码默认学号
				foundation.setPass(Md5Util.encode(foundation.getNumber()));
				//查询角色
				Role role = CommonDAOImpl.getInstance().get(Role.class, com.xgdj.utils.Constant.COMMOM_ROLE);
				//设置角色
				foundation.setRole(role);
				list2.add(foundation);
				System.out.println(foundation.getNumber()+"----"+foundation.getRealName());
			}
			CommonDAOImpl.getInstance().batchSave(list2);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	public static void f5() {
		Process process = new Process();
		int i = (int) CommonDAOImpl.getInstance().save(process);
		System.out.println(i);
	}
	
	public static void f4() {
		Integer[] i = {1,2};
		MessageService.getInstance().send("1", "1", "1", i);
	}
	
	public static void f3() {
		MessageService.getInstance().send("1", "1", "1", 1);
	}
	
	public static void f2() {
		Date d1 = DateUtil.getDate("1991-09-29", "yyyy-MM-dd");
		Date d2 = new Date();
		System.out.println(d1);
		System.out.println(d2);
		int i = DateUtil.getMonth(d1, d2);
		System.out.println(i/12);
	}
	
	public static void f1() {
		Foundation user1 = new Foundation();
		user1.setName("123");
		user1.setPass("qweqwe");
		user1.setNumber("1233");
		int i = (int) CommonDAOImpl.getInstance().save(user1);
		System.out.println(i);
	}
}

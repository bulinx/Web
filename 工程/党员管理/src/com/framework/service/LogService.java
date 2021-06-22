package com.framework.service;

import java.util.List;

import com.framework.dao.impl.LogDAOImpl;
import com.framework.po.Log;
import com.framework.po.Views;
import com.framework.utils.APIUtils;
import com.framework.utils.AddressUtils;
import com.framework.utils.Constant;
import com.framework.utils.Page;
import com.framework.utils.PageResult;
import com.framework.utils.PageUtil;
import com.framework.utils.SystemUtil;

import net.sf.json.JSONObject;


/**
 * 
 * @ClassName: LogService 
 * @Description: 日志业务逻辑
 * @author 谭长华
 * @date 2016年8月1日 上午11:03:55 
 *
 */
public class LogService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final LogService instance = new LogService();

	// 静态工厂方法
	public static LogService getInstance() {
		return instance;
	}

	/**
	 * 保存日志
	 * 
	 * @param name
	 *            帐号
	 * @param content
	 *            状态
	 * @param ip
	 *            IP
	 * @return boolean
	 */
	public boolean saveLog(String name, String content, String ip) {
		// 地理位置
		//String address = AddressUtils.getAddressByIp(ip);
		String address = "IP地址解析异常";
		//调用百度api获得地址信息
		JSONObject object = APIUtils.bdLocation(ip);
		//判断
		if (!object.isEmpty()  && object.get("content") != null) {
			//解析
			object = JSONObject.fromObject(object.get("content"));
			//地址
			address = (String) object.get("address");
		}
		//MAC地址
		String macAddress = "";
		try {
			macAddress = SystemUtil.getMACAddress(ip);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// 实例
		Log log = new Log(name, ip, macAddress, address, content);
		// 保存
		int count = (Integer) LogDAOImpl.getInstance().save(log);
		// 判断
		if (count > 0) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 条件查询所有记录
	 * @param currentPage 当前页
	 * @param log 登录日志实例
	 * @param start 开始时间
	 * @param end 结束时间
	 * @return PageResult
	 */
	public PageResult searchLog(int currentPage, Log log, String start, String end) {
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(Constant.EVERY_PAGE);
		// 设置当前页
		page.setCurrentPage(currentPage);
		
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), LogDAOImpl.getInstance().findLogCount(log, start, end), page
				.getCurrentPage());

		// 查询
		List<Log> lists = LogDAOImpl.getInstance().findLogByPage(page, log, start, end);

		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, lists);

		return result;
	}
	
	/**
	 * 保存访问记录
	 * @param ip IP地址
	 * @param type 访问设备（PC,移动）
	 * @param content 备注
	 * @return boolean
	 */
	public boolean saveViews(String ip, String type, String content) {
		// 地理位置
		String address = AddressUtils.getAddressByIp(ip);
		//MAC地址
		String macAddress = "";
		try {
			macAddress = SystemUtil.getMACAddress(ip);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		//实例
		Views views = new Views(ip, macAddress, type, address, content);
		//保存
		int count = (Integer) LogDAOImpl.getInstance().save(views);
		//判断
		if (count > 0) {
			//成功
			return true;
		} else {
			//失败
			return false;
		}
	}
	
	/**
	 * 条件查询所有访问记录
	 * @param currentPage 当前页
	 * @param views 实例
	 * @param start 开始时间
	 * @param end 结束时间
	 * @return PageResult
	 */
	public PageResult searchViews(int currentPage, Views views, String start, String end) {
		Page page = new Page();
		// 每页显示记录
		page.setEveryPage(Constant.EVERY_PAGE);
		// 设置当前页
		page.setCurrentPage(currentPage);
		
		// 创建分页信息
		page = PageUtil.createPage(page.getEveryPage(), LogDAOImpl.getInstance().findViewsCount(views, start, end), page
				.getCurrentPage());

		// 查询
		List<Views> lists = LogDAOImpl.getInstance().findViewsByPage(page, views, start, end);

		// 封装分页信息和记录信息
		PageResult result = new PageResult(page, lists);

		return result;
	}
}

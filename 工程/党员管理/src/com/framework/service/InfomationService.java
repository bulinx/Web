package com.framework.service;

/**
 * 
 * 描述：文档业务处理
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class InfomationService extends CommonService {
	// 饿汉式单例类.在类初始化时，已经自行实例化
	private static final InfomationService instance = new InfomationService();

	// 静态工厂方法
	public static InfomationService getInstance() {
		return instance;
	}
}

package com.framework.utils;

/**
 * 
 * 描述：系统使用常量
 * @author 谭长华
 * @version 创建时间：2016年9月8日 上午10:07:52
 */
public class Constant {
	/**
	 * 导出文件路径
	 */
	public static final String FILE_SEPARATOR = System.getProperties()
			.getProperty("file.separator");
	/**
	 * 分页每页显示数量
	 */
	public static final int EVERY_PAGE = 15;
	/**
	 * 相册分页每页显示数量
	 */
	public static final int ALBUM_EVERY_PAGE = 50;
	/**
	 * 系统登录用户，session
	 */
	public static final String CURRENT_USER = "user";
	/**
	 * 系统网站信息application
	 */
	public static final String WEBSITE = "web";
	/**
	 * 初始密码
	 */
	public static final String INIT_PASS = "123456";
	/**
	 * 用户菜单
	 */
	public static final String MENU_RESULT = "menuResults";
	
	/**
	 * 项目名称
	 */
	public static final String PROJECT_NAME = "/XGDJ";
}

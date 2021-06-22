package com.framework.utils;

/**
 * 分页辅助信息类
 * @author 谭长华
 * 
 * @version 2015-11-29
 *
 */
public class PageUtil {
	/**
	 * 初始化页面
	 * @param everyPage 每页显示数据
	 * @param totalCount 记录总数
	 * @param currentPage 当前页
	 * @return Page
	 */
	public static Page createPage(int everyPage, int totalCount, int currentPage) {
		everyPage = getEveryPage(everyPage);
		currentPage = getCurrentPage(currentPage);
		int totalPage = getTotalPage(everyPage, totalCount);
		int beginIndex = getBeginIndex(everyPage, currentPage);
		boolean hasPrePage = getHasPrePage(currentPage);
		boolean hasNextPage = getHasNextPage(totalPage, currentPage);
		return new Page(everyPage, totalCount, totalPage, currentPage,
				beginIndex, hasPrePage, hasNextPage);
	}

	// 获得每页显示记录
	public static int getEveryPage(int everyPage) {
		return everyPage == 0 ? 10 : everyPage;
	}

	// 获得当前页
	public static int getCurrentPage(int currentPage) {
		return currentPage == 0 ? 1 : currentPage;
	}

	// 获得总页数
	public static int getTotalPage(int everyPage, int totalCount) {
		int totalPage = 0;
		if (totalCount != 0 && totalCount % everyPage == 0) {
			totalPage = totalCount / everyPage;
		} else {
			totalPage = totalCount / everyPage + 1;
		}
		return totalPage;
	}

	// 查询起始位置
	public static int getBeginIndex(int everyPage, int currentPage) {
		return (currentPage - 1) * everyPage;
	}

	// 是否有上一页
	public static boolean getHasPrePage(int currentPage) {
		return currentPage == 1 ? false : true;
	}

	// 是否有下一页
	public static boolean getHasNextPage(int totalPage, int currentPage) {
		return currentPage == totalPage || currentPage == 0 ? false : true;
	}
}
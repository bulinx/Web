package com.framework.utils;

import java.util.List;

/**
 * 分页结果
 * @author 谭长华
 * @version 2015-11-29
 *
 */
public class PageResult {
	private Page page; // 分页信息
	private List<?> list; // 记录信息

	// 构造方法
	public PageResult(Page page, List<?> list) {
		this.page = page;
		this.list = list;
	}
	
	public PageResult() {
	}

	public Page getPage() {
		return page;
	}

	public void setPage(Page page) {
		this.page = page;
	}

	public List<?> getList() {
		return list;
	}

	public void setList(List<?> list) {
		this.list = list;
	}
}

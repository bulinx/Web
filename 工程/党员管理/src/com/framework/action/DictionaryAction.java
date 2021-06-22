package com.framework.action;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.po.Dictionary;
import com.framework.po.DictionaryText;
import com.framework.service.DictionaryService;
import com.framework.service.DictionaryTextService;
import com.framework.service.OperateService;
import com.framework.utils.PageResult;
import com.framework.utils.Result;
import com.google.gson.Gson;


/**
 * @Description: 字典业务逻辑
 * @ClassName:  DictionaryAction.java
 * @author 谭长华
 * @date 2016年11月2日 
 *
 */
@SuppressWarnings("serial")
public class DictionaryAction extends AbstractAction {
	//名称
	private String name;
	//代码
	private String code;
	//当前页
	private int currentPage;
	//state
	private Byte state;
	//实例
	private Dictionary dictionary;
	//实例
	private DictionaryText dictionaryText;
	//ID
	private Integer id;

	/**
	 * 查询字典
	 */
	@Override
	public String execute() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = DictionaryService.getInstance().getListByPage(Dictionary.class, currentPage);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());
		return SUCCESS;
	}
	
	/**
	 * 查询字典值
	 * @return
	 * @throws Exception
	 */
	public String getText() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = DictionaryTextService.getInstance().getListByPage(id, currentPage);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());
		request.setAttribute("dicId", id);
		return "getText";
	}
	
	/**
	 * 查询字典值
	 * @return
	 * @throws Exception
	 */
	public String searchText() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = DictionaryTextService.getInstance().getListByPage(dictionaryText, currentPage);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());
		if (dictionaryText != null && dictionaryText.getDicId() != null) {
			request.setAttribute("dicId", dictionaryText.getDicId());
			request.setAttribute("text", dictionaryText);
		} else {
			request.setAttribute("dicId", id);
			DictionaryText text = new DictionaryText();
			request.setAttribute("text", text);
		}
		return "searchText";
	}
	
	/**
	 * 查询字典
	 * @return
	 * @throws Exception
	 */
	public String searchDic() throws Exception {
		// 查询提交申请名单
		PageResult pageResult = DictionaryService.getInstance().getListByPage(dictionary, currentPage);

		// 页面数据
		request.setAttribute("lists", pageResult.getList());
		request.setAttribute("page", pageResult.getPage());
		//返回参数
		if (dictionary != null) {
			request.setAttribute("text", dictionary);
		} else {
			Dictionary text = new Dictionary();
			request.setAttribute("dictionary", text);
		}
		return "searchDic";
	}
	
	/**
	 * 新增字典
	 * @throws Exception
	 */
	public void addDictionary() throws Exception {
		// 返回结果
		Result result = new Result();
		// gson
		Gson gson = new Gson();
		
		//保存
		result = DictionaryService.getInstance().addDictionary(name, code);
		
		//操作日志
		OperateService.getInstance().saveOperateLog(user.getName(), "新增字典", result.getMsg()+"ID:"+result.getCode());
		//返回
		outPrint(gson.toJson(result));
	}
	
	/**
	 * 新增字典值
	 * @throws Exception
	 */
	public void addText() throws Exception {
		// 返回结果
		Result result = new Result();
		// gson
		Gson gson = new Gson();
		
		//保存
		result = DictionaryTextService.getInstance().save(dictionaryText);
		
		//操作日志
		OperateService.getInstance().saveOperateLog(user.getName(), "新增字典值", result.getMsg()+"ID:"+result.getCode());
		//返回
		outPrint(gson.toJson(result));
	}
	
	/**
	 * 删除字典
	 * @throws Exception
	 */
	public void delDictionary() throws Exception {
		// 返回结果
		Result result = new Result();
		// gson
		Gson gson = new Gson();
		
		//保存
		result = DictionaryService.getInstance().deleteByIds(name);
		
		//操作日志
		OperateService.getInstance().saveOperateLog(user.getName(), "删除字典", result.getMsg()+"ID:"+name);
		//返回
		outPrint(gson.toJson(result));
	}
	
	/**
	 * 删除字典值
	 * @throws Exception
	 */
	public void delText() throws Exception {
		// 返回结果
		Result result = new Result();
		// gson
		Gson gson = new Gson();
		
		//保存
		result = DictionaryTextService.getInstance().deleteByIds(name);
		
		//操作日志
		OperateService.getInstance().saveOperateLog(user.getName(), "删除字典值", result.getMsg()+"ID:"+name);
		//返回
		outPrint(gson.toJson(result));
	}
	
	/**
	 * 修改字典状态
	 * @throws Exception
	 */
	public void updateDictionary() throws Exception {
		// 返回结果
		Result result = new Result();
		// gson
		Gson gson = new Gson();
		
		//保存
		result = DictionaryService.getInstance().updateDictionaryState(name, state);
		
		//操作日志
		OperateService.getInstance().saveOperateLog(user.getName(), "修改字典状态", result.getMsg()+"ID:"+name);
		//返回
		outPrint(gson.toJson(result));
	}
	
	/**
	 * 修改字典值状态
	 * @throws Exception
	 */
	public void updateText() throws Exception {
		// 返回结果
		Result result = new Result();
		// gson
		Gson gson = new Gson();
		
		//保存
		result = DictionaryTextService.getInstance().updateState(name, state);
		
		//操作日志
		OperateService.getInstance().saveOperateLog(user.getName(), "修改字典值状态", result.getMsg()+"ID:"+name);
		//返回
		outPrint(gson.toJson(result));
	}
	
	/**
	 * 修改字典
	 * @throws Exception
	 */
	public void update() throws Exception {
		// 返回结果
		Result result = new Result();
		// gson
		Gson gson = new Gson();
		
		//保存
		result = DictionaryService.getInstance().updateDictionary(dictionary);
		
		//操作日志
		OperateService.getInstance().saveOperateLog(user.getName(), "修改字典", result.getMsg()+"ID:"+dictionary.getId());
		//返回
		outPrint(gson.toJson(result));
	}
	
	/**
	 * 修改字典值
	 * @throws Exception
	 */
	public void updateTxt() throws Exception {
		// 返回结果
		Result result = new Result();
		// gson
		Gson gson = new Gson();
		
		//保存
		result = DictionaryTextService.getInstance().update(dictionaryText);
		
		//操作日志
		OperateService.getInstance().saveOperateLog(user.getName(), "修改字典值", result.getMsg()+"ID:"+dictionaryText.getId());
		//返回
		outPrint(gson.toJson(result));
	}
	
	/**
	 * 查询字典
	 * @throws Exception
	 */
	public void findDictionary() throws Exception {
		// gson
		Gson gson = new Gson();
		
		//查询
		Dictionary dictionary = CommonDAOImpl.getInstance().get(Dictionary.class, Integer.parseInt(name));
	
		//返回
		outPrint(gson.toJson(dictionary));
	}
	
	/**
	 * 查询字典值
	 * @throws Exception
	 */
	public void findText() throws Exception {
		// gson
		Gson gson = new Gson();
		
		//查询
		DictionaryText text = CommonDAOImpl.getInstance().get(DictionaryText.class, id);
	
		//返回
		outPrint(gson.toJson(text));
	}
	
	/**
	 * 获得字典json数据
	 * @throws Exception
	 */
	public void findDictionaryStr() throws Exception {
		String json = DictionaryService.getInstance().findDictionaryStr();
		//返回
		outPrint(json);
	}
	
	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Byte getState() {
		return state;
	}

	public void setState(Byte state) {
		this.state = state;
	}

	public Dictionary getDictionary() {
		return dictionary;
	}

	public void setDictionary(Dictionary dictionary) {
		this.dictionary = dictionary;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public DictionaryText getDictionaryText() {
		return dictionaryText;
	}

	public void setDictionaryText(DictionaryText dictionaryText) {
		this.dictionaryText = dictionaryText;
	}
}

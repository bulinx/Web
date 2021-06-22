package com.framework.action;

import java.util.List;

import com.framework.dao.impl.CommonDAOImpl;
import com.framework.dao.impl.DictionaryDAOImpl;
import com.framework.po.Dictionary;
import com.framework.po.DictionaryText;
import com.google.gson.Gson;


/**
 * @Description: 数据字典值获取专有
 * @ClassName:  DictionarysAction.java
 * @author 谭长华
 * @date 2016年11月3日 
 *
 */
@SuppressWarnings("serial")
public class DictionarysAction extends AbstractAction {
	
	//字典代码
	private String code;
	
	/**
	 * 按字典查询值
	 * @throws Exception
	 */
	public void getDictionary() throws Exception {
		// gson
		Gson gson = new Gson();
		
		//查询字典
		Dictionary dictionary = CommonDAOImpl.getInstance().findUniqueByProperty(Dictionary.class, "code", code);
		//判断
		if (dictionary.getState() == 1) {
			//停用
			dictionary.setId(-1);
		}
		//查询值
		List<DictionaryText> list = DictionaryDAOImpl.getInstance().findAllDictionaryText(dictionary.getId(), (byte) 0);
	
		//返回
		outPrint(gson.toJson(list));
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
}

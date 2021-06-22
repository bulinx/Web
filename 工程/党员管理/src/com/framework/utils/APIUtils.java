package com.framework.utils;

import org.apache.commons.lang3.StringUtils;

import net.sf.json.JSONObject;

/**
 * API接口工具
 * @author 谭长华
 * @ClassName APIUtils
 * @date 2017年3月15日
 *
 */
public class APIUtils {
	
	/**
	 * 百度接口根据IP返回对应大致位置信息
	 * @param ip ip地址 
	 * 当ip为null时，默认当前访问者的IP地址作为定位参数
	 * @return JSONObject
	 * 参考地址：http://lbsyun.baidu.com/index.php?title=webapi/ip-api
	 */
	public static JSONObject bdLocation(String ip) {
		//结果
		JSONObject object = null;
		//处理请求
		try {
			//请求地址
			String url = "https://api.map.baidu.com/location/ip?ak=eUPvcIg96jeTFZZaLop6kE2h8CNtnPcl&coor=bd09ll";
			//判断
			if (StringUtils.isNotBlank(ip)) {
				//指定ip
				url += "&ip="+ip;
			}
			//执行请求
			String result = HttpUtil.sendPost(url, null);
			//结果
			object = JSONObject.fromObject(result);
		} catch (Exception e) {
			object = null;
		}
		//返回结果
		return object;
	}
}

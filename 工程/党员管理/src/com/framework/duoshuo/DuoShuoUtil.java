package com.framework.duoshuo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;


/**
 * @Description: 多说json处理工具类
 * @ClassName:  DuoShuoUtil.java
 * @author 谭长华
 * @date 2016年11月29日 
 *
 */
public class DuoShuoUtil {
	
	/**
	 * 多数请求数据转换
	 * @param json 数据 
	 * @return List<DuoShuo>
	 */
	public static List<DuoShuo> getComment(String json) {
		//结果
		List<DuoShuo> list = new ArrayList<DuoShuo>();
		//json对象
		JSONObject jsonObject = new JSONObject(json);
		//数据结果
		JSONArray results = jsonObject.getJSONArray("response");
		//数据处理
		for (int i = 0; i < results.length(); i++) {
			//json实例
			JSONObject result = results.getJSONObject(i);
			//数据实例
			DuoShuo duoShuo = new DuoShuo();
			//获得操作类型
			//当action为approve,spam,delete,delete-forever之一时，meta为array。数组每一个项为一条评论的id。
			//当action为create时，meta为object。为新创建的评论信息。下面为评论信息参数
			String action = result.getString("action");
			duoShuo.setAction(action);
			//记录id。按时间顺序递增。
			Long log_id = result.getLong("log_id");
			duoShuo.setLog_id(log_id);
			//对评论执行该操作的用户id。
			String user_id = result.getString("user_id");
			duoShuo.setUser_id(user_id);
			//执行该操作的时间戳
			Long date = Long.valueOf(result.getInt("date")+"000");
			Timestamp timestamp = new Timestamp(date);
			duoShuo.setDate(timestamp);
			//判断
			if ("create".equals(action)) {
				//新增，获取新增内容
				makeMeta(duoShuo, result);
			} else {
				//当action为approve,spam,delete,delete-forever之一时，meta为array。数组每一个项为一条评论的id。
				makeMetaArr(duoShuo, result);
			}
			//数据
			list.add(duoShuo);
		}
		//返回
		return list;
	}
	
	/**
	 * 当action为approve,spam,delete,delete-forever之一时，
	 * meta为array。数组每一个项为一条评论的id。
	 * @param duoShuo 实例
	 * @param result 数据
	 * @return DuoShuo
	 */
	private static DuoShuo makeMetaArr(DuoShuo duoShuo, JSONObject result) {
		//json数组
		JSONArray results = result.getJSONArray("meta");
		//数组
		Long[] arr = new Long[results.length()];
		//处理
		for (int i = 0; i < results.length(); i++) {
			arr[i] = Long.valueOf((String) results.get(i));
		}
		//属性
		duoShuo.setPost_Ids(arr);
		//返回
		return duoShuo;
	}
	
	/**
	 * 获得新增评论内容
	 * @param duoShuo 实例
	 * @param result 数据
	 * @return DuoShuo
	 */
	private static DuoShuo makeMeta(DuoShuo duoShuo, JSONObject result) {
		//json对象内容
		JSONObject mate = result.getJSONObject("meta");
		//评论id。请注意，post_id为64位二进制整数，MySQL数据类型建议定义为bigInt。
		duoShuo.setPost_id(mate.getLong("post_id"));
		//文章在多说的id。请注意，thread_id为64位二进制整数，MySQL数据类型建议定义为bigInt。
		duoShuo.setThread_id(mate.getLong("thread_id"));
		//文章在原站点的文章标识。无记录时，为NULL；
		duoShuo.setThread_key(mate.getString("thread_key"));
		//作者在多说的id。0表示匿名用户。
		duoShuo.setAuthor_id(mate.getString("author_id"));
		//作者显示名。有可能为空。
		duoShuo.setAuthor_name(mate.getString("author_name"));
		//作者邮箱。有可能为空字符串。
		duoShuo.setAuthor_email(mate.getString("author_email"));
		//作者网址。有可能为空字符串。
		duoShuo.setAuthor_url(mate.getString("author_url"));
		//作者在网站中对应的id。有可能为0。
		duoShuo.setAuthor_key(mate.getString("author_key"));
		//作者ip地址。格式为*.*.*.*
		duoShuo.setIp(mate.getString("ip"));
		//评论创建日期，格式示例：2012-07-13T21:58:13+08:00。
		duoShuo.setCreated_at(mate.getString("created_at"));
		//评论内容。请注意截取。
		duoShuo.setMessage(mate.getString("message"));
		//评论状态。创建评论时，可能的状态：approved：已经通过；pending：待审核；spam：垃圾评论
		duoShuo.setStatus(mate.getString("status"));
		//整数，MySQL数据类型建议定义为bigInt。
		duoShuo.setParent_id((String) mate.get("parent_id"));
		//类型。现在均为空。
		duoShuo.setType(mate.getString("type"));
		//返回数据
		return duoShuo;
	}
	
	/**
	 * 获取请求记录
	 * @param json 请求返回数据
	 * @return  GetData
	 */
	public static GetData getResponseData(String json) {
		//结果
		GetData getData = new GetData();
		//json对象
		JSONObject jsonObject = new JSONObject(json);
		//参数处理
		getData.setCode((Integer) jsonObject.get("code"));
		//判断
		if (0 == getData.getCode()) {
			//返回成功
			getData.setErrorMessage("请求成功");
		} else {
			//返回失败
			getData.setErrorMessage(jsonObject.getString("errorMessage"));
		}
		//已经同步的最后一个 last_log_id
		JSONArray last = jsonObject.getJSONArray("response");
		//判断是否有数据
		if (last.length() >0) {
			getData.setLast_log_id(Long.parseLong(last.getJSONObject(0).getString("log_id")));
		}
		//返回数据
		return getData;
	}
	
	/**
	 * 多说数据请求地址
	 * @param url 请求url地址
 	 * @return String
	 */
	public static String loadJSON(String url) {
		StringBuilder json = new StringBuilder();
		try {
			URL oracle = new URL(url);
			URLConnection yc = oracle.openConnection();
			BufferedReader in = new BufferedReader(new InputStreamReader(
					yc.getInputStream(), "utf-8"));
			String inputLine = null;
			while ((inputLine = in.readLine()) != null) {
				json.append(inputLine);
			}
			in.close();
		} catch (MalformedURLException e) {
		} catch (IOException e) {
		}
		return json.toString();
	}
}

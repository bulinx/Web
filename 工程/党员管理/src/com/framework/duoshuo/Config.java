package com.framework.duoshuo;


/**
 * @Description: 多数参数配置
 * @ClassName:  Config.java
 * @author 谭长华
 * @date 2016年11月29日 
 *
 */
public class Config {
	/**
	 * 站点注册的多说二级域名。注意：假如为http://apitest.duoshuo.com时，多说二级域名为apitest。
	 */
	public static final String SHORT_NAME = "short_name=wuzhi2016";
	/**
	 * 站点密钥。
	 */
	public static final String SECRET = "&secret=287a1e1a1bba24488afd904f7b906089";
	/**
	 * 排序方式。asc：从旧到新；desc：从新到旧；默认为asc。
	 */
	public static final String ORDER = "&order=desc";
	/**
	 * 多说请求根地址
	 */
	public static final String URL_ROOT = "http://api.duoshuo.com/log/list.json?";
	/**
	 * 同步开始的记录id，默认为0。
	 */
	public static final String SINCE_ID = "&since_id="; 
	/**
	 * 多说请求地址
	 */
	public static final String URL = URL_ROOT + SHORT_NAME + SECRET + ORDER;
}

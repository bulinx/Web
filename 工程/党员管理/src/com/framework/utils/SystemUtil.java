package com.framework.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.NetworkInterface;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;

/**
 * 获取系统信息帮助类
 * 
 * @author 谭长华
 * @version 2015-12-07
 * 
 */
public class SystemUtil {
	/**
	 * 通过HttpServletRequest返回IP地址
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return ip String ip地址
	 * @throws Exception
	 */
	public static String getIpAddress(HttpServletRequest request) {
		String ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_CLIENT_IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}

	/**
	 * 获取MAC地址
	 * 
	 * @return 返回MAC地址
	 * @throws Exception 
	 */
	public static String getMACAddress(String ip) throws Exception {
		return getMACAddress3("127.0.0.1");
	}
	
	/**
	 * 获取request中的真实IP获得
	 * @param request 请求
	 * @return String ip
	 */
	public static String getRealIp(HttpServletRequest request) {
		try {
			String ip = "";
			ip = request.getHeader("X-Forwarded-For");
			if (StringUtils.isNotEmpty(ip) && !"unKnown".equalsIgnoreCase(ip)) {
				// 多次反向代理后会有多个ip值，第一个ip才是真实ip
				int index = ip.indexOf(",");
				if (index != -1) {
					return ip.substring(0, index);
				} else {
					return ip;
				}
			}
			ip = request.getHeader("X-Real-IP");
			if (StringUtils.isNotEmpty(ip) && !"unKnown".equalsIgnoreCase(ip)) {
				int index = ip.indexOf(",");
				if (index != -1) {
					return ip.substring(0, index);
				} else {
					return ip;
				}
			}
			ip = request.getHeader("Proxy-Client-IP");
			if (StringUtils.isNotEmpty(ip) && !"unKnown".equalsIgnoreCase(ip)) {
				int index = ip.indexOf(",");
				if (index != -1) {
					return ip.substring(0, index);
				} else {
					return ip;
				}
			}
			ip = request.getHeader("WL-Proxy-Client-IP");
			if (StringUtils.isNotEmpty(ip) && !"unKnown".equalsIgnoreCase(ip)) {
				int index = ip.indexOf(",");
				if (index != -1) {
					return ip.substring(0, index);
				} else {
					return ip;
				}
			}
			ip = request.getRemoteAddr();
			return ip;
		} catch (Exception e) {
			e.printStackTrace();
			return "";
		}
	}
	
	/** 
	 * 通过IP地址获取MAC地址 
	 * @param ip String,127.0.0.1格式 
	 * @return mac String 
	 * @throws Exception 
	 */  
	public static String getMACAddress3(String ip) throws Exception {  
	    String line = "";  
	    String macAddress = "";  
	    final String MAC_ADDRESS_PREFIX = "MAC Address = ";  
	    final String LOOPBACK_ADDRESS = "127.0.0.1";  
	    //如果为127.0.0.1,则获取本地MAC地址。  
	    if (LOOPBACK_ADDRESS.equals(ip)) {  
	        InetAddress inetAddress = InetAddress.getLocalHost();  
	        //貌似此方法需要JDK1.6。  
	        byte[] mac = NetworkInterface.getByInetAddress(inetAddress).getHardwareAddress();  
	        //下面代码是把mac地址拼装成String  
	        StringBuilder sb = new StringBuilder();  
	        for (int i = 0; i < mac.length; i++) {  
	            if (i != 0) {  
	                sb.append("-");  
	            }  
	            //mac[i] & 0xFF 是为了把byte转化为正整数  
	            String s = Integer.toHexString(mac[i] & 0xFF);  
	            sb.append(s.length() == 1 ? 0 + s : s);  
	        }  
	        //把字符串所有小写字母改为大写成为正规的mac地址并返回  
	        macAddress = sb.toString().trim().toUpperCase();  
	        return macAddress;  
	    }  
	    //获取非本地IP的MAC地址  
	    try {  
	        Process p = Runtime.getRuntime().exec("nbtstat -A " + ip);  
	        InputStreamReader isr = new InputStreamReader(p.getInputStream());  
	        BufferedReader br = new BufferedReader(isr);  
	        while ((line = br.readLine()) != null) {  
	            if (line != null) {  
	                int index = line.indexOf(MAC_ADDRESS_PREFIX);  
	                if (index != -1) {  
	                    macAddress = line.substring(index + MAC_ADDRESS_PREFIX.length()).trim().toUpperCase();  
	                }  
	            }  
	        }  
	        br.close();  
	    } catch (IOException e) {  
	        e.printStackTrace(System.out);  
	    }  
	    return macAddress;  
	}
}

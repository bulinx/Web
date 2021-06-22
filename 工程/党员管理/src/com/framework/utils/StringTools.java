package com.framework.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

/**
 * 字符串相关处理
 * 
 * @author 谭长华
 * @version 2015-12-03
 * 
 */
public class StringTools {
	/**
	 * 字符数组转换为Integer数组
	 * 
	 * @param str
	 *            待转换字符数组
	 * @return Integer[]
	 */
	public static Integer[] stringsToIntegers(String[] str) {
		Integer[] integers = new Integer[str.length];
		for (int i = 0; i < str.length; ++i) {
			integers[i] = Integer.parseInt(str[i]);
		}
		return integers;
	}
	
	/**
	 * List转换为数组
	 * @param list 待转换数据
	 * @return Integer[]
	 */
	public static Integer[] listToIntegers(List<?> list) {
		Integer[] integers = new Integer[list.size()];
		for (int i = 0; i < list.size(); ++i) {
			integers[i] = Integer.parseInt(list.get(i)+"");
		}
		return integers;
	}

	/**
	 * 获得集合数据
	 * 
	 * @param str
	 *            字符串
	 * @param succ
	 *            List<String>
	 * @return List<String>
	 */
	public static List<String> stringToList(String str, List<String> succ) {
		// 转换
		String[] str1 = str.split(",");
		// 结果
		List<String> list = Arrays.asList(str1);
		// 转换为ArrayList
		List<String> alist = new ArrayList<String>(list);
		List<String> alist1 = new ArrayList<String>(succ);
		// 去成功
		alist.removeAll(alist1);

		return alist;
	}

	/**
	 * @Description:把list转换为一个用逗号分隔的字符串
	 */
	public static String listToString(List<?> list) {
		StringBuilder sb = new StringBuilder();
		if (list != null && list.size() > 0) {
			for (int i = 0; i < list.size(); i++) {
				if (i < list.size() - 1) {
					sb.append(list.get(i) + ",");
				} else {
					sb.append(list.get(i));
				}
			}
		}
		return sb.toString();
	}

	/**
	 * 获取字符串的后n位
	 * 
	 * @param str
	 *            字符串
	 * @param n
	 *            截取位数
	 * @return String
	 */
	public static String getLastString(String str, int n) {
		return str.substring(str.length() - n, str.length());
	}

	/**
	 * 返回长度为【strLength】的随机数
	 * @param pwd_len 长度
	 * @return String
	 */
	public static String genRandomNum(int pwd_len) {
		// 35是因为数组是从0开始的，26个字母+10个数字
		final int maxNum = 36;
		int i; // 生成的随机数
		int count = 0; // 生成的密码的长度
		char[] str = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };
		StringBuffer pwd = new StringBuffer("");
		Random r = new Random();
		while (count < pwd_len) {
			// 生成随机数，取绝对值，防止生成负数，

			i = Math.abs(r.nextInt(maxNum)); // 生成的数最大为36-1

			if (i >= 0 && i < str.length) {
				pwd.append(str[i]);
				count++;
			}
		}
		return pwd.toString();
	}
	
	/**
	 * Integer[]数据去重
	 * @param arr 数据
	 * @return List<Integer>
	 */
	public static List<Integer> getUniqurArray(Integer[] arr) {
		List<Integer> temp = new ArrayList<Integer>();
		//处理
		for (Integer id : arr) {
			if (!temp.contains(id)) {
				temp.add(id);
			}
		}
		//返回
		return temp;
	}
	
	/**
	 * 获得图标查询分类
	 * @param format  %Y-%m-%d
	 * @return String
	 */
	public static String getChartFormat(String format) {
		if ("%Y-%m".equals(format)) {
			return "%Y-%m-%d";
		} else if ("%Y".equals(format)) {
			return "%Y-%m";
		} else {
			return "%Y-%m-%d";
		}
	}
	
	/**
	 * 处理图表查询格式
	 * @param format Y-m-d
	 * @return %Y-%m-%d
	 */
	public static String makeFormat(String format) {
		//日期格式
		String[] sf = format.split("-");
		//处理
		for (int i = 0; i < sf.length; ++i) {
			sf[i] = "%" + sf[i];
		}
		//字符串
		String s = StringUtils.join(sf, "-");
		return s;
	}
	
	/**
	 * 验证字符数组中是否有重复值
	 * @param array 数组
	 * @return boolean
	 * false 有重复
	 * true 不重复
	 */
	public static boolean checkStrArrRepeat(String[] array){
		Set<String> set = new HashSet<String>();
		for(String str : array){
			set.add(str);
		}
		//验证重复
		if(set.size() != array.length){
			return false;//有重复
		} else {
			return true;//不重复
		}
	}
}


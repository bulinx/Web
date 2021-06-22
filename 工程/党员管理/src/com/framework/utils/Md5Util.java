package com.framework.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.security.MessageDigest;

/**
 * 密码加密MD5
 * @author 谭长华
 * @version 2015-11-29
 *
 */
public final class Md5Util {
	// 全局数组
	private static final char hexDigits[] = { '0', '1', '2', '3', '4', '5',
			'6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };

	/**
	 * 文件加密
	 * 
	 * @param file
	 *            加密文件
	 * @return 加密后文件
	 */
	public static String encode(File file) {
		FileInputStream in = null;
		MessageDigest md5 = null;
		try {
			in = new FileInputStream(file);
			FileChannel ch = in.getChannel();
			MappedByteBuffer byteBuffer = ch.map(FileChannel.MapMode.READ_ONLY,
					0, file.length());
			md5 = MessageDigest.getInstance("MD5");
			md5.update(byteBuffer);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				in.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return toHex(md5.digest());
	}

	/**
	 * 字符串进行加密
	 * 
	 * @param arg
	 *            加密字符串
	 * @return 加密后字符串(32字符)
	 */
	public static String encode(String arg) {
		if (arg == null) {
			arg = "";
		}
		MessageDigest md5 = null;
		try {
			md5 = MessageDigest.getInstance("MD5");
			md5.update(arg.getBytes("UTF-8"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return toHex(md5.digest());
	}

	private static String toHex(byte[] bytes) {
		StringBuffer str = new StringBuffer(32);
		for (byte b : bytes) {
			str.append(hexDigits[(b & 0xf0) >> 4]);
			str.append(hexDigits[(b & 0x0f)]);
		}
		return str.toString();
	}
}
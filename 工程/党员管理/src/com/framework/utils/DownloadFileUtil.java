package com.framework.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletResponse;

/**
 * web文件下载，打包下载
 * 
 * @author 谭长华
 * @version 2016-05-02
 * 
 */
public class DownloadFileUtil {
	public static final String FILE_SEPARATOR = System.getProperties()
			.getProperty("file.separator");

	/**
	 * web单个下载文件
	 * 
	 * @param path
	 *            文件路径
	 * @param response
	 *            HttpServletResponse
	 */
	public void download(String path, HttpServletResponse response) {
		try {
			// path是指欲下载的文件的路径。
			File file = new File(path);
			//文件存在
			if (!file.exists()) {
				return;
			}
			// 取得文件名。
			String filename = file.getName();
			// 以流的形式下载文件。
			InputStream fis = new BufferedInputStream(new FileInputStream(path));
			byte[] buffer = new byte[fis.available()];
			fis.read(buffer);
			fis.close();
			// 清空response
			response.reset();
			// 设置response的Header
			response.addHeader("Content-Disposition", "attachment;filename="
					+ new String(filename.getBytes()));
			response.addHeader("Content-Length", "" + file.length());
			OutputStream toClient = new BufferedOutputStream(
					response.getOutputStream());
			response.setContentType("application/form-data;charset=utf-8");
			toClient.write(buffer);
			toClient.flush();
			toClient.close();
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}

	/**
	 * web单个下载文件
	 * 
	 * @param file
	 *            需要下载的文件
	 * @param response
	 *            HttpServletResponse
	 */
	public void download(File file, HttpServletResponse response) {
		try {
			//文件存在
			if (!file.exists()) {
				return;
			}
			// 取得文件名。
			String filename = file.getName();
			// 以流的形式下载文件。
			InputStream fis = new BufferedInputStream(new FileInputStream(file));
			byte[] buffer = new byte[fis.available()];
			fis.read(buffer);
			fis.close();
			// 清空response
			response.reset();
			// 设置response的Header
			response.addHeader("Content-Disposition", "attachment;filename="
					+ new String(filename.getBytes()));
			response.addHeader("Content-Length", "" + file.length());
			OutputStream toClient = new BufferedOutputStream(
					response.getOutputStream());
			response.setContentType("application/form-data;charset=utf-8");
			toClient.write(buffer);
			toClient.flush();
			toClient.close();
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}

	/**
	 * 打包下载文件，不支持中文文件名
	 * @param response 响应
	 * @param files 文件数组
	 * @throws IOException
	 */
	public void zipDownload(HttpServletResponse response, File[] files) throws IOException {
		//in BatchDownload
		response.setContentType("APPLICATION/OCTET-STREAM");
		//下载文件名称
		response.setHeader("Content-Disposition","attachment; filename="+System.currentTimeMillis()+".zip");
		//流
		ZipOutputStream zos = new ZipOutputStream(response.getOutputStream());
		//文件打包
		zipFile(files, zos);
		//关闭流
		zos.flush();     
	    zos.close(); 
	}
	
	/**
	 * 文件打包为zip格式
	 * @param subs 文件数组
	 * @param zos 流
	 * @throws IOException
	 */
	public void zipFile(File[] subs, ZipOutputStream zos)
			throws IOException {
		//打包文件
		for (int i = 0; i < subs.length; i++) {
			File f = subs[i];
			if (f.exists()) {
				zos.putNextEntry(new ZipEntry(f.getName()));
				FileInputStream fis = new FileInputStream(f);
				byte[] buffer = new byte[1024];
				int r = 0;
				while ((r = fis.read(buffer)) != -1) {
					zos.write(buffer, 0, r);
				}
				fis.close();
			}
		}
	}
}

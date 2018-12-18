
import * as vscode from 'vscode';
/**
 * @param {string} workspace 当前的工作目录
 * @param {string} filePath 相对路径+文件全名
 * @param {string} fullPath workspace+filePath
 * @param {string} path 当前打开的文件所在的目录
 * @param {string} file 当前打开的文件
 */
interface Output{
	workspace: string;
	filePath: string;
	fullPath: string;
	path: string;
	file: string;
}
/**
 *
 * @return {Output}
 {"workspace":"/home/glenn/Documents/Glenn/git/test","filePath":"","fullPath":"","path":"","file":""}
 {
	 "workspace":"/home/glenn/Documents/Glenn/git/test",
	 "filePath":"/src/index.js",
	 "fullPath":"/home/glenn/Documents/Glenn/git/test/src/index.js",
	 "path":"/home/glenn/Documents/Glenn/git/test/src",
	 "file":"index.js"
 }
 */
export default function (): Output {
	let workspaceFolders: any[] = vscode.workspace.workspaceFolders || [],
		workspace: string = '',
		filePath: string = '',
		fullPath: string = '',
		path: string = '',
		file: string = '';
	if (workspaceFolders[0]) {
		workspace = workspaceFolders[0].uri.toString();
		if (vscode.window.activeTextEditor) {
			filePath = vscode.window.activeTextEditor.document.uri.toString();
			filePath = filePath.replace(workspace, '');
		}
	}
	if (vscode.window.activeTextEditor) {
		let origin = vscode.window.activeTextEditor.document.uri;
		fullPath = String(origin).split('//').pop() || '';
		path = fullPath.slice(0, fullPath.lastIndexOf('/'));
		file = fullPath.split('/').reverse()[0];
	}
	workspace = workspace.split('//').pop() || '';
	return {
		workspace,
		filePath,
		fullPath,
		path,
		file
	};
}

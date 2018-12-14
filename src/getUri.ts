
import * as vscode from 'vscode';

interface Output{
	workspace: string;
	filePath: string;
	fullPath: string;
	path: string;
	file: string;
}
/**
 *
 * @param terminal
 * @param outputChannel
 * @returns {json}
 * {
		workspace:"/root/data",
		filePath:"/src/test.js",
		fullPath:"/root/data/src/test.js",
		path:"/root/data/src",
		file:"test.js"
 * }
 */
export default function (): Output {
	let workspaceFolders: any[] = vscode.workspace.workspaceFolders;
	let workspace: string = '';
	let filePath: string = '';
	if (workspaceFolders[0]) {
		workspace = workspaceFolders[0].uri.toString();
		filePath = vscode.window.activeTextEditor.document.uri.toString();
		filePath = filePath.replace(workspace, '');
	}
	let origin = vscode.window.activeTextEditor.document.uri;
	let fullPath = String(origin).split('//').pop();
	let path = fullPath.slice(0, fullPath.lastIndexOf('/'));
	let file = fullPath.split('/').reverse()[0];
	return {
		workspace,
		filePath,
		fullPath,
		path,
		file
	};
}

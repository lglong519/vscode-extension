
import * as vscode from 'vscode';
import getUri from './getUri';

export default function (terminal: vscode.Terminal, outputChannel: vscode.OutputChannel): void {
	let { filePath, workspace } = getUri();
	if (filePath) {
		let exec = `file=.${filePath} gulp sync`;
		outputChannel.append(`folder: ${workspace}\n`);
		outputChannel.append(`file: ${filePath}\n`);
		outputChannel.append(`exec: ${exec}\n`);
		terminal.sendText(exec);
	}
}

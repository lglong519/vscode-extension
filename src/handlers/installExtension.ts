
import * as vscode from 'vscode';
import getUri from '../libs/getUri';
import * as fs from 'fs';

export default function (terminal: vscode.Terminal, outputChannel: vscode.OutputChannel, selected: string): void {
	const { workspace } = getUri();
	try {
		const vsix = fs.readdirSync(workspace).filter(item => item.endsWith('.vsix'));
		outputChannel.append(`vsix: ${JSON.stringify(vsix)}\n`);
		vsix.length && terminal.sendText(`${selected} ${vsix[vsix.length - 1]}`);
	} catch (e) {
		outputChannel.append(`Install vsix error: ${String(e)}\n`);
		outputChannel.show();
	}
}

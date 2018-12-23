
import * as vscode from 'vscode';
import getUri from '../libs/getUri';
import * as fs from 'fs';
import getTerminal from '../libs/getActiveTerminal';

export default function (terminal: vscode.Terminal, outputChannel: vscode.OutputChannel): void {
	const { workspace } = getUri();
	const actvieTerminal: vscode.Terminal = getTerminal(terminal);
	try {
		const vsix = fs.readdirSync(workspace).filter(item => item.endsWith('.vsix'));
		outputChannel.append(`vsix: ${JSON.stringify(vsix)}\n`);
		if (vsix.length) {
			actvieTerminal.sendText(`code --install-extension ${vsix[vsix.length - 1]}`);
		} else {
			outputChannel.show();
		}
	} catch (e) {
		outputChannel.append(`Install vsix error: ${String(e)}\n`);
		outputChannel.show();
	}
}

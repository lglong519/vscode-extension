
import * as vscode from 'vscode';
import getUri from '../libs/getUri';
import * as fs from 'fs';

export default function (terminal: vscode.Terminal, outputChannel: vscode.OutputChannel, selected: string): void {
	let { workspace } = getUri();
	let vsix = fs.readdirSync(workspace).filter(item => item.endsWith('.vsix'));
	outputChannel.append(`vsix: ${JSON.stringify(vsix)}\n`);
	vsix.length && terminal.sendText(`${selected} ${vsix[vsix.length - 1]}`);
}

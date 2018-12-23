
import * as vscode from 'vscode';
import getTerminal from '../libs/getActiveTerminal';
import libsGenerator from '../models';

export default function (terminal: vscode.Terminal, outputChannel: vscode.OutputChannel) {
	vscode.window.showQuickPick(libsGenerator().directives).then(selected => {
		const actvieTerminal: vscode.Terminal = getTerminal(terminal);
		if (selected) {
			actvieTerminal.show();
			outputChannel.append(`Item '${selected}' has been selected!\n`);
			actvieTerminal.sendText(selected);
		}
	});
}

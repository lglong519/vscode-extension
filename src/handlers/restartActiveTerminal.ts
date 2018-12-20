
import * as vscode from 'vscode';
import getTerminal from '../libs/getActiveTerminal';

export default function (terminal: vscode.Terminal, terminalStatus: any) {
	return () => {
		terminal = getTerminal(terminal);
		if (terminal.name == 'terminal-tools') {
			terminalStatus.dispose = true;
		} else {
			terminal.dispose();
			vscode.window.createTerminal().show();
		}
	};
}

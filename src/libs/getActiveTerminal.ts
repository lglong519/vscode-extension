
import { window, Terminal } from 'vscode';

export default function (terminal: Terminal): Terminal {
	if (window.activeTerminal && window.activeTerminal.name != 'terminal-tools') {
		terminal = window.activeTerminal;
	}
	terminal.show();
	return terminal;
}

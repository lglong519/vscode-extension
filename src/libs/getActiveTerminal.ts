
import { window, Terminal } from 'vscode';

export default function (terminal: Terminal): Terminal {
	if (window.activeTerminal) {
		window.activeTerminal.show();
		return window.activeTerminal;
	}
	terminal.show();
	return terminal;
}

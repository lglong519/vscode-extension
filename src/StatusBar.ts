import * as vscode from 'vscode';

export default class StatusBar {

	statusBarItems: vscode.StatusBarItem[];
	constructor (statusBarItems: vscode.StatusBarItem[]) {
		this.statusBarItems = statusBarItems;
	}
	addItem (text: string, cmd?: string, tip?: string, col?: string) {
		this.statusBarItems.push(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right)); // Left Right
		this.statusBarItems[this.statusBarItems.length - 1].text = text;
		if (cmd) this.statusBarItems[this.statusBarItems.length - 1].command = cmd;
		if (tip) this.statusBarItems[this.statusBarItems.length - 1].tooltip = tip;
		if (col) this.statusBarItems[this.statusBarItems.length - 1].color = col;
		this.statusBarItems[this.statusBarItems.length - 1].show();
	}

}

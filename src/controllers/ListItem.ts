/* eslint no-unused-var:1 */
import * as vscode from 'vscode';
export default class ListItem extends vscode.TreeItem {

	constructor (
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public contextValue: string = 'terminalTools',
		public command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

}

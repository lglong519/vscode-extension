import * as vscode from 'vscode';
import ListItem from './ListItem';
import libsGenerator from '../models';
import tools from '../models/tools';

let libs = libsGenerator();

export default class DepNodeProvider implements vscode.TreeDataProvider<ListItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<ListItem | undefined> = new vscode.EventEmitter<ListItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<ListItem | undefined> = this._onDidChangeTreeData.event;

	constructor () {}

	public refresh (): void {
		libs = libsGenerator();
		this._onDidChangeTreeData.fire();
	}

	public getTreeItem (element: ListItem): vscode.TreeItem {
		return element;
	}

	public getChildren (element?: ListItem): Thenable<ListItem[]> {
		if (element) {
			if (element.label == 'tools') {
				return Promise.resolve(this.fetchItems(libs[element.label], 0, 1, element.label));
			}
			return Promise.resolve(this.fetchItems(libs[element.label], 0, 0, element.label));
		}
		return Promise.resolve(this.fetchItems(libs.rootItems));
	}

	private fetchItems (
		items: string[],
		collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed,
		cmd?: number,
		contextValue?: string
	): ListItem[] {
		if (!items) {
			return [];
		}
		return items.map(item => {
			if (cmd) {
				let command: any = {
					title: item,
					command: `terminal-tools.${tools[item]}`
				};
				return new ListItem(item, collapsibleState, contextValue, <vscode.Command>command);
			}
			return new ListItem(item, collapsibleState, contextValue);
		});
	}

}

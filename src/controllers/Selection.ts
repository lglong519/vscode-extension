import { Terminal, workspace } from 'vscode';
import getTerminal from '../libs/getActiveTerminal';
import ListItem from './ListItem';
import { isArray } from 'util';

/**
 * @classdesc treeView item handlers
 */
export default class Selection {

	constructor (private terminal: Terminal) { }

	/**
	 * @desc install selected dependance
	 */
	install (item: ListItem, location: string = '', remove: string = ''): void {
		const terminal = getTerminal(this.terminal);
		const config: any = workspace.getConfiguration('terminal-tools').get('options');
		const sudo = config.sudo ? 'sudo ' : '';
		let options = '';
		if (!remove && isArray(config.installOptions) && config.installOptions.length) {
			config.installOptions.forEach((item: string) => {
				options += ` ${item}`;
			});
		}
		if (!item) {
			return;
		}
		return terminal.sendText(`${sudo}${config.install} ${remove}install ${location} ${item && item.label}${options}`);

	}

}

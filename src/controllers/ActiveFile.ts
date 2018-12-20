import { Terminal, OutputChannel, window, StatusBarItem } from 'vscode';
import getUri from '../libs/getUri';
import getTerminal from '../libs/getActiveTerminal';

interface Options{
	terminal: Terminal;
	outputChannel: OutputChannel;
	statusBarItems?: StatusBarItem[];
}
/**
 * @classdesc 当前文件的处理
 */
export default class ActiveFile {

	terminal: Terminal;
	outputChannel: OutputChannel;
	lockFile: string = '';;
	statusBarItems: StatusBarItem[];
	constructor (options: Options) {
		this.terminal = options.terminal;
		this.outputChannel = options.outputChannel;
		this.statusBarItems = options.statusBarItems || [];
	}
	/**
	 * @desc 切换当前文件的锁定
	 */
	lock (): void {
		let color = 'blue',
			tooltip = 'Unlock';
		if (this.lockFile) {
			this.lockFile = '';
		} else {
			color = 'cyan';
			let { file, fullPath } = getUri();
			this.lockFile = fullPath;
			tooltip = `Lock: ${file}`;
		}
		this.statusBarItems[this.statusBarItems.length - 1].color = color;
		this.statusBarItems[this.statusBarItems.length - 1].tooltip = tooltip;
	}
	/**
	 * @desc 运行当前 js/ts 文件
	 */
	run (): void {
		const terminal = getTerminal(this.terminal);
		let filePath = getUri().fullPath;
		if (this.lockFile) {
			filePath = this.lockFile;
		}
		// execute cmd
		if (filePath.endsWith('.js')) {
			return terminal.sendText(`node ${filePath}`);
		}
		if (filePath.endsWith('.ts')) {
			return terminal.sendText(`ts-node ${filePath}`);
		}
		window.setStatusBarMessage('Not a JS/TS file.', 3000);
		this.outputChannel.append(`Not a JS/TS file: ${filePath}\n`);
		this.outputChannel.show();
	}
	/**
	 * @desc 同步当前文件到服务器
	 */
	sync (): void {
		const terminal = getTerminal(this.terminal);
		const { filePath, workspace } = getUri();
		if (filePath) {
			const exec = `file=.${filePath} gulp sync`;
			this.outputChannel.append(`folder: ${workspace}\n`);
			this.outputChannel.append(`file: ${filePath}\n`);
			this.outputChannel.append(`exec: ${exec}\n`);
			terminal.sendText(exec);
		}
	}
	/**
	 * @desc 切换到当前文件所在的目录
	 */
	cd (): void {
		const terminal = getTerminal(this.terminal);
		const { path } = getUri();
		path && terminal.sendText(`cd ${path}`);
	}

}

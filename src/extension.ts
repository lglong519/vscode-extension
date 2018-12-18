import * as vscode from 'vscode';
import selectItem from './selectItem';
import getUri from './getUri';
import StatusBar from './StatusBar';

const statusBarItems: vscode.StatusBarItem[] = [];
let lockFile: string = '';
let statusBar = new StatusBar(statusBarItems);

let terminal: vscode.Terminal = vscode.window.createTerminal({ name: 'lglong519' });
terminal.show();
let outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel('lglong519');

/**
 * @description 当 dispose==false 时会监听到 terminal 已关闭，需重新创建并启动。
 * 当关闭 terminal 时会手动设置 dispose 为 false ，并触发以上条件
 */
const terminalStatus: {dispose: boolean} = new Proxy({
	dispose: false
}, {
	set (target: {dispose: boolean}, prop: string, receiver: boolean): boolean {
		if (prop == 'dispose') {
			if (receiver) {
				terminal.dispose();
			} else {
				terminal = vscode.window.createTerminal({ name: 'lglong519' });
				terminal.show();
			}
		}
		return true;
	}
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate (context: vscode.ExtensionContext) {

	statusBar.addItem('|');
	statusBar.addItem('Stop', 'extension.stop', 'Stop current task', 'cyan');
	statusBar.addItem('|');
	statusBar.addItem('Run', 'extension.run', 'Run acitive js|ts file', 'red');
	statusBar.addItem('|');
	statusBar.addItem('Rerun', 'extension.rerun', 'Run current file again');
	statusBar.addItem('|');
	statusBar.addItem('Clear', 'extension.clear', 'clearTerminal', 'yellow');
	statusBar.addItem('npm', 'extension.npm', 'NPM Install', 'purple');
	statusBar.addItem('CD', 'extension.CD', 'CD to current path', '#BAF3BE');
	statusBar.addItem('$(lock)', 'extension.lock', 'Unlock', 'blue');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let stop = vscode.commands.registerCommand('extension.stop', reStartTerminal);
	context.subscriptions.push(stop);
	let runFileInTerminal = vscode.commands.registerCommand('extension.run', runFile);
	context.subscriptions.push(runFileInTerminal);
	let reRunFileInTerminal = vscode.commands.registerCommand('extension.rerun', () => {
		reStartTerminal();
		setTimeout(runFile, 100);
	});
	context.subscriptions.push(reRunFileInTerminal);
	let clearTerminal = vscode.commands.registerCommand('extension.clear', () => {
		vscode.commands.executeCommand('workbench.action.terminal.clear');// Terminal:Clear
	});
	context.subscriptions.push(clearTerminal);

	let npmInstall = vscode.commands.registerCommand('extension.npm', () => selectItem(terminal, outputChannel));
	context.subscriptions.push(npmInstall);

	let lockFileBtn = vscode.commands.registerCommand('extension.lock', lockFileHandle);
	context.subscriptions.push(lockFileBtn);
	let CDTo = vscode.commands.registerCommand('extension.CD', () => {
		terminal.sendText(`cd ${getUri().path}`);
	});
	context.subscriptions.push(CDTo);
}

// this method is called when your extension is deactivated
export function deactivate () {
	//
}

function runFile () {
	terminal.show();
	let filePath = getUri().fullPath;
	if (lockFile) {
		filePath = lockFile;
	}
	// execute cmd
	if (filePath.endsWith('.js')) {
		return terminal.sendText(`node ${filePath}`);
	}
	if (filePath.endsWith('.ts')) {
		return terminal.sendText(`ts-node ${filePath}`);
	}
	vscode.window.setStatusBarMessage('Not a JS|TS file.', 3000);
	outputChannel.append(`Not a JS|TS file: ${filePath}\n`);
	outputChannel.show();
}
function reStartTerminal () {
	terminalStatus.dispose = true;
}

function lockFileHandle () {
	let color,
		tooltip;
	if (lockFile) {
		lockFile = '';
		color = 'blue';
		tooltip = 'Unlock';
	} else {
		color = 'cyan';
		lockFile = getUri().file;
		tooltip = `Lock: ${lockFile}`;
	}
	statusBarItems[statusBarItems.length - 1].color = color;
	statusBarItems[statusBarItems.length - 1].tooltip = tooltip;
}
/**
 * @description 防止命令面板被意外关闭
 */
vscode.window.onDidCloseTerminal((e: vscode.Terminal) => {
	if (e.name == 'lglong519') {
		terminalStatus.dispose = false;
	}
});

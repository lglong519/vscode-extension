import * as vscode from 'vscode';
import selectItem from './handlers/selectItem';
import StatusBar from './controllers/StatusBar';
import ActiveFile from './controllers/ActiveFile';
import restartActiveTerminal from './handlers/restartActiveTerminal';

const statusBarItems: vscode.StatusBarItem[] = [];
const statusBar = new StatusBar(statusBarItems);
const outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel('terminal-tools');
let terminal: vscode.Terminal = vscode.window.createTerminal({ name: 'terminal-tools' });

const activeFile = new ActiveFile({
	terminal,
	outputChannel,
	statusBarItems,
});

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
				terminal = vscode.window.createTerminal({ name: 'terminal-tools' });
				activeFile.terminal = terminal;
				terminal.show();
			}
		}
		return true;
	}
});

/**
 * @description 防止命令面板被意外关闭
 */
vscode.window.onDidCloseTerminal((e: vscode.Terminal) => {
	if (e.name == 'terminal-tools') {
		terminalStatus.dispose = false;
	}
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate (context: vscode.ExtensionContext) {
	terminal.show();
	statusBar.addItem('|');
	statusBar.addItem('Stop', 'terminal-tools.stop', 'Stop current task', 'cyan');
	statusBar.addItem('|');
	statusBar.addItem('Run', 'terminal-tools.run', 'Run acitive js/ts file', 'red');
	statusBar.addItem('|');
	statusBar.addItem('Rerun', 'terminal-tools.rerun', 'Run acitive file again');
	statusBar.addItem('|');
	statusBar.addItem('Clear', 'terminal-tools.clear', 'clearTerminal', 'yellow');
	statusBar.addItem('npm', 'terminal-tools.npm', 'NPM Install', 'purple');
	statusBar.addItem('CD', 'terminal-tools.cd', 'CD to current path', '#BAF3BE');
	statusBar.addItem('$(lock)', 'terminal-tools.lock', 'Unlock', 'blue');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	context.subscriptions.push(vscode.commands.registerCommand('terminal-tools.stop', restartActiveTerminal(activeFile.terminal, terminalStatus)));

	context.subscriptions.push(vscode.commands.registerCommand('terminal-tools.run', activeFile.run.bind(activeFile)));

	context.subscriptions.push(vscode.commands.registerCommand('terminal-tools.rerun', () => {
		restartActiveTerminal(activeFile.terminal, terminalStatus)();
		setTimeout(activeFile.run.bind(activeFile), 300);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('terminal-tools.clear', () => {
		vscode.commands.executeCommand('workbench.action.terminal.clear');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('terminal-tools.npm', () => selectItem(terminal, outputChannel)));

	context.subscriptions.push(vscode.commands.registerCommand('terminal-tools.lock', activeFile.lock.bind(activeFile)));

	context.subscriptions.push(vscode.commands.registerCommand('terminal-tools.cd', activeFile.cd.bind(activeFile)));
}

// this method is called when your extension is deactivated
export function deactivate () {
	//
}

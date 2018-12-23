import * as vscode from 'vscode';
import selectItem from './handlers/selectItem';
import StatusBar from './controllers/StatusBar';
import ActiveFile from './controllers/ActiveFile';
import restartActiveTerminal from './handlers/restartActiveTerminal';
import Provider from './controllers/Provider';
import Selection from './controllers/Selection';
import installExtension from './handlers/installExtension';
import killPort from './handlers/killPort';
import debounce from './libs/debounce';

const { commands, workspace } = vscode;
const statusBarItems: vscode.StatusBarItem[] = [];
const statusBar = new StatusBar(statusBarItems);
const outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel('terminal-tools');
let terminal: vscode.Terminal = vscode.window.createTerminal({ name: 'terminal-tools' });

const activeFile = new ActiveFile({
	terminal,
	outputChannel,
	statusBarItems,
});

const selection = new Selection(activeFile.terminal);

/**
 * @description 当 dispose==false 时会监听到 terminal 已关闭，需重新创建并启动。
 * 当关闭 terminal 时会手动设置 dispose 为 false ，并触发以上条件
 */
const terminalStatus: { dispose: boolean } = new Proxy({
	dispose: false
}, {
	set (target: { dispose: boolean }, prop: string, receiver: boolean): boolean {
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
	// 底部按钮组
	statusBar.addItem('|');
	statusBar.addItem('Stop', 'terminal-tools.stop', 'Stop current task', 'cyan');
	statusBar.addItem('|');
	statusBar.addItem('Run', 'terminal-tools.run', 'Run acitive js/ts file', 'red');
	statusBar.addItem('|');
	statusBar.addItem('Rerun', 'terminal-tools.rerun', 'Run acitive file again');
	statusBar.addItem('|');
	statusBar.addItem('Clear', 'terminal-tools.clear', 'ClearTerminal', 'yellow');
	statusBar.addItem('cmd', 'terminal-tools.cmd', 'Select directives', 'purple');
	statusBar.addItem('CD', 'terminal-tools.cd', 'CD to current path', '#BAF3BE');
	statusBar.addItem('$(lock)', 'terminal-tools.lock', 'Unlock', 'blue');
	const { subscriptions: sub } = context;
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	sub.push(commands.registerCommand('terminal-tools.stop', restartActiveTerminal(activeFile.terminal, terminalStatus)));

	sub.push(commands.registerCommand('terminal-tools.run', activeFile.run.bind(activeFile)));

	sub.push(commands.registerCommand('terminal-tools.rerun', () => {
		restartActiveTerminal(activeFile.terminal, terminalStatus)();
		setTimeout(activeFile.run.bind(activeFile), 300);
	}));

	sub.push(commands.registerCommand('terminal-tools.clear', () => {
		commands.executeCommand('workbench.action.terminal.clear');
	}));

	sub.push(commands.registerCommand('terminal-tools.cmd', () => selectItem(terminal, outputChannel)));

	sub.push(commands.registerCommand('terminal-tools.lock', activeFile.lock.bind(activeFile)));

	sub.push(commands.registerCommand('terminal-tools.cd', activeFile.cd.bind(activeFile)));

	// treevView
	const treeDataProvider = new Provider();
	vscode.window.createTreeView('terminal-tools', {
		treeDataProvider,
		showCollapseAll: true
	});
	commands.registerCommand('terminal-tools.install', node => selection.install(node, '-S'));
	commands.registerCommand('terminal-tools.uninstall', node => selection.install(node, '', 'un'));
	commands.registerCommand('terminal-tools.uninstall-g', node => selection.install(node, '-g', 'un'));
	commands.registerCommand('terminal-tools.dev', node => selection.install(node, '-D'));
	commands.registerCommand('terminal-tools.global', node => selection.install(node, '-g'));
	commands.registerCommand('terminal-tools.vsix', () => installExtension(terminal, outputChannel));
	commands.registerCommand('terminal-tools.sync', activeFile.sync.bind(activeFile));
	commands.registerCommand('terminal-tools.kill', killPort);

	sub.push(commands.registerCommand(
		'terminal-tools.refresh',
		debounce(() => treeDataProvider.refresh(), 1000)
	));
	sub.push(workspace.onDidChangeConfiguration(debounce(() => treeDataProvider.refresh(), 1000)));
}

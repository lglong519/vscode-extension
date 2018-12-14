import * as vscode from 'vscode';
import selectItem from './selectItem';
import getUri from './getUri';

const statusBarItems: any[] = [];
let lockFile: string = '';

let terminal: vscode.Terminal = vscode.window.createTerminal({ name: 'lglong519' });
terminal.show();
let outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel('lglong519');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate (context: vscode.ExtensionContext) {

	addStatusBarItem('|');
	addStatusBarItem('Stop', 'extension.stop', 'Stop current task', 'cyan');
	addStatusBarItem('|');
	addStatusBarItem('Run', 'extension.run', 'Run current file', 'red');
	addStatusBarItem('|');
	addStatusBarItem('Rerun', 'extension.rerun', 'Run current file again');
	addStatusBarItem('|');
	addStatusBarItem('Clear', 'extension.clear', 'clearTerminal', 'yellow');
	addStatusBarItem('npm', 'extension.npm', 'NPM Install', 'purple');
	addStatusBarItem('CD', 'extension.CD', 'CD to current path', '#BAF3BE');
	addStatusBarItem('$(lock)', 'extension.lock', 'Unlock', 'blue');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let stop = vscode.commands.registerCommand('extension.stop', () => {
		reStartTerminal();
	});
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

function addStatusBarItem (str, cmd?: string, tip?: string, col?: string) {
	statusBarItems.push(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right)); // Left Right
	statusBarItems[statusBarItems.length - 1].text = str;
	if (cmd) statusBarItems[statusBarItems.length - 1].command = cmd;
	if (tip) statusBarItems[statusBarItems.length - 1].tooltip = tip;
	if (col) statusBarItems[statusBarItems.length - 1].color = col;
	statusBarItems[statusBarItems.length - 1].show();
}
function runFile () {
	terminal.show();
	let filePath = getUri().fullPath;
	if (lockFile) {
		filePath = lockFile;
	}
	// execute cmd
	if (filePath.endsWith('.js')) {
		terminal.sendText(`node ${filePath}`);
	} else {
		vscode.window.setStatusBarMessage('Not a JS file.', 3000);
		outputChannel.append(`Not a JS file: ${filePath}\n`);
		outputChannel.show();
	}
}
function reStartTerminal () {
	terminal.dispose();
	terminal = vscode.window.createTerminal({ name: 'lglong519' });
	terminal.show();
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

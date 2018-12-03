// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const statusBarItems = [];
let lockFile = '';

let terminal = vscode.window.createTerminal({ name: 'lglong519' });
terminal.show();
let outputChannel = vscode.window.createOutputChannel('lglong519');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate (context) {

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

	let npmInstall = vscode.commands.registerCommand('extension.npm', SelectItem);
	context.subscriptions.push(npmInstall);

	let lockFileBtn = vscode.commands.registerCommand('extension.lock', () => {
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
	});
	context.subscriptions.push(lockFileBtn);
	let CDTo = vscode.commands.registerCommand('extension.CD', () => {
		terminal.sendText(`cd ${getUri().path}`);
	});
	context.subscriptions.push(CDTo);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate () {
}
exports.deactivate = deactivate;

function addStatusBarItem (str, cmd, tip, col) {
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
function getUri () {
	let origin = vscode.window.activeTextEditor.document.uri;
	let fullPath = String(origin).split('//').pop();
	let path = fullPath.slice(0, fullPath.lastIndexOf('/'));
	let file = fullPath.split('/').reverse()[0];
	return {
		fullPath,
		path,
		file
	};
}

function SelectItem () {
	vscode.window.showQuickPick([
		'npm install',
		'-D eslint-config-teslint@latest',
		'-D gulp@^4.0.0 ',
		'-D gulp-autoprefixer',
		'-D gulp-babel',
		'-D gulp-clean-css',
		'-D gulp-htmlmin',
		'-D gulp-rename',
		'-D gulp-replace',
		'-D gulp-ssh',
		'-D gulp-strip-css-comments',
		'-D gulp-uglify',
		'cheerio@^1.0.0-rc.2',
		'joi',
		'lodash',
		'md5',
		'moment',
		'nconf',
		'request',
		'request-promise',
		'require-dir',
		'superagent',
		'superagent-charset',
		'-g gulp@^4.0.0',
		'-g lglong519/generator',
		'-g nodemon',
		'-g supervisor',
		'-g typings',
	]).then(function (selected) {
		if (selected) {
			vscode.window.showInformationMessage('Item \'' + selected + '\' has been selected!');
			let exec = 'npm install ';
			if (!selected.startsWith('npm')) {
				exec += selected;
			}
			terminal.sendText(exec);
		}
	});
}

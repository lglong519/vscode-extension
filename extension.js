// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const statusBarItems = [];

let terminal = vscode.window.createTerminal({ name: "lglong519" });
terminal.show(true);
let outputChannel = vscode.window.createOutputChannel("lglong519");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    
    addStatusBarItem('|');
    addStatusBarItem('Run', 'extension.run', 'Run current file', 'red');
    addStatusBarItem('|');
    addStatusBarItem('Rerun', 'extension.rerun', 'Run current file again');
    addStatusBarItem('|');
    addStatusBarItem('Clear', 'extension.clear', 'clearTerminal', 'yellow');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let runFileInTerminal = vscode.commands.registerCommand('extension.run',runFile);
    context.subscriptions.push(runFileInTerminal);
    let reRunFileInTerminal = vscode.commands.registerCommand('extension.rerun', function () {
        reStartTerminal();
        runFile();
    });
    context.subscriptions.push(reRunFileInTerminal);
    let clearTerminal = vscode.commands.registerCommand('extension.clear',reStartTerminal);
    context.subscriptions.push(clearTerminal);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

function addStatusBarItem(str, cmd, tip, col) {
    statusBarItems.push(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right)); //Left Right
    statusBarItems[statusBarItems.length - 1].text = str;
    if (cmd) statusBarItems[statusBarItems.length - 1].command = cmd;
    if (tip) statusBarItems[statusBarItems.length - 1].tooltip = tip;
    if (col) statusBarItems[statusBarItems.length - 1].color = col;
    statusBarItems[statusBarItems.length - 1].show();
}
function runFile(){
    let filePath = String(vscode.window.activeTextEditor.document.uri).split('//').pop()
        //execute cmd
        if (filePath.endsWith('.js')) {
            terminal.sendText(`node ${filePath}`);
        } else {
            vscode.window.setStatusBarMessage('Not a JS file.',3000);
            outputChannel.append('Not a JS file.');
        }
}
function reStartTerminal(){
    terminal.dispose();
    terminal = vscode.window.createTerminal({ name: "lglong519" });
    terminal.show(true);
}
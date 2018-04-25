// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const statusBarItems = [];

function addStatusBarItem(str, cmd, tip, col) {
    statusBarItems.push(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left));
    statusBarItems[statusBarItems.length - 1].text = str;
    if (cmd) statusBarItems[statusBarItems.length - 1].command = cmd;
    if (tip) statusBarItems[statusBarItems.length - 1].tooltip = tip;
    if (col) statusBarItems[statusBarItems.length - 1].color = col;
    statusBarItems[statusBarItems.length - 1].show();
}

let terminal = vscode.window.createTerminal({ name: "lglong519" });
terminal.show(true);
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    addStatusBarItem('|');
    addStatusBarItem('Run', 'extension.run', 'Run current file', 'red');
    addStatusBarItem('|');
    addStatusBarItem('Clear', 'extension.clear', 'clearTerminal', 'yellow');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let runFileInTerminal = vscode.commands.registerCommand('extension.run', function () {
        let filePath = String(vscode.window.activeTextEditor.document.uri).split('//').pop()
        //execute cmd
        if (filePath.endsWith('.js')) {
            terminal.sendText(`node ${filePath}`);
        } else {
            vscode.window.setStatusBarMessage('Not a JS file.',3000);
        }
    });
    context.subscriptions.push(runFileInTerminal);
    let clearTerminal = vscode.commands.registerCommand('extension.clear', function () {
        terminal.dispose();
        terminal = vscode.window.createTerminal({ name: "lglong519" });
        terminal.show(true);
    });
    context.subscriptions.push(clearTerminal);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
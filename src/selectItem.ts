
import * as vscode from 'vscode';
import syncFile from './syncFile';
import directives from './directives';
import installExtension from './installExtension';

export default function (terminal: vscode.Terminal, outputChannel: vscode.OutputChannel) {
	vscode.window.showQuickPick(directives).then(selected => {
		if (selected) {
			terminal.show();
			outputChannel.append(`Item '${selected}' has been selected!\n`);
			let exec = selected;
			if (!(/^(npm|ssh|echo|vsce|generator|service|pm2)\s+/).test(selected)) {
				exec = `npm install ${selected}`;
			}
			if (selected == 'npm run sync') {
				return syncFile(terminal, outputChannel);
			}
			if (selected == 'code --install-extension') {
				return installExtension(terminal, outputChannel, selected);
			}
			terminal.sendText(exec);
		}
	});
}

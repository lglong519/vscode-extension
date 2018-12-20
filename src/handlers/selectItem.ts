
import * as vscode from 'vscode';
import directives from '../libs/directives';
import installExtension from './installExtension';
import ActiveFile from '../controllers/ActiveFile';
import getTerminal from '../libs/getActiveTerminal';

export default function (terminal: vscode.Terminal, outputChannel: vscode.OutputChannel) {
	vscode.window.showQuickPick(directives).then(selected => {
		const actvieTerminal: vscode.Terminal = getTerminal(terminal);
		if (selected) {
			actvieTerminal.show();
			outputChannel.append(`Item '${selected}' has been selected!\n`);
			let exec = selected;
			if (!(/^(npm|ssh|echo|vsce|generator|service|pm2)\s+/).test(selected)) {
				exec = `npm install ${selected}`;
			}
			if (selected == 'npm run sync') {
				return new ActiveFile({ terminal: actvieTerminal, outputChannel }).sync();
			}
			if (selected == 'code --install-extension') {
				return installExtension(actvieTerminal, outputChannel, selected);
			}
			actvieTerminal.sendText(exec);
		}
	});
}

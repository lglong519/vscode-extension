
import * as child_process from 'child_process';
import * as vscode from 'vscode';
import getUri from '../libs/getUri';

export default class {

	private password: string='';
	constructor (private outputChannel: vscode.OutputChannel) {
		return <any> this.main.bind(this);
	}
	private async main (): Promise<any> {
		try {
			const port = await vscode.window.showInputBox({ prompt: 'The port number to be killed', placeHolder: 'port', ignoreFocusOut: true });
			if (!port) {
				return;
			}
			let exec = `netstat -ap | grep ${port}`;
			if (getUri().system == 'windows') {
				exec = `netstat -ano |findstr ${port}`;
			}
			let pid = await this.process(exec);
			if (pid) {
				await this.kill(pid);
			}
		} catch (e) {
			this.logErr(e);
		}
	}
	private kill (stdout: string) {
		let clients = stdout.match(/LISTEN\s*(\d+)\/\w+|ESTABLISHED\s*(\d+)\/\w+/g);
		if (clients) {
			let getPid = clients[clients.length - 1].match(/(\d+)\//);
			if (getPid) {
				let killExec = `kill ${getPid[1]}`;
				if (getUri().system == 'windows') {
					killExec = `tskill ${getPid[1]}`;
				}
				return this.process(killExec);
			}
		}
	}

	private process (exec: string): Promise<string|undefined> {
		return new Promise((res, rej) => {
			child_process.exec(exec, async (err, stdout, stderr) => {
				let errMsg = String(err) || '';
				if ((/have\s*to\s*be\s*root/).test(stderr) || (/Operation\s*not\s*permitted/).test(errMsg)) {
					const pwd = await vscode.window.showInputBox({ prompt: '[sudo] password', placeHolder: 'password', ignoreFocusOut: true, value: this.password });
					if (pwd) {
						this.password = pwd;
					} else {
						return rej('Password is required');
					}
					return child_process.exec(`echo "${pwd}" | sudo -S ${exec}`, (err, stdout, stderr) => {
						if (err) {
							return rej(err);
						}
						res(stdout);
					});
				}
				if (err) {
					return rej(err);
				}
				res(stdout);
			});
		});
	}

	private logErr (err: any): void{
		this.outputChannel.append(String(err));
		this.outputChannel.show();
	}

}

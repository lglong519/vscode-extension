import { workspace } from 'vscode';
import rootItems from './rootItems';
import directives from './directives';
import dependencies from './dependencies';
import devDependencies from './devDependencies';
import globalDependencies from './globalDependencies';
import { MArray } from '../libs/mixins';

export default (): MArray => {

	const config: any = workspace.getConfiguration('terminal-tools');
	const libs: MArray = {
		rootItems: Object.keys(rootItems).sort(),
		directives,
		dependencies,
		devDependencies,
		globalDependencies,
		tools: ['install vsix', 'kill port'].sort(),
	};

	Object.keys(libs).forEach(key => {
		libs[key].sort();
		if (!config[key]) {
			return;
		}
		config[key].sort();
		if (config.options[key] == 'default') {
			libs[key] = config[key].concat(libs[key]);
		}
		if (config.options[key] == 'custom') {
			libs[key] = config[key];
		}
		libs[key] = [...new Set(libs[key])];
	});

	return libs;
};

import * as vscode from 'vscode';
import { generateTests } from './commands/generateTests';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vstestgenai" is now active! ');

	const disposable = vscode.commands.registerCommand('vstestgenai.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from vstestgenai!');
	});
	context.subscriptions.push(disposable);

	const generateTestCommand = vscode.commands.registerCommand('vstestgenai.generateTests', generateTests);
    context.subscriptions.push(generateTestCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
 
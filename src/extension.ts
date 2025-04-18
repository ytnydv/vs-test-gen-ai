import * as vscode from 'vscode';
import { generateTests } from './commands/generateTests';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "openaitestgen" is now active! ');

	const disposable = vscode.commands.registerCommand('openaitestgen.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from OpenAITestGen! YYYY');
	});
	context.subscriptions.push(disposable);

	const generateTestCommand = vscode.commands.registerCommand('openaitestgen.generateTests', generateTests);
    context.subscriptions.push(generateTestCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
 
import * as vscode from 'vscode';
import { OpenAIClient } from '../api/openaiClient';
import { TestRequest } from '../types';

export async function generateTests(uri?: vscode.Uri) {
    let fileUri = uri;

    // If not invoked from context menu, ask user to pick a file
    if (!fileUri) {
        const picked = await vscode.window.showOpenDialog({
            canSelectMany: false,
            openLabel: 'Select a file to generate tests for',
            filters: {
                'Code Files': ['js', 'ts', 'jsx', 'tsx']
            }
        });
        if (!picked || picked.length === 0) {
            vscode.window.showWarningMessage('No file selected.');
            return;
        }
        fileUri = picked[0];
    }

    const testType = await vscode.window.showQuickPick(['Unit Test', 'Integration Test'], {
        placeHolder: 'Select the type of tests to generate'
    });
    if (!testType) return;

    // Read file content
    const fileContent = (await vscode.workspace.openTextDocument(fileUri)).getText();

    // Framework detection logic
    const frameworks = ['Angular', 'React', 'Vue', 'Node.js', 'Playwright', 'Java', 'Python'];
    let detectedFramework: string | undefined;
    if (/from\s+['"]@angular/.test(fileContent)) detectedFramework = 'Angular';
    else if (/from\s+['"]react['"]/.test(fileContent)) detectedFramework = 'React';
    else if (/from\s+['"]vue['"]/.test(fileContent)) detectedFramework = 'Vue';
    else if (/from\s+['"]playwright['"]/.test(fileContent)) detectedFramework = 'Playwright';
    else if (/\.java$/.test(fileUri.fsPath)) detectedFramework = 'Java';
    else if (/\.py$/.test(fileUri.fsPath)) detectedFramework = 'Python';
    else if (/require\(['"]express['"]\)/.test(fileContent) || /from\s+['"]express['"]/.test(fileContent)) detectedFramework = 'Node.js';

    const framework = await vscode.window.showQuickPick(frameworks, {
        placeHolder: 'Select the framework',
        ...(detectedFramework && { activeItem: detectedFramework })
    });
    if (!framework) return;

    const apiUrl = "http://192.168.0.133:1234/v1";
    const apiKey = "";
    // const apiUrl = vscode.workspace.getConfiguration('openai').get('apiUrl') as string;
    // const apiKey = vscode.workspace.getConfiguration('openai').get('apiKey') as string;



    const openAIClient = new OpenAIClient(apiUrl, apiKey);

    const testRequest: TestRequest = {
        testType: testType === 'Unit Test' ? 'unit' : 'integration',
        framework: framework as 'Angular' | 'React',
        fileName: fileUri.fsPath,
        fileContent
    };

    try {
        const generatedTests = await openAIClient.generateTests(testRequest);
        vscode.window.showInformationMessage('Tests generated successfully!');
        // Determine spec file path
        const specFilePath = fileUri.fsPath.replace(/(\.ts|\.js|\.tsx|\.jsx)$/, match => `.spec${match}`);
        const specFileUri = vscode.Uri.file(specFilePath);

        let specFileExists = false;
        try {
            await vscode.workspace.fs.stat(specFileUri);
            specFileExists = true;
        } catch {
            specFileExists = false;
        }

        if (specFileExists) {
            // Update existing spec file (append or replace content as needed)
            await vscode.workspace.fs.writeFile(specFileUri, Buffer.from(generatedTests, 'utf8'));
            vscode.window.showInformationMessage('Spec file updated with generated tests!');
        } else {
            // Create new spec file
            await vscode.workspace.fs.writeFile(specFileUri, Buffer.from(generatedTests, 'utf8'));
            vscode.window.showInformationMessage('Spec file created with generated tests!');
        }
    } catch (error: any) {
        vscode.window.showErrorMessage('Failed to generate tests: ' + error.message);
    }
}
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as utils from './utils';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let commands = [
		vscode.commands.registerCommand('markdown-table.convert.split', async () => { await convertTable('split'); }),
		vscode.commands.registerCommand('markdown-table.convert.align', async () => { await convertTable('align'); })
	]
	commands.forEach(command => {
		context.subscriptions.push(command)
	});

	// 	vscode.window.showInformationMessage('Hello World from Markdown Table!');
}

const convertTable = async (mode: string) => {
	// check active window
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage('No active Editor!');
		return;
	}

	// check text selection
	let selection = editor.selection;
	if (selection.isEmpty) {
		vscode.window.showWarningMessage('No text selection!');
		return;
	}

	let text = editor.document.getText(selection);
	let result = '';
	try {
		result = utils.convert2table(text, mode);
	} catch (e) {
		console.log(e);
		return;
	}

	console.log(result);

	editor.edit(edit => {
		edit.replace(selection, result);
	})
}

// this method is called when your extension is deactivated
export function deactivate() {}

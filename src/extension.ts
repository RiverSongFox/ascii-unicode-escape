'use strict';

import * as vscode from 'vscode';
import {Escaper, MODE} from './escaper'

export function activate(context: vscode.ExtensionContext) {

    let escaper = new Escaper();

    let escape = vscode.commands.registerTextEditorCommand('extension.escape', (editor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
        escaper.process(editor, MODE.ESCAPE);
    });

    let unescape = vscode.commands.registerTextEditorCommand('extension.unescape', (editor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
        escaper.process(editor, MODE.UNESCAPE);
    });

    context.subscriptions.push(escaper);
    context.subscriptions.push(escape);
    context.subscriptions.push(unescape);

}

export function deactivate() { }

import * as vscode from 'vscode';

export enum MODE {
    ESCAPE,
    UNESCAPE
}

const RX_NONASCII = /([^\u0000-\u007f]+)/g;
const RX_UNICODE = /(\\u([0-9A-Fa-f]{4}))/g;
const RX_UNICODE_ES6 = /(\\u\{([0-9A-Fa-f]{1,6})\})/g;

export class Escaper {

    private _statusBarItem: vscode.StatusBarItem;

    public process(editor: vscode.TextEditor, mode: MODE) {

        // Process entire document if user haven't selected a text block manually
        let selection = (() => {
            if (editor.selection.end.isAfter(editor.selection.start)) {
                return editor.selection;
            } else {
                let lastLine = editor.document.lineAt(editor.document.lineCount - 1);
                return new vscode.Selection(
                    new vscode.Position(0, 0),
                    new vscode.Position(
                        lastLine.lineNumber,
                        lastLine.text.length
                    )
                );
            }
        })();

        // Choose processor function
        let processor = mode === MODE.ESCAPE
            ? this.escape
            : this.unescape;

        editor.edit((builder) => {
            builder.replace(selection, processor(editor.document.getText(selection)));
        });
    }

    /**
     * Replace non-ASCII characters with respecting Unicode escape-sequences.
     */
    public escape(text: string): string {
        return text.replace(RX_NONASCII, (match: string) => {
            let replacement = [];
            for (var index = 0; index < match.length; index++) {
                replacement.push('\\u' + ('0000' + match.charCodeAt(index).toString(16)).slice(-4));
            }
            return replacement.join('');
        });
    }

    /**
     * Resolve Unicode escape-sequences to simple non-ASCII characters.
     */
    public unescape(text: string): string {
        return text.replace(RX_UNICODE, (match: string, sequence: string, code: string) => {
            return String.fromCharCode(parseInt(code, 16));
        }).replace(RX_UNICODE_ES6, (match: string, sequence: string, code: string) => {
            return String.fromCodePoint(parseInt(code, 16));
        });
    }

    dispose() { }

}

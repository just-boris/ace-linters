import {
    Range,
    Position,
    Diagnostic,
    InsertTextFormat,
    CompletionList,
    CompletionItemKind
} from "vscode-languageserver-types";
import type {Ace} from "ace-code";
import {Range as AceRange} from "ace-code/src/range";

export function fromRange(range: Ace.Range): Range | undefined {
    if (!range) {
        return;
    }
    return {
        start: {
            line: range.start.row,
            character: range.start.column
        },
        end: {line: range.end.row, character: range.end.column}
    };
}

export function toRange(range: Range): Ace.Range | undefined {
    if (!range) {
        return;
    }
    return new AceRange(range.start.line, range.start.character, range.end.line, range.end.character);
}

export function fromPoint(point: Ace.Point): Position {
    if (!point) return;
    return {line: point.row, character: point.column}
}

export function toPoint(position: Position): Ace.Point {
    if (!position) return;
    return {row: position.line, column: position.character}
}

export function toAnnotations(diagnostics: Diagnostic[]): Ace.Annotation[] {
    return diagnostics && diagnostics.map((el) => {
        return {
            row: el.range.start.line,
            column: el.range.start.character,
            text: el.message,
            type: el.severity === 1 ? "error" : el.severity === 2 ? "warning" : "info"
        };
    });
}

export function toCompletions(completionList: CompletionList) {
    return completionList && completionList.items.map((item) => {
            let kind = Object.keys(CompletionItemKind)[Object.values(CompletionItemKind).indexOf(item.kind)];
            let text = item.textEdit?.newText ?? item.insertText ?? item.label;
            if (item.insertTextFormat == InsertTextFormat.Snippet) {
                return {
                    meta: kind,
                    snippet: text,
                    caption: item.label,
                    doc: item.documentation
                }
            }
            return {
                value: text,
                meta: kind,
                caption: item.label,
                doc: item.documentation
            }
        }
    );
}
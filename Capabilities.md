# Client LSP capabilities
- Synchronization
    - didOpen
    - didChange
    - Full text change
    - Incremental text change
    - ~~willSave~~
    - ~~willSaveWaitUntil~~
    - didSave
    - didClose
- Completion
    - insertText
    - additionalTextEdits
    - textEdit
    - InsertTextFormat.Snippet
    - documentation
    - command
    - ~~tags~~
- Hover
- Formatting
    - formatting
    - rangeFormatting
    - ~~onTypeFormatting~~
- pullDiagnostics
- Signature Help
  - activeParameterSupport
- Document Highlight (experimental)
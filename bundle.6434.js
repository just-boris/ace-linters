"use strict";
(self["webpackChunkace_linters_root"] = self["webpackChunkace_linters_root"] || []).push([[6434],{

/***/ 12764:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var oop = __webpack_require__(89359);
var Range = (__webpack_require__(59082)/* .Range */ .e);
var BaseFoldMode = (__webpack_require__(15369).FoldMode);

var FoldMode = exports.Z = function(commentRegex) {
    if (commentRegex) {
        this.foldingStartMarker = new RegExp(
            this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
        );
        this.foldingStopMarker = new RegExp(
            this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
        );
    }
};
oop.inherits(FoldMode, BaseFoldMode);

(function() {
    
    this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
    this.singleLineBlockCommentRe= /^\s*(\/\*).*\*\/\s*$/;
    this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
    this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
    
    //prevent naming conflict with any modes that inherit from cstyle and override this (like csharp)
    this._getFoldWidgetBase = this.getFoldWidget;
    
    /**
     * Gets fold widget with some non-standard extras:
     *
     * @example lineCommentRegionStart
     *      //#region [optional description]
     *
     * @example blockCommentRegionStart
     *      /*#region [optional description] *[/]
     *
     * @example tripleStarFoldingSection
     *      /*** this folds even though 1 line because it has 3 stars ***[/]
     * 
     * @note the pound symbol for region tags is optional
     */
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
    
        if (this.singleLineBlockCommentRe.test(line)) {
            // No widget for single line block comment unless region or triple star
            if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
                return "";
        }
    
        var fw = this._getFoldWidgetBase(session, foldStyle, row);
    
        if (!fw && this.startRegionRe.test(line))
            return "start"; // lineCommentRegionStart
    
        return fw;
    };

    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
        
        if (this.startRegionRe.test(line))
            return this.getCommentRegionBlock(session, line, row);
        
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;

            if (match[1])
                return this.openingBracketBlock(session, match[1], row, i);
                
            var range = session.getCommentFoldRange(row, i + match[0].length, 1);
            
            if (range && !range.isMultiLine()) {
                if (forceMultiline) {
                    range = this.getSectionRange(session, row);
                } else if (foldStyle != "all")
                    range = null;
            }
            
            return range;
        }

        if (foldStyle === "markbegin")
            return;

        var match = line.match(this.foldingStopMarker);
        if (match) {
            var i = match.index + match[0].length;

            if (match[1])
                return this.closingBracketBlock(session, match[1], row, i);

            return session.getCommentFoldRange(row, i, -1);
        }
    };
    
    this.getSectionRange = function(session, row) {
        var line = session.getLine(row);
        var startIndent = line.search(/\S/);
        var startRow = row;
        var startColumn = line.length;
        row = row + 1;
        var endRow = row;
        var maxRow = session.getLength();
        while (++row < maxRow) {
            line = session.getLine(row);
            var indent = line.search(/\S/);
            if (indent === -1)
                continue;
            if  (startIndent > indent)
                break;
            var subRange = this.getFoldWidgetRange(session, "all", row);
            
            if (subRange) {
                if (subRange.start.row <= startRow) {
                    break;
                } else if (subRange.isMultiLine()) {
                    row = subRange.end.row;
                } else if (startIndent == indent) {
                    break;
                }
            }
            endRow = row;
        }
        
        return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    };
    
    /**
     * gets comment region block with end region assumed to be start of comment in any cstyle mode or SQL mode (--) which inherits from this.
     * There may optionally be a pound symbol before the region/endregion statement
     */
    this.getCommentRegionBlock = function(session, line, row) {
        var startColumn = line.search(/\s*$/);
        var maxRow = session.getLength();
        var startRow = row;
        
        var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
        var depth = 1;
        while (++row < maxRow) {
            line = session.getLine(row);
            var m = re.exec(line);
            if (!m) continue;
            if (m[1]) depth--;
            else depth++;

            if (!depth) break;
        }

        var endRow = row;
        if (endRow > startRow) {
            return new Range(startRow, startColumn, endRow, line.length);
        }
    };

}).call(FoldMode.prototype);


/***/ }),

/***/ 46434:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/*
  THIS FILE WAS AUTOGENERATED BY mode.tmpl.js
*/



var oop = __webpack_require__(89359);
var TextMode = (__webpack_require__(98030).Mode);
var FSLHighlightRules = (__webpack_require__(78716)/* .FSLHighlightRules */ .W);
// TODO: pick appropriate fold mode
var FoldMode = (__webpack_require__(12764)/* .FoldMode */ .Z);

var Mode = function() {
    this.HighlightRules = FSLHighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "//";
    this.blockComment = {start: "/*", end: "*/"};
    // Extra logic goes here.
    this.$id = "ace/mode/fsl";
    this.snippetFileId = "ace/snippets/fsl";
}).call(Mode.prototype);

exports.Mode = Mode;


/***/ }),

/***/ 78716:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var oop = __webpack_require__(89359);
var TextHighlightRules = (__webpack_require__(28053)/* .TextHighlightRules */ .K);

var FSLHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        start: [{
            token: "punctuation.definition.comment.mn",
            regex: /\/\*/,
            push: [{
                token: "punctuation.definition.comment.mn",
                regex: /\*\//,
                next: "pop"
            }, {
                defaultToken: "comment.block.fsl"
            }]
        }, {
            token: "comment.line.fsl",
            regex: /\/\//,
            push: [{
                token: "comment.line.fsl",
                regex: /$/,
                next: "pop"
            }, {
                defaultToken: "comment.line.fsl"
            }]
        }, {
            token: "entity.name.function",
            regex: /\${/,
            push: [{
                token: "entity.name.function",
                regex: /}/,
                next: "pop"
            }, {
                defaultToken: "keyword.other"
            }],
            comment: "js outcalls"
        }, {
            token: "constant.numeric",
            regex: /[0-9]*\.[0-9]*\.[0-9]*/,
            comment: "semver"
        }, {
            token: "constant.language.fslLanguage",
            regex: "(?:"
                + "graph_layout|machine_name|machine_author|machine_license|machine_comment|machine_language"
                + "|machine_version|machine_reference|npm_name|graph_layout|on_init|on_halt|on_end|on_terminate|on_finalize|on_transition"
                + "|on_action|on_stochastic_action|on_legal|on_main|on_forced|on_validation|on_validation_failure|on_transition_refused|on_forced_transition_refused"
                + "|on_action_refused|on_enter|on_exit|start_states|end_states|terminal_states|final_states|fsl_version"
                + ")\\s*:"
        }, {
            token: "keyword.control.transition.fslArrow",
            regex: /<->|<-|->|<=>|=>|<=|<~>|~>|<~|<-=>|<=->|<-~>|<~->|<=~>|<~=>/
        }, {
            token: "constant.numeric.fslProbability",
            regex: /[0-9]+%/,
            comment: "edge probability annotation"
        }, {
            token: "constant.character.fslAction",
            regex: /\'[^']*\'/,
            comment: "action annotation"
        }, {
            token: "string.quoted.double.fslLabel.doublequoted",
            regex: /\"[^"]*\"/,
            comment: "fsl label annotation"
        }, {
            token: "entity.name.tag.fslLabel.atom",
            regex: /[a-zA-Z0-9_.+&()#@!?,]/,
            comment: "fsl label annotation"
        }]
    };

    this.normalizeRules();
};

FSLHighlightRules.metaData = {
    fileTypes: ["fsl", "fsl_state"],
    name: "FSL",
    scopeName: "source.fsl"
};


oop.inherits(FSLHighlightRules, TextHighlightRules);

exports.W = FSLHighlightRules;


/***/ })

}]);
//# sourceMappingURL=bundle.6434.js.map
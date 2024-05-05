ace.define("ace/mode/json", [
  "require",
  "exports",
  "module",
  "ace/lib/oop",
  "ace/mode/text",
  "ace/tokenizer",
  "ace/mode/json_highlight_rules",
  "ace/mode/matching_brace_outdent",
  "ace/mode/behaviour/cstyle",
  "ace/mode/folding/cstyle",
  "ace/worker/worker_client",
], function (
  a,
  b,
  c,
  d,
  e,
  f,
  g,
  h,
  i,
  j,
  k
) {
  var l = a("../lib/oop"),
    m = a("./text").Mode,
    n = a("../tokenizer").Tokenizer,
    o = a("./json_highlight_rules").JsonHighlightRules,
    p = a("./matching_brace_outdent").MatchingBraceOutdent,
    q = a("./behaviour/cstyle").CstyleBehaviour,
    r = a("./folding/cstyle").FoldMode,
    s = a("../worker/worker_client").WorkerClient,
    t = function () {
      this.$tokenizer = new n((new o).getRules()),
        this.$outdent = new p(),
        this.$behaviour = new q(),
        this.foldingRules = new r();
    };
  l.inherits(t, m),
    (function () {
      this.getNextLineIndent = function (a, b, c) {
        var d = this.$getIndent(b);
        if (a == "start") {
          var e = b.match(/^.*[\{\(\[]\s*$/);
          e && (d += c);
        }
        return d;
      };
      this.checkOutdent = function (a, b, c) {
        return this.$outdent.checkOutdent(b, c);
      };
      this.autoOutdent = function (a, b, c) {
        this.$outdent.autoOutdent(b, c);
      };
      this.createWorker = function (a) {
        var b = new s(
          ["ace"],
          "ace/mode/json_worker",
          "JsonWorker"
        );
        return (
          b.attachToDocument(a.getDocument()),
          b.on("error", function (b) {
            a.setAnnotations([b.data]);
          }),
          b.on("ok", function () {
            a.clearAnnotations();
          }),
          b
        );
      };
    }.call(t.prototype)),
    (b.Mode = t);
});

ace.define("ace/mode/json_highlight_rules", [
  "require",
  "exports",
  "module",
  "ace/lib/oop",
  "ace/mode/text_highlight_rules",
], function (a, b, c) {
  var d = a("../lib/oop"),
    e = a("./text_highlight_rules").TextHighlightRules,
    f = function () {
      this.$rules = {
        start: [
          {
            token: "variable",
            regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]\\s*(?=:)',
          },
          { token: "string", regex: '"', next: "string" },
          {
            token: "constant.numeric",
            regex: "0[xX][0-9a-fA-F]+\\b",
          },
          {
            token: "constant.numeric",
            regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
          },
          {
            token: "constant.language.boolean",
            regex: "(?:true|false)\\b",
          },
          {
            token: "invalid.illegal",
            regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']",
          },
          {
            token: "invalid.illegal",
            regex: "\\/\\/.*$",
          },
          { token: "paren.lparen", regex: "[[({]" },
          { token: "paren.rparen", regex: "[\\])]" },
          { token: "text", regex: "\\s+" },
        ],
        string: [
          {
            token: "constant.language.escape",
            regex: /\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|["\\\/bfnrt])/,
          },
          {
            token: "string",
            regex: '[^"\\\\]+',
            merge: !0,
          },
          {
            token: "string",
            regex: '"',
            next: "start",
            merge: !0,
          },
          {
            token: "string",
            regex: "",
            next: "start",
            merge: !0,
          },
        ],
      };
    };
  d.inherits(f, e),
    (b.JsonHighlightRules = f);
});

ace.define("ace/mode/matching_brace_outdent", [
  "require",
  "exports",
  "module",
  "ace/range",
], function (a, b, c) {
  var d = a("../range").Range,
    e = function () {};
  (function () {
    this.checkOutdent = function (a, b) {
      return /^\s+$/.test(a)
        ? /^\s*\}/.test(b)
        : !1;
    };
    this.autoOutdent = function (a, b) {
      var c = a.getLine(b),
        d = c.match(/^(\s*\})/);
      if (!d) return 0;
      var e = d[1].length,
        f = a.findMatchingBracket({
          row: b,
          column: e,
        });
      if (!f || f.row == b) return 0;
      var g = this.$getIndent(a.getLine(f.row));
      a.replace(
        new d(b, 0, b, e - 1),
        g
      );
    };
    this.$getIndent = function (a) {
      var b = a.match(/^(\s+)/);
      return b ? b[1] : "";
    };
  }).call(e.prototype),
    (b.MatchingBraceOutdent = e);
});

ace.define("ace/mode/behaviour/cstyle", [
  "require",
  "exports",
  "module",
  "ace/lib/oop",
  "ace/mode/behaviour",
], function (a, b, c) {
  var d = a("../../lib/oop"),
    e = a("../behaviour").Behaviour,
    f = function () {
      this.add(
        "braces",
        "insertion",
        function (a, b, c, d, e) {
          if (e == "{") {
            var f = c.getSelectionRange(),
              g = d.doc.getTextRange(f);
            return (
              g !== ""
                ? { text: "{" + g + "}", selection: !1 }
                : { text: "{}", selection: [1, 1] }
            );
          }
          if (e == "}") {
            var h = c.getCursorPosition(),
              i = d.doc.getLine(h.row),
              j = i.substring(h.column, h.column + 1);
            if (j == "}") {
              var k = d.$findOpeningBracket(
                  "}",
                  { column: h.column + 1, row: h.row }
                ),
                l = this.getNextLineIndent(a, i.substring(0, i.length - 1), d.getTabString());
              return {
                text: "\n" + l + "\n" + this.$getIndent(d.doc.getLine(k.row)),
                selection: [1, l.length, 1, l.length],
              };
            }
          } else if (e == "\n") {
            var h = c.getCursorPosition(),
              i = d.doc.getLine(h.row),
              j = i.substring(h.column, h.column + 1);
            if (j == "}") {
              var l = d.findMatchingBracket({ row: h.row, column: h.column + 1 });
              if (!l) return null;
              var m = this.getNextLineIndent(a, i.substring(0, i.length - 1), d.getTabString()),
                n = this.$getIndent(d.doc.getLine(l.row));
              return {
                text: "\n" + m + "\n" + n,
                selection: [1, m.length, 1, m.length],
              };
            }
          }
        }.bind(this)
      );
      this.add(
        "braces",
        "deletion",
        function (a, b, c, d, e) {
          var f = d.doc.getTextRange(e);
          if (!e.isMultiLine() && f == "{") {
            var g = d.doc.getLine(e.start.row),
              h = g.substring(e.start.column + 1, e.start.column + 2);
            if (h == "}") return e.end.column++, e;
          }
        }.bind(this)
      );
      this.add(
        "parens",
        "insertion",
        function (a, b, c, d, e) {
          if (e == "(") {
            var f = c.getSelectionRange(),
              g = d.doc.getTextRange(f);
            return (
              g !== ""
                ? { text: "(" + g + ")", selection: !1 }
                : { text: "()", selection: [1, 1] }
            );
          }
          if (e == ")") {
            var h = c.getCursorPosition(),
              i = d.doc.getLine(h.row),
              j = i.substring(h.column, h.column + 1);
            if (j == ")") {
              var k = d.$findOpeningBracket(
                  ")",
                  { column: h.column + 1, row: h.row }
                ),
                l = this.getNextLineIndent(a, i.substring(0, i.length - 1), d.getTabString());
              return {
                text: "",
                selection: [1, 1],
              };
            }
          }
        }.bind(this)
      );
      this.add(
        "parens",
        "deletion",
        function (a, b, c, d, e) {
          var f = d.doc.getTextRange(e);
          if (!e.isMultiLine() && f == "(") {
            var g = d.doc.getLine(e.start.row),
              h = g.substring(e.start.column + 1, e.start.column + 2);
            if (h == ")") return e.end.column++, e;
          }
        }.bind(this)
      );
      this.add(
        "brackets",
        "insertion",
        function (a, b, c, d, e) {
          if (e == "[") {
            var f = c.getSelectionRange(),
              g = d.doc.getTextRange(f);
            return (
              g !== ""
                ? { text: "[" + g + "]", selection: !1 }
                : { text: "[]", selection: [1, 1] }
            );
          }
          if (e == "]") {
            var h = c.getCursorPosition(),
              i = d.doc.getLine(h.row),
              j = i.substring(h.column, h.column + 1);
            if (j == "]") {
              var k = d.$findOpeningBracket(
                  "]",
                  { column: h.column + 1, row: h.row }
                ),
                l = this.getNextLineIndent(a, i.substring(0, i.length - 1), d.getTabString());
              return {
                text: "",
                selection: [1, 1],
              };
            }
          }
        }.bind(this)
      );
      this.add(
        "brackets",
        "deletion",
        function (a, b, c, d, e) {
          var f = d.doc.getTextRange(e);
          if (!e.isMultiLine() && f == "[") {
            var g = d.doc.getLine(e.start.row),
              h = g.substring(e.start.column + 1, e.start.column + 2);
            if (h == "]") return e.end.column++, e;
          }
        }.bind(this)
      );
      this.add(
        "string_dquotes",
        "insertion",
        function (a, b, c, d, e) {
          if (e == '"' || e == "'") {
            var f = e,
              g = c.getSelectionRange(),
              h = d.doc.getTextRange(g);
            if (h !== "")
              return {
                text: f + h + f,
                selection: !1,
              };
            var i = c.getCursorPosition(),
              j = d.doc.getLine(i.row),
              k = j.substring(i.column - 1, i.column);
            if (k == "\\") return null;
            var l = d.getTokens(g.start.row),
              m = 0,
              n,
              o = -1;
            for (var p = 0; p < l.length; p++) {
              n = l[p],
                n.type == "string"
                ? (o = -1)
                : o < 0 && (o = n.value.indexOf(f));
              if (

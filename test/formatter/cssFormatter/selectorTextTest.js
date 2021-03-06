/* See license.txt for terms of usage */
function runTest() {
  var prefs = new FBTestFireformat.PrefHandler([
       "fireformatCssFormatter.wrapSize",
       "fireformatCssFormatter.selectorText.selectorsPerLine",
       "fireformatCssFormatter.selectorText.spaceCount",
       "fireformatCssFormatter.selectorText.indentLevel"
  ]);

  var formatter = Format.Formatters.getFormatter("com.incaseofstairs.fireformatCSSFormatter");
  function getStyle(selectorText) {
    var style = {
      type: CSSRule.STYLE_RULE,
      selectorText: selectorText,
      style: { cssText: "" }
    };
    return formatter.format(style).replace(/\s*\{[\S\s]*?\}[\S\s]*/, "");
  }
  function getMultipleStyle() {
    var style = {
      cssRules: [
        {
          type: CSSRule.STYLE_RULE,
          selectorText: ".single",
          style: { cssText: "" }
        },
        {
          type: CSSRule.STYLE_RULE,
          selectorText: ".single[name] > DIV.test + *, .double:focus, .triple#myid",
          style: { cssText: "" }
        }
      ]
    };
    return formatter.format(style).replace(/\s*\{[\S\s]*?\}\s*/g, "|");
  }
  
  // Formatting with a single token
  FBTest.compare(".single", getStyle(".single"), "Single Token");
  
  // Formatting with multiple tokens, no wrap
  prefs.setPrefs(80, 3, 1, 0);
  FBTest.compare(".single, .double, .triple", getStyle(".single, .double, .triple"), "Formatting with multiple tokens, no wrap");

  // Formatting with multiple tokens, token wrap, no indent
  prefs.setPrefs(80, 2, 1, 0);
  FBTest.compare(".single, .double,\n.triple", getStyle(".single, .double, .triple"), "Formatting with multiple tokens, token wrap, no indent");

  // Formatting with multiple tokens, token wrap, indent
  prefs.setPrefs(80, 2, 2, 1);
  FBTest.compare(".single,  .double,\n  .triple", getStyle(".single, .double, .triple"), "Formatting with multiple tokens, token wrap, indent");

  // Formatting with multiple tokens, char wrap, no indent
  prefs.setPrefs(10, 3, 1, 0);
  FBTest.compare(".single, .double,\n.triple", getStyle(".single, .double, .triple"), "Formatting with multiple tokens, char wrap, no indent");

  // Formatting with multiple tokens, char wrap, indent
  prefs.setPrefs(11, 3, 2, 1);
  FBTest.compare(".single,  .double,\n  .triple", getStyle(".single, .double, .triple"), "Formatting with multiple tokens, char wrap, indent");

  // Formatting with advanced selectors, token wrap, indent
  prefs.setPrefs(80, 2, 1, 1);
  FBTest.compare(".single[name] > DIV.test + *, .double:focus,\n  .triple#myid", getStyle(".single[name] > DIV.test + *, .double:focus, .triple#myid"), "Formatting with advanced selectors, token wrap, indent");

  // Formatting with advanced selectors, char wrap, indent
  prefs.setPrefs(10, 3, 2, 1);
  FBTest.compare(".single[name] > DIV.test + *,\n  .double:focus,\n  .triple#myid", getStyle(".single[name] > DIV.test + *, .double:focus, .triple#myid"), "Formatting with advanced selectors, char wrap, indent");

  // Formatting with multiple rules, token wrap
  prefs.setPrefs(80, 2, 1, 1);
  FBTest.compare(".single|.single[name] > DIV.test + *, .double:focus,\n  .triple#myid|", getMultipleStyle(), "Formatting with multiple rules, token wrap");

  // Formatting with comma strings in the selector
  prefs.setPrefs(10, 1, 1, 1);
  FBTest.compare(".single[test=\"fail, fail\"] > DIV.test + *,\n  .double:focus,\n  .triple#myid", getStyle(".single[test=\"fail, fail\"] > DIV.test + *, .double:focus, .triple#myid"), "Comma selector string 1");
  FBTest.compare(".single[test=\'fail, fail\'] > DIV.test + *,\n  .double:focus,\n  .triple#myid", getStyle(".single[test=\'fail, fail\'] > DIV.test + *, .double:focus, .triple#myid"), "Comma selector string 2");
  

  
  prefs.reset();

  FBTest.testDone();
}
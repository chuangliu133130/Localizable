var transformer = require("../core/Transformer.js")['android'];
var EOL = require('os').EOL;

exports.testComment = function (test) {
    var result = transformer.transformComment('un commentaire');

    test.equal('<!-- un commentaire -->', result);
    test.done();
};

exports.testKeyValue = function (test) {
    var line = transformer.transformKeyValue('ma_cle', 'La valeur');
    test.equal('<string name="ma_cle">La valeur</string>', line);

    test.done();
};

exports.testMultipleFormat = function (test) {
    var line = transformer.transformKeyValue('ma_cle', 'La valeur %s et %s');
    test.equal('<string name="ma_cle">La valeur %1$s et %2$s</string>', line);

    test.done();
};

exports.testSingleFormat = function (test) {
    var line = transformer.transformKeyValue('ma_cle', 'La valeur %s');
    test.equal('<string name="ma_cle">La valeur %1$s</string>', line);

    test.done();
};

exports.testEscapeAmp = function (test) {
    var line = transformer.transformKeyValue('ma_cle', 'Ma & valeur');
    test.equal('<string name="ma_cle">Ma &amp; valeur</string>', line);

    test.done();
};

exports.testReplaceThreePointWithEllipsisCharacter = function (test) {
    var line = transformer.transformKeyValue('ma_cle', 'Ma valeur...');
    test.equal('<string name="ma_cle">Ma valeur&#8230;</string>', line);

    test.done();
};

exports.testReplaceThreePointInTheMiddleWithEllipsisCharacter = function (test) {
    var line = transformer.transformKeyValue('ma_cle', 'Ma valeur...à remplacer');
    test.equal('<string name="ma_cle">Ma valeur&#8230;à remplacer</string>', line);

    test.done();
};

exports.testShouldNotReplaceFourPointWithEllipsisCharacter = function (test) {
    var line = transformer.transformKeyValue('ma_cle', 'Ma valeur....');
    test.equal('<string name="ma_cle">Ma valeur....</string>', line);

    test.done();
};

var xmlHeader = '<?xml version="1.0" encoding="utf-8"?>';

exports.testInsert_WhenEmpty_ShouldCreateResourcesTag = function (test) {
    var result = transformer.insert('', 'à insérer');
    test.equal(xmlHeader + EOL + '<resources>' + EOL +
        transformer.AUTOGENERATED_TAG + EOL +
        'à insérer' + EOL +
        '</resources>', result);

    test.done();
};

exports.testInsert_WhenHasResourceTag_ShouldInsertBeforeEndTag = function (test) {
    var result = transformer.insert('<resources>' + EOL + 'aa' + EOL + '</resources>', 'à insérer');
    test.equal('<resources>' + EOL +
        'aa' + EOL +
        transformer.AUTOGENERATED_TAG + EOL +
        'à insérer' + EOL +
        '</resources>', result);

    test.done();
};

exports.testInsert_WhenHasAutoGeneratedTag_ShouldReplaceIt = function (test) {
    var result = transformer.insert('<resources>' + EOL + 'aa' + EOL + transformer.AUTOGENERATED_TAG + EOL + 'à effacer' + EOL + '</resources>', 'à insérer');
    test.equal('<resources>' + EOL +
        'aa' + EOL +
        transformer.AUTOGENERATED_TAG + EOL +
        'à insérer' + EOL +
        '</resources>', result);

    test.done();
};

exports.test_Insert_AfterIsSameAsBeforeIfNewValueDontChange = function (test) {
    var before = '<resources>' + EOL + 'aa' + EOL + transformer.AUTOGENERATED_TAG + EOL + 'before' + EOL + '</resources>';
    var result = transformer.insert(before, 'before');
    test.equal(before, result);

    test.done();
};
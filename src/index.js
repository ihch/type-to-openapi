"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var typescript = require("typescript");
var src = fs.readFileSync(path.resolve('./src/types.ts'), { encoding: 'utf-8' });
var source = typescript.createSourceFile('', src, typescript.ScriptTarget.ES2020);
var openapiComponents = {
    components: {
        schemes: []
    }
};
var createSchemeFromTypeDeclaration = function (typeName, members) {
    var properties = members.map(function (member) {
        return {
            name: member.name.escapedText,
            required: member.questionToken == null,
            type: (function () {
                var type = member.type;
                if (type.kind === typescript.SyntaxKind.StringKeyword) {
                    return 'string';
                }
                if (type.kind === typescript.SyntaxKind.UnionType) {
                    /* @ts-ignore next-line */
                    var types = type.types;
                    return types.map(function (type) {
                        var literal = type.literal;
                        if (literal.numericLiteralFlags != null && !Number.isNaN(literal.text)) {
                            return Number(literal.text);
                        }
                        return literal.text;
                    });
                }
                return null;
            })()
        };
    });
    return {
        title: typeName,
        required: properties.map(function (property) { return property.required && property.name; }).filter(function (name) { return name; }),
        type: 'object',
        properties: Object.assign.apply(Object, __spreadArray([{}], properties.map(function (property) {
            var _a;
            return _a = {},
                _a["".concat(property.name)] = {
                    title: typeName,
                    type: property.type
                },
                _a;
        }), false))
    };
};
var createScheme = function (node) {
    return createSchemeFromTypeDeclaration(node.name.text, node.type.members);
};
var f = function (node) {
    var _a;
    if (typeof node !== 'object')
        return;
    if (node.kind === typescript.SyntaxKind.TypeAliasDeclaration) {
        var typeAliasDeclarationNode = node;
        // Nodeの情報をJSONに詰めていく
        var scheme = createScheme(typeAliasDeclarationNode);
        openapiComponents.components.schemes = __assign(__assign({}, openapiComponents.components.schemes), (_a = {}, _a["".concat(scheme.title)] = scheme, _a));
    }
};
source.statements.forEach(f);
console.log(JSON.stringify(openapiComponents));

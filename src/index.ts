import * as typescript from 'typescript';

const openapiComponents = {
  components: {
    schemes: [],
  },
};

const createSchemeFromTypeDeclaration = (typeName: string, members: typescript.NodeArray<typescript.TypeElement>) => {
  const properties = members.map((member) => {
    return {
      name: (<typescript.Identifier>member.name).escapedText,
      required: member.questionToken == null,
      type: (() => {
        const type = (<typescript.PropertySignature>member).type;
        if (type.kind === typescript.SyntaxKind.StringKeyword) {
          return 'string';
        }
        if (type.kind === typescript.SyntaxKind.UnionType) {
          /* @ts-ignore next-line */
          const types = (type as typescript.UnionType).types;
          return types.map((type: typescript.LiteralType) => {
            const literal = (type as any).literal;
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
    required: properties.map((property) => property.required && property.name).filter((name) => name),
    type: 'object',
    properties: Object.assign({}, ...properties.map((property) => {
      return {
        [`${property.name}`]: {
          title: typeName,
          type: property.type,
        },
      };
    }))
  };
};

const createScheme = (node: typescript.TypeAliasDeclaration) => {
  return createSchemeFromTypeDeclaration(
    node.name.text,
    (<typescript.TypeLiteralNode>node.type).members
  );
}

const f = (node: typescript.Node) => {
  if (typeof node !== 'object') return;
  if (node.kind === typescript.SyntaxKind.TypeAliasDeclaration) {
    const typeAliasDeclarationNode = <typescript.TypeAliasDeclaration>node;

    // Nodeの情報をJSONに詰めていく
    const scheme = createScheme(typeAliasDeclarationNode);
    openapiComponents.components.schemes = {
      ...openapiComponents.components.schemes,
      [`${scheme.title}`]: scheme
    };
  }
}

export function type2openapiSchemes(src: string): string {
  const source = typescript.createSourceFile('', src, typescript.ScriptTarget.ES2020)
  source.statements.forEach(f);
  return JSON.stringify(openapiComponents);
}

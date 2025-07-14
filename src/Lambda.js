import React from 'react';

class Term {}

class Var extends Term {
  constructor(name) {
    super();
    this.name = name;
  }

  toString() {
    return this.name;
  }
}

class Lam extends Term {
  constructor(varName, body) {
    super();
    this.varName = varName;
    this.body = body;
  }

  toString() {
    return `(λ${this.varName}.${this.body.toString()})`;
  }
}

class App extends Term {
  constructor(func, arg) {
    super();
    this.func = func;
    this.arg = arg;
  }

  toString() {
    return `(${this.func.toString()} ${this.arg.toString()})`;
  }
}

function freeVars(term) {
  const set = new Set();
  (function fv(t) {
    if (t instanceof Var) {
      set.add(t.name);
    } else if (t instanceof App) {
      fv(t.func);
      fv(t.arg);
    } else if (t instanceof Lam) {
      fv(t.body);
      set.delete(t.varName);
    }
  })(term);
  return set;
}

function alphaRename(term, oldName, newName) {
  if (term instanceof Var) {
    return term.name === oldName ? new Var(newName) : term;
  } else if (term instanceof App) {
    return new App(
      alphaRename(term.func, oldName, newName),
      alphaRename(term.arg, oldName, newName)
    );
  } else if (term instanceof Lam) {
    if (term.varName === oldName) {
      return new Lam(
        newName,
        alphaRename(term.body, oldName, newName)
      );
    } else {
      return new Lam(
        term.varName,
        alphaRename(term.body, oldName, newName)
      );
    }
  }
}

function substitute(term, varName, replacement) {
  if (term instanceof Var) {
    return term.name === varName ? replacement : term;
  } else if (term instanceof App) {
    return new App(
      substitute(term.func, varName, replacement),
      substitute(term.arg, varName, replacement)
    );
  } else if (term instanceof Lam) {
    if (term.varName === varName) {
      return term;
    } else {
      let bodySub = substitute(term.body, varName, replacement);
      if (freeVars(replacement).has(term.varName)) {
        const newVar = term.varName + "'";
        const renamedBody = alphaRename(term.body, term.varName, newVar);
        bodySub = substitute(renamedBody, varName, replacement);
        return new Lam(newVar, bodySub);
      } else {
        return new Lam(term.varName, bodySub);
      }
    }
  }
}

function parseLambda(input) {
  input = input.replace(/\s/g, '');
  let index = 0;

  const parseTerm = () => {
    const terms = [];
    while (index < input.length) {
      const char = input[index];
      if (char === '(') {
        index++;
        const subTerm = parseTerm();
        if (input[index] !== ')') {
          throw new Error('Mismatched parentheses');
        }
        index++;
        terms.push(subTerm);
      } else if (char === '\\' || char === 'λ') {
        index++;
        const vars = [];
        while (index < input.length && input[index] !== '.' && /[a-zA-Z]/.test(input[index])) {
          vars.push(input[index]);
          index++;
        }
        if (input[index] !== '.') {
          throw new Error('Expected "." after variables');
        }
        index++;
        const body = parseTerm();
        let lam = body;
        for (let i = vars.length - 1; i >= 0; i--) {
          lam = new Lam(vars[i], lam);
        }
        terms.push(lam);
      } else if (/[a-zA-Z]/.test(char)) {
        terms.push(new Var(char));
        index++;
      } else if (char === ')') {
        break;
      } else {
        throw new Error(`Unexpected character '${char}' at position ${index}`);
      }
    }
    if (terms.length === 0) {
      // Allow empty term inside parens for cases like `(y)`
      return null;
    }
    return terms.length > 1 ? terms.reduce((acc, curr) => new App(acc, curr)) : terms[0];
  };

  const term = parseTerm();
  if (index < input.length) {
    throw new Error('Extra characters after expression');
  }
  if (!term) {
    throw new Error('Empty expression');
  }
  return term;
}

function betaReduce(term) {
  if (term instanceof Var) {
    return term;
  } else if (term instanceof App) {
    if (term.func instanceof Lam) {
      return substitute(term.func.body, term.func.varName, term.arg);
    }
    const reducedFunc = betaReduce(term.func);
    if (reducedFunc !== term.func) {
      return new App(reducedFunc, term.arg);
    }
    const reducedArg = betaReduce(term.arg);
    if (reducedArg !== term.arg) {
      return new App(term.func, reducedArg);
    }
    return term;
  } else if (term instanceof Lam) {
    const reducedBody = betaReduce(term.body);
    if (reducedBody !== term.body) {
      return new Lam(term.varName, reducedBody);
    }
    return term;
  }
}

function drawDiagram(term) {
    const PADDING = 30;
    const VAR_SPACING = 40;
    const LEVEL_HEIGHT = 30;
    const LINE_WIDTH = 2;
    
    const COLOR_LAMBDA = '#ffffff';
    const COLOR_VAR = '#ffffff';
    const COLOR_APP = '#ffffff';
    const COLOR_BG = '#1a1a2e';

    // Step 1: Collect all variables in left-to-right order
    const variables = [];
    function collectVars(t) {
        if (t instanceof Var) {
            variables.push(t);
        } else if (t instanceof Lam) {
            collectVars(t.body);
        } else if (t instanceof App) {
            collectVars(t.func);
            collectVars(t.arg);
        }
    }
    collectVars(term);

    // Step 2: Assign x-coordinates to variables
    variables.forEach((v, i) => {
        v.x = PADDING + i * VAR_SPACING;
    });

    // Step 3: Collect lambda abstractions and their depths
    const lambdas = [];
    function collectLambdas(t, depth = 0, bindings = []) {
        if (t instanceof Var) {
            // Find which lambda binds this variable
            const binding = bindings.slice().reverse().find(b => b.name === t.name);
            if (binding) {
                t.bindingDepth = binding.depth;
            }
        } else if (t instanceof Lam) {
            const lambda = {
                name: t.varName,
                depth: depth,
                y: PADDING + depth * LEVEL_HEIGHT
            };
            lambdas.push(lambda);
            collectLambdas(t.body, depth + 1, [...bindings, lambda]);
        } else if (t instanceof App) {
            collectLambdas(t.func, depth, bindings);
            collectLambdas(t.arg, depth, bindings);
        }
    }
    collectLambdas(term);

    // Step 4: Collect applications (connections between leftmost variables)
    const applications = [];
    function collectApps(t) {
        if (t instanceof App) {
            const funVars = [];
            const argVars = [];
            
            function getVars(term, varList) {
                if (term instanceof Var) {
                    varList.push(term);
                } else if (term instanceof Lam) {
                    getVars(term.body, varList);
                } else if (term instanceof App) {
                    getVars(term.func, varList);
                    getVars(term.arg, varList);
                }
            }
            
            getVars(t.func, funVars);
            getVars(t.arg, argVars);
            
            if (funVars.length > 0 && argVars.length > 0) {
                // Connect leftmost variables
                const leftmostFun = funVars.reduce((leftmost, v) => 
                    v.x < leftmost.x ? v : leftmost);
                const leftmostArg = argVars.reduce((leftmost, v) => 
                    v.x < leftmost.x ? v : leftmost);
                
                applications.push({
                    from: leftmostFun,
                    to: leftmostArg
                });
            }
            
            // Recursively collect applications from subterms
            collectApps(t.func);
            collectApps(t.arg);
        }
    }
    collectApps(term);

    // Step 5: Calculate diagram dimensions
    const maxX = Math.max(...variables.map(v => v.x)) + VAR_SPACING;
    const maxY = PADDING + lambdas.length * LEVEL_HEIGHT + 100; // Extra space for variable lines

    // Step 6: Generate SVG
    let svg = `<svg width="${maxX}" height="${maxY}" style="background: ${COLOR_BG}">`;

    // Draw lambda abstraction lines (horizontal)
    lambdas.forEach(lambda => {
        const lambdaVars = variables.filter(v => v.bindingDepth === lambda.depth);
        if (lambdaVars.length > 0) {
            const minX = Math.min(...lambdaVars.map(v => v.x));
            const maxX = Math.max(...lambdaVars.map(v => v.x));
            svg += `<line x1="${minX}" y1="${lambda.y}" x2="${maxX}" y2="${lambda.y}" 
                    stroke="${COLOR_LAMBDA}" stroke-width="${LINE_WIDTH}"/>`;
            
            // Label the lambda
            svg += `<text x="${minX - 15}" y="${lambda.y + 5}" fill="${COLOR_LAMBDA}" 
                    font-family="monospace" font-size="12">λ${lambda.name}</text>`;
        }
    });

    // Draw variable lines (vertical from binding lambda to bottom)
    variables.forEach(v => {
        if (v.bindingDepth !== undefined) {
            const lambdaY = PADDING + v.bindingDepth * LEVEL_HEIGHT;
            const varY = maxY - 50;
            svg += `<line x1="${v.x}" y1="${lambdaY}" x2="${v.x}" y2="${varY}" 
                    stroke="${COLOR_VAR}" stroke-width="${LINE_WIDTH}"/>`;
            
            // Label the variable
            svg += `<text x="${v.x - 5}" y="${varY + 15}" fill="${COLOR_VAR}" 
                    font-family="monospace" font-size="12">${v.name}</text>`;
        }
    });

    // Draw application connections (horizontal between variables)
    applications.forEach(app => {
        const y = maxY - 60; // Just above variable labels
        svg += `<line x1="${app.from.x}" y1="${y}" x2="${app.to.x}" y2="${y}" 
                stroke="${COLOR_APP}" stroke-width="${LINE_WIDTH + 1}"/>`;
    });

    svg += '</svg>';
    
    // Return a React element that renders the SVG
    return React.createElement('div', {
        dangerouslySetInnerHTML: { __html: svg }
    });
}

export { Var, Lam, App, parseLambda, betaReduce, drawDiagram }; 
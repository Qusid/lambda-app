# Lambda Calculus Diagram Generator

A React-based interactive application for visualizing and manipulating lambda calculus expressions.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 Available Scripts

### Development
- **`npm start`** - Runs the app in development mode with hot reload
- **`npm test`** - Launches the test runner in interactive watch mode  
- **`npm run build`** - Builds the app for production deployment

### Testing
- **`npx playwright test`** - Run end-to-end tests
- **`npm test -- --coverage`** - Run tests with coverage report

## 🏗️ Project Structure

```
src/
├── App.js              # Main React component with Material-UI interface
├── Lambda.js           # Lambda calculus parser, evaluator, and diagram generator
├── index.js            # Application entry point
├── App.css             # Application styles
└── index.css           # Global styles

tests/
└── app.spec.js         # Playwright e2e tests

public/
├── index.html          # HTML template
└── ...                 # Static assets
```

## 🔧 Core Components

### Lambda Calculus Engine (`Lambda.js`)
- **Parser**: Recursive descent parser for lambda expressions
- **AST Classes**: `Term`, `Var`, `Lam`, `App` for expression representation
- **Beta Reduction**: Step-by-step evaluation with proper substitution
- **Diagram Generator**: SVG visualization of variable bindings and applications

### React UI (`App.js`)
- Material-UI dark theme interface
- Interactive expression input with symbol buttons
- Real-time diagram generation and updates
- Beta reduction controls

## 📚 Lambda Expression Syntax

| Expression | Description | Example |
|------------|-------------|---------|
| `x` | Variable | `x`, `y`, `f` |
| `λx.M` | Abstraction | `λx.x` (identity) |
| `(M N)` | Application | `(λx.x y)` |
| Nested | Complex expressions | `((λx.(λw.xw))(λa.(λf.f)))` |

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests**: Jest-based tests for lambda calculus operations
- **E2E Tests**: Playwright tests for complete user workflows
- **Integration Tests**: UI component interaction testing

```bash
# Run all tests
npm test

# Run e2e tests with UI
npx playwright test --ui

# Generate test coverage
npm test -- --coverage --watchAll=false
```

## 🎯 Features

### Expression Parsing
- Supports variables, lambda abstractions, and function applications
- Handles nested parentheses and complex expressions
- Error reporting with position information

### Visualization
- Dynamic SVG diagram generation
- Visual representation of variable bindings
- Application connections between expressions
- Automatic layout and positioning

### Beta Reduction
- Step-by-step evaluation
- Alpha conversion to avoid variable capture
- Proper substitution handling
- Loop detection for safety

## 🔧 Technical Details

### Dependencies
- **React 19.1.0**: Latest React with concurrent features
- **Material-UI 7.2.0**: Component library and theming
- **Playwright**: End-to-end testing framework

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance
- Handles expressions up to ~50 levels of nesting
- Real-time parsing and visualization
- Efficient AST manipulation and rendering

## 🚀 Deployment

```bash
# Build for production
npm run build

# The build folder contains optimized static files
# Deploy the contents to any static hosting service
```

The build is optimized and ready for deployment to services like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Development

### Code Style
- ESLint configuration included
- Prettier formatting recommended
- React Hooks patterns
- Functional components preferred

### Adding Features
1. Extend lambda calculus operations in `Lambda.js`
2. Update UI components in `App.js`
3. Add corresponding tests in `tests/`
4. Update documentation

### Common Development Tasks

```bash
# Add new dependency
npm install <package-name>

# Run linter
npx eslint src/

# Format code
npx prettier --write src/

# Analyze bundle size
npm run build && npx serve -s build
```

---

For more detailed information, see the main project README.

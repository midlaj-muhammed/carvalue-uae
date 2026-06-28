# Contributing to CarValue UAE

Thank you for your interest in contributing! Here's how to get started.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/your-username/carvalue-uae.git
   cd carvalue-uae
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies**:
   ```bash
   uv sync
   cd frontend && npm install && cd ..
   ```

## Development Workflow

### Making Changes

- Keep changes focused — one feature or fix per PR
- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation if needed

### Before Submitting

```bash
# Run backend tests
cd backend && uv run pytest tests/ -v

# Run frontend build
cd frontend && npm run build

# Run ML evaluation (if ML code changed)
uv run python ml/evaluate.py
```

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add fuel type filter to prediction form
fix: resolve CORS issue with production frontend
docs: update API endpoint documentation
```

## Pull Requests

1. Push your changes to your fork
2. Open a Pull Request against `main`
3. Fill in the PR template with:
   - **What** you changed
   - **Why** you changed it
   - **How** to test it
4. Wait for CI checks to pass
5. Request a review

## Reporting Bugs

Open an [issue](https://github.com/midlaj-muhammed/carvalue-uae/issues) with:

- **Description** of the bug
- **Steps** to reproduce
- **Expected** vs **actual** behavior
- **Screenshots** if applicable

## Code of Conduct

Be respectful, constructive, and inclusive. We're building something useful together.

## Questions?

Open a [discussion](https://github.com/midlaj-muhammed/carvalue-uae/issues) or reach out directly.

# Version Control Guide

## Git Usage
- Commit messages should be clear and descriptive.
- Follow a simple prefix convention if possible (e.g., `feat:`, `fix:`, `docs:`, `ui:`).

## Branching Strategy
- `main`: Stable production-ready code. Contains the live version of the site.
- `dev` / `staging`: Used for testing new features before pushing to main.
- `feature/*`: Branch off of `main` or `dev` to work on individual features or fixes (e.g., `feature/image-upload`, `fix/cart-bug`).

## Collaboration Rules
1. Never commit API keys or sensitive company data (ensure `.gitignore` is used if expanding to backend).
2. Pull latest changes from `main` before starting a new feature branch.
3. Test locally with the Local Storage items cleared to ensure clean initialization.
4. Try to make smaller, frequent commits rather than massive one-time commits.

# Security Policy

## Supported Versions

Because this project is still in development, only the latest version of the project is supported.

| Version              | Supported          |
| -------------------- | ------------------ |
| Latest / main branch | :white_check_mark: |
| Older versions       | :x:                |

## Security Rules

To keep the project safe and clean, the following security rules must be followed:

* [ ] API keys, tokens, passwords, and other secrets must never be committed to the repository.
* [ ] API keys and private configuration files must stay local on the developer's device.
* [ ] Personal data may not be shared, uploaded, or stored unless it is clearly needed for the project.
* [ ] Do not add real personal information to test data.
* [ ] Do not expose sensitive data in frontend code, console logs, screenshots, commits, or pull requests.
* [ ] Use `.env` files or local configuration files for private values when needed.
* [ ] Make sure private files are added to `.gitignore`.

## Reporting a Vulnerability

If you find a security issue, do not create a public GitHub issue for it.

Instead, report it privately to the project team or the project owner. Describe the problem clearly and include the following information if possible:

* What the security issue is
* Where the issue was found
* Steps to reproduce the issue
* What data or functionality could be affected
* A possible solution, if you already know one

The project team will review the report and decide whether the issue needs to be fixed immediately.

## Vulnerability Handling

When a vulnerability is accepted:

* [ ] A separate security fix issue or branch will be created if needed.
* [ ] The problem will be fixed before related code is merged.
* [ ] The fix will be reviewed before being added to the main branch.

When a vulnerability is declined:

* [ ] The reason will be explained to the reporter.
* [ ] No changes will be made unless new information becomes available.

## Important Notes

This project should not contain real personal data, private API keys, passwords, or production secrets.

If sensitive data is accidentally committed, it must be removed as soon as possible and the affected key, token, or password should be replaced.

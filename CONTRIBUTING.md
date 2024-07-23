## Commits

Use the following structure: `<type>(<scope>): <subject>` [See full examples here](https://www.conventionalcommits.org/en/v1.0.0/#examples)

> i.e: if you are integrating a new language to your project, the commit would be `feat(lang): spanish language added`

> i.e: if you are fixing some bug on a form, the commit would be `fix(contact): email input validated`

### Commit structure

```text
feat(lang): spanish language added
^--^^-----^^---------------------^
|   |      |
|   |      +--> Summary in past simple tense.
|   |
|   +---------> Optional scope about task, file, package, etc.
|
+-------------> Type: feat, fix, chore, build, ci, docs, style, refactor, perf, test
```

### Commit Types

- `build`: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- `ci`: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- `docs`: Documentation only changes
- `feat`: A new feature for the user, not a new feature for building scripts
- `fix`: A bug fix for the user, not a fix to a build script
- `perf`: A code change that improves performance
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `test`: Adding missing tests or correcting existing tests; not production code
- `chore`: Updating packages or configurations; no production code change

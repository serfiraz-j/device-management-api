# Dependency Security Audit

## Scope

Device Management REST API npm dependency security review.

## Previous Audit Results

The previous audit reported:

| Scope | Findings |
|---|---|
| Production dependencies | 0 |
| All dependencies | 25 |
| Moderate | 12 |
| High | 12 |
| Critical | 1 |

These are historical audit results and must be verified again before delivery.

## Key Finding

A critical advisory was reported for the `handlebars` package through the Newman/Postman dependency chain.

Other findings affected development dependencies, including tooling used for API testing and linting.

## Risk Management

- Newman is installed as a development dependency.
- Only trusted Postman collections should be executed.
- API tests must run against development or isolated test data.
- Production dependencies are checked separately using `npm audit --omit=dev`.
- Unresolved advisories are disclosed rather than marked as fixed.
- Breaking dependency changes are not applied without testing.

## Remediation Follow-up

- [ ] Record the latest npm audit results and audit date.
- [ ] Review safe dependency updates.
- [ ] Evaluate supported alternatives for Newman.
- [ ] Re-run all automated tests after dependency changes.
- [ ] Close the security follow-up only after verifying remediation or formally accepting the remaining risks.
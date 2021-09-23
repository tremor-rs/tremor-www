---
title: Documentation Changes
id: docs_changes
---

# RFC policy - Documentation design

Any change to tremor that requires an RFC requires complete documentation to be contributed to cover the changes covered by the RFC and any changes to existing capabilities, features or functions within tremor.

Any change to tremor that changes a public behaviour, configuration or any other expectation that a user of the project interacts with should result in documentation being created, changed or removed consistent with the change itself.

All maintainers, in all sub-teams will monitor for documentation and content changes and may request changes to contributions - such as the addition of relevant details for complex changes; or, for additional content to be created where new capabilities or features are being added. For example, a new `codec` or `connector` should include examples of how to correctly configure and use them in a canonical example tremor application.

Documentation RFCs, if they are needed, are managed by the documentation sub-team, and tagged `docs`.

All RFCs are monitored by the documentation sub-team who will do an initial triage of new `needs-rfc` PRs within a week of submission. The result of triage be a decision on the documentation needs for the PR or RFC candidate.

Generally speaking all user facing functions, interactions or behaviors requires
both reference and practical `how to get jobs done` guides and be accompanied
with functional tutorials and usage examples.

## Since

This is a new process document since 2021-Sep-23.

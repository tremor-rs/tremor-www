---
title: Documentation Changes
id: docs_changes
---

# RFC policy - Documentation design

Any change to tremor that requires an RFC requires complete documentation to be contributed to cover the changes covered by the RFC and any changes to existing capabilities, features or functions within tremor.

Any change to tremor that changes a public behaviour, configuration or any other expectation that a user of the project interacts with should result in documentation being created, changed or removed consistent with the change itself.

All maintainers, in all sub-teams will monitor for documentation and content changes and may request changes to contributions - such as the addition of relevant details for complex changes; or, for additional content to be created where new capabilities or features are being added. For example, a new `codec` or `connector` should include examples of how to correctly configure and use them in a canonical example tremor application.

Documentation RFCs are managed by the documentation sub-team, and tagged `docs`. The
documentation sub-team will do an initial triage of new PRs within a week of
submission. The result of triage will either be that the PR is assigned to a
member of the sub-team for shepherding, the PR is closed as postponed because
the sub-team believe it might be a good idea, but is not currently aligned with
Tremor's priorities, or the PR is closed because the sub-team feel it should
not be done and further discussion is not necessary. In the latter two
cases, the sub-team will give a detailed explanation. We'll follow the standard
procedure for shepherding, final comment period, etc.

## Since

This is a new process document since 2023-Sep-22.
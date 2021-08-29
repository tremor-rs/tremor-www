# RFC policy - architecture design

Pretty much every change to the tremor internals architecture needs an RFC.
Note that new facilities (or major changes to an existing facilities) are
considered changes to tremor architecture.

Architecture RFCs are managed by the architecture sub-team, and tagged `arch`. The
architecture sub-team will do an initial triage of new PRs within a week of
submission. The result of triage will either be that the PR is assigned to a
member of the sub-team for shepherding, the PR is closed as postponed because
the subteam believe it might be a good idea, but is not currently aligned with
Tremor's priorities, or the PR is closed because the sub-team feel it should
clearly not be done and further discussion is not necessary. In the latter two
cases, the sub-team will give a detailed explanation. We'll follow the standard
procedure for shepherding, final comment period, etc.

As changes to tremor architecture may intersect with multiple sub-teams, it may
require multiple shepherds - one from each sub-team, and a core member to coordinate.

In general, changes to core architecture and internals implies a significant investment
by the contributor to Tremor and implies that the contributor wishes to become a
member committed to continued investment in the project. The core sub-team may wish
to discuss commitment with significant contributions to insure progressing those RFCs
and long term maintenance and evolution of contributed work.

## Amendments

Sometimes in the implementation of an RFC, changes are required. In general
these don't require an RFC as long as they are very minor and in the spirit of
the accepted RFC (essentially bug fixes). In this case implementers should
submit an RFC PR which amends the accepted RFC with the new details. Although
the RFC repository is not intended as a reference manual, it is preferred that
RFCs do reflect what was actually implemented. Amendment RFCs will go through
the same process as regular RFCs, but should be less controversial and thus
should move more quickly.

When a change is more dramatic, it is better to create a new RFC. The RFC should
be standalone and reference the original, rather than modifying the existing
RFC. You should add a comment to the original RFC with referencing the new RFC
as part of the PR.

Obviously there is some scope for judgment here. As a guideline, if a change
affects more than one part of the RFC (i.e., is a non-local change), affects the
applicability of the RFC to its motivating use cases, or there are multiple
possible new solutions, then the feature is probably not 'minor' and should get
a new RFC.

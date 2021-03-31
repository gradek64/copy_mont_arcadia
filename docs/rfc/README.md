# RFC: Request for Commments

RFCs are for engineers in monty to bring about change to the codebase. It adds a little more
formality to how things were done previously regarding changes that impact all squads.
They should help us to avoid some of the communication problems we've had in the past.

RFCs are a way to empower engineers to change the codebase for the better. They allow everyone
to know what changes are coming up, voice their opinion and help to decide whether the change should
happen or not.

If a change is required that is not business specific, it should probably be an RFC.

Over time, RFCs will provide us with a history of documentation of the main changes to the codebase.

## The RFC process

An RFC is simply a markdown file with a suggestion of a change. The rfc-template.md
is the starting point of all RFCs with some common points that need to be addressed.

1. Draft: Someone opens a PR with a template RFC filled out with the details of the change. The PR can then be shared and commented on directly to iron out any obvious issues.

2. Proposal: The RFC should then be presented by the author at the next guild meeting. The RFC is then put to a vote. If the majority are in favour of the change, the RFC can then be brought up at the next Tech Leads meeting.

3. Approved: At the Tech Leads meeting we then discuss the RFC in more depth and if approved, Tom can prioritise the work to implement the change along with the PTM tickets. Once approved the RFC can be merged into develop.

## What an RFC is not

An RFC is not...

- a feature request. These should be raised to a Product Owner to be prioritised along with regular Monty work
- a replacement for PTM tickets. RFC work may well be done with PTM tickets. PTM tickets should still be used to raise small changes for platform maintenance.
- an opportunity to flame. An RFC PR shouldn't focus on what's wrong but rather a proposed solution to a problem.
Equally, people commenting on the RFC should be respectful of the authors work even if they disagree with it.

## Codemods

Codemods can analyse the code to see how often an anti-pattern or dependency is used, giving us an idea of the breadth of your suggested change. You can also create scripts that transform the codebase to refactor anti-patterns.

There are 3 npm scripts to assist in this:

- `rfc:analyse` - runs analyse.js against the codebase, this should be used to analyse the code base and output a log file
- `rfc:transform` - runs transform.js against the codebase, this should be used to apply transformations to the code.
- `rfc:process` - runs process-results.js, this should be used to turn your log file into a more useful set of results

(all tasks must be run via `npm run` from the root directory of your rfc)

An example of these script can be found in the `example-rfc-with-codemod` directory.
Some helpful methods for logging are in `docs/rfc/utils.js`.

To learn more about using or producing codemods see [awesome-jscodeshift](https://github.com/sejoker/awesome-jscodeshift).

*Note: We're currently using a fork of jscodescript that support decorators, ple`se raise any issue against the fork not the main repository.*

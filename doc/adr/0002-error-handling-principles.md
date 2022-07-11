# 1. Record architecture decisions

Date: 2022-07-11

## Status

Accepted

## Context

Historically error handling has been limited to allow the application to function in the case of unexpected errors. Over time as the complexity of the application has increased this has led to errors passing unnoticed and difficulty in debugging them when they do happen. To address this problem we want to establish some error handling principles to guide future development and as a basis for retrofitting proper error handling into the existing code.  

## Decision

We will adopt a common set of error handling principles which will be documented [here](https://dsdmoj.atlassian.net/wiki/spaces/PIC/pages/4066050065/Error+handling+principles). This will be kept as a living document and kept up to date with the latest agreed ways of working within the dev team.

## Consequences

- Existing code which does not comply with the above principles will need to be updated
- Developers should apply these principles for all future work in `prepare-a-case`
- Developers should raise any issues with the principles with the team and update the living document as needed

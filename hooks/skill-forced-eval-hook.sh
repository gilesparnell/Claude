#!/bin/bash
# UserPromptSubmit hook — forces skill evaluation before every response.
#
# ALWAYS-ACTIVE skills (must activate when producing code):
#   - tdd-first: mandatory test-first development
#   - verification-before-completion: no claims without evidence
#
# All other skills: evaluate and activate if relevant.

cat <<'EOF'
INSTRUCTION: MANDATORY SKILL ACTIVATION (enforced by hook — not optional)

BEFORE doing anything, evaluate skills:

ALWAYS-ACTIVE (activate these whenever producing non-trivial code):
  - tdd-first — tests BEFORE implementation. No exceptions.
  - verification-before-completion — evidence BEFORE claiming done.

THEN check <available_skills> for additional relevance.

IF any skills are relevant:
  1. State which skills and why (only mention relevant ones)
  2. Activate ALL relevant skills with Skill() tool
  3. Then proceed with implementation

IF no skills are relevant AND no code is being produced:
  - Proceed directly (no statement needed)

CRITICAL: Activate ALL relevant skills via Skill() tool before implementation.
Mentioning a skill without activating it is worthless.
Producing code without activating tdd-first is a violation.
EOF

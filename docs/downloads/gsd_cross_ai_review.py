#!/usr/bin/env python3
"""Bridge GSD's external code-review hook to a second AI.

`/gsd-ship` pipes a review prompt (phase diff + context) into
`workflow.code_review_command` and expects one JSON object on stdout with a
`verdict` of APPROVED or REVISE. This hands that prompt to `cursor-agent` in
read-only ask mode, so the code is reviewed by a different model from the one
that wrote it, and returns the reviewer's JSON.

Every failure (no reviewer, timeout, non-zero exit, no JSON, unknown verdict)
exits non-zero with a reason on stderr. /gsd-ship then warns and falls back to
its manual review options; nothing here can turn a failure into an approval.

Wire it up in .planning/config.json (absolute path; ship does not expand ~):
  "code_review_command": "python3 /Users/<you>/.claude/scripts/gsd_cross_ai_review.py --model <model>"
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

VERDICTS = {"APPROVED", "REVISE"}
# /gsd-ship kills the command at 120 s; stop first so the reason is ours.
DEFAULT_TIMEOUT = 110


def fail(msg):
    print(f"gsd_cross_ai_review: {msg}", file=sys.stderr)
    sys.exit(1)


def extract_json(text):
    """Return the first JSON object carrying a verdict, fenced or bare."""
    candidates = re.findall(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.S)
    start = text.find("{")
    if start != -1:
        candidates.append(text[start:text.rfind("}") + 1])
    for raw in candidates:
        try:
            obj = json.loads(raw)
        except ValueError:
            continue
        if isinstance(obj, dict) and "verdict" in obj:
            return obj
    return None


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--binary", default="cursor-agent")
    ap.add_argument("--model", default=None)
    ap.add_argument("--timeout", type=float, default=DEFAULT_TIMEOUT)
    args = ap.parse_args()

    prompt = sys.stdin.read()
    if not prompt.strip():
        fail("empty review prompt on stdin")

    # The prompt goes by file reference: a full diff overflows argv limits. The
    # reviewer runs inside the file's own directory, because cursor-agent in ask
    # mode stalls asking permission to read anything outside its workspace.
    work_dir = tempfile.mkdtemp(prefix="gsd-xai-review-")
    prompt_path = os.path.join(work_dir, "review-request.md")
    try:
        with open(prompt_path, "w") as f:
            f.write(prompt)
        cmd = [args.binary, "-p"]
        if args.model:
            cmd += ["--model", args.model]
        cmd += ["--mode", "ask", "--trust", "--output-format", "text",
                f"Read the review request in {prompt_path} and follow it exactly. "
                "Reply with only the JSON object it asks for."]
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=args.timeout,
                                 cwd=work_dir, stdin=subprocess.DEVNULL)
        except FileNotFoundError:
            fail(f"reviewer binary not found: {args.binary}")
        except subprocess.TimeoutExpired:
            fail(f"reviewer timed out after {args.timeout:g}s")
    finally:
        shutil.rmtree(work_dir, ignore_errors=True)

    if res.returncode != 0:
        fail(f"reviewer exited {res.returncode}: {res.stderr.strip()[:500]}")
    review = extract_json(res.stdout)
    if review is None:
        fail(f"no JSON verdict in reviewer output: {res.stdout.strip()[:300]!r}")
    verdict = str(review["verdict"]).upper()
    if verdict not in VERDICTS:
        fail(f"unknown verdict {review['verdict']!r}; expected APPROVED or REVISE")
    review["verdict"] = verdict
    print(json.dumps(review))


if __name__ == "__main__":
    main()

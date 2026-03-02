# Lessons

- When composing CDK apps with nested stack artifacts, never reuse the same physical `stackName` across root and child artifacts; enforce uniqueness before first deploy.
- Deployment helper scripts must select explicit artifact patterns (e.g. `^OpenclawStack/`) instead of broad text filters to avoid cross-artifact collisions.
- Do not mark infrastructure fixes complete without proof artifacts: before/after behavior diff, deploy/synth evidence, live request results, and CloudWatch logs confirming handler execution.

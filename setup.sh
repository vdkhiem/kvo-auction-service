#!/bin/bash

set -eo pipefail

echo -e "Yay! It all worked! 👍\n"

echo "BUILDKITE_PIPELINE_SIT_AWS_KEY: $BUILDKITE_PIPELINE_SIT_AWS_KEY"
echo "BUILDKITE_PIPELINE_SIT_AWS_SECRET: $BUILDKITE_PIPELINE_SIT_AWS_SECRET"

serverless config credentials --overwrite --provider aws --key AKIASBCQKNZLFOMPGV4M --secret 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
sls deploy -v
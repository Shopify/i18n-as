#!/bin/bash

npm run test:general &&
npm run test:success_no_config_file &&
npm run test:success_with_config_file &&
npm run test:failure_transform_not_used &&
npm run test:transform_only_works_on_i18n_as_sources

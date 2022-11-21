#!/bin/bash

source $(dirname "$0")/helper.sh

load_env 'example-todo'
execute_docker_services 'example-todo'

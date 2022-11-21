#!/bin/bash

source $(dirname "$0")/helper.sh

environment=dev
load_env 'example-todo'
execute_docker_services 'example-todo'

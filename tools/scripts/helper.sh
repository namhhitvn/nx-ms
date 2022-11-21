#!/bin/bash

scripts_dir=`dirname $(readlink -f "$BASH_SOURCE")`

function load_env() {
  scope=$1
  file_path="$scripts_dir/../environments/.env.$scope"
  file_path_env="$scripts_dir/../environments/.env.$scope.$environment"
  file_path_sample="$scripts_dir/../environments/.env.$scope.sample"

  if [ -f $file_path_sample ]; then
    file_path=$file_path_sample
  fi

  if [ -f $file_path ]; then
    export $(grep -v '^#' "$file_path" | xargs)
  elif [ -f $file_path_sample ]; then
    export $(grep -v '^#' "$file_path_sample" | xargs)
  else
    echo "Not exist environment with scope \"$scope\" in folder tools/environments"
  fi
}

function execute_docker_services() {
  scope_services=("${@}")
  scopes=()
  scopes_with_flag=()
  services=()

  for item in "${scope_services[@]}"; do
    scope=${item%:*}
    service=${item#*:}

    if [ $service = $scope ]; then
      service=""
    fi

    if [ ! -z "$scope" ]; then
      file_path="$scripts_dir/../composes/docker-compose.$scope.yml"
      file_path_env="$scripts_dir/../composes/docker-compose.$scope.$environment.yml"
      compose_path=$file_path

      if [ -f $file_path_env ]; then
        compose_path=$file_path_env
      fi

      if [ -f $compose_path ]; then
        scopes+=( "$compose_path" )
        scopes_with_flag+=( "--file=$compose_path" )

        if [ -z "$service" ]; then
          _services=$(docker compose -f $compose_path config --services)
          services+=(${_services//\\n/ })
        else
          services+=( "$service" )
        fi
      fi
    fi
  done

  function array_unique() {
    items=("$@")
    echo "${items[@]}" | tr ' ' '\n' | sort -u | tr '\n' ' '
  }

  scopes_with_flag=($(array_unique "${scopes_with_flag[@]}"))
  services=($(array_unique "${services[@]}"))

  cmd_prefix="docker-compose ${scopes_with_flag[@]}"
  cmd_up="$cmd_prefix up ${services[@]}"
  cmd_down="$cmd_prefix down"

  all_services=$($cmd_prefix config --services)
  all_services=(${all_services//\\n/ })

  $cmd_up
  $cmd_down
}

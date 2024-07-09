#!/bin/bash
echo "Starting Client"
script_dir=$(realpath $(dirname $0))
cd $script_dir/client/dist
python3 -m http.server 8000

#!/bin/bash
script_dir=$(realpath $(dirname $0))
echo $script_dir
open -na "Terminal" --args "$script_dir/runTelemClient.sh"
open -na "Terminal" --args "$script_dir/runTelemServer.sh"
open "http://localhost:8000"
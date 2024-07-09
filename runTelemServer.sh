#!/bin/bash
echo "Starting Server"
script_dir=$(realpath $(dirname $0))
cd $script_dir/server
./venv/bin/python3 serverMac.py

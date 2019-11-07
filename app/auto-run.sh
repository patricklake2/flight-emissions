#!/bin/bash
cd $(dirname $0)
cd ..
git pull origin
python3 app/main.py
git commit -a -m 'Added daily flight data.'
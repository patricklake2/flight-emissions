#!/bin/bash
cd $(dirname $0)
cd ..
source env/bin/activate
git pull origin
python3 app/main.py
git add .
git commit -m 'Added daily flight data.'
git push origin master
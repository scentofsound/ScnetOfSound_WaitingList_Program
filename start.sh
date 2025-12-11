#bin/bash

cd ./frontend
pm2 start "serve -s dist -l 5173" --name frontend

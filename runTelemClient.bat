@ECHO OFF

TITLE TelemVizClient

cd ./client/dist
python -m http.server

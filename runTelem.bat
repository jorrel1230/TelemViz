@ECHO OFF

TITLE TelemViz

start .\runTelemServer.bat
start .\runTelemClient.bat
start http://localhost:8000

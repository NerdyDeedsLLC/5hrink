#!/bin/bash

serverExecute=$(node "5hrink.js")
if [ $? -eq 0 ]; then
	echo "Running"
else
	echo "Failed"
fi

#!/bin/bash

for NUMB in 1 2 3 4 5
do
	export BUG_TAG=bug$NUMB
	declare -a arr=("REST" "Chat" "VideoSession")
	for testName in "${arr[@]}"
	do
   		docker rm -f $(docker ps -a -q) || true
		docker-compose up --no-color &> bug${NUMB}_SuT_${testName}.txt &
		
		while true
		do
			HTTP_STATUS=$(curl -Ik https://localhost:5000 | head -n1 | awk '{print $2}')
			if [[ ${HTTP_STATUS} == 200 ]]; then
				break
			fi
			sleep 1
		done

		cd ../../
		mvn -Dtest=FullTeachingTestE2E${testName} -B test >> docker-compose/full-teaching-env/bug${NUMB}_Test_${testName}.txt
		cd docker-compose/full-teaching-env
	done
done


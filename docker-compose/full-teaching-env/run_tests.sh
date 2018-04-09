#!/bin/bash

for NUMB in 1 2 3 4 5
do
	# New folder for bug	
	mkdir bug${NUMB}

	export BUG_TAG=bug$NUMB
	declare -a arr=("REST" "Chat" "VideoSession")
	for testName in "${arr[@]}"
	do
		# Clean and run docker-compose
   		docker rm -f $(docker ps -a -q) || true
		docker-compose up --no-color &> bug${NUMB}/bug${NUMB}_SuT_${testName}.txt &
		
		# Wait for application
		while true
		do
			HTTP_STATUS=$(curl -Ik https://localhost:5000 | head -n1 | awk '{print $2}')
			if [[ ${HTTP_STATUS} == 200 ]]; then
				break
			fi
			sleep 1
		done
	
		# Run test
		cd ../../
		mvn -Dtest=FullTeachingTestE2E${testName} -B test >> docker-compose/full-teaching-env/bug${NUMB}/bug${NUMB}_Test_${testName}.txt
		cd docker-compose/full-teaching-env
	done
	
	# Copy surefire-reports folder and clean it for next iteration
	cp -r ../../target/surefire-reports bug${NUMB}/surefire-reports
	rm -rf ../../target/surefire-reports/*
done


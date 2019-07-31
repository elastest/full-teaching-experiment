#/!bin/bash
# Add sut prefix for the current execution 
sed -i -e "s/image: codeurjc/full-teaching/name: image: codeurjc/full-teaching:${BUG_TAG}/g" -e "s/name: openvidu-java-sut/name: ${ET_SUT_CONTAINER_NAME}-openvidu-java-sut/g" -e "s/io.elastest.service: openvidu-java-sut/io.elastest.service: ${ET_SUT_CONTAINER_NAME}-openvidu-java-sut/g" -e 's/sut_/sut-/g' openvidu-deployment.yaml

#/!bin/bash
# Add sut prefix for the current execution 
sed -i -e "s/name: openvidu-java-sut/name: ${ET_SUT_CONTAINER_NAME}-openvidu-java-sut/g" -e "s/io.elastest.service: openvidu-java-sut/io.elastest.service: ${ET_SUT_CONTAINER_NAME}-openvidu-java-sut/g" -e 's/sut_/sut-/g' openvidu-deployment.yaml

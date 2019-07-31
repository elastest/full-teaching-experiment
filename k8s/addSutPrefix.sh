#/!bin/bash
# Add sut prefix for the current execution 
sed -i -e "s/image: codeurjc\/full-teaching/image: codeurjc\/full-teaching:${BUG_TAG}/g" -e "s/name: full-teaching/name: ${ET_SUT_CONTAINER_NAME}-full-teaching/g" -e "s/io.elastest.service: full-teaching/io.elastest.service: ${ET_SUT_CONTAINER_NAME}-full-teaching/g" -e 's/sut_/sut-/g' full-teaching-deployment.yaml

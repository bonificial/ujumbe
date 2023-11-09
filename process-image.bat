@echo off
set IMAGE_NAME=ujumbe
set ECR_IMAGE_TAG=public.ecr.aws/j9c2n9s8/ujumbe:latest


echo Building Docker image...
docker build -t %IMAGE_NAME% .

echo Tagging Docker image...
docker tag %IMAGE_NAME%:latest %ECR_IMAGE_TAG%

echo Pushing Docker image to AWS ECR
docker push %ECR_IMAGE_TAG%

echo Docker image build and push completed.

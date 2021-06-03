echo "Deploying Backend..."
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 983235779107.dkr.ecr.us-east-2.amazonaws.com
docker build -t icarus .
docker tag icarus:latest 983235779107.dkr.ecr.us-east-2.amazonaws.com/icarus:latest
docker push 983235779107.dkr.ecr.us-east-2.amazonaws.com/icarus:latest
cd aws_deploy
eb deploy
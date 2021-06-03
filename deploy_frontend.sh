echo "Deploying Frontend..."
cd web
export REACT_APP_API_URL=/api
npm run build
aws s3 sync out/ s3://cs492e-icarus --acl public-read
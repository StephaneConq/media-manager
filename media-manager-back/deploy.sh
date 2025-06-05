export PROJECT="stephaneconq"

docker build -t europe-west9-docker.pkg.dev/${PROJECT}/media-manager-repo/media-manager-back:latest .

docker push europe-west9-docker.pkg.dev/${PROJECT}/media-manager-repo/media-manager-back:latest

gcloud builds submit --tag europe-west9-docker.pkg.dev/${PROJECT}/media-manager-repo/media-manager-back:latest

gcloud run deploy media-manager-back --image europe-west9-docker.pkg.dev/${PROJECT}/media-manager-repo/media-manager-back:latest --platform managed --region europe-west9


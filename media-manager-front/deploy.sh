export PROJECT="stephaneconq"

docker build -t europe-west9-docker.pkg.dev/${PROJECT}/media-manager-repo/media-manager-front:latest .

docker push europe-west9-docker.pkg.dev/${PROJECT}/media-manager-repo/media-manager-front:latest

gcloud builds submit --tag europe-west9-docker.pkg.dev/${PROJECT}/media-manager-repo/media-manager-front:latest

gcloud run deploy media-manager-front --image europe-west9-docker.pkg.dev/${PROJECT}/media-manager-repo/media-manager-front:latest --platform managed --region europe-west9


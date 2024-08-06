if [ $# -ne 1 ]; then
  echo "Usage: deploy.sh <your_name>"
  exit 1
fi

REGION=asia-northeast1
YOUR_NAME=$1
FUNCTION_NAME=${YOUR_NAME}-function
BUCKET_NAME=$PROJECT_ID-${YOUR_NAME}-article
SERVICE_ACCOUNT=function-service-account@${PROJECT_ID}.iam.gserviceaccount.com
DATASET_ID=${YOUR_NAME}_dataset
TABLE_ID=article_category

# バケットを作成する
gcloud storage buckets create gs://${BUCKET_NAME} --location=${REGION} --uniform-bucket-level-access &

# データセットとテーブルを作成する
{
  bq mk --dataset --location=${REGION} ${DATASET_ID}
  bq mk --table ${DATASET_ID}.${TABLE_ID} bq/schema.json
} &

# Cloud Functions が使う環境変数を書き出す
echo -e "DATASET_ID: ${DATASET_ID}\nTABLE_ID: ${TABLE_ID}" > env.yaml &

wait

# Cloud Functions をデプロイする
gcloud functions deploy ${FUNCTION_NAME} \
  --entry-point=classify \
  --gen2 \
  --region=${REGION} \
  --source=src \
  --trigger-bucket=${BUCKET_NAME} \
  --runtime=nodejs20 \
  --env-vars-file=env.yaml \
  --trigger-service-account=${SERVICE_ACCOUNT} \
  --service-account=${SERVICE_ACCOUNT} \
  --ingress-settings=internal-only

# デプロイが完了したら、バケットにファイルをアップロードする
gcloud storage cp --recursive gs://${PROJECT_ID}-article/* gs://$BUCKET_NAME

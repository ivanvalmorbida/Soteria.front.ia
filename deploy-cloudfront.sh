#!/bin/bash
set -e

BUCKET="soteria-front-ia-1782132685"
DISTRIBUTION_ID="E1YDG833IACCPP"
REGION="sa-east-1"

echo "=== Buildando o projeto ==="
npm run build

echo ""
echo "=== Enviando para S3 ==="
aws s3 sync dist/ "s3://$BUCKET" --delete --region "$REGION"

echo ""
echo "=== Invalidando cache do CloudFront ==="
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --output json

echo ""
echo "=== Deploy concluído! ==="
echo "URL: https://sot.mielina.com.br"

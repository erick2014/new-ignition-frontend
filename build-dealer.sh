
DEALER_FOLDER=$1
echo "Generating html files for '${DEALER_FOLDER}'"
npx pug src/$DEALER_FOLDER/src/pages --pretty --out src/$DEALER_FOLDER/dist

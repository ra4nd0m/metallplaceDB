set -ex

ROOT=/home/mpl-base/frontend
RELEASES=$ROOT/releases
CURRENT=$ROOT/current
SHARED=$ROOT/shared

RELEASE=$(date '+%Y%m%d%H%M%S')

mkdir -p $RELEASES/$RELEASE/build
cd $RELEASES/$RELEASE/build

git clone https://github.com/qusysert/metallplaceDB.git .

cd chart_service
npm install --save-dev
npm run build
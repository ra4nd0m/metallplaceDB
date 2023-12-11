. /home/mpl-base/.env
set -ex

ROOT=/home/mpl-base/charts
RELEASES=$ROOT/releases
CURRENT=$ROOT/current
SHARED=$ROOT/shared

RELEASE=$(date '+%Y%m%d%H%M%S')

mkdir -p $SHARED
mkdir -p $RELEASES/$RELEASE/build
cd $RELEASES/$RELEASE/build

git clone https://github.com/qusysert/metallplaceDB.git .

# build
cd chart_service
npm install --save-dev
npm run build
cp -r build/* $RELEASES/$RELEASE/
mv $RELEASES/$RELEASE/app.js $RELEASES/$RELEASE/metallplace-charts.js
mv node_modules $RELEASES/$RELEASE
mv assets $RELEASES/$RELEASE
rm -rf $RELEASES/$RELEASE/build

# switch links and run
ln -sfT $RELEASES/$RELEASE $CURRENT
cd $CURRENT
kill $(ps -ax | grep './metallplace-charts.js' | grep -v grep | awk '{print $1}') || :
node ./metallplace-charts.js >> $SHARED/charts.log 2>&1 &

# remove older releases
cd $RELEASES
ls -t ./ | tail -n+4 | xargs rm -rf | :

. /home/mpl-base/.env
set -ex

ROOT=/home/mpl-base/docx
RELEASES=$ROOT/releases
CURRENT=$ROOT/current
SHARED=$ROOT/shared

RELEASE=$(date '+%Y%m%d%H%M%S')

mkdir -p $SHARED
mkdir -p $RELEASES/$RELEASE/build
cd $RELEASES/$RELEASE/build

git clone https://github.com/qusysert/metallplaceDB.git .

# build
cd docx-gen
npm install
cp -r ./* $RELEASES/$RELEASE/
mv $RELEASES/$RELEASE/src/app.js $RELEASES/$RELEASE/src/metallplace-docx.js
rm -rf $RELEASES/$RELEASE/build

# set link and run
ln -sfT $RELEASES/$RELEASE $CURRENT
cd $CURRENT/src
kill $(ps -ax | grep './metallplace-docx.js' | grep -v grep | awk '{print $1}') || :
node ./metallplace-docx.js >> $SHARED/docx.log 2>&1 &

# remove older releases
cd $RELEASES
ls -t ./ | tail -n+4 | xargs rm -rf | :

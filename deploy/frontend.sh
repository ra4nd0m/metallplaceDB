set -ex

ROOT=/home/mpl-base/frontend
RELEASES=$ROOT/releases
CURRENT=$ROOT/current
SHARED=$ROOT/shared

RELEASE=$(date '+%Y%m%d%H%M%S')

mkdir -p $RELEASES/$RELEASE/build
cd $RELEASES/$RELEASE/build

git clone https://github.com/qusysert/metallplaceDB.git .

# build frontend
cd web2
npm install --save-dev
cat /home/mpl-base/.env | sed 's/export //' >.env
npm run build
cp -r dist/* $RELEASES/$RELEASE/
rm -rf $RELEASES/$RELEASE/build
ln -sfT $RELEASES/$RELEASE $CURRENT
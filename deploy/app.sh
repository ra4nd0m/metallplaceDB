. /home/mpl-base/.env
set -ex

ROOT=/home/mpl-base/app
RELEASES=$ROOT/releases
CURRENT=$ROOT/current
SHARED=$ROOT/shared

RELEASE=$(date '+%Y%m%d%H%M%S')

mkdir -p $SHARED
mkdir -p $RELEASES/$RELEASE/build
cd $RELEASES/$RELEASE/build

git clone https://github.com/qusysert/metallplaceDB.git .

# build go server
export PATH="$PATH:/usr/local/go/bin/"
make gen-swagger
make build
cd $RELEASES/$RELEASE
cp build/bin/metallplace .
mkdir docs
cp build/docs/swagger.json ./docs
cp -r build/internal/migrations .
rm -rf build
touch .env


# links
rm -rf $RELEASES/$RELEASE/var
ln -s $SHARED/var $RELEASES/$RELEASE/var

pkill -TERM metallplace || :
ln -sfT $RELEASES/$RELEASE $CURRENT
$CURRENT/metallplace >>$SHARED/app.log 2>&1 &

# remove older releases
cd $RELEASES
ls -t ./ | tail -n+4 | xargs rm -rf | :
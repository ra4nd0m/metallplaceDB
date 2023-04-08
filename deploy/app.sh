. /home/mpl-base/.env
set -ex

ROOT=/home/mpl-base/app
RELEASES=$ROOT/releases
CURRENT=$ROOT/current
SHARED=$ROOT/shared

RELEASE=$(date '+%Y%m%d%H%M%S')

mkdir -p $RELEASES/$RELEASE/build
cd $RELEASES/$RELEASE/build

git clone https://github.com/qusysert/metallplaceDB.git .


## build charts
#cd chart_service
#npm run build
#mv build charts
#mkdir -p ROOT/$RELEASE/bu
#
#
## build docx
#cd docx-gen
#node src/app.js

# build go server
export PATH="$PATH:/usr/local/go/bin/"
make build
cd $RELEASES/$RELEASE
cp build/bin/metallplace .
cp -r build/internal/migrations .
rm -rf build
touch .env


# links
rm -rf $RELEASES/$RELEASE/var
ln -s $SHARED/var $RELEASES/$RELEASE/var

pkill -TERM metallplace || :
ln -sfT $RELEASES/$RELEASE $CURRENT
$CURRENT/metallplace >>$SHARED/app.log 2>&1 &

cd $RELEASES
ls -t ./ | tail -n+4 | xargs rm -rf | :
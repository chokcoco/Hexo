echo gitPullBat
git init
git remote rm origin
git remote add origin git@github.com:chokcoco/Hexo.git
git pull origin master
echo gitPullBat end
pause

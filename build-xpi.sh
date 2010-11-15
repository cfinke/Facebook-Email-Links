rm -rf .xpi_work_dir/

chmod -R 0777 facebook-email-links/
rm -f facebook-email-links.xpi
mkdir .xpi_work_dir
cp -r facebook-email-links/* .xpi_work_dir/
cd .xpi_work_dir/

rm -rf `find . -name ".git"`
rm -rf `find . -name ".DS_Store"`
rm -rf `find . -name "Thumbs.db"`

cd chrome/
zip -rq ../facebook-email-links.jar *
rm -rf *
mv ../facebook-email-links.jar ./
cd ../
zip -rq ~/Desktop/facebook-email-links.xpi *
cd ..

rm -rf .xpi_work_dir/

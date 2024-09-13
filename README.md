# ionic habits app


## Plugins used
- @capacitor-community/sqlite
- jeep-sqlite@latest (sqlite in browser)
- copyfiles (check package.json scripts change)
- @capacitor/splash-screen
- @capacitor/local-notifications


### Commands you need often
- ionic cap add [platform]
- ionic cap sync [platform] or without specified platform
- ionic cap open android (just opens android app in android studio)
- ionic cap build [platform] (android in my case)
- ionic cap run android --livereload --external --public-host=192.168.1.52
- adb -d shell "run-as [appID found in capacitor.config.ts] cat databases/[dbName]+SQLite.db" > ~/Documents/habits.db (dbName in this case would be appdb) if that doesn't work check next point
- To find database file in android studio. Open up Device Explorer and select emulator you are using. Then open folder data inside that folder there is another folder named data so open that one as well. After you did that find your app (appID) in this example io.ionic.starter and inside that folder you will find folder named databases. When you open databases you should see .db file and you can right click on it and Save As where you want it.
- To read data from sqlite file there are couple of apps that can help. TablePlus, DB Browser for SQLite or any other you find suitable.
- npm run copysqlwasm (if using web/serve and sql-wasm.wasm file is not present in src/assets)


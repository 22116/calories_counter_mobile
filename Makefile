.PHONY: publish

publish:
	npm run build
	npm run sign
	/Users/katarsys/Library/Android/sdk/build-tools/30.0.2/zipalign -f -v 4 ./dist/cordova/android/apk/release/app-release-unsigned.apk ./dist/cordova/android/apk/release/DCounter.apk

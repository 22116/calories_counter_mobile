.PHONY: publish

publish:
	npm run build
	npm run sign
	/Users/katarsys/Library/Android/sdk/build-tools/30.0.2/zipalign -f -v 4 ./dist/capacitor/android/apk/release/app-release-unsigned.apk ./dist/capacitor/android/apk/release/DCounter.apk

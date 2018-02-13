package com.fullteaching.backend.e2e;

import org.junit.jupiter.api.TestInfo;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.runner.JUnitPlatform;
import org.junit.runner.RunWith;

import io.github.bonigarcia.SeleniumExtension;
import io.github.bonigarcia.wdm.ChromeDriverManager;
import io.github.bonigarcia.wdm.FirefoxDriverManager;

@ExtendWith(SeleniumExtension.class)
@RunWith(JUnitPlatform.class)
public class FullTeachingTestE2E {
	
	protected static String APP_URL;
	
	protected static final String CHROME = "chrome";
	protected static final String FIREFOX = "firefox";
	
	public FullTeachingTestE2E (){
		if (System.getenv("ET_EUS_API") == null) {
			// Outside ElasTest
			ChromeDriverManager.getInstance().setup();
			FirefoxDriverManager.getInstance().setup();
		}

		if (System.getenv("ET_SUT_HOST") != null) {
			APP_URL = "https://" + System.getenv("ET_SUT_HOST") + ":5000/";
		} else {
			APP_URL = System.getProperty("app.url");
			if (APP_URL == null) {
				APP_URL = "https://localhost:5000/";
			}
		}
	}
	
	BrowserUser setupBrowser(String browser, TestInfo testInfo, String userIdentifier, int secondsOfWait) {

		BrowserUser u;

		switch (browser) {
		case "chrome":
			u = new ChromeUser("TestUser", secondsOfWait, testInfo.getDisplayName(), userIdentifier);
			break;
		case "firefox":
			u = new FirefoxUser("TestUser", secondsOfWait, testInfo.getDisplayName(), userIdentifier);
			break;
		default:
			u = new ChromeUser("TestUser", secondsOfWait, testInfo.getDisplayName(), userIdentifier);
		}

		u.getDriver().get(APP_URL);

		final String GLOBAL_JS_FUNCTION = "var s = window.document.createElement('script');"
				+ "s.innerText = 'window.MY_FUNC = function(containerQuerySelector) {"
				+ "var elem = document.createElement(\"div\");" + "elem.id = \"video-playing-div\";"
				+ "elem.innerText = \"VIDEO PLAYING\";" + "document.body.appendChild(elem);"
				+ "console.log(\"Video check function successfully added to DOM by Selenium\")}';" + "window.document.head.appendChild(s);";

		u.runJavascript(GLOBAL_JS_FUNCTION);

		return u;
	}

}

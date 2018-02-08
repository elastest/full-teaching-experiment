/*
 * (C) Copyright 2017 OpenVidu (http://openvidu.io/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package com.fullteaching.backend.e2e;

import static java.lang.invoke.MethodHandles.lookup;
import static org.slf4j.LoggerFactory.getLogger;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.junit.platform.runner.JUnitPlatform;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;

import io.github.bonigarcia.SeleniumExtension;
import io.github.bonigarcia.wdm.ChromeDriverManager;
import io.github.bonigarcia.wdm.FirefoxDriverManager;

/**
 * E2E tests for FullTeaching chat in a video session.
 *
 * @author Pablo Fuente (pablo.fuente@urjc.es)
 */
@Tag("e2e")
@DisplayName("E2E tests for FullTeaching chat")
@ExtendWith(SeleniumExtension.class)
@RunWith(JUnitPlatform.class)
public class FullTeachingTestE2EChat {
	
	final String TEACHER_BROWSER = "chrome";
	final String STUDENT_BROWSER = "chrome";

	static String APP_URL = "https://localhost:5000/";
	static Exception ex = null;

	final static Logger log = getLogger(lookup().lookupClass());

	final String teacherMail = "teacher@gmail.com";
	final String teacherPass = "pass";
	final String teacherName = "Teacher Cheater";
	final String studentMail = "student1@gmail.com";
	final String studentPass = "pass";
	final String studentName = "Student Imprudent";

	BrowserUser user;

	@BeforeAll()
	static void setupAll() {

		if (System.getenv("ET_EUS_API") == null) {
			// Outside ElasTest
			ChromeDriverManager.getInstance().setup();
			FirefoxDriverManager.getInstance().setup();
		}

		if (System.getenv("ET_SUT_HOST") != null) {
			APP_URL = "https://" + System.getenv("ET_SUT_HOST") + ":5000/";
		}

		log.info("Using URL {} to connect to openvidu-testapp", APP_URL);
	}

	BrowserUser setupBrowser(String browser) {

		BrowserUser u;

		switch (browser) {
		case "chrome":
			u = new ChromeUser("TestUser", 15);
			break;
		case "firefox":
			u = new FirefoxUser("TestUser", 15);
			break;
		default:
			u = new ChromeUser("TestUser", 15);
		}

		u.getDriver().get(APP_URL);

		return u;
	}

	@AfterEach
	void dispose() {

		this.logout(user);

		user.dispose();
	}

	@Test
	@DisplayName("Test chat in a video session")
	void oneToOneVideoAudioSessionChrome() throws Exception {

		// TEACHER

		this.user = setupBrowser(TEACHER_BROWSER);

		log.info("Test video session");

		this.login(user, teacherMail, teacherPass);

		waitSeconds(1);

		user.getWaiter().until(ExpectedConditions.presenceOfElementLocated(
				By.cssSelector(("ul.collection li.collection-item:first-child div.course-title"))));
		user.getDriver().findElement(By.cssSelector("ul.collection li.collection-item:first-child div.course-title"))
				.click();

		waitSeconds(1);

		user.getWaiter().until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(("#md-tab-label-0-1"))));
		user.getDriver().findElement(By.cssSelector("#md-tab-label-0-1")).click();

		waitSeconds(1);

		user.getDriver().findElement(By.cssSelector("ul div:first-child li.session-data div.session-ready")).click();

		waitSeconds(1);

		// Check connected message
		user.getDriver().findElement(By.cssSelector("#fixed-icon")).click();
		checkSystemMessage("Connected", user);

		// STUDENT

		BrowserUser student = setupBrowser(STUDENT_BROWSER);
		login(student, studentMail, studentPass);

		waitSeconds(1);

		student.getWaiter().until(ExpectedConditions.presenceOfElementLocated(
				By.cssSelector(("ul.collection li.collection-item:first-child div.course-title"))));
		student.getDriver().findElement(By.cssSelector("ul.collection li.collection-item:first-child div.course-title"))
				.click();

		student.getWaiter().until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(("#md-tab-label-0-1"))));
		student.getDriver().findElement(By.cssSelector("#md-tab-label-0-1")).click();

		waitSeconds(1);

		student.getDriver().findElement(By.cssSelector("ul div:first-child li.session-data div.session-ready")).click();

		waitSeconds(1);

		student.getDriver().findElement(By.cssSelector("#fixed-icon")).click();
		
		checkSystemMessage(studentName + " has connected", user);
		checkSystemMessage(teacherName + " has connected", student);

		// Test chat

		waitSeconds(1);

		String teacherMessage = "TEACHER CHAT MESSAGE";
		String studentMessage = "STUDENT CHAT MESSAGE";

		WebElement chatInputTeacher = user.getDriver().findElement(By.id("message"));
		chatInputTeacher.sendKeys(teacherMessage);
		user.getWaiter().until(ExpectedConditions.elementToBeClickable(By.id("send-btn")));
		user.getDriver().findElement(By.id("send-btn")).click();

		waitSeconds(1);

		checkOwnMessage(teacherMessage, teacherName, user);
		checkStrangerMessage(teacherMessage, teacherName, student);

		WebElement chatInputStudent = student.getDriver().findElement(By.id("message"));
		chatInputStudent.sendKeys(studentMessage);
		student.getWaiter().until(ExpectedConditions.elementToBeClickable(By.id("send-btn")));
		student.getDriver().findElement(By.id("send-btn")).click();

		waitSeconds(1);

		checkStrangerMessage(studentMessage, studentName, user);
		checkOwnMessage(studentMessage, studentName, student);

		waitSeconds(2);

		// Logout student
		this.logout(student);
		student.dispose();
		
		checkSystemMessage(studentName + " has disconnected", user);

	}

	private void login(BrowserUser user, String userEmail, String userPass) {
		user.getDriver().findElement(By.id("download-button")).click();

		// Find form elements (login modal is already opened)
		WebElement userNameField = user.getDriver().findElement(By.id("email"));
		WebElement userPassField = user.getDriver().findElement(By.id("password"));

		// Fill input fields
		userNameField.sendKeys(userEmail);

		waitSeconds(1);

		userPassField.sendKeys(userPass);

		waitSeconds(1);

		// Ensure fields contain what has been entered
		Assert.assertEquals(userNameField.getAttribute("value"), userEmail);
		Assert.assertEquals(userPassField.getAttribute("value"), userPass);

		user.getDriver().findElement(By.id("log-in-btn")).click();
	}

	private void logout(BrowserUser user) {
		if (user.getDriver().findElements(By.cssSelector("#fixed-icon")).size() > 0) {
			// Get out of video session page
			if (!isClickable("#exit-icon", user)) { // Side menu not opened
				user.getDriver().findElement(By.cssSelector("#fixed-icon")).click();
				waitForAnimations();
			}
			user.getWaiter().until(ExpectedConditions.elementToBeClickable(By.cssSelector("#exit-icon")));
			user.getDriver().findElement(By.cssSelector("#exit-icon")).click();
		}
		// if (user.getDriver().findElements(By.cssSelector("#arrow-drop-down")).size()
		// > 0) {
		try {
			// Up bar menu
			user.getWaiter().withTimeout(1000, TimeUnit.MILLISECONDS)
					.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#arrow-drop-down")));
			user.getDriver().findElement(By.cssSelector("#arrow-drop-down")).click();
			waitForAnimations();
			user.getWaiter().until(ExpectedConditions.elementToBeClickable(By.cssSelector("#logout-button")));
			user.getDriver().findElement(By.cssSelector("#logout-button")).click();
		} catch (TimeoutException e) {
			// Shrunk menu
			user.getWaiter().withTimeout(1000, TimeUnit.MILLISECONDS)
					.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("a.button-collapse")));
			user.getDriver().findElement(By.cssSelector("a.button-collapse")).click();
			waitForAnimations();
			user.getWaiter().until(
					ExpectedConditions.elementToBeClickable(By.xpath("//ul[@id='nav-mobile']//a[text() = 'Logout']")));
			user.getDriver().findElement(By.xpath("//ul[@id='nav-mobile']//a[text() = 'Logout']")).click();
		}
		waitSeconds(1);
		user.getWaiter().until(ExpectedConditions.elementToBeClickable(By.id("download-button")));
	}

	private boolean isClickable(String selector, BrowserUser user) {
		try {
			WebDriverWait wait = new WebDriverWait(user.getDriver(), 1);
			wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(selector)));
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	private void checkOwnMessage(String message, String sender, BrowserUser user) {
		List<WebElement> messages = user.getDriver().findElements(By.tagName("app-chat-line"));
		WebElement lastMessage = messages.get(messages.size() - 1);

		WebElement msgUser = lastMessage.findElement(By.cssSelector(".own-msg .message-header .user-name"));
		WebElement msgContent = lastMessage.findElement(By.cssSelector(".own-msg .message-content .user-message"));

		user.getWaiter().until(ExpectedConditions.textToBePresentInElement(msgUser, sender));
		user.getWaiter().until(ExpectedConditions.textToBePresentInElement(msgContent, message));
	}

	private void checkStrangerMessage(String message, String sender, BrowserUser user) {
		List<WebElement> messages = user.getDriver().findElements(By.tagName("app-chat-line"));
		WebElement lastMessage = messages.get(messages.size() - 1);

		WebElement msgUser = lastMessage.findElement(By.cssSelector(".stranger-msg .message-header .user-name"));
		WebElement msgContent = lastMessage.findElement(By.cssSelector(".stranger-msg .message-content .user-message"));

		user.getWaiter().until(ExpectedConditions.textToBePresentInElement(msgUser, sender));
		user.getWaiter().until(ExpectedConditions.textToBePresentInElement(msgContent, message));
	}

	private void checkSystemMessage(String message, BrowserUser user) {
		List<WebElement> messages = user.getDriver().findElements(By.tagName("app-chat-line"));
		WebElement lastMessage = messages.get(messages.size() - 1);

		WebElement msgContent = lastMessage.findElement(By.cssSelector(".system-msg"));

		user.getWaiter().until(ExpectedConditions.textToBePresentInElement(msgContent, message));
	}

	private void waitForAnimations() {
		try {
			Thread.sleep(750);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

	private void waitSeconds(int seconds) {
		try {
			Thread.sleep(1000 * seconds);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

}

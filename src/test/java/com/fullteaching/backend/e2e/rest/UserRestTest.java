package com.fullteaching.backend.e2e.rest;

import static org.junit.Assert.fail;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.platform.runner.JUnitPlatform;
import org.junit.runner.RunWith;
import org.springframework.http.HttpStatus;

import com.fullteaching.backend.utils.HttpApiClient;

@DisplayName("Tests for Fullteaching login")
@RunWith(JUnitPlatform.class)
public class UserRestTest {

    protected static String APP_URL;
    protected static String ET_SUT_HOST;
    protected static int ET_SUT_PORT = 5000;
    private HttpApiClient httpApiClient;

    // urls
    static String new_user_uri = "/api-users/new";
    static String change_password_uri = "/api-users/changePassword";
    static String login_uri = "/api-logIn";
    // userStrings
    static String ok_parameters = "[\"unique@gmail.com\", \"Mock66666\", \"fakeUser\", \"IGNORE\"]";
    static String ok_parameters_2 = "[\"unique2@gmail.com\", \"Mock66666\", \"fakeUser\", \"IGNORE\"]";
    // passParameters
    static String pass_parameters = "[\"Mock66666\", \"Mock77777\"]";
    static String revert_pass_parameters = "[\"Mock77777\", \"Mock66666\"]";

    @BeforeAll
    public static void setUp() {
        if (System.getenv("ET_SUT_HOST") != null) {
            ET_SUT_HOST = System.getenv("ET_SUT_HOST");
        } else {
            ET_SUT_HOST = System.getProperty("sut.host");
            if (ET_SUT_HOST == null) {
                ET_SUT_HOST = "localhost";
            }
        }

        if (System.getenv("ET_SUT_PORT") != null) {
            if (!System.getenv("ET_SUT_PORT").isEmpty()) {
                ET_SUT_PORT = Integer.parseInt(System.getenv("ET_SUT_PORT"));
            } else {
                ET_SUT_PORT = 0;
            }
        }
    }

    @Test
    public void testCreateUserOk() {
        try {
            // Create the user if it doesn't exist
            int status = createUser(ok_parameters);

            int expected = HttpStatus.CREATED.value();

            assertEquals(expected, status,
                    "failure - expected HTTP status " + expected);
        } catch (IOException | KeyManagementException | NoSuchAlgorithmException
                | KeyStoreException e) {
            e.printStackTrace();
            fail("EXCEPTION: " + e.getMessage());
        }
    }

    @Test
    public void testChangeUserPassword() {
        try {
            // Create the user if it doesn't exist
            createUser(ok_parameters_2);

            // Change the user's password
            httpApiClient = new HttpApiClient(null, ET_SUT_HOST, ET_SUT_PORT,
                    change_password_uri, "unique2@gmail.com", "Mock66666");

            int status_pass = httpApiClient.sendRequest(pass_parameters, "put");
            assertTrue(status_pass == HttpStatus.OK.value(),
                    "failure login - expected HTTP status "
                            + HttpStatus.OK.value() + " but was: "
                            + status_pass);

            // Revert the change of user password
            httpApiClient = new HttpApiClient(null, ET_SUT_HOST, ET_SUT_PORT,
                    change_password_uri, "unique2@gmail.com", "Mock77777");

            httpApiClient.sendRequest(revert_pass_parameters, "put");

        } catch (IOException | KeyManagementException | NoSuchAlgorithmException
                | KeyStoreException e) {
            e.printStackTrace();
            fail("EXCEPTION: " + e.getMessage());
        }
    }

    private int createUser(String parameters) throws KeyManagementException,
            NoSuchAlgorithmException, KeyStoreException, IOException {
        httpApiClient = new HttpApiClient(null, ET_SUT_HOST, ET_SUT_PORT,
                new_user_uri, null, null);

        return httpApiClient.sendRequest(parameters, "post");
    }

}

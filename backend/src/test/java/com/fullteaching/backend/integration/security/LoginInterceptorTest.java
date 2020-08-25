package com.fullteaching.backend.integration.security;

import com.fullteaching.backend.AbstractLoggedControllerUnitTest;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.junit.Assert.assertEquals;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

public class LoginInterceptorTest extends AbstractLoggedControllerUnitTest {

    private final String loginSecurecUri = "/api-courses/course/123";

    @Before
    public void setUp() {
        super.setUp();
        mvc = MockMvcBuilders.webAppContextSetup(webAppCtx)
                .apply(springSecurity())
                .build();
    }

    @Test
    public void successLoginInterceptorResponse() throws Exception {

        MvcResult result = mvc.perform(get(loginSecurecUri)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .session((MockHttpSession) httpSession)
        ).andReturn();

        MockHttpServletResponse response = result.getResponse();
        assertEquals(200, response.getStatus());
    }

    @Test
    public void notAuthorizedLoginInterceptorResponse() throws Exception {

        MvcResult result = mvc.perform(get(loginSecurecUri)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
        ).andReturn();

        MockHttpServletResponse response = result.getResponse();
        assertEquals(401, response.getStatus());
    }

}

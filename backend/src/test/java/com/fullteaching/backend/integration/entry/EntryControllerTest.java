package com.fullteaching.backend.integration.entry;

import com.fullteaching.backend.AbstractLoggedControllerUnitTest;
import com.fullteaching.backend.model.Comment;
import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.Entry;
import com.fullteaching.backend.utils.CourseTestUtils;
import com.google.gson.Gson;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.Assert.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

public class EntryControllerTest extends AbstractLoggedControllerUnitTest {


    private static String newEntry_uri = "/api-entries/forum/";

    @Before
    public void setUp() {
        super.setUp();
    }

    @Test
    public void newForumEntryControllerTest() {

        Course c = CourseTestUtils.newCourseWithCd("Test Forum", loggedUser, null, "this is the info", true);
        c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);

        long forumId = c.getCourseDetails().getForum().getId();
        long cdId = c.getCourseDetails().getId();


        Comment cm = new Comment("This is the message", System.currentTimeMillis(), loggedUser);
        Entry entry = new Entry("Test Entry", System.currentTimeMillis(), loggedUser);
        entry.getComments().add(cm);

        Assert.assertTrue((forumId > -1) && (cdId > -1));

        Gson gson = new Gson();
        String entry_request = gson.toJson(entry);

        //test ok
        try {

            MvcResult result = mvc.perform(post(newEntry_uri + cdId)//fakeID
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .session((MockHttpSession) httpSession)
                    .content(entry_request + cdId)
            ).andReturn();

            int status = result.getResponse().getStatus();

            int expected = HttpStatus.CREATED.value();

            Assert.assertEquals("failure - expected HTTP status " + expected, expected, status);

        } catch (Exception e) {
            e.printStackTrace();
            fail("EXCEPTION: //test OK");
        }

    }

}

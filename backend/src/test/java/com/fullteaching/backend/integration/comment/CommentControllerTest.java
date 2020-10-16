package com.fullteaching.backend.integration.comment;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import com.fullteaching.backend.entry.NewEntryCommentResponse;
import org.json.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MvcResult;

import com.fullteaching.backend.AbstractLoggedControllerUnitTest;
import com.fullteaching.backend.model.Comment;
import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.Entry;
import com.fullteaching.backend.utils.CourseTestUtils;
import com.fullteaching.backend.utils.ForumTestUtils;
import com.google.gson.Gson;

public class CommentControllerTest extends AbstractLoggedControllerUnitTest {

	private static String newComment_uri ="/api-comments/entry/{entryId}/forum/{courseDetailsId}";
    private static String deleteCommentUri ="/api-comments/comment/delete/{commentId}/{courseId}/{entryId}";

    private static String courseTitle = "Course Title";
	private static String info ="Course information";
	private static boolean forum = true;
	
	
	@Before
	public void setUp() {
		super.setUp();
	}

	@Rollback
	@Test
	public void newCommentTest() throws Exception {
		newComment(false);
	}
	
	@Rollback
	@Test
	public void replyCommentTest() throws Exception {
		
		Course c = CourseTestUtils.newCourseWithCd(courseTitle, loggedUser, null, info, forum);	
		
		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);
						
		Comment cm = new Comment("This is the message", System.currentTimeMillis(), loggedUser);
		Entry entry = new Entry("Test Entry",System.currentTimeMillis(),loggedUser);
		entry.getComments().add(cm);		
		c = ForumTestUtils.newEntry(mvc, c, entry, httpSession);
		
		long entryId = c.getCourseDetails().getForum().getEntries().get(0).getId();
		long forumId = c.getCourseDetails().getForum().getId();
		
		Comment parent = c.getCourseDetails().getForum().getEntries().get(0).getComments().get(0);
		Comment comment = new Comment();
		comment.setMessage("New Comment");
		comment.setCommentParent(parent);
		
		Gson gson = new Gson();
		String request_OK = gson.toJson(comment);
		
		//test new message
		//test ok 
		try {

            MvcResult result =  mvc.perform(post(newComment_uri.replace("{entryId}", String.valueOf(entryId)).replace("{courseDetailsId}", String.valueOf(c.getCourseDetails().getId())))
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(request_OK)
					                ).andReturn();
			
			String content = result.getResponse().getContentAsString();
			
			JSONObject json = (JSONObject) new JSONParser().parse(content);
			json = (JSONObject) json.get("entry");
			
			Entry e = ForumTestUtils.json2Entry(json.toJSONString());

			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.CREATED.value();

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			Assert.assertEquals("failure - expected user x" , loggedUser, e.getComments().get(0).getReplies().get(0).getUser());
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
	}

	private void newComment(boolean deleteIt) throws Exception {
        Course c = CourseTestUtils.newCourseWithCd(courseTitle, loggedUser, null, info, forum);

        c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);

        Comment cm = new Comment("This is the message", System.currentTimeMillis(), loggedUser);
        Entry entry = new Entry("Test Entry",System.currentTimeMillis(),loggedUser);
        entry.getComments().add(cm);

        c = ForumTestUtils.newEntry(mvc, c, entry, httpSession);

        long entryId = c.getCourseDetails().getForum().getEntries().get(0).getId();

        Comment comment = new Comment();
        comment.setMessage("New Comment");

        Gson gson = new Gson();
        String request_OK = gson.toJson(comment);

        Comment toDelete = null;

        //test new message
        //test ok
        try {

            MvcResult result =  mvc.perform(post(newComment_uri.replace("{entryId}", String.valueOf(entryId)).replace("{courseDetailsId}", String.valueOf(c.getCourseDetails().getId())))
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .session((MockHttpSession) httpSession)
                    .content(request_OK)
            ).andReturn();

            String content = result.getResponse().getContentAsString();

            // json parse entry
            NewEntryCommentResponse entryCommentResponse = new Gson().fromJson(content, NewEntryCommentResponse.class);
            Entry e = entryCommentResponse.getEntry();

            // json parse comments
            toDelete = entryCommentResponse.getComment();


            int status = result.getResponse().getStatus();

            int expected = HttpStatus.CREATED.value();

            Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
            Assert.assertEquals("failure - expected user x" , loggedUser,e.getComments().get(0).getUser());

        } catch (Exception e) {
            e.printStackTrace();
            fail("EXCEPTION: //test OK");
        }


        if(deleteIt){

            String uri = deleteCommentUri.replace("{commentId}", String.valueOf(toDelete.getId()));
            uri = uri.replace("{courseId}", String.valueOf(c.getId()));
            uri = uri.replace("{entryId}", String.valueOf(entryId));

            logger.info(uri);

            MvcResult result =  mvc.perform(post(uri)
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .session((MockHttpSession) httpSession)
                    .content(request_OK)
            ).andReturn();

            MockHttpServletResponse response = result.getResponse();

            assertEquals(200, response.getStatus());

        }
    }

    @Rollback
    @Test
    public void deleteCommentTest() throws Exception {

	    newComment(true);

    }

}

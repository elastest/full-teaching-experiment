package com.fullteaching.backend.integration.file;

import com.fullteaching.backend.AbstractLoggedControllerUnitTest;
import com.fullteaching.backend.file.MimeTypes;
import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.FileGroup;
import com.fullteaching.backend.utils.CourseTestUtils;
import com.fullteaching.backend.utils.FileTestUtils;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.junit.Assert.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

public class FileControllerTest extends AbstractLoggedControllerUnitTest {

    private static String upload_uri = "/api-load-files/upload/course/{courseId}/file-group/{fileGroupId}/type/";
    private static String download_uri = "/api-load-files/course/{courseId}/download/";//{fileId}
    private static String uploadPicture_uri = "/api-load-files/upload/picture/";//{userId}

    private static MockMultipartFile firstFile = new MockMultipartFile("file", "filename.txt", "text/plain", "some xml".getBytes());
    private static MockMultipartFile secondFile = new MockMultipartFile("file", "other-file-name.txt", "text/plain", "some other type".getBytes());

    @Before
    public void setUp() {
        super.setUp();
    }


    @Test
    public void fileUploadTest() {
        Course c = CourseTestUtils.newCourseWithCd("Course", loggedUser, null, "this is the info", true);
        c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);

        FileGroup fg = new FileGroup("Test File Group");
        fg = FileTestUtils.newFileGroup(mvc, httpSession, fg, c);


        try {

            String uri = upload_uri.replace("{courseId}", "" + c.getId()).replace("{fileGroupId}", String.valueOf(fg.getId())) + "1";
            logger.info(uri);
            MvcResult result = mvc.perform(MockMvcRequestBuilders.multipart(uri)
                    .file(firstFile)
                    .session((MockHttpSession) httpSession)
            ).andReturn();

            int status = result.getResponse().getStatus();

            int expected = HttpStatus.CREATED.value();

            Assert.assertEquals("failure - expected HTTP status " + expected, expected, status);

            fg = FileTestUtils.json2FileGroup(result.getResponse().getContentAsString());

            Assert.assertEquals("failure - file order" + 0, 0, fg.getFiles().get(0).getIndexOrder());

        } catch (Exception e) {
            e.printStackTrace();
            fail("EXCEPTION: //test OK");
        }
        //test secondFile
        try {
            String uri = upload_uri.replace("{courseId}", "" + c.getId()).replace("{fileGroupId}", String.valueOf(fg.getId())) + "1";

            MvcResult result = mvc.perform(MockMvcRequestBuilders.multipart(uri)
                    .file(secondFile)
                    .session((MockHttpSession) httpSession)
            ).andReturn();

            int status = result.getResponse().getStatus();

            int expected = HttpStatus.CREATED.value();

            Assert.assertEquals("failure - expected HTTP status " + expected, expected, status);

            fg = FileTestUtils.json2FileGroup(result.getResponse().getContentAsString());

            Assert.assertEquals("failure - file order" + 1, 1, fg.getFiles().get(1).getIndexOrder());

        } catch (Exception e) {
            e.printStackTrace();
            fail("EXCEPTION: //test OK");
        }
    }

    @Test
    public void fileDownloadTest() {
        Course c = CourseTestUtils.newCourseWithCd("Course", loggedUser, null, "this is the info", true);
        c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);

        FileGroup fg = new FileGroup("Test File Group");
        fg = FileTestUtils.newFileGroup(mvc, httpSession, fg, c);

        fg = FileTestUtils.uploadTestFile(mvc, httpSession, fg, c);

        long fileId = fg.getFiles().get(0).getId();
        String expected_contentType = MimeTypes.getMimeType(fg.getFiles().get(0).getFileExtension());

        //test OK
        try {

            MvcResult result = mvc.perform(get(download_uri.replace("{courseId}", "" + c.getId()) + fileId)
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .session((MockHttpSession) httpSession)
            ).andReturn();

            int status = result.getResponse().getStatus();

            int expected = HttpStatus.OK.value();

            String contentType = result.getResponse().getContentType();

            String content = result.getResponse().getContentAsString();
            System.out.println(content);

            Assert.assertEquals("failure - expected HTTP status " + expected, expected, status);
            Assert.assertEquals("failure - expected ContenType" + expected_contentType, expected_contentType, contentType);

        } catch (Exception e) {
            e.printStackTrace();
            fail("EXCEPTION: //test OK");
        }
        //test Unkown file
        try {

            MvcResult result = mvc.perform(get(download_uri.replace("{courseId}", "" + c.getId()) + 23123)//Unexisting file
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .session((MockHttpSession) httpSession)
            ).andReturn();

            int status = result.getResponse().getStatus();

            int expected = HttpStatus.OK.value();

            String content = result.getResponse().getContentAsString();
            System.out.println(content);

            Assert.assertEquals("failure - expected HTTP status " + expected, expected, status);

        } catch (Exception e) {
            e.printStackTrace();
            fail("EXCEPTION: //test OK");
        }
        //test UNAUTHORIZED
        try {

            MvcResult result = mvc.perform(get(download_uri.replace("{courseId}", "" + c.getId()) + fileId)
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = result.getResponse().getStatus();

            int expected = HttpStatus.UNAUTHORIZED.value();

            String content = result.getResponse().getContentAsString();
            System.out.println(content);

            Assert.assertEquals("failure - expected HTTP status " + expected, expected, status);

        } catch (Exception e) {
            e.printStackTrace();
            fail("UNAUTHORIZED: //test OK");
        }

        //test BAD_REQUEST UNPROCESSABLE_ENTITY
        try {

            MvcResult result = mvc.perform(get(download_uri.replace("{courseId}", "" + c.getId()) + "not_a_long")
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .session((MockHttpSession) httpSession)
            ).andReturn();

            int status = result.getResponse().getStatus();

            int expected = HttpStatus.UNPROCESSABLE_ENTITY.value();

            String content = result.getResponse().getContentAsString();
            System.out.println(content);

            Assert.assertEquals("failure - expected HTTP status " + expected, expected, status);

        } catch (Exception e) {
            e.printStackTrace();
            fail("UNAUTHORIZED: //test UNPROCESSABLE_ENTITY");
        }
    }


    @Test
    public void pictureUploadTest() {


        try {
            MvcResult result = mvc.perform(MockMvcRequestBuilders.multipart(uploadPicture_uri + loggedUser.getId())
                    .file(firstFile)
                    .session((MockHttpSession) httpSession)
            ).andReturn();

            int status = result.getResponse().getStatus();

            int expected = HttpStatus.OK.value();

            Assert.assertEquals("failure - expected HTTP status " + expected, expected, status);


        } catch (Exception e) {
            e.printStackTrace();
            fail("EXCEPTION: //test OK");
        }

        //BAD_REQUEST
        try {
            MvcResult result = mvc.perform(MockMvcRequestBuilders.fileUpload(uploadPicture_uri + "not_a_long")
                    .file(firstFile)
                    .session((MockHttpSession) httpSession)
            ).andReturn();

            int status = result.getResponse().getStatus();

            int expected = HttpStatus.BAD_REQUEST.value();

            Assert.assertEquals("failure - expected HTTP status " + expected, expected, status);


        } catch (Exception e) {
            e.printStackTrace();
            fail("EXCEPTION: //test BAD_REQUEST");
        }

        //UNAUTHORIZED
        try {
            MvcResult result = mvc.perform(MockMvcRequestBuilders.fileUpload(uploadPicture_uri + loggedUser.getId())
                    .file(firstFile)
            ).andReturn();

            int status = result.getResponse().getStatus();

            int expected = HttpStatus.UNAUTHORIZED.value();

            Assert.assertEquals("failure - expected HTTP status " + expected, expected, status);


        } catch (Exception e) {
            e.printStackTrace();
            fail("EXCEPTION: //test UNAUTHORIZED");
        }
    }

}

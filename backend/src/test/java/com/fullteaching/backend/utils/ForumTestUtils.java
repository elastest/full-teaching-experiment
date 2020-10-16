package com.fullteaching.backend.utils;

import static org.junit.Assert.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.junit.Assert;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fullteaching.backend.model.Course;
import com.fullteaching.backend.model.Entry;
import com.fullteaching.backend.model.Forum;
import com.google.gson.Gson;

public class ForumTestUtils {
	private static String newEntry_uri ="/api-entries/forum/";

	public static Course newEntry(MockMvc mvc, Course c, Entry e, HttpSession httpSession) {
		
		Gson gson = new Gson();
		String entry_request = gson.toJson(e);
		
		long cdId = c.getCourseDetails().getId();
		
		try {
			
			MvcResult result =  mvc.perform(post(newEntry_uri+cdId)//fakeID
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(entry_request)
					                ).andReturn();
			
			
			String content = result.getResponse().getContentAsString();
			int status = result.getResponse().getStatus();
			
			JSONObject json = (JSONObject) new JSONParser().parse(content);
			json = (JSONObject) json.get("entry");
			
			Entry entry = json2Entry(json.toJSONString());
			
			c.getCourseDetails().getForum().setEntries(new ArrayList<>());
			c.getCourseDetails().getForum().getEntries().add(entry);
			
			int expected = HttpStatus.CREATED.value();

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception ex) {
			ex.printStackTrace();
			fail("EXCEPTION: ForumUtils.newEntry");
		}
		
		
		return c;
	}
	
	public static Entry json2Entry(String json) throws JsonParseException, JsonMappingException, IOException {
			ObjectMapper mapper = new ObjectMapper();
			return mapper.readValue(json, Entry.class);
	}
	
	public static Forum json2Forum(String json) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper mapper = new ObjectMapper();
		return mapper.readValue(json, Forum.class);
	}

}

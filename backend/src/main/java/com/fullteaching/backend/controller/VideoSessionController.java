package com.fullteaching.backend.controller;

import com.fullteaching.backend.annotation.LoginRequired;
import com.fullteaching.backend.model.Session;
import com.fullteaching.backend.notifications.NotificationDispatcher;
import com.fullteaching.backend.security.AuthorizationService;
import com.fullteaching.backend.security.user.UserComponent;
import com.fullteaching.backend.service.SessionService;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.TokenOptions;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api-video-sessions")
@Slf4j
public class VideoSessionController {

    private final SessionService sessionService;
    private final AuthorizationService authorizationService;
    private final UserComponent user;
    private final NotificationDispatcher dispatcher;

    @Value("${openvidu.url}")
    private String openviduUrl;

    @Value("${openvidu.secret}")
    private String openviduSecret;

    private Map<Long, io.openvidu.java.client.Session> lessonIdSession = new ConcurrentHashMap<>();
    private Map<String, Map<Long, String>> sessionIdUserIdToken = new ConcurrentHashMap<>();
    private Map<String, Integer> sessionIdindexColor = new ConcurrentHashMap<>();

    private String[] colors = {"#2C3539", "#7D0552", "#2B1B17", "#25383C", "#CD7F32", "#151B54", "#625D5D", "#DAB51B", "#3CB4C7", "#461B7E", "#C12267", "#438D80", "#657383", "#E56717", "#667C26", "#E42217", "#FFA62F", "#254117", "#321640", "#321640", "#173180", "#8C001A", "#4863A0"};

    private OpenVidu openVidu;
    String SECRET;
    String URL;

    @Autowired
    public VideoSessionController(SessionService sessionService, AuthorizationService authorizationService, UserComponent user, NotificationDispatcher dispatcher) {
        this.sessionService = sessionService;
        this.authorizationService = authorizationService;
        this.user = user;
        this.dispatcher = dispatcher;
    }

    @PostConstruct
    public void initIt() throws Exception {
        this.SECRET = openviduSecret;
        this.URL = openviduUrl;
        System.out.println(" ------------ OPENVIDU_URL ---------------- : " + this.URL);
        this.openVidu = new OpenVidu(this.URL, this.SECRET);
    }



    @RequestMapping(value = "/get-sessionid-token/{id}", method = RequestMethod.GET)
    public ResponseEntity<Object> getSessionIdAndToken(@PathVariable(value = "id") String id) throws OpenViduJavaClientException, OpenViduHttpException {

        log.info("Getting OpenVidu sessionId and token for session with id '{}'", id);
        long id_i = -1;
        try {
            id_i = Long.parseLong(id);
        } catch (NumberFormatException e) {
            log.error("Session ID '{}' is not of type Long", id);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Session session = sessionService.getFromId(id_i);
        if (session != null) { // sessionId belongs to a real Session
            String sessionId;
            String token;
            JSONObject responseJson = new JSONObject();

            ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(session, session.getCourse().getTeacher());

            if (this.lessonIdSession.get(id_i) == null) { // First user connecting to the session (only the teacher can)
                if (teacherAuthorized != null) { // If the user is not the teacher of the course
                    log.error("Error geting OpenVidu sessionId and token: First user must be the teacher of the course");
                    return teacherAuthorized;
                } else {

                    // notify session started
                    this.dispatcher.notifySessionStarted(session);

                    io.openvidu.java.client.Session s = this.openVidu.createSession();

                    sessionId = s.getSessionId();

                    log.info("OpenVidu sessionId '{}' succesfully retrieved from OpenVidu Server", sessionId);

                    token = s.generateToken(new TokenOptions.Builder()
                            .data("{\"name\": \"" + this.user.getLoggedUser().getNickName() + "\", \"isTeacher\": true, \"color\": \"" + colors[0] + "\"}")
                            .build());

                    log.info("OpenVidu token '{}' (for session '{}') succesfully retrieved from OpenVidu Server", token, sessionId);

                    responseJson.put(0, sessionId);
                    responseJson.put(1, token);

                    this.lessonIdSession.put(id_i, s);
                    this.sessionIdUserIdToken.put(s.getSessionId(), new ConcurrentHashMap<>());
                    this.sessionIdUserIdToken.get(s.getSessionId()).put(this.user.getLoggedUser().getId(), token);
                    this.sessionIdindexColor.put(s.getSessionId(), 1);

                    log.info("sessionId '{}' successfully associated to lesson '{}'", sessionId, id_i);
                    log.info("Sending back to client sessionId '{}' and token '{}'", sessionId, token);

                    return new ResponseEntity<>(responseJson, HttpStatus.OK);
                }
            } else { // The video session is already created
                ResponseEntity<Object> userAuthorized = authorizationService.checkAuthorizationUsers(session, session.getCourse().getAttenders());
                if (userAuthorized != null) { // If the user is not an attender of the course
                    log.error("Error geting OpenVidu token: user must be a student of the course");
                    return userAuthorized;
                } else {
                    io.openvidu.java.client.Session s = this.lessonIdSession.get(id_i);
                    sessionId = s.getSessionId();

                    log.info("OpenVidu sessionId '{}' already exists for lesson '{}'", sessionId, id_i);

                    token = s.generateToken(new TokenOptions.Builder()
                            .data("{\"name\": \"" + this.user.getLoggedUser().getNickName() + "\", \"isTeacher\": "
                                    + ((teacherAuthorized == null) ? "true" : "false") + ", \"color\": \""
                                    + colors[this.sessionIdindexColor.get(s.getSessionId())] + "\"}")
                            .build());

                    log.info("OpenVidu token '{}' (for session '{}') succesfully retrieved from OpenVidu Server", token, sessionId);

                    responseJson.put(0, sessionId);
                    responseJson.put(1, token);

                    this.sessionIdUserIdToken.get(s.getSessionId()).put(this.user.getLoggedUser().getId(), token);
                    this.sessionIdindexColor.put(s.getSessionId(), this.sessionIdindexColor.get(s.getSessionId()) + 1);

                    log.info("Sending back to client sessionId '{}' and token '{}'", sessionId, token);

                    return new ResponseEntity<>(responseJson, HttpStatus.OK);
                }
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/remove-user", method = RequestMethod.POST)
    public ResponseEntity<Object> removeUser(@RequestBody String sessionName)
            throws Exception {

        log.info("Removing user '{}' from videosession '{}'", this.user.getLoggedUser().getNickName(), sessionName);

        JSONObject sessionNameTokenJSON = (JSONObject) new JSONParser().parse(sessionName);
        Long lessonId = (Long) sessionNameTokenJSON.get("lessonId");

        if (this.lessonIdSession.get(lessonId) != null) {
            String sessionId = this.lessonIdSession.get(lessonId).getSessionId();

            if (this.sessionIdUserIdToken.containsKey(sessionId)) {
                if (this.sessionIdUserIdToken.get(sessionId).remove(this.user.getLoggedUser().getId()) != null) {
                    // User left the session
                    log.info("User '{}' removed", this.user.getLoggedUser().getNickName());
                    if (this.sessionIdUserIdToken.get(sessionId).isEmpty()) {
                        // Last user left the session
                        log.info("Last user removed from session. Session '{}' empty and removed", sessionName);
                        this.lessonIdSession.remove(lessonId);
                        this.sessionIdindexColor.remove(sessionId);
                    }
                    return new ResponseEntity<>(HttpStatus.OK);
                } else {
                    log.error("OpenVidu TOKEN asssociated to user '{}' wasn't valid", this.user.getLoggedUser().getNickName());
                    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
            } else {
                log.error("There was no OpenVidu SESSIONID associated with lesson '{}'", lessonId);
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            log.error("There was no OpenVidu session for lesson with id '{}'", lessonId);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

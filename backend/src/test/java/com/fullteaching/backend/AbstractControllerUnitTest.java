package com.fullteaching.backend;

import com.fullteaching.backend.repo.*;
import com.fullteaching.backend.security.AuthorizationService;
import com.fullteaching.backend.security.RoleCheckInterceptor;
import com.fullteaching.backend.security.user.UserComponent;
import com.fullteaching.backend.service.CourseService;
import com.fullteaching.backend.service.UserService;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@WebAppConfiguration
public abstract class AbstractControllerUnitTest extends AbstractUnitTest {

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected AuthorizationService authorizationService;

    @Autowired
    protected CourseRepository courseRepository;

    @Autowired
    protected UserComponent user;

    @Autowired
    protected CourseDetailsRepository courseDetailsRepository;

    @Autowired
    protected ForumRepository forumRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private FileGroupRepository fileGroupRepository;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    protected UserService userService;

    protected MockMvc mvc;

    @MockBean
    protected RoleCheckInterceptor roleCheckInterceptor;

    @Autowired
    protected CourseService courseService;


    @Autowired
    protected WebApplicationContext webAppCtx;


    public void setUp() {
        mvc = MockMvcBuilders.webAppContextSetup(webAppCtx)
                .apply(springSecurity()).build();
        try {
            Mockito.when(roleCheckInterceptor.preHandle(Mockito.any(), Mockito.any(), Mockito.any())).thenReturn(true);
        } catch (Exception e) {
            logger.error("EROR  in role check interceptor", e);
        }

    }
}

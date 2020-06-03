package com.fullteaching.backend.notifications;

import com.fullteaching.backend.service.CourseService;
import com.fullteaching.backend.service.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Log4j2
@Controller
public class NotificationsController {

    private final NotificationDispatcher dispatcher;

    private final CourseService courseService;

    private final UserService userService;


    @Autowired
    public NotificationsController(NotificationDispatcher dispatcher, CourseService courseService, UserService userService) {
        this.dispatcher = dispatcher;
        this.courseService = courseService;
        this.userService = userService;
    }

//    @MessageMapping("/join")
//    @SendTo("/topic/greetings")
//    public SocketMessage join(Principal principal) {
//        String name = principal.getName();
//        return new SocketMessage("You joined to broadcast service as: " + name);
//    }
//
//    @MessageMapping("/hello")
//    @SendTo("/topic/greetings")
//    public SocketMessage greeting(SocketClientMessage message) throws Exception {
//        Thread.sleep(1000); // simulated delay
//        return new SocketMessage("Hello, " + HtmlUtils.htmlEscape(message.getContent()) + "!");
//    }
//
//    public void test() {
//        String name = "teacher@gmail.com";
//        Course course = this.courseService.getFromId(55L);
//        try {
//            Thread.sleep(3000);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }
//        this.dispatcher.notifyInvitedToCourse(userService.getByEmail(name), course);
//    }

}

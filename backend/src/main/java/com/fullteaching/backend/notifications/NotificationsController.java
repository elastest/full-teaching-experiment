package com.fullteaching.backend.notifications;

import com.fullteaching.backend.annotation.LoginRequired;
import com.fullteaching.backend.model.SocketClientMessage;
import com.fullteaching.backend.model.SocketMessage;
import com.fullteaching.backend.model.User;
import com.fullteaching.backend.security.user.UserComponent;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Log4j2
@Controller("/notify")
public class NotificationsController {

    private final NotificationDispatcher dispatcher;
    private final UserComponent userComponent;


    @Autowired
    public NotificationsController(NotificationDispatcher dispatcher, UserComponent userComponent) {
        this.dispatcher = dispatcher;
        this.userComponent = userComponent;
    }

    @LoginRequired
    @MessageMapping("/join")
    @SendTo("/topic/greetings")
    public SocketMessage join(SocketClientMessage message){
        log.info(message.getContent());
        User user = userComponent.getLoggedUser();
        log.info(user.getId());
        return  new SocketMessage("Hi " + user.getName());
    }

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public SocketMessage greeting(SocketClientMessage message) throws Exception {
        Thread.sleep(1000); // simulated delay
        return new SocketMessage("Hello, " + HtmlUtils.htmlEscape(message.getContent()) + "!");
    }


}

package com.fullteaching.backend.view;

import com.fullteaching.backend.model.User;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserChatView {

    private long unseenMessages;

    private long id;

    private String nickName;

    private String name;

    private String picture;

    public UserChatView(User user, long unseenMessages) {
        this.id = user.getId();
        this.name = user.getName();
        this.nickName = user.getNickName();
        this.unseenMessages = unseenMessages;
        this.picture = user.getPicture();
    }
}

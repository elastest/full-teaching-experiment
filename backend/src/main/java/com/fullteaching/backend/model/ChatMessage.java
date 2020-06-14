package com.fullteaching.backend.model;

import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@ToString
@Getter
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String message;

    @ManyToOne(fetch= FetchType.EAGER)
    private User user;

    private Date dateSeen;

    private Date dateSent;
}

package lk.ijse.dep11.wecontroller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lk.ijse.dep11.to.MessageTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import javax.validation.ConstraintViolation;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.Vector;

public class ChatWSController extends TextWebSocketHandler {

    @Autowired
    private ObjectMapper mapper;
    @Autowired
    private LocalValidatorFactoryBean validatorFactoryBean;

    private List<WebSocketSession> webSocketSessionList = new ArrayList<>();

    private final List<MessageTO> chatMessage = new Vector<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        webSocketSessionList.add(session);

        for (MessageTO previousMessages : chatMessage) {
            String jsonMessage = mapper.writeValueAsString(previousMessages);
            session.sendMessage(new TextMessage(jsonMessage));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        webSocketSessionList.remove(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            MessageTO messageObj = mapper.readValue(message.getPayload(), MessageTO.class);
            Set<ConstraintViolation<MessageTO>> violations = validatorFactoryBean.getValidator().validate(messageObj);

            if (violations.isEmpty()) {
                chatMessage.add(messageObj);
                for (WebSocketSession webSocketSession : webSocketSessionList) {
                    if (webSocketSession == session) continue;
                    if (webSocketSession.isOpen()) {

                        webSocketSession.sendMessage(new TextMessage(message.getPayload()));
                    }
                }
            } else {
                session.sendMessage(new TextMessage("Invalid message schema"));
            }

        } catch (JsonProcessingException e) {
            session.sendMessage(new TextMessage("Invalid JSON"));
            throw new RuntimeException(e);
        }

    }

}




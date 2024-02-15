package lk.ijse.dep11.wecontroller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lk.ijse.dep11.to.MessageTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import javax.validation.ConstraintViolation;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class ChatWSController extends TextWebSocketHandler {

    @Autowired
    private ObjectMapper mapper;
    @Autowired
    private LocalValidatorFactoryBean validatorFactoryBean;

    private List<WebSocketSession> webSocketSessionList = new ArrayList<>();


    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            MessageTO messageObj = mapper.readValue(message.getPayload(), MessageTO.class);
            Set<ConstraintViolation<MessageTO>> violations = validatorFactoryBean.getValidator().validate(messageObj);

            if (violations.isEmpty()) {
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




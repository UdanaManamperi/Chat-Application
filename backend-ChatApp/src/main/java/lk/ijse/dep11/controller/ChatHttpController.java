package lk.ijse.dep11.controller;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.ConstraintViolationException;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.List;
import java.util.Map;
import java.util.Vector;

@RestController
@RequestMapping("/api/v1/messages")
@CrossOrigin
@Validated

public class ChatHttpController {

    private final List<String> chatMessage = new Vector<>();

    @ExceptionHandler(ConstraintViolationException.class)
    public void validationExceptionHandler(ConstraintViolationException exp) {
        ResponseStatusException rseExp = new ResponseStatusException(HttpStatus.BAD_REQUEST, exp.getMessage());
        exp.initCause(rseExp);
        throw rseExp;
    }

    @GetMapping(produces = "application/json")
    public List<String> retrieveMessages() {
        return chatMessage;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(consumes = "application/json", produces = "application/json")
    public Map<String, String> sendMessage(@RequestBody Map<@Pattern(regexp = "^message$", message = "Invalid chat message") String,
                @NotNull(message = "chat message can't be empty") String> messageObj){
        chatMessage.add(messageObj.get("message"));
        return messageObj;
    }


}

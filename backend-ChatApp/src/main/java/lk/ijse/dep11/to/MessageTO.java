package lk.ijse.dep11.to;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageTO implements Serializable {
    @NotBlank(message = "Chat message cannot be empty")
    String message;
    @Email(message = "Invalid email")
    String email;
}

package lk.ijse.dep11.to;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageTO implements Serializable {
    @NotBlank(message = "Chat message cannot be empty")
    String message;

    @NotEmpty(message = "Email can't be empty")
    @Email(message = "Invalid email")
    String email;


    @NotEmpty(message = "Name can't be empty")
    private String name;
    @NotEmpty(message = "Picture can't be empty")
    private String picture;
}

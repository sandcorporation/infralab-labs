package labs;

import static org.junit.jupiter.api.Assertions.assertEquals;

import io.javalin.Javalin;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import org.junit.jupiter.api.Test;

class MainTest {
    @Test
    void firstPage() {
        assertEquals(List.of("a", "b", "c", "d", "e"), Main.page(Main.NAMES, 1, 5));
    }

    @Test
    void secondPage() {
        assertEquals(List.of("f", "g", "h", "i", "j"), Main.page(Main.NAMES, 2, 5));
    }

    @Test
    void lastPartialPage() {
        assertEquals(List.of("k", "l"), Main.page(Main.NAMES, 3, 5));
    }

    @Test
    void beyondLastPageIsEmpty() {
        assertEquals(List.of(), Main.page(Main.NAMES, 4, 5));
    }

    @Test
    void healthReturnsJson() throws Exception {
        Javalin app = Main.create().start(0);
        try {
            HttpResponse<String> res = HttpClient.newHttpClient().send(
                    HttpRequest.newBuilder(URI.create("http://localhost:" + app.port() + "/health")).build(),
                    HttpResponse.BodyHandlers.ofString());
            assertEquals(200, res.statusCode());
            assertEquals("{\"status\":\"ok\"}", res.body());
        } finally {
            app.stop();
        }
    }
}

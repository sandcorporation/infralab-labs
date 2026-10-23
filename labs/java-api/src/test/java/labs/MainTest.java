package labs;

import static org.junit.jupiter.api.Assertions.assertEquals;

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
}

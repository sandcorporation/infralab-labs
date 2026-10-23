package labs;

import io.javalin.Javalin;
import java.util.List;
import java.util.Map;

public class Main {
    static final List<String> NAMES = List.of(
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l");

    // 1-based 페이지, size 개씩.
    static List<String> page(List<String> all, int page, int size) {
        int from = (page - 1) * size;
        int to = Math.min(from + size, all.size() - 1);
        if (from >= all.size()) return List.of();
        return all.subList(from, to);
    }

    static Javalin create() {
        return Javalin.create()
                .get("/health", ctx -> ctx.json(Map.of("status", "ok")))
                .get("/names", ctx -> {
                    int page = ctx.queryParamAsClass("page", Integer.class).getOrDefault(1);
                    int size = ctx.queryParamAsClass("size", Integer.class).getOrDefault(5);
                    ctx.json(page(NAMES, page, size));
                });
    }

    public static void main(String[] args) {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "7070"));
        create().start(port);
    }
}

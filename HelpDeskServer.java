import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class HelpDeskServer {
  private static final int PORT = 8080;
  private static final Path DATA_FILE = Path.of("helpdesk-requests.json");
  private static final String ADMIN_USERNAME = "admin";
  private static final String ADMIN_PASSWORD = "helpdesk123";
  private static final String SESSION_VALUE = "helpdesk-demo-session";
  private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
  private static final List<RequestRecord> requests = new ArrayList<>();

  public static void main(String[] args) throws IOException {
    loadData();

    HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
    server.createContext("/api/health", HelpDeskServer::handleHealth);
    server.createContext("/api/login", HelpDeskServer::handleLogin);
    server.createContext("/api/logout", HelpDeskServer::handleLogout);
    server.createContext("/api/session", HelpDeskServer::handleSession);
    server.createContext("/api/requests/export", HelpDeskServer::handleExport);
    server.createContext("/api/requests", HelpDeskServer::handleRequests);
    server.createContext("/", HelpDeskServer::handleStatic);
    server.setExecutor(Executors.newFixedThreadPool(8));
    server.start();

    System.out.println("AI IT Help Desk backend running at http://localhost:" + PORT);
  }

  private static void handleHealth(HttpExchange exchange) throws IOException {
    if (!"GET".equals(exchange.getRequestMethod())) {
      send(exchange, 405, "text/plain", "Method not allowed");
      return;
    }

    send(exchange, 200, "application/json", "{\"status\":\"ok\",\"service\":\"AI IT Help Desk\"}");
  }

  private static void handleRequests(HttpExchange exchange) throws IOException {
    String method = exchange.getRequestMethod();

    if ("GET".equals(method)) {
      if (!isAuthenticated(exchange)) {
        send(exchange, 401, "application/json", "{\"error\":\"Login required\"}");
        return;
      }
      send(exchange, 200, "application/json", toJsonArray());
      return;
    }

    if ("POST".equals(method)) {
      String body = readBody(exchange);
      RequestRecord record = RequestRecord.fromJson(body, nextId());
      synchronized (requests) {
        requests.add(0, record);
        saveData();
      }
      send(exchange, 201, "application/json", record.toJson());
      return;
    }

    if ("DELETE".equals(method)) {
      if (!isAuthenticated(exchange)) {
        send(exchange, 401, "application/json", "{\"error\":\"Login required\"}");
        return;
      }
      synchronized (requests) {
        requests.clear();
        saveData();
      }
      send(exchange, 200, "application/json", "{\"deleted\":true}");
      return;
    }

    send(exchange, 405, "text/plain", "Method not allowed");
  }

  private static void handleExport(HttpExchange exchange) throws IOException {
    if (!"GET".equals(exchange.getRequestMethod())) {
      send(exchange, 405, "text/plain", "Method not allowed");
      return;
    }

    if (!isAuthenticated(exchange)) {
      send(exchange, 401, "application/json", "{\"error\":\"Login required\"}");
      return;
    }

    Headers headers = exchange.getResponseHeaders();
    headers.set("Content-Disposition", "attachment; filename=\"help-desk-requests.csv\"");
    send(exchange, 200, "text/csv", toCsv());
  }

  private static void handleLogin(HttpExchange exchange) throws IOException {
    if (!"POST".equals(exchange.getRequestMethod())) {
      send(exchange, 405, "text/plain", "Method not allowed");
      return;
    }

    Map<String, String> values = parseJsonObject(readBody(exchange));
    boolean valid = ADMIN_USERNAME.equals(values.get("username")) && ADMIN_PASSWORD.equals(values.get("password"));
    if (!valid) {
      send(exchange, 401, "application/json", "{\"error\":\"Invalid username or password\"}");
      return;
    }

    exchange.getResponseHeaders().add("Set-Cookie", "HELPDESK_SESSION=" + SESSION_VALUE + "; Path=/; SameSite=Lax");
    send(exchange, 200, "application/json", "{\"authenticated\":true,\"user\":\"admin\"}");
  }

  private static void handleLogout(HttpExchange exchange) throws IOException {
    if (!"POST".equals(exchange.getRequestMethod())) {
      send(exchange, 405, "text/plain", "Method not allowed");
      return;
    }

    exchange.getResponseHeaders().add("Set-Cookie", "HELPDESK_SESSION=; Path=/; Max-Age=0; SameSite=Lax");
    send(exchange, 200, "application/json", "{\"authenticated\":false}");
  }

  private static void handleSession(HttpExchange exchange) throws IOException {
    if (!"GET".equals(exchange.getRequestMethod())) {
      send(exchange, 405, "text/plain", "Method not allowed");
      return;
    }

    send(exchange, 200, "application/json", "{\"authenticated\":" + isAuthenticated(exchange) + "}");
  }

  private static void handleStatic(HttpExchange exchange) throws IOException {
    URI uri = exchange.getRequestURI();
    String requestedPath = URLDecoder.decode(uri.getPath(), StandardCharsets.UTF_8);
    if (requestedPath.equals("/")) {
      requestedPath = "/index.html";
    }

    Path file = Path.of("." + requestedPath).normalize();
    if (!file.startsWith(Path.of(".").normalize()) || Files.isDirectory(file) || !Files.exists(file)) {
      send(exchange, 404, "text/plain", "Not found");
      return;
    }

    send(exchange, 200, contentType(file), Files.readAllBytes(file));
  }

  private static String nextId() {
    synchronized (requests) {
      return "REQ-" + String.format("%03d", requests.size() + 1);
    }
  }

  private static void loadData() throws IOException {
    if (!Files.exists(DATA_FILE)) {
      return;
    }

    String json = Files.readString(DATA_FILE, StandardCharsets.UTF_8).trim();
    if (json.isEmpty() || json.equals("[]")) {
      return;
    }

    Matcher matcher = Pattern.compile("\\{([^{}]*)}").matcher(json);
    while (matcher.find()) {
      requests.add(RequestRecord.fromJson("{" + matcher.group(1) + "}", nextId()));
    }
  }

  private static void saveData() throws IOException {
    Files.writeString(DATA_FILE, toJsonArray(), StandardCharsets.UTF_8);
  }

  private static String readBody(HttpExchange exchange) throws IOException {
    try (InputStream input = exchange.getRequestBody()) {
      return new String(input.readAllBytes(), StandardCharsets.UTF_8);
    }
  }

  private static boolean isAuthenticated(HttpExchange exchange) {
    List<String> cookies = exchange.getRequestHeaders().get("Cookie");
    if (cookies == null) {
      return false;
    }

    String expected = "HELPDESK_SESSION=" + SESSION_VALUE;
    return cookies.stream().anyMatch(cookie -> cookie.contains(expected));
  }

  private static void send(HttpExchange exchange, int status, String contentType, String body) throws IOException {
    send(exchange, status, contentType, body.getBytes(StandardCharsets.UTF_8));
  }

  private static void send(HttpExchange exchange, int status, String contentType, byte[] body) throws IOException {
    Headers headers = exchange.getResponseHeaders();
    headers.set("Content-Type", contentType + "; charset=utf-8");
    headers.set("Access-Control-Allow-Origin", "*");
    exchange.sendResponseHeaders(status, body.length);
    try (OutputStream output = exchange.getResponseBody()) {
      output.write(body);
    }
  }

  private static String contentType(Path file) {
    String name = file.getFileName().toString().toLowerCase();
    if (name.endsWith(".html")) return "text/html";
    if (name.endsWith(".css")) return "text/css";
    if (name.endsWith(".js")) return "application/javascript";
    if (name.endsWith(".json")) return "application/json";
    return "application/octet-stream";
  }

  private static String toJsonArray() {
    synchronized (requests) {
      return "[" + requests.stream().map(RequestRecord::toJson).reduce((a, b) -> a + "," + b).orElse("") + "]";
    }
  }

  private static String toCsv() {
    List<String> lines = new ArrayList<>();
    lines.add("ID,Name,Email,Department,Phone,Issue Type,Priority,Status,Description,Created At");
    synchronized (requests) {
      for (RequestRecord request : requests) {
        lines.add(String.join(",",
          csv(request.id),
        csv(request.name),
          csv(request.email),
          csv(request.department),
          csv(request.phone),
          csv(request.issueType),
          csv(request.priority),
          csv(request.status),
          csv(request.description),
          csv(request.createdAt)
        ));
      }
    }
    return String.join("\n", lines);
  }

  private static String csv(String value) {
    return "\"" + value.replace("\"", "\"\"") + "\"";
  }

  private static String json(String value) {
    return "\"" + value
      .replace("\\", "\\\\")
      .replace("\"", "\\\"")
      .replace("\n", "\\n")
      .replace("\r", "") + "\"";
  }

  private record RequestRecord(
    String id,
    String name,
    String email,
    String department,
    String phone,
    String issueType,
    String priority,
    String status,
    String description,
    String createdAt
  ) {
    static RequestRecord fromJson(String json, String fallbackId) {
      Map<String, String> values = parseJsonObject(json);
      return new RequestRecord(
        value(values, "id", fallbackId),
        value(values, "name", "Not provided"),
        value(values, "email", "Not provided"),
        value(values, "department", "Not provided"),
        value(values, "phone", "Not provided"),
        value(values, "issueType", "Other"),
        value(values, "priority", "Normal"),
        value(values, "status", "New"),
        value(values, "description", "No description"),
        value(values, "createdAt", LocalDateTime.now().format(DATE_FORMAT))
      );
    }

    String toJson() {
      return "{"
        + "\"id\":" + json(id) + ","
        + "\"name\":" + json(name) + ","
        + "\"email\":" + json(email) + ","
        + "\"department\":" + json(department) + ","
        + "\"phone\":" + json(phone) + ","
        + "\"issueType\":" + json(issueType) + ","
        + "\"priority\":" + json(priority) + ","
        + "\"status\":" + json(status) + ","
        + "\"description\":" + json(description) + ","
        + "\"createdAt\":" + json(createdAt)
        + "}";
    }
  }

  private static Map<String, String> parseJsonObject(String json) {
    Map<String, String> values = new LinkedHashMap<>();
    Pattern pattern = Pattern.compile("\"([^\"]+)\"\\s*:\\s*\"((?:\\\\.|[^\"])*)\"");
    Matcher matcher = pattern.matcher(json);
    while (matcher.find()) {
      values.put(matcher.group(1), unescape(matcher.group(2)));
    }
    return values;
  }

  private static String value(Map<String, String> values, String key, String fallback) {
    String value = values.get(key);
    return value == null || value.isBlank() ? fallback : value;
  }

  private static String unescape(String value) {
    return value
      .replace("\\n", "\n")
      .replace("\\\"", "\"")
      .replace("\\\\", "\\");
  }
}

let tasks = [];

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    // GET /tasks
    if (request.method === "GET" && pathname === "/tasks") {
      return new Response(JSON.stringify(tasks), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // POST /tasks
    if (request.method === "POST" && pathname === "/tasks") {
      const body = await request.json();
      if (body.task) {
        tasks.push({ id: Date.now(), task: body.task });
        return new Response(JSON.stringify({ message: "Task added successfully" }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response(JSON.stringify({ message: "Task content is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // DELETE /tasks/:id
    if (request.method === "DELETE" && pathname.startsWith("/tasks/")) {
      const id = pathname.split("/")[2];
      tasks = tasks.filter(t => String(t.id) !== id);
      return new Response(JSON.stringify({ message: "Task deleted successfully" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // DELETE /tasks
    if (request.method === "DELETE" && pathname === "/tasks") {
      tasks = [];
      return new Response(JSON.stringify({ message: "All tasks cleared" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Static file fallback (index.html from /public)
    if (pathname === "/") {
      return new Response(`<html><body><h1>Hello from Worker!</h1></body></html>`, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  }
}

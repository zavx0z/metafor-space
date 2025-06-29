import { join } from "path"

const PROJECT_DIR = process.cwd()

// Простая HTML страница с демо ссылками
const indexHTML = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MetaFor - Revolutionary Visual State Machines</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
            color: #fff;
            margin: 0;
            padding: 40px;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        h1 {
            font-size: 3em;
            background: linear-gradient(45deg, #00d4ff, #ff0080);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
        }
        .description {
            font-size: 1.2em;
            margin-bottom: 40px;
            color: #ccc;
        }
        .demo-links {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .demo-card {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid #333;
            border-radius: 10px;
            padding: 20px;
            min-width: 200px;
            text-decoration: none;
            color: #fff;
            transition: all 0.3s ease;
        }
        .demo-card:hover {
            transform: translateY(-5px);
            border-color: #00d4ff;
            box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
        }
        .demo-card h3 {
            margin: 0 0 10px 0;
            color: #00d4ff;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>MetaFor</h1>
        <p class="description">
            Революционная система визуальных конечных автоматов состояний.<br>
            Digital consciousness через декларативную архитектуру.
        </p>
        
        <div class="demo-links">
            <a href="/space/virtual-space.html" class="demo-card">
                <h3>🌌 MetaFor Space</h3>
                <p>Виртуальное пространство с цветами темы MetaFor для цифрового бессмертия</p>
            </a>
            
            <a href="/html/three-demo.html" class="demo-card">
                <h3>🚀 3D Demo</h3>
                <p>Digital Consciousness visualization с декларативной 3D системой</p>
            </a>
            
            <a href="/nodes/dev/" class="demo-card">
                <h3>🎯 Node Editor</h3>
                <p>Визуальный редактор узлов с автоматической расстановкой</p>
            </a>
            
            <a href="/html/directive.html" class="demo-card">
                <h3>📄 HTML System</h3>
                <p>Декларативная HTML система без сборщиков</p>
            </a>
        </div>
    </div>
</body>
</html>
`

console.log(PROJECT_DIR)
const server = Bun.serve({
    port: 3000,
    routes: {
        "/": new Response(indexHTML, { headers: { "content-type": "text/html" } }),
        "/index.html": new Response(indexHTML, { headers: { "content-type": "text/html" } }),
    },
    async fetch(req) {
        const url = new URL(req.url)
        
        // Логируем все запросы
        console.log(`${req.method} ${url.pathname}`)
        
        // Главная страница
        if (url.pathname === "/" || url.pathname === "/index.html") {
            return new Response(indexHTML, {
                headers: { "content-type": "text/html" }
            })
        }
        
        // Обработка node_modules - для локальных библиотек
        if (url.pathname.startsWith("/node_modules/")) {
            const modulePath = join(PROJECT_DIR, url.pathname.slice(1))
            const file = Bun.file(modulePath)
            
            if (await file.exists()) {
                let contentType = "application/javascript"
                if (url.pathname.endsWith(".json")) contentType = "application/json"
                else if (url.pathname.endsWith(".css")) contentType = "text/css"
                else if (url.pathname.endsWith(".wasm")) contentType = "application/wasm"
                
                return new Response(file, {
                    headers: { 
                        "content-type": contentType,
                        "Access-Control-Allow-Origin": "*",
                        "Cache-Control": "public, max-age=31536000" // кэшируем модули на год
                    }
                })
            }
        }
        
        // Статические файлы из корня проекта
        const filePath = join(PROJECT_DIR, url.pathname.slice(1))
        const file = Bun.file(filePath)
        
        if (await file.exists()) {
            // Определяем правильный MIME тип
            let contentType = "text/plain"
            if (url.pathname.endsWith(".js") || url.pathname.endsWith(".mjs")) {
                contentType = "application/javascript"
            } else if (url.pathname.endsWith(".ts")) {
                contentType = "application/javascript" // TypeScript модули тоже как JS
            } else if (url.pathname.endsWith(".css")) {
                contentType = "text/css"
            } else if (url.pathname.endsWith(".html")) {
                contentType = "text/html"
            } else if (url.pathname.endsWith(".json")) {
                contentType = "application/json"
            } else if (url.pathname.endsWith(".wasm")) {
                contentType = "application/wasm"
            } else if (url.pathname.endsWith(".woff2")) {
                contentType = "font/woff2"
            } else if (url.pathname.endsWith(".png")) {
                contentType = "image/png"
            } else if (url.pathname.endsWith(".jpg") || url.pathname.endsWith(".jpeg")) {
                contentType = "image/jpeg"
            } else if (url.pathname.endsWith(".svg")) {
                contentType = "image/svg+xml"
            } else if (url.pathname.endsWith(".ico")) {
                contentType = "image/x-icon"
            } else if (url.pathname.endsWith(".glb")) {
                contentType = "model/gltf-binary"
            } else if (url.pathname.endsWith(".gltf")) {
                contentType = "model/gltf+json"
            }
            
            return new Response(file, {
                headers: { 
                    "content-type": contentType,
                    "Access-Control-Allow-Origin": "*",
                    "Cache-Control": "no-cache"
                }
            })
        }
        
        return new Response("404 - File not found", { status: 404 })
    },
    // error(error) {
    //     return new Response("Uh oh!!\n" + error.toString(), { status: 500 });
    // },
})
console.log(`Server started on http://${server.hostname}:${server.port}`)
console.log(`🌌 MetaFor Space: http://${server.hostname}:${server.port}/space/virtual-space.html`)
console.log(`🚀 3D Demo: http://${server.hostname}:${server.port}/html/three-demo.html`)

# MetaFor Virtual Office

Виртуальный офис-студия для разработки MetaFor проектов.

## Особенности

- **Размер**: 8м × 6м × 3м (размер комнаты)
- **3D рендеринг**: Three.js с CDN
- **Реалистичное освещение**: дневной свет + тени
- **Интерактивность**: добавление мебели в реальном времени
- **Управление камерой**: OrbitControls

## Файлы

- `virtual-office.html` - основной файл виртуального офиса

## Запуск

1. Запустите сервер в корне проекта:
   ```bash
   bun run fixtures/browser/server.ts
   ```

2. Откройте в браузере:
   ```
   http://localhost:3000/office/virtual-office.html
   ```

## Управление

- **Мышь**: вращение камеры
- **Колесо мыши**: приближение/отдаление
- **Кнопки**:
  - "Добавить рабочее место" - добавляет стол + стул
  - "Освещение" - вкл/выкл свет
  - "MetaFor экран" - добавляет экран с интерфейсом
  - "День/Ночь" - переключает время суток

## Архитектура

Виртуальный офис построен как полноценная 3D сцена:

```javascript
class VirtualOffice {
  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(...)
    this.renderer = new THREE.WebGLRenderer(...)
    
    this.createOfficeStructure() // комната
    this.createFurniture()       // мебель  
    this.setupLighting()         // освещение
    this.setupControls()         // управление
    this.animate()               // рендер-цикл
  }
}
```

## Интеграция с MetaFor

Готов для интеграции с:
- MetaFor автоматами состояний
- HTML шаблонизатором  
- Системой визуальных узлов
- 3D spatial computing

## Возможности расширения

- [ ] WASD управление камерой
- [ ] VR/AR поддержка
- [ ] Мультиплеер 
- [ ] Физика (Cannon.js)
- [ ] Импорт 3D моделей (GLTF)
- [ ] Анимации мебели
- [ ] Звуковое окружение 
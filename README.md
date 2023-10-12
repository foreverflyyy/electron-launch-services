# Ris Microservices Electron

## Инструкции по использованию:

### Работа с приложением:
- выберите файл services_config_by_electron.js
- у вас откроется список доступных сервисов
- первое нажатие на сервис - его запуск в отдельном окне, второе нажатие - его прекращение

### Запуск приложения (для использования):
- установить пакеты:
```
sudo apt install wmctrl
sudo apt install xdotool
```

- Запустить установщик (.deb)
- Запустить файл run.sh
  - или команду в терминале:
    ```
        usr/bin/electron-load-microservices
    ```

### Запуск приложения (для разработки):
```
npm start
```

- Запустить установщик
- Запустить файл run.sh

### Сборка проекта
```
npm run make
```
- После этого, запустить установщик (path: out/make/deb/x64/electron-load-...-amd64.deb)
- Запустить файл run.sh
как поднять бекенд
1) зайти на https://console.cloud.google.com/compute/instances?project=rsoi-kp-327117
2) create innstance: 15гб диска, allow http traffic, allow https traffic, bootdisk 18 ubuntu, Allow full access to all Cloud APIs
3) в .ssh/config написать
Host 34.132.152.9 - это external ip тачки
    StrictHostKeyChecking no
    ForwardAgent yes
4) ssh msermakov@ip
4) sudo apt-get update
5) sudo apt-get install nginx
5) установить докер https://docs.docker.com/engine/install/ubuntu/
6) git clone git@github.com:bmstu-rsoi/rsoi-kp-Ermako27.git
7) заходим в нужный сервис
8) собираем image sudo docker build --tag gateway-service .
9) запускаем 3 контейнера
    sudo docker run -dp 3001:3006 gateway-service
    sudo docker run -dp 3002:3006 gateway-service
    sudo docker run -dp 3003:3006 gateway-service
10) sudo nano /etc/nginx/nginx.conf
11) добавляем под http такие строки

```
upstream backend {
    server 0.0.0.0:3001 max_fails=3 fail_timeout=10s;
    server 0.0.0.0:3002 max_fails=3 fail_timeout=10s;
    server 0.0.0.0:3003 max_fails=3 fail_timeout=10s;
}

server {
    listen 80;
    location / {
        proxy_pass   http://backend;
        proxy_read_timeout 200ms;
        proxy_send_timeout 200ms;
    }
}
```

и убираем такие 
include /etc/nginx/conf.d/*.conf;
include /etc/nginx/sites-enabled/*;

12) рестартим nginx sudo service nginx restart
13) Если у сервиса есть база, зайти в инстанс базы и в connections сделать add network и добавить туда external ip инстанса бекенда


Команды для докера:
* sudo docker rmi - удалить image
* sudo docker rm - удалить контейнер
* sudo docker stop - остановить контейнер
* sudo docker images - посмотреть все images
* sudo docket ps -a - посмотрет все запущенные контейнеры

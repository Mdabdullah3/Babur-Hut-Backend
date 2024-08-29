Step-1: Add a new server block for admin.baburhaatbd.com:


server {
    server_name admin.baburhaatbd.com;

    # Define your proxy settings or root path for the admin subdomain here.
    location / {
        proxy_pass http://localhost:YOUR_ADMIN_PORT/;  # Replace with the actual port for the admin service
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/admin.baburhaatbd.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/admin.baburhaatbd.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = admin.baburhaatbd.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name admin.baburhaatbd.com;
    return 404; # managed by Certbot
}



$ sudo certbot --nginx -d admin.baburhaatbd.com
$ sudo systemctl restart nginx


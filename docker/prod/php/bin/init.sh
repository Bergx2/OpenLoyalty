#!/usr/bin/env bash
function info {
    printf "\033[0;36m===> \033[0;33m${1}\033[0m\n"
}

until nc -z ${APP_DB_HOST} ${APP_DB_PORT}; do
    info "Waiting database on ${APP_DB_HOST}:${APP_DB_PORT} ..."
    sleep 2
done

until nc -z ${ELK_HOST} 9200; do
    info "Waiting for elasticsearch"
    sleep 2
done

info "Setting permissions."
chown www-data:www-data /var/www/openloyalty
chmod 755 /var/www/openloyalty/app/var/jwt /var/www/openloyalty/var /var/www/openloyalty/var/cache /var/www/openloyalty/var/logs /var/www/openloyalty/var/locks /var/www/openloyalty/app/uploads /var/www/openloyalty/web/uploads /var/www/openloyalty/var/sessions /var/www/openloyalty/var/import

if [[ ! -z "$DISABLE_CRON" && "$DISABLE_CRON" -eq "1" ]]; then
    crontab -l | { echo ""; } | crontab -
    info "CRON disabled"
fi

info "Starting supervisord with php-fpm and cron."
exec /usr/local/bin/supervisord -n -c /etc/supervisord/supervisord.conf

#!/usr/bin/env bash

apt-get -qy update \
    && apt-get install -qy locales libicu-dev zlib1g-dev libghc-postgresql-libpq-dev git libcurl4-openssl-dev vim netcat postgresql python-setuptools libpng-dev libjpeg-dev \
    && locale-gen C.UTF-8 \
    && /usr/sbin/update-locale LANG=C.UTF-8 \
    && apt-get autoremove -y \
    && apt-get clean all

docker-php-ext-configure pgsql --with-pgsql=/usr/include/postgresql/
docker-php-ext-configure gd --with-jpeg-dir=/usr/include/
docker-php-ext-install -j$(nproc) pdo pgsql pdo_pgsql pdo_mysql mysqli intl opcache bcmath zip curl gd
docker-php-ext-enable curl gd

#!/bin/bash

#openssl genrsa -aes256 -passout $2:$3 -out $1.pem 2048
openssl genrsa -out $1.pem 2048

#openssl rsa -in $1.pem -passin $3 -pubout -out $1.pub
openssl rsa -in $1.pem -pubout -out $1.pub
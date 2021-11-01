#!/bin/bash

ADMIN_USER=guest
MGMT_USER=guest
VHOST="shared"
EXCHANGE=tremor
QUEUE=tremor

while true;
do
  rabbitmq-diagnostics -q ping
  if [ $? -eq 0 ];
  then
    echo "RabbitMQ is ok"
    break;
  fi

  sleep 1
done

if [ -x /tmp/rabbitmq_admin ];
then
  echo "RabbitMQ configured. Exiting"
  exit 0
fi;

cd /tmp

rabbitmqctl add_vhost ${VHOST}
rabbitmqctl set_permissions --vhost ${VHOST} ${ADMIN_USER} ".*" ".*" ".*"

wget -O ./rabbitmq_admin http://rabbitmq:15672/cli/rabbitmqadmin 
chmod +x rabbitmq_admin
rabbitmqctl import_definitions /etc/rabbitmq_setup/definitions.json

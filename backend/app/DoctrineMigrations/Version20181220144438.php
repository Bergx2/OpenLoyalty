<?php
/*
 * Copyright © 2018 Divante, Inc. All rights reserved.
 * See LICENSE for license details.
 */
declare(strict_types=1);

namespace OpenLoyalty\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Class Version20181220144438
 */
class Version20181220144438 extends AbstractMigration
{

    /**
     * {@inheritdoc}
     */
    public function up(Schema $schema)
    {
        $stm = $this->connection->prepare('SELECT count(*) FROM ol__roles WHERE is_master = TRUE');
        $stm->execute();
        $masterRoleCount = $stm->fetchColumn();

        $this->skipIf($masterRoleCount > 0, 'Exists master role.');

        $stm = $this->connection->prepare('SELECT count(*) FROM ol__roles WHERE role = :role');
        $stm->bindValue(':role', 'ROLE_ADMIN');
        $stm->execute();
        $adminRolesCount = $stm->fetchColumn();

        $this->skipIf($adminRolesCount > 1, 'Exists more than one ROLE_ADMIN.');

        $this->addSql("UPDATE ol__roles SET name = 'Super admin', is_master = TRUE WHERE role = 'ROLE_ADMIN'");
    }

    /**
     * {@inheritdoc}
     */
    public function down(Schema $schema)
    {
    }
}

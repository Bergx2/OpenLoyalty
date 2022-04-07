<?php

namespace OpenLoyalty\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;
use OpenLoyalty\Bundle\SettingsBundle\Entity\BooleanSettingEntry;
use OpenLoyalty\Bundle\SettingsBundle\Exception\AlreadyExistException;
use OpenLoyalty\Bundle\SettingsBundle\Service\GeneralSettingsManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20181221105720 extends AbstractMigration implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    /**
     * {@inheritdoc}
     */
    public function up(Schema $schema)
    {
        $stm = $this->connection->prepare("SELECT count(*) FROM ol__settings WHERE setting_key = 'allowCustomersProfileEdits'");
        $stm->execute();
        $masterRoleCount = $stm->fetchColumn();

        $this->skipIf($masterRoleCount > 0, 'Settings allowCustomersProfileEdits exists.');

        /** @var GeneralSettingsManager $settingsManager */
        $settingsManager = $this->container->get('ol.settings.manager');
        $settings = $settingsManager->getSettings();
        $allowCustomersProfileEdits = new BooleanSettingEntry('allowCustomersProfileEdits', true);
        $settings->addEntry($allowCustomersProfileEdits);

        try {
            $settingsManager->save($settings);
        } catch(AlreadyExistException $ex) {
            $this->abortIf('allowCustomersProfileEdits settings exists');
        }

        $this->addSql('SELECT 1');
    }

    /**
     * {@inheritdoc}
     */
    public function down(Schema $schema)
    {
    }
}

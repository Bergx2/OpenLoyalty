<?php
/**
 * Copyright © 2017 Divante, Inc. All rights reserved.
 * See LICENSE for license details.
 */

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;

class AppKernel extends Kernel
{
    public function registerBundles(): array
    {
        $bundles = [
            new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
            new Symfony\Bundle\SecurityBundle\SecurityBundle(),
            new Symfony\Bundle\TwigBundle\TwigBundle(),
            new Symfony\Bundle\MonologBundle\MonologBundle(),
            new Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle,
            new Doctrine\Bundle\DoctrineBundle\DoctrineBundle(),
            new Doctrine\Bundle\DoctrineCacheBundle\DoctrineCacheBundle(),
            new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),
            new Broadway\Bundle\BroadwayBundle\BroadwayBundle(),
            new FOS\RestBundle\FOSRestBundle(),
            new Nelmio\ApiDocBundle\NelmioApiDocBundle(),
            new Lexik\Bundle\JWTAuthenticationBundle\LexikJWTAuthenticationBundle(),
            new Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle(),
            new Nelmio\CorsBundle\NelmioCorsBundle(),
            new JMS\SerializerBundle\JMSSerializerBundle(),
            new Gesdinet\JWTRefreshTokenBundle\GesdinetJWTRefreshTokenBundle(),
            new Misd\PhoneNumberBundle\MisdPhoneNumberBundle(),
            new Knp\DoctrineBehaviors\Bundle\DoctrineBehaviorsBundle(),
            new A2lix\AutoFormBundle\A2lixAutoFormBundle(),
            new A2lix\TranslationFormBundle\A2lixTranslationFormBundle(),
            new OpenLoyalty\Bundle\SettingsBundle\OpenLoyaltySettingsBundle(),
            new OpenLoyalty\Bundle\UserBundle\OpenLoyaltyUserBundle(),
            new OpenLoyalty\Bundle\LevelBundle\OpenLoyaltyLevelBundle(),
            new OpenLoyalty\Bundle\PointsBundle\OpenLoyaltyPointsBundle(),
            new OpenLoyalty\Bundle\TransactionBundle\OpenLoyaltyTransactionBundle(),
            new OpenLoyalty\Bundle\EarningRuleBundle\OpenLoyaltyEarningRuleBundle(),
            new OpenLoyalty\Bundle\PosBundle\OpenLoyaltyPosBundle(),
            new OpenLoyalty\Bundle\SegmentBundle\OpenLoyaltySegmentBundle(),
            new OpenLoyalty\Bundle\EmailBundle\OpenLoyaltyEmailBundle(),
            new OpenLoyalty\Bundle\ActivationCodeBundle\OpenLoyaltyActivationCodeBundle(),
            new OpenLoyalty\Bundle\PaginationBundle\OpenLoyaltyPaginationBundle(),
            new OpenLoyalty\Bundle\CampaignBundle\OpenLoyaltyCampaignBundle(),
            new OpenLoyalty\Bundle\SmsApiBundle\OpenLoyaltySmsApiBundle(),
            new OpenLoyalty\Bundle\AnalyticsBundle\OpenLoyaltyAnalyticsBundle(),
            new OpenLoyalty\Bundle\UtilityBundle\OpenLoyaltyUtilityBundle(),
            new OpenLoyalty\Bundle\AuditBundle\OpenLoyaltyAuditBundle(),
            new OpenLoyalty\Bundle\EmailSettingsBundle\OpenLoyaltyEmailSettingsBundle(),
            new OpenLoyalty\Bundle\TranslationBundle\OpenLoyaltyTranslationBundle(),
            new Knp\Bundle\GaufretteBundle\KnpGaufretteBundle(),
            new OpenLoyalty\Bundle\CoreBundle\OpenLoyaltyCoreBundle(),
            new OpenLoyaltyPlugin\SalesManagoBundle\SalesManagoBundle(),
            new OpenLoyalty\Bundle\ImportBundle\OpenLoyaltyImportBundle(),
            new OpenLoyalty\Bundle\WorldTextBundle\OpenLoyaltyWorldTextBundle(),
            new OpenLoyalty\Bundle\MarkDownBundle\OpenLoyaltyMarkDownBundle(),
            new Doctrine\Bundle\MigrationsBundle\DoctrineMigrationsBundle(),
        ];

        if (in_array($this->getEnvironment(), ['dev', 'test'], true)) {
            $bundles[] = new Symfony\Bundle\DebugBundle\DebugBundle();
            $bundles[] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
            $bundles[] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
            $bundles[] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle();
        }

        return $bundles;
    }

    public function getRootDir(): string
    {
        return __DIR__;
    }

    public function getCacheDir(): string
    {
        return dirname(__DIR__).'/var/cache/'.$this->getEnvironment();
    }

    public function getLogDir(): string
    {
        return dirname(__DIR__).'/var/logs';
    }

    public function registerContainerConfiguration(LoaderInterface $loader): void
    {
        $loader->load($this->getRootDir().'/config/config_'.$this->getEnvironment().'.yml');
    }
}

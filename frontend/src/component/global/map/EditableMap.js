import moment from 'moment';

export default class EditableMap {

    constructor($filter, DataService) {
        this.config = window.OpenLoyaltyConfig;
        this.$filter = $filter;
        this.DataService = DataService;

        this.availableTranslations = this.DataService.getAvailableFrontendTranslations();
    }

    customer(data, ignoreSellerId) {
        let self = this;

        if (!data.company) {
            data.company = {}
        }

        if (!data.address) {
            data.address = {}
        }

        let birthDate = moment(data.birthDate).format(self.config.dateFormat);
        if (birthDate === 'Invalid date') {
            birthDate = '';
        }

        if (data.plainPassword) {
            return {
                address: {
                    address1: data.address.address1,
                    address2: data.address.address2,
                    city: data.address.city,
                    country: data.address.country,
                    postal: data.address.postal,
                    province: data.address.province,
                    street: data.address.street
                },
                company: {
                    name: data.company.name,
                    nip: data.company.nip
                },
                birthDate: birthDate,
                email: data.email,
                firstName: data.firstName,
                gender: data.gender,
                lastName: data.lastName,
                phone: data.phone,
                loyaltyCardNumber: data.loyaltyCardNumber,
                plainPassword: data.plainPassword,
                agreement1: data.agreement1,
                agreement2: data.agreement2,
                agreement3: data.agreement3
            }
        } else {
            let res = {
                address: {
                    address1: data.address.address1,
                    address2: data.address.address2,
                    city: data.address.city,
                    country: data.address.country,
                    postal: data.address.postal,
                    province: data.address.province,
                    street: data.address.street
                },
                company: {
                    name: data.company.name,
                    nip: data.company.nip
                },
                birthDate: birthDate,
                email: data.email,
                firstName: data.firstName,
                gender: data.gender,
                labels: data.labels,
                lastName: data.lastName,
                phone: data.phone,
                posId: data.posId,
                levelId: data.levelId,
                loyaltyCardNumber: data.loyaltyCardNumber,
                agreement1: data.agreement1,
                agreement2: data.agreement2,
                agreement3: data.agreement3
            };
            res.labels = this.convertLabels(res);
            if (!ignoreSellerId) {
                res.sellerId = data.sellerId;

            }

            return res;
        }
    }

    settings(data) {
        let res = _.clone(data);
        delete res.logo;

        return res
    }

    humanizeCustomer(data) {
        let self = this;
        if (data.birthDate) {
            data.birthDate = moment(data.birthDate).format(self.config.dateFormat);
            if (data.birthDate === 'Invalid date') {
                data.birthDate = '';
            }
        }
        if (data.address) {
            data.address = _.pickBy(data.address);
        }

        return data;
    }

    humanizeUser(data) {
        let res = _.clone(data);
        let roles = res.roles;
        let dataArray = Object.keys(roles).map(val => roles[val].id);
        res.roles = dataArray;

        return _.pickBy(res);
    }

    level(data) {
        let self = this;
        let specialRewards = [];

        if (data.specialRewards) {
            specialRewards = _.map(data.specialRewards, function (reward) {
                return {
                    active: reward.active,
                    code: reward.code,
                    endAt: moment(reward.endAt).format(self.config.dateFormat),
                    startAt: moment(reward.startAt).format(self.config.dateFormat),
                    name: reward.name,
                    value: self.$filter('commaToDot')(reward.value)
                }
            })
        }

        return {
            conditionValue: self.$filter('commaToDot')(data.conditionValue),
            minOrder: data.minOrder,
            active: data.active,
            reward: {
                name: data.reward.name,
                value: self.$filter('commaToDot')(data.reward.value),
                code: data.reward.code
            },
            specialRewards: specialRewards,
            translations: data.translations
        }
    }


    humanizeLevel(data) {
        let self = this;

        if (data.translations) {
            data.translations = self.convertTranslations(data.translations);
        }

        if (data.reward) {
            data.reward.value = self.$filter('percent')(self.$filter('commaToDot')(data.reward.value));
        }

        if (data.specialRewards) {
            data.specialRewards = _.map(data.specialRewards, function (reward) {
                return {
                    active: reward.active,
                    code: reward.code,
                    endAt: moment(reward.endAt).format(self.config.dateFormat),
                    startAt: moment(reward.startAt).format(self.config.dateFormat),
                    name: reward.name,
                    value: self.$filter('percent')(self.$filter('commaToDot')(reward.value))
                }
            })
        }

        return data;
    }

    newCustomer(data) {
        let res = _.clone(data);
        res.labels = this.convertLabels(res);

        return _.pickBy(res);
    }

    newEarningRule(data, deleteType) {
        let res = _.clone(data);

        delete res.usageUrl;
        delete res.hasPhoto;

        switch (res.type) {
            case 'points' :
                delete res.eventName;
                delete res.skuIds;
                delete res.pointsAmount;
                delete res.multiplier;
                delete res.labelMultipliers;
                delete res.limit;
                delete res.rewardType;
                break;
            case 'event' :
                delete res.excludedSKUs;
                delete res.pointValue;
                delete res.excludedLabels;
                delete res.includedLabels;
                delete res.labelsInclusionType;
                delete res.labelMultipliers;
                delete res.excludeDeliveryCost;
                delete res.minOrderValue;
                delete res.skuIds;
                delete res.multiplier;
                delete res.limit;
                delete res.rewardType;
                break;
            case 'custom_event' :
                delete res.excludedSKUs;
                delete res.pointValue;
                delete res.excludedLabels;
                delete res.includedLabels;
                delete res.labelsInclusionType;
                delete res.labelMultipliers;
                delete res.excludeDeliveryCost;
                delete res.minOrderValue;
                delete res.skuIds;
                delete res.multiplier;
                delete res.rewardType;
                if (res.limit && !res.limit.active) {
                    delete res.limit.period;
                    delete res.limit.limit;
                }
                break;
            case 'referral' :
                delete res.excludedSKUs;
                delete res.pointValue;
                delete res.excludedLabels;
                delete res.includedLabels;
                delete res.labelsInclusionType;
                delete res.labelMultipliers;
                delete res.excludeDeliveryCost;
                delete res.minOrderValue;
                delete res.skuIds;
                delete res.multiplier;
                delete res.limit;
                delete res.limit;
                break;
            case 'product_purchase' :
                delete res.excludedSKUs;
                delete res.pointValue;
                delete res.excludedLabels;
                delete res.includedLabels;
                delete res.labelsInclusionType;
                delete res.labelMultipliers;
                delete res.excludeDeliveryCost;
                delete res.minOrderValue;
                delete res.eventName;
                delete res.multiplier;
                delete res.limit;
                delete res.rewardType;
                break;
            case 'multiply_for_product' :
                delete res.excludedSKUs;
                delete res.pointValue;
                delete res.excludedLabels;
                delete res.includedLabels;
                delete res.labelsInclusionType;
                delete res.labelMultipliers;
                delete res.excludeDeliveryCost;
                delete res.minOrderValue;
                delete res.eventName;
                delete res.pointsAmount;
                delete res.limit;
                delete res.rewardType;
                break;
            case 'multiply_by_product_labels' :
                delete res.excludedSKUs;
                delete res.pointValue;
                delete res.excludedLabels;
                delete res.includedLabels;
                delete res.labelsInclusionType;
                delete res.excludeDeliveryCost;
                delete res.minOrderValue;
                delete res.eventName;
                delete res.pointsAmount;
                delete res.limit;
                delete res.rewardType;
                break;
            case 'instant_reward':
                delete res.eventName;
                delete res.skuIds;
                delete res.pointsAmount;
                delete res.multiplier;
                delete res.labelMultipliers;
                delete res.limit;
                delete res.rewardType;
                break;
            default:
                break;
        }

        if (!res.rewardCampaignId){
            delete res.rewardCampaignId;
        }

        if (res.allTimeActive) {
            delete res.startAt;
            delete res.endAt;
        } else {
            delete res.allTimeActive;
            if (res.startAt) {
                res.startAt = new moment(res.startAt).format('YYYY-MM-DDTHH:mm:ssZ');
            }
            if (res.endAt) {
                res.endAt = new moment(res.endAt).format('YYYY-MM-DDTHH:mm:ssZ');
            }
        }

        if (!res.active) {
            delete res.active;
        }

        if (res.excludedSKUs) {
            let SKUs = '';
            for (let sku in res.excludedSKUs) {
                SKUs += res.excludedSKUs[sku] + ';';
            }
            if (SKUs.charAt(SKUs.length - 1) == ';') {
                SKUs = SKUs.substring(0, SKUs.length - 1)
            }
            res.excludedSKUs = SKUs;
        }

        if (!this.DataService.isStoppableEarningRule(res.type)){
            delete res.lastExecutedRule;
        }
        res.excludedLabels = this.convertLabels(res, 'excludedLabels');
        res.includedLabels = this.convertLabels(res, 'includedLabels');
        res.labels = this.convertLabels(res);

        delete res.earningRuleId;
        delete res.fromServer;
        delete res.restangularized;
        delete res.route;
        delete res.usages;
        delete res.levelNames;
        delete res.segmentNames;
        delete res.posNames;
        if (deleteType) {
            delete res.type;
        }

        if (data.type === "geolocation")
        {
            res.latitude = data.latitude ? data.latitude.toString() : null;
            res.longitude = data.longitude ? data.longitude.toString() : null;
        }

        return _.pickBy(res);
    }

    earningRule(data) {
        let res = _.omit(data, ['earningRuleId', 'type']);

        return res;
    }

    humanizeEarningRuleFields(data) {
        let self = this;

        if (data.translations) {
            data.translations = self.convertTranslations(data.translations);
        }

        if (data.startAt) {
            data.startAt = moment(data.startAt).format(self.config.dateTimeForhumanizeEarningRuleFieldsmat)
        }
        if (data.endAt) {
            data.endAt = moment(data.endAt).format(self.config.dateTimeFormat)
        }

        if (data.levels && data.levels.length) {
            data.target = 'level'
        }

        if (data.segments && data.segments.length) {
            data.target = 'segment'
        }

        if (data.levels && data.segments && !data.levels.length && !data.segments.length) {
            data.target = 'level';
        }

        data.excludedLabels = _.pickBy(data.excludedLabels);
        if (data.excludedSKUs) {
            data.excludedSKUs = data.excludedSKUs.filter(function (e) {
                return e
            });
        }
        data.includedLabels = _.pickBy(data.includedLabels);

        return data;
    }

    pos(data) {
        let res = _.clone(data);
        if (res.location.country && res.location.country.code) {
            res.location.country = res.location.country.code
        }

        delete res.currency;
        delete res.posId;
        delete res.transactionValue;
        delete res.transactionsCount;

        return _.pickBy(res);
    }

    humanizePos(data) {
        let self = this;
        let pos = _.clone(data);

        if (pos.location && pos.location.geoPoint) {
            pos.location.lat = pos.location.geoPoint.lat;
            pos.location.long = pos.location.geoPoint.long;
            delete pos.location.geoPoint;
        }

        return _.pickBy(pos)
    }


    role(data) {
        let res = _.clone(data);
        delete res.role;
        delete res.id;

        _.each(res.permissions, role => {
            delete role.id;  
        });

        return _.pickBy(res);
    }


    segment(data) {
        let self = this;
        let segment = angular.copy(data);

        segment.parts = _.each(segment.parts, part => {
            delete part.segmentPartId;
            _.each(part.criteria, criterium => {
                delete criterium.criterionId;
                if (criterium.posIds) {
                    let ids = [];

                    _.each(criterium.posIds, pos => {
                        ids.push(pos.posId);
                    });

                    criterium.posIds = ids;
                }
                if (criterium.fromDate && criterium.toDate) {
                    criterium.fromDate = new moment(criterium.fromDate).format('YYYY-MM-DDTHH:mm:ssZ');
                    criterium.toDate = new moment(criterium.toDate).format('YYYY-MM-DDTHH:mm:ssZ');
                }
                let c = {};
                switch (criterium.type) {
                    case 'bought_in_pos' :
                        delete criterium.min;
                        delete criterium.max;
                        delete criterium.fromDate;
                        delete criterium.toDate;
                        delete criterium.labels;
                        delete criterium.makers;
                        delete criterium.anniversaryType;
                        delete criterium.days;
                        delete criterium.skuIds;
                        delete criterium.fromAmount;
                        delete criterium.toAmount;
                        delete criterium.percent;
                        delete criterium.posId;
                        delete criterium.customers;
                        delete criterium.segmentedCustomers;
                        break;
                    case 'transaction_count' :
                        delete criterium.posIds;
                        delete criterium.fromDate;
                        delete criterium.toDate;
                        delete criterium.labels;
                        delete criterium.makers;
                        delete criterium.anniversaryType;
                        delete criterium.days;
                        delete criterium.skuIds;
                        delete criterium.fromAmount;
                        delete criterium.toAmount;
                        delete criterium.percent;
                        delete criterium.posId;
                        delete criterium.customers;
                        delete criterium.segmentedCustomers;
                        break;
                    case 'purchase_period' :
                        delete criterium.min;
                        delete criterium.posIds;
                        delete criterium.max;
                        delete criterium.labels;
                        delete criterium.makers;
                        delete criterium.anniversaryType;
                        delete criterium.days;
                        delete criterium.skuIds;
                        delete criterium.fromAmount;
                        delete criterium.toAmount;
                        delete criterium.percent;
                        delete criterium.posId;
                        delete criterium.customers;
                        delete criterium.segmentedCustomers;
                        break;
                    case 'bought_labels' :
                        delete criterium.min;
                        delete criterium.posIds;
                        delete criterium.fromDate;
                        delete criterium.toDate;
                        delete criterium.max;
                        delete criterium.makers;
                        delete criterium.anniversaryType;
                        delete criterium.days;
                        delete criterium.skuIds;
                        delete criterium.fromAmount;
                        delete criterium.toAmount;
                        delete criterium.percent;
                        delete criterium.posId;
                        delete criterium.customers;
                        delete criterium.segmentedCustomers;
                        break;
                    case 'customer_with_labels_values' :
                        delete criterium.min;
                        delete criterium.posIds;
                        delete criterium.fromDate;
                        delete criterium.toDate;
                        delete criterium.max;
                        delete criterium.makers;
                        delete criterium.anniversaryType;
                        delete criterium.days;
                        delete criterium.skuIds;
                        delete criterium.fromAmount;
                        delete criterium.toAmount;
                        delete criterium.percent;
                        delete criterium.posId;
                        delete criterium.customers;
                        delete criterium.segmentedCustomers;
                        break;
                    case 'customer_has_labels' :
                        delete criterium.min;
                        delete criterium.posIds;
                        delete criterium.fromDate;
                        delete criterium.toDate;
                        delete criterium.max;
                        delete criterium.makers;
                        delete criterium.anniversaryType;
                        delete criterium.days;
                        delete criterium.skuIds;
                        delete criterium.fromAmount;
                        delete criterium.toAmount;
                        delete criterium.percent;
                        delete criterium.posId;
                        delete criterium.customers;
                        delete criterium.segmentedCustomers;
                        break;
                    case 'bought_makers' :
                        delete criterium.min;
                        delete criterium.posIds;
                        delete criterium.fromDate;
                        delete criterium.toDate;
                        delete criterium.labels;
                        delete criterium.max;
                        delete criterium.anniversaryType;
                        delete criterium.days;
                        delete criterium.skuIds;
                        delete criterium.fromAmount;
                        delete criterium.toAmount;
                        delete criterium.percent;
                        delete criterium.posId;
                        delete criterium.customers;
                        delete criterium.segmentedCustomers;
                        break;
                    case 'anniversary' :
                        delete criterium.min;
                        delete criterium.posIds;
                        delete criterium.fromDate;
                        delete criterium.toDate;
                        delete criterium.labels;
                        delete criterium.makers;
                        delete criterium.max;
                        delete criterium.skuIds;
                        delete criterium.fromAmount;
                        delete criterium.toAmount;
                        delete criterium.percent;
                        delete criterium.posId;
                        delete criterium.customers;
                        delete criterium.segmentedCustomers;
                        break;
                    case 'last_purchase_n_days_before' :
                        delete criterium.min;
                        delete criterium.posIds;
                        delete criterium.fromDate;
                        delete criterium.toDate;
                        delete criterium.labels;
                        delete criterium.makers;
                        delete criterium.anniversaryType;
                        delete criterium.max;
                        delete criterium.skuIds;
                        delete criterium.fromAmount;
                        delete criterium.toAmount;
                        delete criterium.percent;
                        delete criterium.posId;
                        delete criterium.customers;
                        delete criterium.segmentedCustomers;
                        break;
                    case 'bought_skus' :
                        delete criterium.min;
                        delete criterium.posIds;
                        delete criterium.fromDate;
                        delete criterium.toDate;
                        delete criterium.labels;
                        delete criterium.makers;
                        delete criterium.anniversaryType;
                        delete criterium.days;
                        delete criterium.max;
                        delete criterium.fromAmount;
                        delete criterium.toAmount;
                        delete criterium.percent;
                        delete criterium.posId;
                        delete criterium.customers;
                        delete criterium.segmentedCustomers;
                        break;
                    case 'transaction_amount' :
                        delete criterium.min;
                        delete criterium.posIds;
                        delete criterium.fromDate;
                        delete criterium.toDate;
                        delete criterium.labels;
                        delete criterium.makers;
                        delete criterium.anniversaryType;
                        delete criterium.days;
                        delete criterium.skuIds;
                        delete criterium.max;
                        delete criterium.percent;
                        delete criterium.posId;
                        delete criterium.customers;
                        delete criterium.segmentedCustomers;
                        break;
                    case 'average_transaction_amount' :
                        delete criterium.min;
                        delete criterium.posIds;
                        delete criterium.fromDate;
                        delete criterium.toDate;
                        delete criterium.labels;
                        delete criterium.makers;
                        delete criterium.anniversaryType;
                        delete criterium.days;
                        delete criterium.skuIds;
                        delete criterium.max;
                        delete criterium.percent;
                        delete criterium.posId;
                        delete criterium.customers;
                        delete criterium.segmentedCustomers;
                        break;
                    case 'transaction_percent_in_pos' :
                        delete criterium.min;
                        delete criterium.posIds;
                        delete criterium.fromDate;
                        delete criterium.toDate;
                        delete criterium.labels;
                        delete criterium.makers;
                        delete criterium.anniversaryType;
                        delete criterium.days;
                        delete criterium.skuIds;
                        delete criterium.max;
                        delete criterium.fromAmount;
                        delete criterium.toAmount;
                        delete criterium.customers;
                        delete criterium.segmentedCustomers;
                        break;
                    case 'customer_list' :
                        delete criterium.min;
                        delete criterium.posIds;
                        delete criterium.fromDate;
                        delete criterium.toDate;
                        delete criterium.labels;
                        delete criterium.makers;
                        delete criterium.anniversaryType;
                        delete criterium.days;
                        delete criterium.skuIds;
                        delete criterium.max;
                        delete criterium.fromAmount;
                        delete criterium.toAmount;
                        delete criterium.percent;
                        delete criterium.posId;
                        delete criterium.segmentedCustomers;
                        break;
                    default:
                        break;
                }
            });
        });

        delete segment.createdAt;
        delete segment.segmentId;
        delete segment.customersCount;

        return segment;
    }

    humanizeSegment(data, pos) {
        let self = this;
        let segment = data;

        segment.parts = _.each(segment.parts, part => {
            _.each(part.criteria, criterium => {
                if (criterium.type === 'transaction_percent_in_pos') {
                    criterium.percent = self.$filter('percent')(self.$filter('commaToDot')(criterium.percent))
                }
                if (criterium.type === 'purchase_period') {
                    criterium.fromDate = moment(criterium.fromDate).format(self.config.dateTimeFormat)
                    criterium.toDate = moment(criterium.toDate).format(self.config.dateTimeFormat)
                }
            });
        });

        return segment
    }

    seller(data) {
        let self = this;
        let seller = angular.copy(data);

        delete seller.deleted;
        delete seller.sellerId;
        delete seller.posCity;
        delete seller.posName;
        delete seller.name;
        delete seller.version;

        return seller;
    }

    humanizeSeller(data, pos) {
        let self = this;

        return data;
    }

    humanizeCampaign(data) {
        let self = this;
        let campaign = angular.copy(data);

        if (campaign.translations) {
            campaign.translations = self.convertTranslations(campaign.translations);
        }

        if (campaign.campaignActivity) {
            campaign.campaignActivity.activeTo = moment(campaign.campaignActivity.activeTo).format(self.config.dateTimeFormat);
            campaign.campaignActivity.activeFrom = moment(campaign.campaignActivity.activeFrom).format(self.config.dateTimeFormat)
        }

        if (campaign.campaignVisibility) {
            campaign.campaignVisibility.visibleTo = moment(campaign.campaignVisibility.visibleTo).format(self.config.dateTimeFormat);
            campaign.campaignVisibility.visibleFrom = moment(campaign.campaignVisibility.visibleFrom).format(self.config.dateTimeFormat)
        }

        if (campaign.levels && campaign.levels.length) {
            campaign.target = 'level'
        }

        if (campaign.segments && campaign.segments.length) {
            campaign.target = 'segment'
        }

        return campaign;
    }

    campaign(data) {
        let self = this;
        let campaign = _.omit(angular.copy(data), ['name', 'shortDescription', 'usageInstruction', 'conditionsDescription', 'brandDescription', 'brandName']);

        campaign.labels = this.convertLabels(campaign);

        if (campaign.campaignActivity) {
            if (campaign.campaignActivity.activeTo) {
                campaign.campaignActivity.activeTo = moment(campaign.campaignActivity.activeTo).format('YYYY-MM-DDTHH:mm:ssZ');
            }
            if (campaign.campaignActivity.activeFrom) {
                campaign.campaignActivity.activeFrom = moment(campaign.campaignActivity.activeFrom).format('YYYY-MM-DDTHH:mm:ssZ')
            }
        }

        if (campaign.campaignVisibility) {
            if (campaign.campaignVisibility.visibleTo) {
                campaign.campaignVisibility.visibleTo = moment(campaign.campaignVisibility.visibleTo).format('YYYY-MM-DDTHH:mm:ssZ');
            }
            if (campaign.campaignVisibility.visibleFrom) {
                campaign.campaignVisibility.visibleFrom = moment(campaign.campaignVisibility.visibleFrom).format('YYYY-MM-DDTHH:mm:ssZ')
            }
        }

        if (campaign.couponsCsv && campaign.couponsCsv.length) {
            if (campaign.coupons instanceof Array) {
                campaign.coupons = campaign.coupons.concat(campaign.couponsCsv)
            } else {
                campaign.coupons = campaign.couponsCsv;
            }
            campaign.coupons = _.pickBy(campaign.coupons);
        }
        delete campaign.campaignId;
        if (campaign.will_be_active_from) {
            delete campaign.will_be_active_from;
        }
        if (campaign.will_be_active_to) {
            delete campaign.will_be_active_to;
        }
        if (campaign.reward == 'cashback') {
            delete campaign.costInPoints;
            delete campaign.campaignVisibility;
            delete campaign.limit;
            delete campaign.limitPerUser;
            delete campaign.coupons;
            delete campaign.singleCoupon;
            delete campaign.unlimited;
            delete campaign.daysInactive;
            delete campaign.daysValid;
        }

        if (campaign.reward == 'custom_campaign_code') {
            delete campaign.costInPoints;
            delete campaign.limit;
            delete campaign.limitPerUser;
            delete campaign.coupons;
            delete campaign.singleCoupon;
            delete campaign.unlimited;
            delete campaign.daysInactive;
            delete campaign.daysValid;
            if (campaign.connectType == 'none') {
                delete campaign.earningRuleId;
            }
        } else {
            delete campaign.connectType;
            delete campaign.earningRuleId;
        }

        if (campaign.reward == 'percentage_discount_code') {
            delete campaign.costInPoints;
            delete campaign.campaignVisibility;
            delete campaign.limit;
            delete campaign.limitPerUser;
            delete campaign.coupons;
            delete campaign.singleCoupon;
            delete campaign.unlimited;
        } else {
            delete campaign.transactionPercentageValue;
        }

        delete campaign.couponsCsv;
        delete campaign.id;
        delete campaign.segmentNames;
        delete campaign.levelNames;
        delete campaign.usageLeft;
        delete campaign.usageLeftForCustomer;
        delete campaign.usersWhoUsedThisCampaignCount;
        delete campaign.visibleForCustomersCount;
        delete campaign.hasPhoto;
        delete campaign.categoryNames;
        delete campaign.brandIcon;
        delete campaign.earningRule;

        return campaign;
    }

    convertLabels(object, key = 'labels') {
        let labels = '';

        if (object[key]) {
            for (let label in object[key]) {
                labels += object[key][label].key + ':' + object[key][label].value + ';';
            }
            if (labels.charAt(labels.length - 1) == ';') {
                labels = labels.substring(0, labels.length - 1)
            }
        }

        return labels;
    }

    convertTranslations(translations) {
        const newTranslations = {};

        _.each(translations, translation => {
            if (!this.availableTranslations.some(t => t.code === translation.locale)) {
                return;
            }
            newTranslations[translation.locale] = {};
            _.each(translation, (value, key) => {
                if (key !== 'locale' && key !== 'id') {
                    newTranslations[translation.locale][key] = value;
                }
            });
        });

        return newTranslations;
    }

    humanizeCampaignCategory(data) {
        let self = this;
        let category = angular.copy(data);

        if (category.translations) {
            category.translations = self.convertTranslations(category.translations);
        }

        return category;
    }

    campaignCategory(data) {
        let category = _.omit(angular.copy(data), ['name']);

        delete category.campaignCategoryId;
        return category;
    }
}

EditableMap.$inject = ['$filter', 'DataService'];

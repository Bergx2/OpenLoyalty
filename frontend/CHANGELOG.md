# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.6.0] - 05-06-2018
### Added
- upload customer from XML file
- add Earning Points Rule name to the Transfer Points comment (https://github.com/DivanteLtd/open-loyalty/issues/79)
### Changed
- segment or level is now required in Earning Points Rules
- only png/jpg/jpeg files are now supported for logo
- updated Symfony to latest version 3.4.11 with security fixes
### Fixed
- generating demo data
- updating administrator account
- choosing different language in Settings -> Configuration (https://github.com/DivanteLtd/open-loyalty/issues/83)

## [2.5.0] - 25-05-2018
### Added
- added property hasPhoto to indicate a model has photo in campaigns, earning points rules and levels
- added photo to Levels
- added photo to Earning Points Rules
- added uploading transactions from XML file
- added new Reward Campaign "CashBack"
- added a new property "Prize value" to the Reward Campaigns
- added a new property "Tax" to the Reward Campaigns
- added a new settings "Small logo"
- added uploading points transfers from XML file
- added a new sorting filter "manuallyAssignedLevel" to the customer list
- added a method to unassign a customer from assigned manually level /api/customer/{customer}/remove-manually-level
### Changed
- upgraded minimum version of PHP from 7.0 to 7.1
- changed campaignId object to string in response from /api/customer/campaign/bought
- property "pointsEarned" is now always available in the /api/transaction response

## [2.4.0] - 23-04-2018
### Added
- added missing translations
- added translatable program name in the title bar in browser
- added list of redeemed rewards
- added matching transaction with a customer using phone number
- added new SMS gateway WorldText
- added possibility to log in using phone number
- added settings to change activation method (e-mail or sms)
- added endpoint to match transactions by a customer
### Fixed
- fixed minor bugs with customer activation using SMS
- fixed searching customers (/api/customer)

## [2.3.1] - 12-04-2018
### Added
- added [API documentation](http://open-loyalty.readthedocs.io/en/latest/)

## [2.3.0] - 05-04-2018
### Added
- added API aliases to fix X-AUTH-TOKEN invalid credentials
- added comment to the points transfer list
- added missing translations
- added a new feature to activate a customer using SMS
### Fixed
- fixed SQL Injection vulnerabilities

## [2.2.0] - 28-02-2018
### Added
- encryption parameter for swiftmailer
- logo validation
- added APCu cache layer for mappings and query building in Doctrine ORM
- better concurrency support for writings
- increased performance
- added makefile for common used commands
### Changed
- upgraded jquery to 3.x version to fix potential vulnerabilities
- upgraded Symfony framework to version 3.4 LTS
- upgraded Broadway library to version 2.0.1 (it's a BC break)
- changed README.md
### Fixed
- changing merchant data in AC
- searching a client in POSC
- rounding points in emails

## [2.1.0] - 28-01-2018
### Added
- Added new customer account statuses (it's a BC break!)
- Collect / spend points only when a customer has a defined status
- Support GDPR
- A new setting where you can change loyalty program logo
- More information link field for a reward campaign
- Display reward campaing's image in client cockpit
### Fixed
- Missing transactions in the POS cockpit
- Remove transfer points in Admin Cockpit
- Vagrant setup for Windows users
- Fixes missing placeholders

## [2.0.0] - 2017-11-016
### Added
- Kubernetes support
### Changed
- Docker files
- Frontend migration from Gulp to the Webpack
- Migration from Nodejs server to the Nginx

## [1.4.0] - 2017-11-07
### Added
- CLI command to restore read model using event store
### Fixed
- AC/POSC fixed transaction id
- AC/POSC show points for each transaction
- AC clear fields after changing event type
- POSC fixed missing days from last order
- CC fixed cancel button

## [1.3.1] - 2017-10-23
### Added
- Added change log file
### Changed
- API Documentation
- Changed guide link in the admin cockpit
### Fixed
- Reload application after language change
- Fixed renaming translation name

## [1.3.0] - 2017-10-09
### Changed
- Added new endpoints to the API documentation
### Fixed
- Fixed PHPUnit configuration
- Changed label for Postgres from latest to version 9

## [1.2.1] - 2017-09-28
### Added
- Added API documentation
### Fixed
- Fixed wrong marketing agreement label
- Fixed table width on the transaction details
- View level & segment names instead of ID in the reward campaign view
- Show newly added language in the settings

## [1.2.0] - 2017-09-08
### Changed
- Moved code to the vendor
### Fixed
- Fixed customer activation link
- Fixed variables in the e-mail templates
- Fixed link to the page "See rewards you have already redeemed"

## [1.1.0] - 2017-07-21
### Changed
- Allow decimal numbers for point value field in the general spending rule
- Change default language from PL to EN
### Fixed
- Fixed loader look

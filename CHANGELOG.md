# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.7.0](https://github.com/ardkinci/eyotek-scrapper/compare/v1.6.0...v1.7.0) (2026-05-03)


### Features

* **api:** add metadata block to API outputs ([#7](https://github.com/ardkinci/eyotek-scrapper/issues/7)) ([ea80b20](https://github.com/ardkinci/eyotek-scrapper/commit/ea80b2045e1bcdceab88f9488328e44c0e87da7d))
* **core:** add metadata to outputs ([e1f678a](https://github.com/ardkinci/eyotek-scrapper/commit/e1f678a57b4fce96a69a341d28d82b253efd3983))
* **utils:** add success and error response generators ([1551081](https://github.com/ardkinci/eyotek-scrapper/commit/15510810c14253a8ef549edd9d13f7160067a487))

## [1.6.0](https://github.com/ardkinci/eyotek-scrapper/compare/v1.5.0...v1.6.0) (2026-05-02)


### Features

* **api:** add an API key auth system ([f454544](https://github.com/ardkinci/eyotek-scrapper/commit/f4545441db820f73c8ded0e57f9a9b5fb2ddb7ad))
* **api:** add the auth system to authenticate requests with an API key ([#5](https://github.com/ardkinci/eyotek-scrapper/issues/5)) ([27006a7](https://github.com/ardkinci/eyotek-scrapper/commit/27006a70c2b89b0cdf0ccf8a0f0e40fcac3b8204))


### Bug Fixes

* **auth:** correct the incorrect function name ([2775cff](https://github.com/ardkinci/eyotek-scrapper/commit/2775cff374a270e4b52a33a8017f418acf22d314))
* **auth:** fix the bug that caused turnstile to fail ([dfa74a9](https://github.com/ardkinci/eyotek-scrapper/commit/dfa74a954277d89a9c4517d08011d63f98f53d89))
* **auth:** fix the bug that caused turnstile to fail ([#6](https://github.com/ardkinci/eyotek-scrapper/issues/6)) ([d90386a](https://github.com/ardkinci/eyotek-scrapper/commit/d90386a38167e9f355c51ac2b2c7c7d509aef643))
* **auth:** fix the crash in manual login [#4](https://github.com/ardkinci/eyotek-scrapper/issues/4) ([cdfc33b](https://github.com/ardkinci/eyotek-scrapper/commit/cdfc33bc63fb7cf0ecc7cdac4fc7de1c4c907d33))

## [1.5.0](https://github.com/ardkinci/eyotek-scrapper/compare/v1.4.0...v1.5.0) (2026-05-02)


### Features

* **auth:** add auto-login system ([4994ede](https://github.com/ardkinci/eyotek-scrapper/commit/4994edead56951e86c459278c4419aca65ebb4c0))
* **auth:** implementing the auto-login system ([#1](https://github.com/ardkinci/eyotek-scrapper/issues/1)) ([80ec0b8](https://github.com/ardkinci/eyotek-scrapper/commit/80ec0b86a8486a619a0ed134303e2f1d2dd93a96))


### Bug Fixes

* **auth:** fix the error that causes turnstile to fail ([3773be9](https://github.com/ardkinci/eyotek-scrapper/commit/3773be94c21c1e76b4cdd6ce9ea6bbb89c4078ca))

## [1.4.0](https://github.com/ardkinci/eyotek-scrapper/compare/v1.3.0...v1.4.0) (2026-04-18)


### Features

* **api:** implement .ics supported endpoint ([d74ce03](https://github.com/ardkinci/eyotek-scrapper/commit/d74ce0383c14a8857e37f2e1f8fec9997dfd8f26))

## [1.3.0](https://github.com/ardkinci/eyotek-scrapper/compare/v1.2.0...v1.3.0) (2026-04-18)


### Features

* add timestamps to logs ([f41f9ae](https://github.com/ardkinci/eyotek-scrapper/commit/f41f9aefebc0d4ee2339636742e4e82f88dba7a0))
* **core:** normalization of terminal logs ([e96da86](https://github.com/ardkinci/eyotek-scrapper/commit/e96da86fb96dafb34c177c1f2a99ad800b3e48d4))
* date formats configured to ISO standards ([83cf3b2](https://github.com/ardkinci/eyotek-scrapper/commit/83cf3b2228868ba7816e3d8344f30d917197f774))
* **scraper:** add date support for food menu ([4387eaa](https://github.com/ardkinci/eyotek-scrapper/commit/4387eaa7e54523495406efc7f3cfd18986d5472e))
* **scraper:** add more detailed output for timetable ([5105dff](https://github.com/ardkinci/eyotek-scrapper/commit/5105dff55f89473486fe70f2717b4971c0ae0aec))


### Bug Fixes

* **config:** add missing comma ([48f2b02](https://github.com/ardkinci/eyotek-scrapper/commit/48f2b02494a92d3c18d811c6a09331fe9497712c))
* **scraper:** import config file in food menu scraper ([eb91349](https://github.com/ardkinci/eyotek-scrapper/commit/eb91349003453b880c5ffcec2c0b752496a702de))

## [1.2.0](https://github.com/ardkinci/eyotek-scrapper/compare/v1.1.0...v1.2.0) (2026-04-12)


### Features

* **config:** ddd full eyotek URL support ([c3229f1](https://github.com/ardkinci/eyotek-scrapper/commit/c3229f1356f2a74dbf9f13bd96531ab4837718c3))
* **core:** apply the first run wizard ([f9c9930](https://github.com/ardkinci/eyotek-scrapper/commit/f9c99307a9e230fa6812d726f30a897b6dc15e9d))

## 1.1.0 (2026-04-11)


### Features

* **config:** add config example ([cf62d1b](https://github.com/ardkinci/eyotek-scrapper/commit/cf62d1b48a0678c4517fb4eeaf7bbe208cebc260))
* **config:** update config example ([c9ecba4](https://github.com/ardkinci/eyotek-scrapper/commit/c9ecba446cd8ed79c9eac4e0d2a746ebe6de04bf))
* **core:** add index script ([4e53cba](https://github.com/ardkinci/eyotek-scrapper/commit/4e53cba0cada7645b7836a23b75e339517de1298))
* **core:** add server.js ([58412d9](https://github.com/ardkinci/eyotek-scrapper/commit/58412d9524b54a537061738cf46962a30238126e))
* **scraper:** add engine script for scrapers ([3f92176](https://github.com/ardkinci/eyotek-scrapper/commit/3f92176923f361f5906e78631f57e00935ed4a6a))
* **scraper:** add new data scrapers ([d401e65](https://github.com/ardkinci/eyotek-scrapper/commit/d401e654d1635c48feda4c374bfdf20355716e1f))

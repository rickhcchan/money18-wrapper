# Money18 Wrapper
Money18 Wrapper is a JSONP wrapper which retrieves stock market data from [Money18 website](http://money18.on.cc/). The data retrieved is wrapped in JSONP format.

## Installation
The source is available for download from [GitHub](https://github.com/rickhcchan/money18-wrapper/blob/master/app.js).

Money18 requires:

* [async](https://github.com/caolan/async) (^1.2.1)
* [express](https://github.com/strongloop/express) (~4.12.4)
* [iconv-lite](https://github.com/ashtuchkin/iconv-lite) (^0.4.10)
* [request](https://github.com/request/request) (^2.58.0)
* util (^0.10.3)

Install dependencies with command below:


```bash
$ npm install
```

## Quick Start
Start the wrapper service:

```bash
$ node app.js
```

## Features
* Retrieve daily information of stocks, warrants and CBBCs
* Retrieve opening inforation of stocks, warrants and CBBCs
* Retrieve real time information of stocks, warrants and CBBCs

## Usages
Invoke a request to **`/{resources}/{codes}?[callback={callback}]`**.

### Parameters

#### Resources keywords

* **`d`** - Retrieve daily information of given stocks/warrants/CBBCs, i.e. **`/d/00001,00002`**
  * `code` - Code
  * `premium` - Premium in % (warrants and CBBCs only)
  * `gearing` - Gearing (warrants and CBBCs only)
  * `issuedShare` - Numbers of share issued (stocks only)
  * `relatedStock` - N/A
  * `parentType` - index (stocks only), stock (warrants and CBBCs only)
  * `cbbcCPrice` - Call price (CBBCs only)
  * `cpType` - `c` represents call, `p` represents put (warrants and CBBCs only)
  * `maturity` - Maturity date (yyyyMMdd) (warrants and CBBCs only)
  * `stkPrice` - Strike price (warrants and CBBCs only)
  * `cnvRatio` - Conversion ratio (warrants and CBBCs only)
  * `eps` - Earning per share (stocks only)
  * `dividend` - Dividend (stocks only)
  * `rsi20` - 20-day RSI
  * `rsi14` - 14-day RSI
  * `rsi10` - 10-day RSI
  * `ma50` - 50-day moving average
  * `ma20` - 20-day moving average
  * `ma10` - 10-day moving average
  * `wk52Low` - 52-week low
  * `wk52High` - 52-week high
  * `mthLow` - Month low
  * `mthHigh` - Month high
  * `spCode` - N/A
  * `instType` - `EQTY` represents stocks, `WRNT` represents warrants and CBBCs
  * `sspnFlag` - Suspend flag (Y/N)
  * `currUnit` - N/A
  * `currCode` - Trading currency
  * `lotSize` - Lot size
  * `preCPrice` - Previous close price
  * `nameChi` - Name in Chinese
  * `name` - Name in English
* **`o`** - Retrieve opening information of given stocks/warrants/CBBCs, i.e. **`/o/00001,00002`**
  * `code` - Code
  * `openPrice` - Opening price
* **`r`** - Retrieve real time information of given stocks/warrants/CBBCs, i.e. **`/r/00001,00002`**
  * `code` - Code
  * `dyl` - Day low
  * `dyh` - Day high
  * `tvr` - Turnover
  * `vol` - Volumn
  * `ltp` - Last traded price
  * `iev` - N/A
  * `iep` - N/A
  * `np` - Nominal price
  * `ltt` - Last traded time (yyyy/MM/dd HH:mm)
* **`s`** - Retrieve daily, opening and real time information of given stocks/warrants/CBBCs, i.e. **`/s/00001,00002`**

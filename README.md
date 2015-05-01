# angular-directive-percentage

[![NPM version](https://badge.fury.io/js/angular-directive-percentage.png)](http://badge.fury.io/js/angular-directive-percentage)
[![Bower version](https://badge.fury.io/bo/angular-directive-percentage.png)](http://badge.fury.io/bo/angular-directive-percentage)
[![Build Status](https://travis-ci.org/dkhunt27/angular-directive-percentage.svg?branch=master)](https://travis-ci.org/dkhunt27/angular-directive-percentage)
[![Coverage Status](https://coveralls.io/repos/dkhunt27/angular-directive-percentage/badge.svg)](https://coveralls.io/r/dkhunt27/angular-directive-percentage)

## Credit

This directive is a port of fiestah's great work on [angular-money-directive](https://github.com/fiestah/angular-money-directive).  Just slightly altered for percentages

## Overview

This directive takes inputs in decimal format 0.425376 and displays it in a percentage format 42.5376 (%).

It does a few things:

- Prevents entering non-numeric characters
- Prevents entering the minus sign when `min >= 0`
- Supports `min` and `max` like in `<input type="number">`
- Rounds the model value by `precision`, e.g. `0.42219` will be rounded to `42.22` by default
- On `blur`, the input field is auto-formatted. Say if you enter `42`, it will be formatted to `42.00`


## Usage:

```
$ bower install angular-directive-percentage
```

Then include it as a dependency in your app.
```
angular.module('myApp', ['angular-directive-percentage'])
```

### Attributes:

- `percentage`: _required_
- `ng-model`: _required_
- `type`: Set to `text` or just leave it out. Do _not_ set to `number`.
- `min`: _optional_ Defaults to `0`.
- `max`: _optional_ Not enforced by default
- `precision`: _optional_ Defaults to `4`. Set to `-1` to disable rounding

Basic example:

``` html
<input type="text" ng-model="model.percent" percentage>
```

`min`, `max` and `precision` can be set dynamically in $scope:

``` html
<input type="text" ng-model="model.percent" percentage min="{{min}}">
```

## Tests:

1. Install test deps: `npm install` and `bower install`
1. Run: `npm test` or `./node_modules/karma/bin/karma start`

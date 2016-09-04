"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectValidationUtils = injectValidationUtils;
function injectValidationUtils(target, name, descriptor) {

  target.prototype.isValid = function () {};

  target.prototype.isValidField = function (name) {};
}
export function injectValidationUtils(target, name, descriptor) {

  target.prototype.isValid = function() {

  };

  target.prototype.isValidField = function(name) {
  }

}

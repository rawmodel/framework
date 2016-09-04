import {isArray} from 'typeable';

export function injectObjectSerializationUtils(target, name, descriptor) {

  target.prototype.toObject = function() {
    let data = {};
    let names = Object.keys(this);

    for (let name of names) {
      let value = this[name];

      if (isArray(value)) {
        data[name] = value.map(i => this.valueToObject(i));
      } else {
        data[name] = this.valueToObject(value);
      }
    }

    return data;
  };

  target.prototype.valueToObject = function(value) {
    if (value && value.toObject) {
      return value.toObject();
    } else {
      return value;
    }
  }

}
